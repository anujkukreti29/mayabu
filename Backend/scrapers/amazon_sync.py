import re
import urllib.parse
from playwright.sync_api import sync_playwright



def scrape_amazon(query: str, max_products: int = 5) -> list[dict]:
    """
    FIXES APPLIED:
    ✅ Changed wait_until from "load" → "domcontentloaded" (faster)
    ✅ Reduced timeout from 30000ms → 12000ms
    ✅ Added retry logic for selector waits
    ✅ Increased wait buffers for Amazon's lazy loading
    ✅ Added fallback selectors
    ✅ Better price extraction
    """
    def to_int(price):
        if not price or price == "N/A":
            return None
        price = price.replace(",", "").replace("₹", "").strip()
        return int(price) if price.isdigit() else None


    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                viewport={"width": 1920, "height": 1080},
                locale="en-IN",
                java_script_enabled=True,
                extra_http_headers={
                    "Accept-Language": "en-IN,en;q=0.9",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                }
            )
            page = context.new_page()
            page.set_default_timeout(10000)  # SPEED: 12000 → 10000
            page.set_default_navigation_timeout(10000)  # SPEED: Add global timeout
            
            search_url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}"
            
            # SPEED: Timeout reduced from 12000 → 10000
            page.goto(search_url, wait_until="domcontentloaded", timeout=10000)
            page.wait_for_timeout(1000)  # SPEED: 2000 → 1000
            
            # Scroll to trigger lazy loading
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(800)  # SPEED: 1500 → 800
            
            # Wait for products with retry logic
            try:
                page.wait_for_selector('div[role="listitem"] div.sg-col-inner', timeout=5000)  # SPEED: 8000 → 5000
            except:
                print("⚠️  Primary selector failed, trying alternative...")
                try:
                    page.wait_for_selector('div.s-result-item', timeout=3000)  # SPEED: 5000 → 3000
                except:
                    print("❌ No products found on Amazon")
                    context.close()
                    browser.close()
                    return []


            product_elements = page.query_selector_all('div[role="listitem"] div.sg-col-inner')
            products = []
            
            for idx, product in enumerate(product_elements[:max_products]):
                try:
                    # Primary selectors
                    title_element = product.query_selector("a.a-link-normal.s-line-clamp-2.s-line-clamp-3-for-col-12.s-link-style.a-text-normal h2 span")
                    if not title_element:
                        # Fallback selector
                        title_element = product.query_selector("h2 a span")
                    
                    link_element = product.query_selector("span.rush-component a.a-link-normal.s-no-outline")
                    if not link_element:
                        # Fallback selector
                        link_element = product.query_selector("a.a-link-normal")


                    title = title_element.inner_text() if title_element else "N/A"
                    link = link_element.get_attribute('href') if link_element else "N/A"


                    currPrice_element = product.query_selector('span.a-price span.a-price-whole')
                    mrpPrice_element = product.query_selector("span.a-text-price span.a-offscreen")
                    image_element = product.query_selector('div.s-product-image-container img.s-image')
                    rating_element = product.query_selector("span.a-size-small.a-color-base")
                    ratingCount_element = product.query_selector("span.a-size-mini.puis-normal-weight-text.s-underline-text")


                    currPrice = currPrice_element.inner_text() if currPrice_element else "N/A"
                    mrpPrice = mrpPrice_element.inner_text() if mrpPrice_element else "N/A"
                    rating = rating_element.inner_text() if rating_element else "N/A"
                    ratingCount = ratingCount_element.inner_text() if ratingCount_element else "N/A"
                    image = image_element.get_attribute('src') if image_element else "N/A"


                    cp = to_int(currPrice)
                    mp = to_int(mrpPrice)
                    discount = round(100 - ((cp / mp) * 100), 2) if cp and mp else "N/A"


                    # Better link handling
                    if link and link != "N/A":
                        if "/dp/" in link:
                            real_link = link
                        else:
                            try:
                                parsed = urllib.parse.urlparse(link)
                                params = urllib.parse.parse_qs(parsed.query)
                                encoded = params.get("url", [None])[0]
                                real_link = urllib.parse.unquote(encoded) if encoded else link
                            except:
                                real_link = link
                    else:
                        real_link = "N/A"


                    # Only add valid products
                    if title != "N/A" and currPrice != "N/A":
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
                    print(f"  ⚠️  Error on product {idx + 1}: {str(e)[:80]}")
                    continue


            context.close()
            browser.close()
            return products


    except Exception as e:
        print(f"Error in Amazon scraper: {e}")
        return []