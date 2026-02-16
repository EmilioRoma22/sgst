from pydantic import BaseModel
from app.models.usuarios import UsuarioDTO
from datetime import datetime

class LoginDTO(BaseModel):
    correo_usuario: str
    password_usuario: str
    
class TokensDTO(BaseModel):
    access_token: str
    refresh_token: str
    
class LoginResponseDTO(BaseModel):
    usuario: UsuarioDTO
    tokens: TokensDTO

class RefreshTokenBdDTO(BaseModel):
    id_token: int
    id_usuario: int
    expira_en: datetime

class RegistroDTO(BaseModel):
    nombre_usuario: str
    apellidos_usuario: str
    correo_usuario: str
    telefono_usuario: str
    password_usuario: str
    confirmar_password_usuario: str