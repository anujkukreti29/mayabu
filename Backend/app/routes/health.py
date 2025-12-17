# app/routes/health.py
"""
Health check and status routes
Monitor API health and readiness
"""

from fastapi import APIRouter
from datetime import datetime
from app.config import logger

# Create router
router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    """
    Health check endpoint
    
    Returns basic API status information.
    Use this to verify the API is running.
    
    Returns:
    - status: "healthy" or "unhealthy"
    - timestamp: Current server time
    - version: API version
    
    Example:
    ```
    GET /health
    
    Response:
    {
        "status": "healthy",
        "timestamp": "2024-12-17T14:30:45.123456",
        "version": "3.1-ENHANCED"
    }
    ```
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "3.1-ENHANCED"
    }


@router.get("/status")
async def get_status() -> dict:
    """
    Detailed API status endpoint
    
    Returns more detailed information about API capabilities and state.
    Use this for monitoring and debugging.
    
    Returns:
    - online: Whether API is online
    - platforms: List of supported platforms
    - features: Available features
    - timestamp: Current server time
    
    Example:
    ```
    GET /status
    
    Response:
    {
        "online": true,
        "platforms": ["flipkart", "amazon", "croma", "reliancedigital"],
        "features": ["compare", "search"],
        "timestamp": "2024-12-17T14:30:45.123456"
    }
    ```
    """
    return {
        "online": True,
        "platforms": ["flipkart", "amazon", "croma", "reliancedigital"],
        "features": ["compare", "search"],
        "timestamp": datetime.now().isoformat()
    }


__all__ = ["router"]