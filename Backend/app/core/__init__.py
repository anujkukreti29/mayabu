# app/core/__init__.py
"""Core utilities for data processing, matching, and formatting"""

from app.core.price_utils import extract_price, is_price_valid_for_match, calculate_savings
from app.core.text_utils import extract_product_model, boost_score_with_query, soft_filter_by_query
from app.core.matcher import find_best_match, match_products_across_platforms
from app.core.formatter import format_product, build_comparison_result, build_bulk_comparison

__all__ = [
    # Price utilities
    "extract_price",
    "is_price_valid_for_match",
    "calculate_savings",
    # Text utilities
    "extract_product_model",
    "boost_score_with_query",
    "soft_filter_by_query",
    # Matching
    "find_best_match",
    "match_products_across_platforms",
    # Formatting
    "format_product",
    "build_comparison_result",
    "build_bulk_comparison",
]