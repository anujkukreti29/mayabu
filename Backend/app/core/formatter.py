# app/core/formatter.py
"""
Data formatting and standardization
Converts platform-specific data to unified response format
"""

from app.core.price_utils import extract_price, calculate_savings
from app.config import logger


def format_product(product: dict | None, platform: str) -> dict | None:
    """
    Format product data to standardized structure
    
    Normalizes product fields from different platforms into consistent format.
    Handles missing fields gracefully with defaults.
    
    Args:
        product: Product dict from platform scraper
        platform: Platform name for tracking
        
    Returns:
        dict: Standardized product format or None if product is None
        
    Example:
        >>> amz_product = {
        ...     "title": "Dell XPS 13",
        ...     "currentPrice": "₹51,999",
        ...     "maxRetailPrice": "₹60,000",
        ...     "image": "https://...",
        ...     "rating": 4.5,
        ...     "ratingCount": 1200,
        ...     "link": "https://amazon.in/...",
        ...     "discount": "13%"
        ... }
        >>> fmt = format_product(amz_product, "Amazon")
        >>> fmt["platform"]
        "Amazon"
    """
    if not product:
        return None
    
    formatted = {
        "title": product.get("title", "N/A"),
        "price": product.get("currentPrice", "N/A"),
        "originalPrice": product.get("maxRetailPrice", "N/A"),
        "image": product.get("image", "N/A"),
        "rating": product.get("rating", "N/A"),
        "reviews": product.get("ratingCount", 0),
        "url": product.get("link", "N/A"),
        "discount": product.get("discount", "N/A"),
        "platform": platform
    }
    
    logger.debug(f"Formatted {platform} product: {formatted['title'][:40]}...")
    return formatted


def build_comparison_result(
    fk_product: dict,
    amz_product: dict | None = None,
    croma_product: dict | None = None,
    reliance_product: dict | None = None,
    similarity_score: float = 100
) -> dict:
    """
    Build complete comparison result with all platform products
    
    Creates the final response object with:
    - Individual formatted products from each platform
    - Price information and savings calculation
    - Similarity scores for matching quality
    
    Args:
        fk_product: Flipkart product (required, reference product)
        amz_product: Amazon product or None if not found
        croma_product: Croma product or None if not found
        reliance_product: Reliance Digital product or None if not found
        similarity_score: Match quality score (0-100)
        
    Returns:
        dict: Complete comparison result ready for API response
        
    Example:
        >>> fk_prod = {"title": "Dell XPS", "currentPrice": "₹51,999"}
        >>> amz_prod = {"title": "Dell XPS 13", "currentPrice": "₹52,000"}
        >>> result = build_comparison_result(fk_prod, amz_prod)
        >>> result["price_difference"]
        1
        >>> result["cheaper_on"]
        "flipkart"
    """
    # Extract prices
    fk_price = extract_price(fk_product.get("currentPrice", "0"))
    fk_formatted = format_product(fk_product, "Flipkart")
    
    # Initialize result with Flipkart as base
    result = {
        "similarity_score": round(similarity_score, 2),
        "flipkart": fk_formatted,
        "flipkart_price": fk_price,
        "amazon": None,
        "amazon_price": None,
        "croma": None,
        "croma_price": None,
        "reliancedigital": None,
        "reliancedigital_price": None,
        "all_prices": {"flipkart": fk_price},
        "price_difference": None,
        "cheaper_on": None,
        "you_save": None,
    }
    
    # Add Amazon if available
    if amz_product:
        amz_formatted = format_product(amz_product, "Amazon")
        amz_price = extract_price(amz_product.get("currentPrice", "0"))
        result["amazon"] = amz_formatted
        result["amazon_price"] = amz_price
        result["all_prices"]["amazon"] = amz_price
    
    # Add Croma if available
    if croma_product:
        croma_formatted = format_product(croma_product, "Croma")
        croma_price = extract_price(croma_product.get("currentPrice", "0"))
        result["croma"] = croma_formatted
        result["croma_price"] = croma_price
        result["all_prices"]["croma"] = croma_price
    
    # Add Reliance Digital if available
    if reliance_product:
        reliance_formatted = format_product(reliance_product, "Reliance Digital")
        reliance_price = extract_price(reliance_product.get("currentPrice", "0"))
        result["reliancedigital"] = reliance_formatted
        result["reliancedigital_price"] = reliance_price
        result["all_prices"]["reliancedigital"] = reliance_price
    
    # Calculate price comparison and savings
    savings = calculate_savings(result["all_prices"])
    result["price_difference"] = savings["price_difference"]
    result["cheaper_on"] = savings["cheaper_on"]
    result["you_save"] = savings["you_save"]
    
    logger.debug(f"Built comparison result with {len([p for p in [amz_product, croma_product, reliance_product] if p])} matches")
    
    return result


def build_bulk_comparison(
    matches: list[dict]
) -> list[dict]:
    """
    Convert platform matches into final comparison results
    
    Takes raw matches from matcher and formats them into response objects.
    This is the bridge between matching logic and API response.
    
    Args:
        matches: List of match dicts from match_products_across_platforms()
        
    Returns:
        list: List of formatted comparison results
    """
    results = []
    
    for match in matches:
        comparison = build_comparison_result(
            fk_product=match["flipkart"],
            amz_product=match.get("amazon"),
            croma_product=match.get("croma"),
            reliance_product=match.get("reliance"),
            similarity_score=min(
                (match.get("amazon_score", 0) + match.get("croma_score", 0) + match.get("reliance_score", 0)) / 3,
                100
            ) if any([match.get("amazon_product"), match.get("croma_product"), match.get("reliance_product")]) else 100
        )
        results.append(comparison)
    
    return results


__all__ = [
    "format_product",
    "build_comparison_result",
    "build_bulk_comparison"
]