# app/middleware/cors_config.py
"""
CORS and middleware configuration
Sets up cross-origin resource sharing and request handling
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import logger


def setup_cors_middleware(app: FastAPI):
    """
    Configure CORS middleware for FastAPI app
    
    Allows frontend to communicate with backend from different origins.
    IMPORTANT: In production, restrict allow_origins to specific domains
    
    Args:
        app: FastAPI application instance
    """
    logger.info("Setting up CORS middleware...")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # TODO: Restrict to specific origins in production
        allow_credentials=True,
        allow_methods=["*"],  # Allow GET, POST, OPTIONS, etc.
        allow_headers=["*"],  # Allow all headers
    )
    
    logger.info("CORS middleware configured")


def setup_middlewares(app: FastAPI):
    """
    Setup all middlewares for the application
    
    Central place to configure all middleware.
    CORS must be first middleware for proper functionality.
    
    Args:
        app: FastAPI application instance
    """
    logger.info("Setting up application middlewares...")
    
    # CORS MUST be first
    setup_cors_middleware(app)
    
    # Add other middlewares here as needed
    # e.g., authentication, rate limiting, compression, etc.
    
    logger.info("All middlewares configured")


__all__ = ["setup_cors_middleware", "setup_middlewares"]