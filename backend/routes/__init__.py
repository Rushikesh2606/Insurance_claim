"""
HTTP interface layer.
Import and expose all blueprints so `app.py` can register them in one line.
"""
from .auth_routes import auth_bp

__all__ = ["auth_bp"]