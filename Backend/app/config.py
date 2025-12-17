# app/config.py
"""
Configuration module for Mayabu backend
Handles logging, constants, and global settings
"""

import logging
from typing import Final

# ✅ LOGGING SETUP
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================
# CONSTANTS & SETTINGS
# ============================================

# Thread Pool Configuration
MAX_WORKERS: Final[int] = 6  # Optimized for parallel scraping (was 4)

# Fuzzy Matching Thresholds
SIMILARITY_THRESHOLD: Final[float] = 50  # Minimum match score (0-100)
MAX_PRICE_DIFF_PERCENT: Final[float] = 35  # Max acceptable price variance

# Query Boosting Parameters
QUERY_EXACT_MATCH_BOOST: Final[float] = 15  # Boost for exact phrase match
QUERY_TOKEN_MATCH_BOOST: Final[float] = 8  # Boost for all tokens present
MIN_FILTERED_PRODUCTS: Final[int] = 3  # Fallback if too few filtered

# Platform names
PLATFORMS: Final[list[str]] = [
    "flipkart",
    "amazon", 
    "croma",
    "reliancedigital"
]

# ============================================
# EXPORT
# ============================================
__all__ = [
    "logger",
    "MAX_WORKERS",
    "SIMILARITY_THRESHOLD",
    "MAX_PRICE_DIFF_PERCENT",
    "QUERY_EXACT_MATCH_BOOST",
    "QUERY_TOKEN_MATCH_BOOST",
    "MIN_FILTERED_PRODUCTS",
    "PLATFORMS",
]