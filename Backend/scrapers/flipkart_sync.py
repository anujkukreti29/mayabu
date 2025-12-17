import re
from playwright.sync_api import sync_playwright


def scrape_flipkart(query: str, max_products: int = 5) -> list[dict]:
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                viewport={"width": 1920, "height": 1080},
                locale="en-IN",
                extra_http_headers={"Accept-Language": "en-IN,en;q=0.9"}
            )


            page = context.new_page()
            page.set_default_timeout(8000)  # SPEED: 10000 → 8000
            page.set_default_navigation_timeout(8000)  # SPEED: 10000 → 8000


            search_url = f"https://www.flipkart.com/search?q={query.replace(' ', '+')}"
            page.goto(search_url, wait_until="domcontentloaded", timeout=8000)  # SPEED: 10000 → 8000
            
            page.wait_for_timeout(200)  # SPEED: 500 → 200
            
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(200)  # SPEED: 500 → 200


            try:
                page.wait_for_selector('a.k7wcnx', timeout=3000)  # SPEED: 5000 → 3000
            except:
                try:
                    page.wait_for_selector('div._2kHmtP', timeout=2000)  # SPEED: 3000 → 2000
                except:
                    print("❌ No products found on Flipkart")
                    context.close()
                    browser.close()
                    return []


            product_elements = page.query_selector_all('a.k7wcnx')
            products = []


            for idx, product in enumerate(product_elements[:max_products]):
                try:
                    title_element = product.query_selector('div.RG5Slk')
                    currPrice_element = product.query_selector('div.hZ3P6w.DeU9vF')
                    mrpPrice_element = product.query_selector("div.kRYCnD.gxR4EY")
                    discount_element = product.query_selector('div.HQe8jr span')
                    image_element = product.query_selector('div.lWX0_T img')
                    rating_element = product.query_selector("div.MKiFS6")
                    ratingCount_element = product.query_selector("span.PvbNMB span")


                    title = title_element.inner_text() if title_element else "N/A"
                    currPrice = currPrice_element.inner_text() if currPrice_element else "N/A"
                    discount = discount_element.inner_text() if discount_element else "No discount"
                    newlink = product.get_attribute('href') if product else "N/A"
                    image = image_element.get_attribute('src') if image_element else "N/A"
                    mrpPrice = mrpPrice_element.inner_text() if mrpPrice_element else "N/A"
                    rating = rating_element.inner_text() if rating_element else "N/A"
                    ratingCountNum = ratingCount_element.inner_text() if ratingCount_element else "N/A"


                    link = f"https://www.flipkart.com{newlink}" if newlink != "N/A" else "N/A"


                    ratingCount = 0
                    if ratingCountNum != "N/A":
                        ratingCountMatch = re.findall(r"\d[\d,]*", ratingCountNum)
                        ratingCount = int(ratingCountMatch[0].replace(",", "")) if ratingCountMatch else 0


                    if title != "N/A" and currPrice != "N/A":
                        products.append({
                            "title": title,
                            "currentPrice": currPrice,
                            "maxRetailPrice": mrpPrice,
                            "discount": discount,
                            "link": link,
                            "rating": rating,
                            "ratingCount": ratingCount,
                            "image": image
                        })


                except Exception as e:
                    print(f"Error on product {idx + 1}: {str(e)[:80]}")
                    continue


            context.close()
            browser.close()
            return products


    except Exception as e:
        print(f"Error in Flipkart scraper: {e}")
        return []