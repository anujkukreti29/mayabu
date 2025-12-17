# app/core/price_utils.py
"""
Price extraction and validation utilities
Handles parsing, formatting, and validation of prices
"""

from app.config import logger, MAX_PRICE_DIFF_PERCENT


def extract_price(price_str: str) -> int:
    """
    Extract numeric price from string like '₹51,999'
    
    Args:
        price_str: Price string with currency and formatting
        
    Returns:
        int: Numeric price value, 0 if invalid
        
    Example:
        >>> extract_price("₹51,999")
        51999
        >>> extract_price("N/A")
        0
    """
    try:
        if not price_str or price_str == "N/A":
            return 0
        
        price = str(price_str).replace("₹", "").replace(",", "").strip()
        return int(price) if price.isdigit() else 0
        
    except Exception as e:
        logger.warning(f"Price extraction failed for '{price_str}': {e}")
        return 0


def is_price_valid_for_match(
    prices: list[int],
    max_diff_percent: float = MAX_PRICE_DIFF_PERCENT
) -> bool:
    """
    Check if prices are within acceptable range
    
    Validates that price variance across platforms is reasonable.
    If extreme differences detected, product match may be incorrect.
    
    Args:
        prices: List of prices to validate
        max_diff_percent: Maximum allowed percentage difference
        
    Returns:
        bool: True if prices are valid for matching
        
    Example:
        >>> is_price_valid_for_match([50000, 51000, 52000])
        True
        >>> is_price_valid_for_match([50000, 100000])
        False  # Too much variance
    """
    valid_prices = [p for p in prices if p > 0]
    
    # Need at least 2 prices to validate
    if len(valid_prices) < 2:
        return True
    
    min_price = min(valid_prices)
    max_price = max(valid_prices)
    
    price_diff_percent = ((max_price - min_price) / max_price) * 100
    
    is_valid = price_diff_percent <= max_diff_percent
    
    if not is_valid:
        logger.debug(f"Price variance {price_diff_percent:.1f}% exceeds {max_diff_percent}%")
    
    return is_valid


def calculate_savings(prices_dict: dict[str, int]) -> dict:
    """
    Calculate savings and cheapest platform
    
    Args:
        prices_dict: Dict of {platform: price}
        
    Returns:
        dict: {
            'price_difference': int,
            'cheaper_on': str,
            'you_save': int
        }
    """
    valid_prices = {k: v for k, v in prices_dict.items() if v > 0}
    
    if len(valid_prices) < 2:
        return {
            "price_difference": None,
            "cheaper_on": None,
            "you_save": None
        }
    
    min_price = min(valid_prices.values())
    max_price = max(valid_prices.values())
    
    return {
        "price_difference": max_price - min_price,
        "cheaper_on": [k for k, v in valid_prices.items() if v == min_price][0],
        "you_save": max_price - min_price
    }


__all__ = [
    "extract_price",
    "is_price_valid_for_match",
    "calculate_savings"
]