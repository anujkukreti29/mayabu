import re
from playwright.sync_api import sync_playwright



def scrape_croma(query: str, max_products: int = 5) -> list[dict]:
    """
    FIXES APPLIED:
    ✅ Removed conflicting wait_for_load_state calls (major fix!)
    ✅ Changed from "domcontentloaded" + "networkidle" → single "domcontentloaded"
    ✅ Reduced timeout from 30000ms → 12000ms
    ✅ Increased lazy-load wait buffer from 3000ms → 4000ms
    ✅ Improved scroll-to-load strategy
    ✅ Added proper fallback handling
    ✅ Better selector queries with retry
    """
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--disable-background-networking',
                    '--disable-client-side-phishing-detection',
                    '--disable-default-apps',
                    '--disable-device-discovery-notifications',
                    '--disable-extensions',
                    '--disable-features=TranslateUI',
                    '--disable-sync',
                    '--metrics-recording-only',
                    '--mute-audio',
                    '--no-default-browser-check',
                    '--no-first-run',
                    '--password-store=basic',
                    '--use-mock-keychain',
                ]
            )
            
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                viewport={"width": 1366, "height": 768},
                locale="en-IN",
                timezone_id="Asia/Kolkata",
                ignore_https_errors=True,
                extra_http_headers={
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Accept-Language": "en-IN,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Cache-Control": "max-age=0",
                    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="119"',
                    "Sec-Ch-Ua-Mobile": "?0",
                    "Sec-Ch-Ua-Platform": '"Windows"',
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-User": "?1",
                    "Upgrade-Insecure-Requests": "1",
                    "DNT": "1",
                }
            )
            
            page = context.new_page()
            page.set_default_timeout(10000)  # SPEED: 12000 → 10000
            page.set_default_navigation_timeout(10000)  # SPEED: Add global timeout
            
            # Stealth mode
            page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                });
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5],
                });
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-IN', 'en-US', 'en'],
                });
                window.chrome = {runtime: {}};
                Object.defineProperty(navigator, 'permissions', {
                    get: () => ({
                        query: () => Promise.resolve({state: Notification.permission})
                    }),
                });
            """)
            
            search_url = f"https://www.croma.com/searchB?q={query.replace(' ', '%20')}%3Arelevance&text={query.replace(' ', '%20')}"
            print(f"🔍 Scraping Croma: {query}")
            
            # SPEED: Reduced timeout from 12000 → 10000
            page.goto(search_url, wait_until="domcontentloaded", timeout=10000)
            
            # SPEED: Reduced from 2000ms to 1200ms
            page.wait_for_timeout(1200)
            
            # Scroll to trigger lazy loading
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(2500)  # SPEED: 4000 → 2500 (lazy-loading still works)
            
            # Scroll again to load more
            page.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.5)")
            page.wait_for_timeout(800)  # SPEED: 1500 → 800
            
            # Wait for products with fallback
            try:
                page.wait_for_selector('li.product-item div.cp-product', timeout=5000)  # SPEED: 8000 → 5000
            except:
                print("⚠️  Primary selector timeout, trying fallback...")
                try:
                    page.wait_for_selector('li.product-item', timeout=3000)  # SPEED: 5000 → 3000
                except:
                    print("❌ No product elements found on Croma")
                    context.close()
                    browser.close()
                    return []
            
            product_elements = page.query_selector_all('li.product-item div.cp-product')
            print(f"✅ Found {len(product_elements)} products on Croma")
            
            products = []
            
            for i, product in enumerate(product_elements[:max_products]):
                try:
                    title_element = product.query_selector("div.plp-prod-title-rating-cont h3.product-title")
                    if not title_element:
                        title_element = product.query_selector("h3.product-title")
                    
                    currPrice_element = product.query_selector("div.new-price span.amount")
                    mrpPrice_element = product.query_selector("span.old-price span.amount")
                    discount_element = product.query_selector("span.discount")
                    link_element = product.query_selector("div.product-info h3 a")
                    if not link_element:
                        link_element = product.query_selector("a")
                    
                    image_element = product.query_selector("div.product-img img")
                    rating_element = product.query_selector("span.rating-text")
                    ratingCount_element = product.query_selector("span[style='color: rgb(255, 255, 255);'] span")
                    
                    title = title_element.inner_text() if title_element else "N/A"
                    currPrice = currPrice_element.inner_text() if currPrice_element else "N/A"
                    discount = discount_element.inner_text() if discount_element else "No discount"
                    newlink = link_element.get_attribute('href') if link_element else "N/A"
                    image = image_element.get_attribute('src') if image_element else "N/A"
                    mrpPrice = mrpPrice_element.inner_text() if mrpPrice_element else "N/A"
                    rating = rating_element.inner_text() if rating_element else "N/A"
                    ratingCount = ratingCount_element.inner_text() if ratingCount_element else "N/A"
                    
                    link = f"https://www.croma.com{newlink}" if newlink and newlink != "N/A" else "N/A"
                    
                    # Only add valid products
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
                        print(f"  ✓ Product {i+1}: {title[:50]}...")
                
                except Exception as e:
                    print(f"  ⚠️  Error on product {i+1}: {str(e)[:80]}")
                    continue
            
            context.close()
            browser.close()
            return products
    
    except Exception as e:
        print(f"💥 Croma scraper error: {e}")
        return []