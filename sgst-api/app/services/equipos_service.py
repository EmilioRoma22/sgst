from typing import Dict, Any
from app.models.equipo import EquipoDTO, CrearEquipoDTO, ActualizarEquipoDTO
from app.models.pagination import PaginationParams
from app.repositories.equipos_repository import EquiposRepository
from app.repositories.tipo_equipos_repository import TipoEquiposRepository
from app.core.exceptions import (
    EquipoNoEncontradoException,
    EquipoDuplicadoException,
    TipoEquipoNoEncontradoException,
    TallerNoEspecificadoException,
)

class EquiposService:
    def __init__(self, bd):
        self.bd = bd
        self.equipos_repository = EquiposRepository(self.bd)
        self.tipo_equipos_repository = TipoEquiposRepository(self.bd)

    def listar_equipos(
        self,
        id_taller: str,
        pagination: PaginationParams,
        id_tipo: int | None = None,
    ) -> Dict[str, Any]:
        if not id_taller:
            raise TallerNoEspecificadoException()
        if id_tipo is not None:
            tipo = self.tipo_equipos_repository.obtener_por_id(id_tipo, id_taller)
            if not tipo:
                raise TipoEquipoNoEncontradoException()
        equipos = self.equipos_repository.listar_por_taller(
            id_taller, pagination, id_tipo_filtro=id_tipo
        )
        total = self.equipos_repository.contar_por_taller(
            id_taller, pagination.search, id_tipo_filtro=id_tipo
        )
        return {
            "data": equipos,
            "pagination": {
                "page": pagination.page,
                "limit": pagination.limit,
                "total": total,
                "total_pages": (total + pagination.limit - 1) // pagination.limit
                if pagination.limit > 0
                else 0,
            },
        }

    def obtener_equipo(self, id_equipo: int, id_taller: str) -> EquipoDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()
        equipo = self.equipos_repository.obtener_por_id(id_equipo, id_taller)
        if not equipo:
            raise EquipoNoEncontradoException()
        return equipo

    def crear_equipo(self, datos: CrearEquipoDTO, id_taller: str) -> EquipoDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()
        tipo = self.tipo_equipos_repository.obtener_por_id(datos.id_tipo, id_taller)
        if not tipo:
            raise TipoEquipoNoEncontradoException()
        if self.equipos_repository.existe_num_serie_en_taller(id_taller, datos.num_serie):
            raise EquipoDuplicadoException("número de serie")
        data_insert = {
            "id_taller": id_taller,
            "id_tipo": datos.id_tipo,
            "num_serie": datos.num_serie,
            "marca_equipo": datos.marca_equipo,
            "modelo_equipo": datos.modelo_equipo,
            "descripcion_equipo": datos.descripcion_equipo,
        }
        id_equipo = self.equipos_repository.create(data_insert, returning="id_equipo")
        equipo_creado = self.equipos_repository.obtener_por_id(int(id_equipo), id_taller)
        if not equipo_creado:
            raise EquipoNoEncontradoException()
        return equipo_creado

    def actualizar_equipo(
        self, id_equipo: int, datos: ActualizarEquipoDTO, id_taller: str
    ) -> EquipoDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()
        equipo_existente = self.equipos_repository.obtener_por_id(id_equipo, id_taller)
        if not equipo_existente:
            raise EquipoNoEncontradoException()
        if datos.id_tipo is not None:
            tipo = self.tipo_equipos_repository.obtener_por_id(datos.id_tipo, id_taller)
            if not tipo:
                raise TipoEquipoNoEncontradoException()
        data_update = {}
        if datos.id_tipo is not None:
            data_update["id_tipo"] = datos.id_tipo
        if datos.num_serie is not None:
            if self.equipos_repository.existe_num_serie_en_taller(
                id_taller, datos.num_serie, excluir_id_equipo=id_equipo
            ):
                raise EquipoDuplicadoException("número de serie")
            data_update["num_serie"] = datos.num_serie
        if datos.marca_equipo is not None:
            data_update["marca_equipo"] = datos.marca_equipo
        if datos.modelo_equipo is not None:
            data_update["modelo_equipo"] = datos.modelo_equipo
        if datos.descripcion_equipo is not None:
            data_update["descripcion_equipo"] = datos.descripcion_equipo
        if data_update:
            self.equipos_repository.update(id_equipo, "id_equipo", data_update)
        equipo_actualizado = self.equipos_repository.obtener_por_id(id_equipo, id_taller)
        if not equipo_actualizado:
            raise EquipoNoEncontradoException()
        return equipo_actualizado

    def eliminar_equipo(self, id_equipo: int, id_taller: str) -> None:
        if not id_taller:
            raise TallerNoEspecificadoException()
        equipo = self.equipos_repository.obtener_por_id(id_equipo, id_taller)
        if not equipo:
            raise EquipoNoEncontradoException()
        self.equipos_repository.delete(id_equipo, "id_equipo")
