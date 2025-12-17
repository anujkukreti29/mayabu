import asyncio
import re
from playwright.async_api import async_playwright

async def scrape_flipkart(query : str, max_products=5) -> list[dict]:
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                viewport={"width": 1920, "height": 1080},
                locale="en-IN",
                extra_http_headers={"Accept-Language": "en-IN,en;q=0.9"}
            )
            page = await context.new_page()

            search_url = f"https://www.flipkart.com/search?q={query.replace(' ', '+')}"
            await page.goto(search_url, wait_until="networkidle")
            await asyncio.sleep(2)  # Allow additional time for dynamic content
            await page.wait_for_selector('a.CGtC98')

            product_elements = await page.query_selector_all('a.CGtC98')
            products = []

            for product in product_elements[:max_products]:
                try:
                        title_element = await product.query_selector('.KzDlHZ')
                        currPrice_element = await product.query_selector('div.Nx9bqj._4b5DiR')
                        mrpPrice_element = await product.query_selector("div.hl05eU div.yRaY8j.ZYYwLA")
                        discount_element = await product.query_selector('div.UkUFwK span')
                       
                        link_element = product
                        image_element = await product.query_selector('div.Otbq5D div._4WELSP img.DByuf4')
                        rating_element = await product.query_selector("span#productRating_LSTCOMH7NCZGGGWQC4WQSQGVR_COMH7NCZGGGWQC4W_ div.XQDdHH")
                        ratingCount_element = await product.query_selector("span.Wphh3N span")

                        title = await title_element.inner_text() if title_element else "N/A"
                        currPrice = await currPrice_element.inner_text() if currPrice_element else "N/A"
                        discount = await discount_element.inner_text() if discount_element else "No discount"
                        # link = await link_element.get_attribute('href') if link_element else "N/A"
                        newlink = await link_element.get_attribute('href') if link_element else "N/A"
                        image = await image_element.get_attribute('src') if image_element else "N/A"
                        mrpPrice = await mrpPrice_element.inner_text() if mrpPrice_element else "N/A"
                        rating = await rating_element.inner_text() if rating_element else "N/A"
                        ratingCountNum = await ratingCount_element.inner_text() if ratingCount_element else "N/A"

                        link = f"https://www.flipkart.com{newlink}" if newlink != "N/A" else "N/A"
                        
                        ratingCount = int(re.findall(r"\d[\d,]*", ratingCountNum)[0].replace(",", ""))

                        products.append({
                            "title": title,
                            "currPrice": currPrice,
                            "maxRetailPrice": mrpPrice,
                            "discount": discount,
                            "link": link,
                            "rating": rating,
                            "ratingCount": ratingCount,
                            "image": image

                        })

                except Exception as e:
                    print(f"Error extracting product data: {e}")
                    continue

            await context.close()
            await browser.close()
            return products

        except Exception as e:
            print(f"Error in Flipkart scraper: {e}")
            return []
