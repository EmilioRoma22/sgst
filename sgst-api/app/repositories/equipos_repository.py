from typing import List, Dict, Any
from app.repositories.base_repository import BaseRepository
from app.models.pagination import PaginationParams
from app.models.equipo import EquipoDTO


class EquiposRepository(BaseRepository):
    table_name = "equipos"
    searchable_fields = ["num_serie", "marca_equipo", "modelo_equipo", "descripcion_equipo"]

    def listar_por_taller(
        self,
        id_taller: str,
        pagination: PaginationParams,
        id_tipo_filtro: int | None = None,
    ) -> List[Dict[str, Any]]:
        base_query = f"""SELECT e.*, t.nombre_tipo FROM {self.table_name} e
                        LEFT JOIN tipo_equipos t ON e.id_tipo = t.id_tipo
                        WHERE e.id_taller = %s"""
        params_list: List[Any] = [id_taller]
        if id_tipo_filtro is not None:
            base_query += " AND e.id_tipo = %s"
            params_list.append(id_tipo_filtro)
        search_clause, search_params = self._build_search_clause(pagination.search)
        base_query += search_clause
        if search_params:
            params_list.extend(search_params)
        params = tuple(params_list)
        columnas_permitidas = {
            "id_equipo": "e.id_equipo",
            "num_serie": "e.num_serie",
            "marca_equipo": "e.marca_equipo",
            "modelo_equipo": "e.modelo_equipo",
            "fecha_registro": "e.fecha_registro",
            "ultima_actualizacion": "e.ultima_actualizacion",
        }
        return self.paginate(
            base_query=base_query,
            params=params,
            pagination=pagination,
            columnas_permitidas=columnas_permitidas,
            default_order="e.fecha_registro DESC",
        )

    def obtener_por_id(self, id_equipo: int, id_taller: str) -> EquipoDTO | None:
        query = f"""SELECT e.*, t.nombre_tipo FROM {self.table_name} e
                   LEFT JOIN tipo_equipos t ON e.id_tipo = t.id_tipo
                   WHERE e.id_equipo = %s AND e.id_taller = %s"""
        self.execute(query, (id_equipo, id_taller))
        fila = self.cursor.fetchone()
        return EquipoDTO(**fila) if fila else None

    def existe_num_serie_en_taller(
        self, id_taller: str, num_serie: str, excluir_id_equipo: int | None = None
    ) -> bool:
        num_trim = num_serie.strip() if num_serie else ""
        if not num_trim:
            return False
        if excluir_id_equipo is not None:
            query = f"""SELECT COUNT(*) as total FROM {self.table_name}
                       WHERE id_taller = %s AND num_serie = %s AND id_equipo != %s"""
            self.execute(query, (id_taller, num_trim, excluir_id_equipo))
        else:
            query = f"""SELECT COUNT(*) as total FROM {self.table_name}
                       WHERE id_taller = %s AND num_serie = %s"""
            self.execute(query, (id_taller, num_trim))
        resultado = self.cursor.fetchone()
        return resultado["total"] > 0 if resultado else False

    def contar_por_taller(
        self,
        id_taller: str,
        search: str | None = None,
        id_tipo_filtro: int | None = None,
    ) -> int:
        base = f"SELECT COUNT(*) as total FROM {self.table_name} WHERE id_taller = %s"
        params_list: List[Any] = [id_taller]
        if id_tipo_filtro is not None:
            base += " AND id_tipo = %s"
            params_list.append(id_tipo_filtro)
        search_clause, search_params = self._build_search_clause(search)
        base += search_clause
        if search_params:
            params_list.extend(search_params)
        full_params = tuple(params_list)
        try:
            self.cursor.execute(base, full_params)
            result = self.cursor.fetchone()
            return result["total"] if result else 0
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error en contar_por_taller: {e}")
            return 0
