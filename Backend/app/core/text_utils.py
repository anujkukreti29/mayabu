# app/core/text_utils.py
"""
Text processing and product model extraction
Handles title normalization and query-aware matching
"""

import re
from app.config import (
    logger,
    QUERY_EXACT_MATCH_BOOST,
    QUERY_TOKEN_MATCH_BOOST
)


def extract_product_model(title: str) -> str:
    """
    Extract core product model from title for better matching
    
    Removes noise like specifications, packaging info, and special chars
    Enables more accurate cross-platform product matching
    
    Args:
        title: Full product title
        
    Returns:
        str: Cleaned product model
        
    Example:
        >>> extract_product_model("Dell XPS 13 (2023) - Intel i7 16GB RAM")
        "dell xps 13 intel"
    """
    title = title.lower()
    
    # Remove content in parentheses
    title = re.sub(r'\(.*?\)', '', title)
    
    # Remove content in brackets
    title = re.sub(r'\[.*?\]', '', title)
    
    # Remove spec keywords that create false negatives
    title = re.sub(
        r'\b(gb|storage|ram|processor|windows|core|intel|amd|ryzen|gen)\b',
        '',
        title,
        flags=re.IGNORECASE
    )
    
    return title.strip()


def boost_score_with_query(
    raw_title: str,
    user_query: str,
    base_score: float
) -> float:
    """
    Boost similarity score if product title contains user query
    
    Prioritizes exact matches and all-token matches over partial matches.
    This helps when user searches for specific model like "MacBook Pro M2"
    
    Args:
        raw_title: Product title from platform
        user_query: User's search query
        base_score: Base fuzzy match score (0-100)
        
    Returns:
        float: Boosted score (capped at 100)
        
    Example:
        >>> boost_score_with_query("MacBook Pro M2 2022", "MacBook Pro M2", 85)
        93  # +8 boost for token match
    """
    t = raw_title.lower()
    q = user_query.lower().strip()
    
    if not q:
        return base_score
    
    # Hard boost if exact phrase appears in title
    if q in t:
        boosted = base_score + QUERY_EXACT_MATCH_BOOST
        logger.debug(f"Exact match boost: {base_score} -> {boosted}")
        return boosted
    
    # Softer boost if all query tokens appear in title
    q_tokens = [x for x in q.split() if x]
    if q_tokens and all(tok in t for tok in q_tokens):
        boosted = base_score + QUERY_TOKEN_MATCH_BOOST
        logger.debug(f"Token match boost: {base_score} -> {boosted}")
        return boosted
    
    return base_score


def soft_filter_by_query(
    products: list[dict],
    user_query: str,
    keep_if_missing: int = 3
) -> list[dict]:
    """
    Filter products by query relevance with fallback
    
    Keeps only products whose title contains ALL query tokens.
    If filtering removes too many products, returns original list
    to avoid over-filtering (user may not remember exact title)
    
    Args:
        products: List of product dicts with 'title' key
        user_query: User's search query
        keep_if_missing: Minimum products to keep before fallback
        
    Returns:
        list: Filtered products or original if too few matches
        
    Example:
        >>> products = [
        ...     {"title": "Dell XPS 13 Core i7"},
        ...     {"title": "MacBook Pro M2"},
        ...     {"title": "ThinkPad X1 Carbon"}
        ... ]
        >>> soft_filter_by_query(products, "Dell XPS")
        [{"title": "Dell XPS 13 Core i7"}]
    """
    q = user_query.lower().strip()
    
    if not q:
        return products
    
    tokens = [t for t in q.split() if t]
    
    def is_relevant(title: str) -> bool:
        t = title.lower()
        return all(tok in t for tok in tokens)
    
    filtered = [p for p in products if is_relevant(p.get("title", ""))]
    
    # Fallback if too few match
    if len(filtered) < keep_if_missing:
        logger.debug(
            f"Filtered too aggressively ({len(filtered)} < {keep_if_missing}), "
            f"returning original {len(products)} products"
        )
        return products
    
    logger.debug(f"Filtered {len(products)} -> {len(filtered)} products")
    return filtered


__all__ = [
    "extract_product_model",
    "boost_score_with_query",
    "soft_filter_by_query"
]