# app/middleware/__init__.py
"""Middleware and configuration"""

from app.middleware.cors_config import setup_cors_middleware, setup_middlewares

__all__ = ["setup_cors_middleware", "setup_middlewares"]