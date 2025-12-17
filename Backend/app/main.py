# app/main.py
"""
Mayabu Price Comparison API - Main Entry Point
Refactored modular version with clean separation of concerns
"""

from fastapi import FastAPI
from app.config import logger

# Import middleware setup
from app.middleware.cors_config import setup_middlewares

# Import all routers
from app.routes import comparison, health

# ============================================
# APP INITIALIZATION
# ============================================

app = FastAPI(
    title="Mayabu Price Comparison API",
    description="Compare prices across Amazon, Flipkart, Croma & Reliance Digital",
    version="3.1-ENHANCED"
)

# ============================================
# MIDDLEWARE SETUP
# ============================================

setup_middlewares(app)

# ============================================
# ROUTE REGISTRATION
# ============================================

# Health routes
app.include_router(health.router)

# Comparison routes
app.include_router(comparison.router)

# ============================================
# ROOT ENDPOINT
# ============================================

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Mayabu Price Comparison API",
        "version": "3.1-ENHANCED",
        "status": "running",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


# ============================================
# STARTUP & SHUTDOWN EVENTS
# ============================================

@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup"""
    logger.info("🚀 Mayabu API starting up...")
    logger.info("✅ All systems initialized")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources on shutdown"""
    logger.info("🛑 Mayabu API shutting down...")
    logger.info("✅ Cleanup completed")


# ============================================
# AVAILABLE ENDPOINTS
# ============================================

"""
Documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

Endpoints:
- GET  /                    - API information
- GET  /health              - Health check
- GET  /status              - Detailed status
- GET  /api/compare         - Compare prices across platforms
- GET  /api/search          - Search products on specific platform

Examples:
    curl http://localhost:8000/health
    curl http://localhost:8000/api/compare?query=MacBook+Pro
    curl http://localhost:8000/api/search?query=iPhone&platform=amazon
"""


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)