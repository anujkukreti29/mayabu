# app/scrapers_bridge/orchestrator.py
"""
Scraping orchestration and result aggregation
Coordinates parallel scraping and result compilation
"""

from app.config import logger
from app.scrapers_bridge.executor import ScraperExecutor
from app.core.matcher import match_products_across_platforms
from app.core.formatter import build_bulk_comparison
from app.core.text_utils import soft_filter_by_query
from app.core.price_utils import is_price_valid_for_match
from scrapers.flipkart_sync import scrape_flipkart
from scrapers.amazon_sync import scrape_amazon
from scrapers.croma_sync import scrape_croma
from scrapers.reliancedigital_sync import scrape_reliancedigital


class ScrapingOrchestrator:
    """
    Orchestrates end-to-end scraping, matching, and formatting
    
    Manages the full pipeline:
    1. Parallel scraping across all platforms
    2. Product matching across platforms
    3. Data formatting for API response
    4. Error handling and logging
    """
    
    def __init__(self):
        """Initialize orchestrator with executor"""
        self.executor = ScraperExecutor()
        self.scrapers = {
            "flipkart": scrape_flipkart,
            "amazon": scrape_amazon,
            "croma": scrape_croma,
            "reliancedigital": scrape_reliancedigital,
        }
    
    async def scrape_all_platforms(self, query: str) -> dict:
        """
        Scrape all platforms in parallel
        
        Args:
            query: User search query
            
        Returns:
            dict: {platform: products_list or None}
        """
        logger.info(f"Starting parallel scraping for query: {query}")
        results = await self.executor.run_all_scrapers(self.scrapers, query)
        
        # Log results
        for platform, products in results.items():
            count = len(products) if products else 0
            logger.info(f"{platform}: {count} products scraped")
        
        return results
    
    async def compare_prices(
        self,
        query: str,
        validate_prices: bool = True
    ) -> dict:
        """
        Full comparison pipeline: scrape → match → format
        
        Orchestrates complete price comparison workflow.
        Returns final comparison results ready for API response.
        
        Args:
            query: User search query
            validate_prices: Whether to check price variance validity
            
        Returns:
            dict: {
                'success': bool,
                'query': str,
                'results': list[dict],
                'count': int,
                'error': str or None
            }
        """
        try:
            # STAGE 1: Scrape all platforms
            logger.info(f"=== PRICE COMPARISON: {query} ===")
            scraped = await self.scrape_all_platforms(query)
            
            # Check if we got any results
            has_flipkart = scraped.get("flipkart")
            if not has_flipkart:
                logger.warning(f"No Flipkart results for: {query}")
                return {
                    "success": False,
                    "query": query,
                    "results": [],
                    "count": 0,
                    "error": "No products found on Flipkart"
                }
            
            # STAGE 2: Match products across platforms
            logger.info("Matching products across platforms...")
            matches = match_products_across_platforms(
                flipkart_products=scraped["flipkart"],
                amazon_products=scraped.get("amazon", []),
                croma_products=scraped.get("croma", []),
                reliance_products=scraped.get("reliancedigital", []),
                user_query=query
            )
            
            logger.info(f"Found {len(matches)} potential matches")
            
            # STAGE 3: Format and validate results
            logger.info("Formatting results...")
            results = []
            
            from app.core.price_utils import extract_price, is_price_valid_for_match

            for match in matches:
                fk = match["flipkart"]
                amz = match.get("amazon")
                croma = match.get("croma")
                reliance = match.get("reliance")

                # Collect prices from the raw products
                price_list: list[int] = []
                if fk:
                    price_list.append(extract_price(fk.get("currentPrice", "0")))
                if amz:
                    price_list.append(extract_price(amz.get("currentPrice", "0")))
                if croma:
                    price_list.append(extract_price(croma.get("currentPrice", "0")))
                if reliance:
                    price_list.append(extract_price(reliance.get("currentPrice", "0")))

                if validate_prices and not is_price_valid_for_match(price_list):
                    logger.debug(f"Skipping match due to price variance: {fk.get('title')}")
                    continue

                comparison = {
                    "flipkart": fk,
                    "flipkart_score": 100,
                    "amazon": amz,
                    "amazon_score": match.get("amazon_score", 0),
                    "croma": croma,
                    "croma_score": match.get("croma_score", 0),
                    "reliancedigital": reliance,
                    "reliancedigital_score": match.get("reliance_score", 0),
                }
                results.append(comparison)
            
            # Remove duplicates by Flipkart title
            seen = set()
            unique_results = []
            for result in results:
                title = result["flipkart"].get("title")
                if title not in seen:
                    seen.add(title)
                    unique_results.append(result)
            
            logger.info(f"Returning {len(unique_results)} unique comparisons")
            
            return {
                "success": True,
                "query": query,
                "results": unique_results,
                "count": len(unique_results),
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Comparison failed: {e}", exc_info=True)
            return {
                "success": False,
                "query": query,
                "results": [],
                "count": 0,
                "error": str(e)
            }
    
    async def get_product_details(self, query: str) -> dict:
        """
        Get detailed information for a specific product
        
        Args:
            query: Product identifier/search term
            
        Returns:
            dict: Detailed product information across platforms
        """
        logger.info(f"Getting product details for: {query}")
        return await self.compare_prices(query, validate_prices=False)
    
    def shutdown(self):
        """Cleanup resources"""
        logger.info("Shutting down ScrapingOrchestrator")
        self.executor.shutdown()


__all__ = ["ScrapingOrchestrator"]