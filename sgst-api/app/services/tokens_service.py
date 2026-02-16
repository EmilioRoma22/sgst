from app.core.security import crear_token
from app.models.usuarios import UsuarioDTO
from app.models.auth import TokensDTO, RefreshTokenBdDTO
from app.repositories.refresh_token_repository import RefreshTokenRepository
from datetime import datetime, timedelta, timezone
from app.core.exceptions import TokenException, TokenRevocadoException, TokenExpiradoException, UsuarioNoEncontradoException, UsuarioDesactivadoException
from app.repositories.usuarios_repository import UsuariosRepository
import secrets

class TokensService:
    def __init__(self, bd):
        self.bd = bd
        self.refresh_token_repository = RefreshTokenRepository(self.bd)
        self.usuarios_repository = UsuariosRepository(self.bd)

    def crear_tokens(self, usuario: UsuarioDTO) -> TokensDTO:
        access_token = crear_token(usuario)
        refresh_token = secrets.token_urlsafe(64)
        expira_en = datetime.now(timezone.utc) + timedelta(days=1)
        
        self.refresh_token_repository.create(data={
            "id_usuario": usuario.id_usuario,
            "token": refresh_token,
            "expira_en": expira_en,
            "valido": 1
        })
        
        return TokensDTO(access_token=access_token, refresh_token=refresh_token)
    
    def refresh_token_expirado(self, r_token: RefreshTokenBdDTO) -> bool:
        expira = r_token.expira_en

        if expira.tzinfo is None:
            expira = expira.replace(tzinfo=timezone.utc)
            
        if expira < datetime.now(timezone.utc):
            self.refresh_token_repository.revocar_refresh_token(r_token=r_token)
            return True
        return False
    
    def refresh_token(self, refresh_token: str) -> TokensDTO:
        if not refresh_token:
            raise TokenException()
        
        token_bd = self.refresh_token_repository.existe_refresh_token(refresh_token)
        
        if not token_bd:
            raise TokenRevocadoException()
        
        if self.refresh_token_expirado(token_bd):
            raise TokenExpiradoException()
        
        self.refresh_token_repository.revocar_refresh_token(token_bd)
        usuario = self.usuarios_repository.obtener_usuario_por_id(token_bd.id_usuario)
        
        if not usuario:
            raise UsuarioNoEncontradoException()

        if not usuario.activo:
            raise UsuarioDesactivadoException()

        tokens = self.crear_tokens(usuario=usuario)
        
        return tokens
    
    def revocar_refresh_token(self, refresh_token: str):
        token = self.refresh_token_repository.existe_refresh_token(refresh_token)
        
        if not token:
            return
        
        self.refresh_token_repository.revocar_refresh_token(token)