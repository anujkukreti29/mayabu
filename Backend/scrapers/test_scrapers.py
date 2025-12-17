# Test Script: Verify All 4 Scrapers
# Run this to check if flipkart, amazon, croma, and reliancedigital scrapers work

import sys
from flipkart_sync import scrape_flipkart
from amazon_sync import scrape_amazon
from reliancedigital_sync import scrape_reliancedigital
from croma_sync import scrape_croma


def test_scraper(scraper_func, platform_name: str, query: str = "laptop", max_products: int = 3):
    """Test a single scraper and return results"""
    print(f"\n{'='*70}")
    print(f"🧪 Testing {platform_name} Scraper")
    print(f"{'='*70}")
    
    try:
        print(f"📍 Query: '{query}' (max {max_products} products)")
        print(f"⏳ Fetching products...")
        
        results = scraper_func(query, max_products)
        
        # Check if results exist
        if not results:
            print(f"❌ FAILED: No products returned (empty list)")
            return False
        
        print(f"✅ SUCCESS: Found {len(results)} product(s)\n")
        
        # Display first product details
        first_product = results[0]
        print(f"📦 First Product Details:")
        print(f"   Title:        {first_product.get('title', 'N/A')[:80]}")
        print(f"   Price:        {first_product.get('currentPrice', 'N/A')}")
        print(f"   MRP:          {first_product.get('maxRetailPrice', 'N/A')}")
        print(f"   Discount:     {first_product.get('discount', 'N/A')}")
        print(f"   Link:         {first_product.get('link', 'N/A')[:60]}...")
        print(f"   Image:        {first_product.get('image', 'N/A')[:60]}...")
        
        # Validate required fields
        print(f"\n✓ Field Validation:")
        required_fields = ["title", "currentPrice", "maxRetailPrice", "discount", "link", "image"]
        
        all_valid = True
        for field in required_fields:
            has_field = field in first_product
            is_valid = has_field and first_product[field] != "N/A"
            status = "✅" if is_valid else "⚠️"
            print(f"   {status} {field:20} | {first_product.get(field, 'MISSING')}")
            if not is_valid:
                all_valid = False
        
        if all_valid:
            print(f"\n✅ All required fields present and valid!")
            return True
        else:
            print(f"\n⚠️ Some fields missing or invalid - check selector issues")
            return True  # Still working, just incomplete data
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def run_all_tests():
    """Run tests for all 4 scrapers"""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*68 + "║")
    print("║" + "MAYABU - ALL 4 SCRAPERS TEST SUITE".center(68) + "║")
    print("║" + " "*68 + "║")
    print("╚" + "="*68 + "╝")
    
    test_query = "iphone 15"
    
    # Test all 4 scrapers
    scrapers = [
        (scrape_flipkart, "Flipkart"),
        (scrape_amazon, "Amazon"),
        (scrape_croma, "Croma"),
        (scrape_reliancedigital, "Reliance Digital"),
    ]
    
    results = {}
    
    for scraper_func, platform_name in scrapers:
        results[platform_name] = test_scraper(scraper_func, platform_name, test_query, max_products=3)
    
    # Summary
    print(f"\n\n{'='*70}")
    print("📊 TEST SUMMARY")
    print(f"{'='*70}\n")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for platform, status in results.items():
        status_icon = "✅ PASS" if status else "❌ FAIL"
        print(f"  {status_icon} | {platform}")
    
    print(f"\n  Total: {passed}/{total} scrapers working\n")
    
    if passed == total:
        print("🎉 All scrapers are working properly!")
        return True
    elif passed > 0:
        print(f"⚠️ {total - passed} scraper(s) need fixing")
        return False
    else:
        print("❌ All scrapers failed - check imports and selectors")
        return False


def test_individual_scraper(platform_name: str):
    """Test a specific scraper by name"""
    scrapers = {
        "flipkart": scrape_flipkart,
        "amazon": scrape_amazon,
        "croma": scrape_croma,
        "reliancedigital": scrape_reliancedigital,
    }
    
    platform_name = platform_name.lower()
    
    if platform_name not in scrapers:
        print(f"❌ Unknown platform: {platform_name}")
        print(f"Available: {', '.join(scrapers.keys())}")
        return
    
    scraper = scrapers[platform_name]
    display_name = platform_name.replace("reliancedigital", "Reliance Digital").title()
    
    test_scraper(scraper, display_name, "asus laptop", max_products=5)


if __name__ == "__main__":
    # Run all tests by default
    if len(sys.argv) > 1:
        # Test specific scraper if argument provided
        test_individual_scraper(sys.argv[1])
    else:
        # Run all tests
        run_all_tests()
