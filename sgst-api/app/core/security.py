from datetime import datetime, timedelta, timezone
from app.core.config import settings
from app.core.exceptions import ConfigError, TokenExpiradoException, TokenInvalidoException
from passlib.context import CryptContext
from jwt import ExpiredSignatureError, PyJWTError, InvalidTokenError
from app.models.usuarios import UsuarioDTO
import jwt

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM
SCHEMES = settings.SCHEMES
ARGON2_ROUNDS = settings.ARGON2_ROUNDS

pwd_context = CryptContext(
    schemes=[SCHEMES], 
    deprecated="auto",
    argon2__rounds=ARGON2_ROUNDS
)

def crear_token(usuario: UsuarioDTO) -> str:
    if not SECRET_KEY:
        raise ConfigError()
    if len(SECRET_KEY) < settings.JWT_SECRET_KEY_MIN_LENGTH:
        raise ConfigError()
    if not ALGORITHM:
        raise ConfigError()
    
    ahora = datetime.now(timezone.utc)
    exp = datetime.now(timezone.utc) + timedelta(minutes=10)

    payload = {
        "id_usuario": usuario.id_usuario,
        "id_empresa": usuario.id_empresa,
        "iat": int(ahora.timestamp()),
        "exp": int(exp.timestamp())
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return token

def decodificar_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={
                "verify_signature": True,
                "verify_exp": True,
                "verify_iat": True,
                "require": ["exp", "iat", "id_usuario"],
                "leeway": timedelta(minutes=10)
            }
        )
        return payload

    except ExpiredSignatureError:
        raise TokenExpiradoException()
    except PyJWTError:
        raise TokenInvalidoException()

# ESTE MÉTODO SOLAMENTE USARSE EN CERRAR SESIÓN, ES SIMPLEMENTE PARA OBTENER EL ID DEL USUARIO, NO USAR ESTE MÉTODO EN OTROS CASOS.
def decodificar_token_sin_validar(token: str) -> dict:
    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
        verify=False,
        options={
            "verify_signature": False,
            "verify_exp": False,
        }
    )
    
    return payload

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)