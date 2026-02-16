class AppException(Exception):
    def __init__(
        self,
        *,
        status_code: int,
        code: str,
        message: str,
        details: dict | None = None
    ):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details

class ConfigError(AppException):
    def __init__(self):
        super().__init__(
            status_code=500,
            code="SERVER_ERROR", # Se coloca así para el el usuario solamente sepa que es un error del servidor y no un error de configuración.
            message="Error en el servidor, comuníquese con el administrador e intente nuevamente.",
            details={}
        )

class TokenExpiradoException(AppException):
    def __init__(self):
        super().__init__(
            status_code=401,
            code="TOKEN_EXPIRADO",
            message="El token ha expirado, por favor inicie sesión nuevamente.",
            details={}
        )

class TokenInvalidoException(AppException):
    def __init__(self):
        super().__init__(
            status_code=401,
            code="TOKEN_INVALIDO",
            message="El token es inválido, por favor inicie sesión nuevamente.",
            details={}
        )

class UsuarioNoEncontradoException(AppException):
    def __init__(self):
        super().__init__(
            status_code=404,
            code="USUARIO_NO_ENCONTRADO",
            message="No existe un usuario con el correo ingresado, por favor verifique o regístrese.",
            details={}
        )

class CredencialesIncorrectasException(AppException):
    def __init__(self):
        super().__init__(
            status_code=401,
            code="CREDENCIALES_INCORRECTAS",
            message="Las credenciales ingresadas son incorrectas, por favor verifique e intente nuevamente.",
            details={}
        )

class TokenException(AppException):
    def __init__(self):
        super().__init__(
            status_code=401,
            code="TOKEN_ERROR",
            message="No se ha encontrado un token, por favor inicie sesión nuevamente.",
            details={}
        )

class TokenRevocadoException(AppException):
    def __init__(self):
        super().__init__(
            status_code=401,
            code="TOKEN_REVOCADO",
            message="El token ha sido revocado, por favor inicie sesión nuevamente.",
            details={}
        )

class UsuarioNoPerteneceAlTallerException(AppException):
    def __init__(self):
        super().__init__(
            status_code=403,
            code="USUARIO_NO_PERTENECE_AL_TALLER",
            message="El usuario no pertenece al taller, por favor inicie sesión nuevamente.",
            details={}
        )

class UsuarioNoEsAdminNiPerteneceAlTallerException(AppException):
    def __init__(self):
        super().__init__(
            status_code=403,
            code="USUARIO_NO_ES_ADMIN_NI_TALLER",
            message="El usuario no es admin ni pertenece a un taller, por favor inicie sesión nuevamente.",
            details={}
        )

class UsuarioDesactivadoException(AppException):
    def __init__(self):
        super().__init__(
            status_code=403,
            code="USUARIO_DESACTIVADO",
            message="El usuario ha sido desactivado, por favor comuníquese con el administrador.",
            details={}
        )

class HayCorreoRepetidoException(AppException):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="HAY_CORREO_REPETIDO",
            message="El correo electrónico ya está en uso, por favor ingrese uno diferente.",
            details={}
        )

class HayTelefonoRepetidoException(AppException):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="HAY_TELEFONO_REPETIDO",
            message="El teléfono ya está en uso, por favor ingrese uno diferente.",
            details={}
        )

class ContraseñasNoCoincidenException(AppException):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="CONTRASEÑAS_NO_COINCIDEN",
            message="Las contraseñas no coinciden, por favor ingrese nuevamente.",
            details={}
        )

class CamposIncompletosException(AppException):
    def __init__(self):
        super().__init__(
            status_code=400,
            code="CAMPOS_INCOMPLETOS",
            message="Por favor complete todos los campos requeridos.",
            details={}
        )