from app.repositories.base_repository import BaseRepository
from app.models.taller import TallerRolDTO

class UsuariosTalleresRepository(BaseRepository):
    table_name = "usuarios_talleres"
    
    def el_usuario_pertenece_al_taller(self, id_usuario: int, id_taller: int) -> bool:
        query = f"""SELECT COUNT(*) FROM {self.table_name} WHERE id_usuario = %s AND id_taller = %s AND activo = 1"""
        self.execute(query, (id_usuario, id_taller))
        return self.cursor.fetchone()[0] > 0

    def obtener_rol_y_taller_por_id_usuario(self, id_usuario: int) -> TallerRolDTO:
        query = f"""SELECT rol_taller, id_taller FROM {self.table_name} WHERE id_usuario = %s AND activo = 1"""
        self.execute(query, (id_usuario,))
        rol_y_taller = self.cursor.fetchone()
        
        return TallerRolDTO(**rol_y_taller) if rol_y_taller else None

    def obtener_rol_por_usuario_y_taller(self, id_usuario: int, id_taller: int) -> TallerRolDTO | None:
        query = f"""SELECT rol_taller, id_taller FROM {self.table_name} 
                    WHERE id_usuario = %s AND id_taller = %s AND activo = 1"""
        self.execute(query, (id_usuario, id_taller))
        resultado = self.cursor.fetchone()
        return TallerRolDTO(**resultado) if resultado else None