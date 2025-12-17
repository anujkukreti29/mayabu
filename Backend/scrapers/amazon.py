import asyncio
import json
import urllib.parse
from playwright.async_api import async_playwright

async def scrape_amazon(query : str, max_products=5) -> list[dict]:
    async with async_playwright() as p:
        try:
            def to_int(price):
                if not price or price == "N/A":
                    return None
                price = price.replace(",", "").replace("₹", "").strip()
                return int(price) if price.isdigit() else None

            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
                viewport={"width": 1920, "height": 1080},
                locale="en-IN",
                java_script_enabled=True,
                extra_http_headers={"Accept-Language": "en-IN,en;q=0.9"}
            )
            page = await context.new_page()
            search_url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}"

            await page.goto(search_url, wait_until="load")
            await asyncio.sleep(2)
            await page.wait_for_selector('div[role="listitem"] div.sg-col-inner')

            product_elements = await page.query_selector_all('div[role="listitem"] div.sg-col-inner')

            products = []
            for product in product_elements[:max_products]:
                try:
                    title_element = await product.query_selector(
                        "a.a-link-normal.s-line-clamp-2.s-line-clamp-3-for-col-12.s-link-style.a-text-normal h2 span"
                    )
                    link_element = await product.query_selector("span.rush-component a.a-link-normal.s-no-outline")

                    title = await title_element.inner_text() if title_element else "N/A"
                    link = await link_element.get_attribute('href') if link_element else "N/A"

                    currPrice_element = await product.query_selector('span.a-price span.a-price-whole')
                    mrpPrice_element = await product.query_selector("span.a-text-price span.a-offscreen")
                    image_element = await product.query_selector('div.s-product-image-container img.s-image')
                    rating_element = await product.query_selector("span.a-size-small.a-color-base")
                    ratingCount_element = await product.query_selector("span.a-size-mini.puis-normal-weight-text.s-underline-text")

                    currPrice = await currPrice_element.inner_text() if currPrice_element else "N/A"
                    mrpPrice = await mrpPrice_element.inner_text() if mrpPrice_element else "N/A"
                    rating = await rating_element.inner_text() if rating_element else "N/A"
                    ratingCount = await ratingCount_element.inner_text() if ratingCount_element else "N/A"
                    image = await image_element.get_attribute('src') if image_element else "N/A"

                    cp = to_int(currPrice)
                    mp = to_int(mrpPrice)
                    discount = round(100 - ((cp / mp) * 100), 2) if cp and mp else "N/A"

                    # Clean product link
                    if "/dp/" in link:
                        real_link = link
                    else:
                        parsed = urllib.parse.urlparse(link)
                        params = urllib.parse.parse_qs(parsed.query)
                        encoded = params.get("url", [None])[0]
                        real_link = urllib.parse.unquote(encoded) if encoded else link

                    products.append({
                        "title": title,
                        "currentPrice": currPrice,
                        "discount": discount,
                        "rating": rating,
                        "ratingCount": ratingCount,
                        "link": f"https://www.amazon.in{real_link}" if real_link != "N/A" else "N/A",
                        "maxRetailPrice": mrpPrice,
                        "image": image
                    })
                except Exception as e:
                    print(f"Error extracting product data: {e}")
                    continue

            await context.close()
            await browser.close()

            return products

        except Exception as e:
            print(f"An error occurred: {e}")
            return []
