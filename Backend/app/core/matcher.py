# app/core/matcher.py
"""
Product matching and fuzzy search logic
Handles cross-platform product matching using fuzzy algorithms
"""

from rapidfuzz import process, fuzz
from app.config import logger, SIMILARITY_THRESHOLD
from app.core.text_utils import extract_product_model, boost_score_with_query


def find_best_match(
    reference_title: str,
    products_list: list[dict],
    threshold: float = SIMILARITY_THRESHOLD,
    user_query: str | None = None
) -> dict | None:
    """
    Find best matching product from a list using fuzzy matching
    
    Two-stage matching strategy:
    1. Full title matching with token sort
    2. Fallback to model-based matching if poor score
    
    Args:
        reference_title: Title to match against (usually from Flipkart)
        products_list: List of product dicts with 'title' key
        threshold: Minimum score to accept match (0-100)
        user_query: Optional query for score boosting
        
    Returns:
        dict: {"product": {...}, "score": float} or None if no match
        
    Example:
        >>> fk_product = {"title": "Dell XPS 13 Core i7"}
        >>> amz_products = [{"title": "Dell XPS 13 (i7) 2022"}]
        >>> match = find_best_match(fk_product["title"], amz_products)
        >>> match["score"]
        87.5
    """
    if not products_list:
        logger.debug("No products to match against")
        return None
    
    titles = [p.get("title", "") for p in products_list]
    
    # STRATEGY 1: Full title matching with token sort
    logger.debug(f"Attempting full title match for: {reference_title[:50]}...")
    best_match = process.extractOne(
        reference_title,
        titles,
        scorer=fuzz.token_sort_ratio
    )
    
    # If poor match, try model-based matching
    use_model = False
    if not best_match or best_match[1] < threshold:
        logger.debug(f"Full match score {best_match[1] if best_match else 'N/A'} < {threshold}, trying model matching...")
        
        ref_model = extract_product_model(reference_title)
        models = [extract_product_model(t) for t in titles]
        
        best_match = process.extractOne(
            ref_model,
            models,
            scorer=fuzz.token_sort_ratio
        )
        use_model = True
    
    # No acceptable match found
    if not best_match or best_match[1] < threshold:
        logger.debug(f"No match found above threshold {threshold}")
        return None
    
    # Get the matched product
    if use_model:
        models = [extract_product_model(t) for t in titles]
        idx = models.index(best_match[0])
    else:
        idx = titles.index(best_match[0])
    
    product = products_list[idx]
    score = float(best_match[1])
    
    # Boost score if close to user query
    if user_query:
        score = boost_score_with_query(product.get("title", ""), user_query, score)
    
    score = min(score, 100.0)  # Cap at 100
    
    logger.debug(f"Match found: {product.get('title', '')[:50]}... (score: {score})")
    
    return {
        "product": product,
        "score": score,
    }


def match_products_across_platforms(
    flipkart_products: list[dict],
    amazon_products: list[dict],
    croma_products: list[dict],
    reliance_products: list[dict],
    user_query: str | None = None
) -> list[dict]:
    """
    Find best matches across all platforms for Flipkart reference products
    
    For each Flipkart product, tries to find matching products on other platforms.
    Returns comparison data ready for response.
    
    Args:
        flipkart_products: Reference products list
        amazon_products: Products to match from Amazon
        croma_products: Products to match from Croma
        reliance_products: Products to match from Reliance
        user_query: Optional query for better matching
        
    Returns:
        list: Comparison results with matches from all platforms
    """
    from app.core.text_utils import soft_filter_by_query
    
    results = []
    
    for fk_product in flipkart_products:
        # Soft filter each platform's products by query for better matching
        amz_filtered = soft_filter_by_query(amazon_products, user_query or "")
        croma_filtered = soft_filter_by_query(croma_products, user_query or "")
        reliance_filtered = soft_filter_by_query(reliance_products, user_query or "")
        
        # Find best match on each platform
        amz_match = find_best_match(
            fk_product.get("title", ""),
            amz_filtered,
            user_query=user_query
        )
        
        croma_match = find_best_match(
            fk_product.get("title", ""),
            croma_filtered,
            user_query=user_query
        )
        
        reliance_match = find_best_match(
            fk_product.get("title", ""),
            reliance_filtered,
            user_query=user_query
        )
        
        result = {
            "flipkart": fk_product,
            "flipkart_score": 100,
            "amazon": amz_match["product"] if amz_match else None,
            "amazon_score": amz_match["score"] if amz_match else 0,
            "croma": croma_match["product"] if croma_match else None,
            "croma_score": croma_match["score"] if croma_match else 0,
            "reliance": reliance_match["product"] if reliance_match else None,
            "reliance_score": reliance_match["score"] if reliance_match else 0,
        }
        
        results.append(result)
    
    return results


__all__ = [
    "find_best_match",
    "match_products_across_platforms"
]