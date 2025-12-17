# app/scrapers_bridge/executor.py
"""
Thread pool execution for sync scrapers
Manages parallel scraping across platforms
"""

from concurrent.futures import ThreadPoolExecutor
from app.config import logger, MAX_WORKERS
import asyncio


class ScraperExecutor:
    """
    Thread pool executor for running sync scrapers in parallel
    
    Wraps concurrent.futures.ThreadPoolExecutor for easy scraper management.
    Allows async code to call sync scrapers without blocking.
    """
    
    def __init__(self, max_workers: int = MAX_WORKERS):
        """Initialize executor with thread pool"""
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.max_workers = max_workers
        logger.info(f"ScraperExecutor initialized with {max_workers} workers")
    
    async def run_scraper(
        self,
        scraper_func,
        query: str,
        timeout: int = 30
    ) -> dict | None:
        """
        Run a sync scraper in thread pool (non-blocking in async context)
        
        Args:
            scraper_func: Scraper function (from scrapers module)
            query: Search query
            timeout: Max seconds to wait for scraper
            
        Returns:
            dict: Scraper results or None if failed
        """
        loop = asyncio.get_event_loop()
        
        try:
            logger.debug(f"Running {scraper_func.__name__} with query: {query}")
            result = await asyncio.wait_for(
                loop.run_in_executor(self.executor, scraper_func, query),
                timeout=timeout
            )
            logger.debug(f"{scraper_func.__name__} completed")
            return result
            
        except asyncio.TimeoutError:
            logger.error(f"{scraper_func.__name__} timed out after {timeout}s")
            return None
        except Exception as e:
            logger.error(f"{scraper_func.__name__} failed: {e}")
            return None
    
    async def run_all_scrapers(
        self,
        scrapers: dict,
        query: str
    ) -> dict:
        """
        Run all scrapers in parallel
        
        Args:
            scrapers: Dict of {platform: scraper_func}
            query: Search query
            
        Returns:
            dict: {platform: results or None}
        """
        logger.info(f"Starting parallel scraping for: {query}")
        
        tasks = {
            platform: self.run_scraper(func, query)
            for platform, func in scrapers.items()
        }
        
        results = {}
        for platform, task in tasks.items():
            results[platform] = await task
        
        logger.info(f"Parallel scraping completed")
        return results
    
    def shutdown(self):
        """Gracefully shut down thread pool"""
        logger.info("Shutting down ScraperExecutor")
        self.executor.shutdown(wait=True)


__all__ = ["ScraperExecutor"]