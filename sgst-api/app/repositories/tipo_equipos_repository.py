from typing import List, Dict, Any
from app.repositories.base_repository import BaseRepository
from app.models.tipo_equipo import TipoEquipoDTO


class TipoEquiposRepository(BaseRepository):
    table_name = "tipo_equipos"
    searchable_fields: List[str] = []

    def listar_por_taller(self, id_taller: str) -> List[Dict[str, Any]]:
        query = f"""SELECT * FROM {self.table_name}
                   WHERE id_taller = %s AND activo = 1
                   ORDER BY nombre_tipo ASC"""
        self.cursor.execute(query, (id_taller,))
        return self.cursor.fetchall()

    def obtener_por_id(self, id_tipo: int, id_taller: str) -> TipoEquipoDTO | None:
        query = f"""SELECT * FROM {self.table_name}
                    WHERE id_tipo = %s AND id_taller = %s"""
        self.execute(query, (id_tipo, id_taller))
        fila = self.cursor.fetchone()
        return TipoEquipoDTO(**fila) if fila else None

    def existe_nombre_en_taller(
        self, id_taller: str, nombre_tipo: str, excluir_id_tipo: int | None = None
    ) -> bool:
        nombre_trim = nombre_tipo.strip() if nombre_tipo else ""
        if not nombre_trim:
            return False
        if excluir_id_tipo is not None:
            query = f"""SELECT COUNT(*) as total FROM {self.table_name}
                       WHERE id_taller = %s AND nombre_tipo = %s AND id_tipo != %s"""
            self.execute(query, (id_taller, nombre_trim, excluir_id_tipo))
        else:
            query = f"""SELECT COUNT(*) as total FROM {self.table_name}
                       WHERE id_taller = %s AND nombre_tipo = %s"""
            self.execute(query, (id_taller, nombre_trim))
        resultado = self.cursor.fetchone()
        return resultado["total"] > 0 if resultado else False
