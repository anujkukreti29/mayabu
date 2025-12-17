# app/routes/comparison.py
"""
Price comparison routes and logic
Main endpoint for comparing products across platforms
"""

from fastapi import APIRouter, Query
from app.config import logger
from app.scrapers_bridge.orchestrator import ScrapingOrchestrator

# Create router
router = APIRouter(prefix="/api", tags=["comparison"])

# Initialize orchestrator (singleton-like, could be moved to app startup)
orchestrator = ScrapingOrchestrator()


@router.get("/compare")
async def compare_products(
    query: str = Query(
        ...,
        min_length=2,
        max_length=100,
        description="Product search query"
    ),
    validate_prices: bool = Query(
        True,
        description="Whether to validate price variance"
    ),
    limit: int = Query(
        10,
        ge=1,
        le=50,
        description="Maximum results to return"
    )
) -> dict:
    """
    Compare product prices across all platforms
    
    Searches for products on Flipkart (reference), Amazon, Croma, and Reliance Digital.
    Returns price comparisons, savings, and product details.
    
    Query Parameters:
    - query: Product search term (required)
    - validate_prices: Check price variance (default: true)
    - limit: Max results to return (default: 10, max: 50)
    
    Returns:
    - success: Whether comparison succeeded
    - query: Original search query
    - results: List of price comparisons
    - count: Number of results
    - error: Error message if failed
    
    Example:
    ```
    GET /api/compare?query=MacBook+Pro+M2&limit=5
    
    Response:
    {
        "success": true,
        "query": "MacBook Pro M2",
        "results": [
            {
                "flipkart": {...},
                "flipkart_score": 100,
                "amazon": {...},
                "amazon_score": 92.5,
                "croma": null,
                "reliancedigital": {...},
                "price_difference": 5000,
                "cheaper_on": "amazon"
            }
        ],
        "count": 1
    }
    ```
    """
    logger.info(f"Compare endpoint called: query='{query}', limit={limit}")
    
    # Get comparison results from orchestrator
    result = await orchestrator.compare_prices(
        query=query,
        validate_prices=validate_prices
    )
    
    # Apply limit
    if result["results"]:
        result["results"] = result["results"][:limit]
        result["count"] = len(result["results"])
    
    return result


@router.get("/search")
async def search_products(
    query: str = Query(
        ...,
        min_length=2,
        max_length=100,
        description="Product search query"
    ),
    platform: str = Query(
        "flipkart",
        description="Platform to search (flipkart, amazon, croma, reliancedigital)"
    ),
    limit: int = Query(
        20,
        ge=1,
        le=100,
        description="Maximum results to return"
    )
) -> dict:
    """
    Search for products on a specific platform
    
    Returns products from a single platform without comparison.
    Useful for browsing or detailed product searches.
    
    Query Parameters:
    - query: Product search term (required)
    - platform: Which platform to search (default: flipkart)
    - limit: Max results to return (default: 20, max: 100)
    
    Returns:
    - success: Whether search succeeded
    - query: Original search query
    - platform: Platform searched
    - results: List of products
    - count: Number of results
    - error: Error message if failed
    
    Example:
    ```
    GET /api/search?query=iPhone&platform=amazon&limit=10
    ```
    """
    logger.info(f"Search endpoint called: query='{query}', platform='{platform}'")
    
    # Map platform name to scraper
    scrapers = {
        "flipkart": orchestrator.scrapers.get("flipkart"),
        "amazon": orchestrator.scrapers.get("amazon"),
        "croma": orchestrator.scrapers.get("croma"),
        "reliancedigital": orchestrator.scrapers.get("reliancedigital"),
    }
    
    if platform not in scrapers or not scrapers[platform]:
        return {
            "success": False,
            "query": query,
            "platform": platform,
            "results": [],
            "count": 0,
            "error": f"Platform '{platform}' not supported"
        }
    
    try:
        # Get products from selected platform
        scraper_func = scrapers[platform]
        products = scraper_func(query)
        
        if products:
            products = products[:limit]
        else:
            products = []
        
        return {
            "success": True,
            "query": query,
            "platform": platform,
            "results": products,
            "count": len(products),
            "error": None
        }
        
    except Exception as e:
        logger.error(f"Search failed: {e}")
        return {
            "success": False,
            "query": query,
            "platform": platform,
            "results": [],
            "count": 0,
            "error": str(e)
        }


__all__ = ["router"]