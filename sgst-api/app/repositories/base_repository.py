from typing import List, Dict, Any, Optional, Tuple
from app.models.pagination import PaginationParams
import mysql.connector
import logging

logger = logging.getLogger(__name__)

class BaseRepository:
    """
    Repositorio base que implementa funcionalidades comunes de CRUD y paginación.
    
    Esta clase proporciona métodos genéricos para operaciones comunes sobre tablas de base de datos.
    Utiliza mysql.connector con cursor en modo diccionario para retornar resultados como diccionarios.
    
    Atributos de clase:
        table_name (str): Nombre de la tabla sobre la que se realizarán las operaciones.
                          Debe ser definido en las clases hijas.
        searchable_fields (List[str]): Lista de campos de la tabla que se pueden buscar
                                       en operaciones de búsqueda global.
    
    Atributos de instancia:
        db: Conexión activa a la base de datos MySQL.
        cursor: Cursor configurado para retornar resultados como diccionarios.
    
    Métodos principales:
        - execute: Ejecuta una consulta SQL sin retornar resultados.
        - create: Inserta un nuevo registro en la tabla.
        - update: Actualiza un registro existente.
        - soft_delete: Realiza borrado lógico estableciendo el campo activo a 0.
        - _build_search_clause: Construye la cláusula WHERE para búsqueda global.
        - paginate: Ejecuta una consulta con paginación (LIMIT/OFFSET) y ordenamiento seguro.
        - list: Lista registros con paginación y búsqueda básica (SELECT *).
        - count: Cuenta el total de registros que coinciden con la búsqueda.
    
    Nota: Las clases hijas deben definir table_name y opcionalmente searchable_fields.
    """
    table_name: str = ""
    searchable_fields: List[str] = []
    
    def __init__(self, db: mysql.connector.connection.MySQLConnection):
        """
        Inicializa el repositorio base con una conexión a la base de datos.
        Crea un cursor configurado para retornar resultados como diccionarios.
        
        :param db: Conexión activa a la base de datos MySQL.
        """
        self.db = db
        self.cursor = self.db.cursor(dictionary=True)
    
    def execute(self, query: str, params: tuple = ()) -> None:
        """
        Ejecuta una consulta SQL sin retornar resultados.
        Útil para operaciones INSERT (sin retorno), DELETE, UPDATE, etc.
        No retorna datos, solo ejecuta la consulta.
        
        :param query: Consulta SQL a ejecutar. Debe usar placeholders %s para parámetros.
        :param params: Tupla con los parámetros para la consulta.
        :raises Exception: Si ocurre un error durante la ejecución de la consulta.
        """
        try:
            self.cursor.execute(query, params)
        except Exception as e:
            logger.error(f"Error en execute: {e} | Query: {query} | Params: {params}")
            raise
    
    def create(self, data: Dict[str, Any], returning: Optional[str] = None) -> Any:
        """
        Inserta un nuevo registro en la tabla.
        
        :param data: Diccionario con columnas y valores a insertar.
        :param returning: (Opcional) Nombre de la columna ID a retornar. Si se proporciona,
                         el método retornará el ID del registro insertado.
        :return: El ID insertado (lastrowid) si returning está definido, o None.
        :raises Exception: Si ocurre un error durante la inserción.
        """
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["%s"] * len(data))
        values = tuple(data.values())

        query = f"INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders})"

        try:
            self.cursor.execute(query, values)
            return self.cursor.lastrowid if returning else None
        except Exception as e:
            logger.error(f"Error en create: {e} | Data: {data}")
            raise
    
    def update(self, id_value: Any, id_column: str, data: Dict[str, Any]) -> int:
        """
        Actualiza un registro existente en la tabla.
        
        :param id_value: Valor del ID para la condición WHERE.
        :param id_column: Nombre de la columna que se usará como identificador (por defecto "id").
        :param data: Diccionario con las columnas y valores a actualizar.
        :return: Número de filas afectadas por la actualización.
        :raises Exception: Si ocurre un error durante la actualización.
        """
        if not data:
            return 0

        set_clause = ", ".join([f"{k} = %s" for k in data.keys()])
        values = tuple(data.values()) + (id_value,)
        query = f"UPDATE {self.table_name} SET {set_clause} WHERE {id_column} = %s"

        try:
            self.cursor.execute(query, values)
            return self.cursor.rowcount
        except Exception as e:
            logger.error(f"Error en update: {e} | ID: {id_value} | Data: {data}")
            raise
    
    def soft_delete(self, id_value: Any, id_column: str = "id", active_field: str = "activo") -> int:
        """
        Realiza un borrado lógico estableciendo el campo activo a 0.
        El registro no se elimina físicamente de la base de datos, solo se marca como inactivo.
        
        :param id_value: Valor del ID del registro a desactivar.
        :param id_column: Nombre de la columna que se usará como identificador (por defecto "id").
        :param active_field: Nombre del campo que indica si el registro está activo (por defecto "activo").
        :return: Número de filas afectadas (normalmente 1 si el registro existe, 0 si no existe).
        :raises Exception: Si ocurre un error durante la operación.
        """
        query = f"UPDATE {self.table_name} SET {active_field} = 0 WHERE {id_column} = %s"
        try:
            self.cursor.execute(query, (id_value,))
            return self.cursor.rowcount
        except Exception as e:
            logger.error(f"Error en soft_delete: {e} | ID: {id_value}")
            raise
    
    def delete(self, id_value: Any, id_column: str = "id") -> int:
        query = f"DELETE FROM {self.table_name} WHERE {id_column} = %s"
        try:
            self.cursor.execute(query, (id_value,))
            return self.cursor.rowcount
        except Exception as e:
            logger.error(f"Error en delete: {e} | ID: {id_value}")
            raise
    
    def _build_search_clause(self, search: Optional[str]) -> Tuple[str, List[Any]]:
        """
        Construye la cláusula WHERE para búsqueda global en múltiples campos.
        Busca el término en todos los campos definidos en searchable_fields usando LIKE.
        
        :param search: Término de búsqueda opcional. Si es None o vacío, retorna cláusula vacía.
        :return: Tupla con (cláusula SQL, lista de parámetros). 
                 La cláusula será una cadena vacía si no hay búsqueda o campos buscables.
        """
        if not search or not self.searchable_fields:
            return "", []

        conditions = [f"{field} LIKE %s" for field in self.searchable_fields]
        params = [f"%{search}%" for _ in self.searchable_fields]

        clause = " OR ".join(conditions)
        return f" AND ({clause})", params
    
    def paginate(
        self,
        base_query: str,
        params: tuple,
        pagination: PaginationParams,
        columnas_permitidas: Dict[str, str],
        default_order: str
    ) -> List[Dict[str, Any]]:
        """
        Ejecuta una consulta SQL con paginación (LIMIT/OFFSET) y ordenamiento seguro.
        Valida que la columna de ordenamiento esté en la lista de columnas permitidas
        para prevenir inyección SQL.
        
        :param base_query: Consulta SQL base sin ORDER BY ni LIMIT.
        :param params: Tupla con los parámetros para la consulta base.
        :param pagination: Objeto PaginationParams con offset, limit, order_by y order_dir.
        :param columnas_permitidas: Diccionario que mapea nombres de columnas de usuario
                                    a nombres reales de columnas en la base de datos.
        :param default_order: Nombre de la columna por defecto para ordenar si order_by
                             no está en columnas_permitidas.
        :return: Lista de diccionarios con los resultados de la consulta paginada.
        :raises Exception: Si ocurre un error durante la ejecución de la consulta.
        """
        order_dir = "DESC" if pagination.order_dir.upper() == "DESC" else "ASC"

        if pagination.order_by is None or pagination.order_by not in columnas_permitidas:
            order_clause = default_order
        else:
            order_column = columnas_permitidas[pagination.order_by]
            order_clause = f"{order_column} {order_dir}"

        query = f"""
            {base_query}
            ORDER BY {order_clause}
            LIMIT %s OFFSET %s
        """

        try:
            full_params = params + (pagination.limit, pagination.offset)
            self.cursor.execute(query, full_params)
            return self.cursor.fetchall()
        except Exception as e:
            logger.error(f"Error en paginate: {e}")
            raise
    
    def list(
        self,
        pagination: PaginationParams,
        columnas_permitidas: Dict[str, str],
        default_order: str
    ) -> List[Dict[str, Any]]:
        """
        Lista registros de la tabla con paginación y búsqueda básica.
        Utiliza SELECT * para obtener todos los campos de la tabla.
        Aplica búsqueda global si se proporciona un término de búsqueda y
        hay campos buscables definidos en searchable_fields.
        
        :param pagination: Objeto PaginationParams con parámetros de paginación y búsqueda.
        :param columnas_permitidas: Diccionario que mapea nombres de columnas de usuario
                                    a nombres reales de columnas en la base de datos.
        :param default_order: Nombre de la columna por defecto para ordenar.
        :return: Lista de diccionarios con los registros encontrados (paginados).
        """
        base_query = f"SELECT * FROM {self.table_name} WHERE 1=1"
        search_clause, search_params = self._build_search_clause(pagination.search)
        
        return self.paginate(
            base_query=base_query + search_clause,
            params=tuple(search_params),
            pagination=pagination,
            columnas_permitidas=columnas_permitidas,
            default_order=default_order
        )

    def count(self, search: Optional[str]) -> int:
        """
        Cuenta el total de registros que coinciden con el criterio de búsqueda.
        Utiliza la misma lógica de búsqueda que el método list() para mantener consistencia.
        
        :param search: Término de búsqueda opcional. Si se proporciona, busca en los campos
                      definidos en searchable_fields.
        :return: Número total de registros que coinciden con la búsqueda. Retorna 0 si hay error.
        """
        base = f"SELECT COUNT(*) as total FROM {self.table_name} WHERE 1=1"
        search_clause, params = self._build_search_clause(search)
        
        try:
            self.cursor.execute(base + search_clause, tuple(params))
            result = self.cursor.fetchone()
            return result["total"] if result else 0
        except Exception as e:
            logger.error(f"Error en count: {e}")
            return 0