from app.repositories.base_repository import BaseRepository
from app.models.usuarios import UsuarioDTO
from app.models.auth import TokensDTO, RefreshTokenBdDTO

class RefreshTokenRepository(BaseRepository):
    table_name = "refresh_tokens"
    
    def existe_refresh_token(self, refresh_token: str)  -> RefreshTokenBdDTO | None:
        query = f"""SELECT id_token, id_usuario, expira_en FROM {self.table_name} WHERE token = %s AND valido = 1"""
        self.execute(query, (refresh_token, ))
        token_bd = self.cursor.fetchone()
        
        return RefreshTokenBdDTO(**token_bd) if token_bd else None

    def revocar_refresh_token(self, r_token: RefreshTokenBdDTO) -> None:
        self.update(
            id_value=r_token.id_token,
            id_column="id_token",
            data={
                "valido": 0
            })
        self.db.commit() # Se hace commit aqui ya que se está usando un soft delete y después tiraremos una 
                         # excepción, al tirar una excepción se hace un rollback en la dependencia de la base de datos, 
                         # así que confirmamos solamente esta acción.
        