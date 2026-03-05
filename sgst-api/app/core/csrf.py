"""
Protección CSRF mediante Double Submit Cookie.
El token se guarda en una cookie no HttpOnly y se exige el mismo valor en header en mutaciones.
"""
import secrets
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

CSRF_COOKIE_NAME = "csrf_token"
CSRF_HEADER_NAME = "X-CSRF-Token"
CSRF_TOKEN_BYTES = 32

METODOS_PROTEGIDOS = {"POST", "PUT", "PATCH", "DELETE"}

RUTAS_SIN_CSRF = ("/auth/login", "/auth/registro", "/auth/refresh")

def generar_token_csrf() -> str:
    return secrets.token_urlsafe(CSRF_TOKEN_BYTES)

def _ruta_excluida_csrf(path: str) -> bool:
    return any(path.endswith(ruta) for ruta in RUTAS_SIN_CSRF)

class CsrfMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method not in METODOS_PROTEGIDOS:
            return await call_next(request)
        if _ruta_excluida_csrf(request.url.path):
            return await call_next(request)
        cookie_token = request.cookies.get(CSRF_COOKIE_NAME)
        header_token = request.headers.get(CSRF_HEADER_NAME)
        if not cookie_token or not header_token or not secrets.compare_digest(cookie_token, header_token):
            return JSONResponse(
                status_code=403,
                content={
                    "error": {
                        "code": "CSRF_TOKEN_INVALIDO",
                        "message": "Token de seguridad inválido o faltante. R   ecargue la página e intente de nuevo.",
                    }
                },
            )
        return await call_next(request)
