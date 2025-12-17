from playwright.sync_api import sync_playwright
import time


def scrape_reliancedigital(query: str, max_products: int = 5) -> list[dict]:
    start_time = time.time()
    try:
        with sync_playwright() as p:
            # Use Firefox instead of Chromium
            browser = p.firefox.launch(
                headless=False,
                # Firefox does not support all Chromium-only args like --deny-permission-prompts
                # so keep this minimal or empty unless you need something specific
                # args=[]
            )

            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                viewport={"width": 1920, "height": 1080},
                locale="en-IN",
                # If you still want to auto-allow location in Firefox:
                permissions=["geolocation"],
                geolocation={"latitude": 19.0760, "longitude": 72.8777},
            )

            page = context.new_page()
            page.set_default_timeout(15000)

            search_url = f"https://www.reliancedigital.in/products?q={query.replace(' ', '%20')}"
            page.goto(search_url, wait_until="domcontentloaded", timeout=15000)

            page.wait_for_timeout(3000)
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(2000)

            product_elements = page.query_selector_all(
                'div.product-card div.card-info-container'
            )

            products = []
            for product in product_elements[:max_products]:
                try:
                    title = product.query_selector("div.product-card-title").inner_text() if product.query_selector("div.product-card-title") else "N/A"
                    currPrice = product.query_selector("div.price-container div.price").inner_text() if product.query_selector("div.price-container div.price") else "N/A"
                    mrpPrice = product.query_selector("div.mrp-container div.mrp-amount").inner_text() if product.query_selector("div.mrp-container div.mrp-amount") else "N/A"
                    discount = product.query_selector("div.discount").inner_text() if product.query_selector("div.discount") else "No discount"
                    newlink = product.query_selector("div.card-info-container a").get_attribute('href') if product.query_selector("div.card-info-container a") else None
                    image = product.query_selector("img.fy__img").get_attribute('src') if product.query_selector("img.fy__img") else "N/A"

                    link = f"https://www.reliancedigital.in/{newlink}" if newlink else "N/A"

                    if title != "N/A" and currPrice != "N/A":
                        products.append({
                            "title": title,
                            "currentPrice": currPrice,
                            "maxRetailPrice": mrpPrice,
                            "discount": discount,
                            "link": link,
                            "image": image
                        })
                except:
                    continue

            context.close()
            browser.close()
            print(f"Reliance completed in {time.time() - start_time:.1f}s")
            return products
    except Exception as e:
        print(f"Reliance error: {e}")
        return []


if __name__ == "__main__":
    test_query = "asus vivobook ultra 5"
    print(f"Testing Reliance Digital scraper for: {test_query}")
    print("-" * 50)

    products = scrape_reliancedigital(test_query, max_products=3)

    if products:
        print(f"\n✅ Scraper working! Found {len(products)} products:")
        print("-" * 50)
        for i, product in enumerate(products, 1):
            print(f"{i}. {product['title']}")
            print(f"   Price: {product['currentPrice']}")
            print(f"   MRP: {product['maxRetailPrice']}")
            print(f"   Discount: {product['discount']}")
            print(f"   Link: {product['link']}")
            print()
    else:
        print("❌ No products found - scraper may need selector updates")
