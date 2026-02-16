from pydantic import BaseModel

class UsuarioDTO(BaseModel):
    id_usuario: int
    id_empresa: int | None
    nombre_usuario: str
    apellidos_usuario: str
    correo_usuario: str
    telefono_usuario: str
    hash_password: str
    activo: bool