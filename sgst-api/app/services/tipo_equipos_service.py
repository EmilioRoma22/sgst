from typing import List, Dict, Any
from app.models.tipo_equipo import TipoEquipoDTO, CrearTipoEquipoDTO, ActualizarTipoEquipoDTO
from app.repositories.tipo_equipos_repository import TipoEquiposRepository
from app.core.exceptions import (
    TipoEquipoNoEncontradoException,
    TipoEquipoDuplicadoException,
    TallerNoEspecificadoException,
)

class TipoEquiposService:
    def __init__(self, bd):
        self.bd = bd
        self.tipo_equipos_repository = TipoEquiposRepository(self.bd)

    def listar_tipos(self, id_taller: str) -> List[Dict[str, Any]]:
        if not id_taller:
            raise TallerNoEspecificadoException()
        return self.tipo_equipos_repository.listar_por_taller(id_taller)

    def obtener_tipo(self, id_tipo: int, id_taller: str) -> TipoEquipoDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()
        tipo = self.tipo_equipos_repository.obtener_por_id(id_tipo, id_taller)
        if not tipo:
            raise TipoEquipoNoEncontradoException()
        return tipo

    def crear_tipo(self, datos: CrearTipoEquipoDTO, id_taller: str) -> TipoEquipoDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()
        if self.tipo_equipos_repository.existe_nombre_en_taller(id_taller, datos.nombre_tipo):
            raise TipoEquipoDuplicadoException("nombre")
        data_insert = {
            "id_taller": id_taller,
            "nombre_tipo": datos.nombre_tipo.strip(),
        }
        id_tipo = self.tipo_equipos_repository.create(data_insert, returning="id_tipo")
        tipo_creado = self.tipo_equipos_repository.obtener_por_id(int(id_tipo), id_taller)
        if not tipo_creado:
            raise TipoEquipoNoEncontradoException()
        return tipo_creado

    def actualizar_tipo(
        self, id_tipo: int, datos: ActualizarTipoEquipoDTO, id_taller: str
    ) -> TipoEquipoDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()
        tipo_existente = self.tipo_equipos_repository.obtener_por_id(id_tipo, id_taller)
        if not tipo_existente:
            raise TipoEquipoNoEncontradoException()
        if datos.nombre_tipo is not None:
            if self.tipo_equipos_repository.existe_nombre_en_taller(
                id_taller, datos.nombre_tipo, excluir_id_tipo=id_tipo
            ):
                raise TipoEquipoDuplicadoException("nombre")
            self.tipo_equipos_repository.update(
                id_tipo, "id_tipo", {"nombre_tipo": datos.nombre_tipo.strip()}
            )
        tipo_actualizado = self.tipo_equipos_repository.obtener_por_id(id_tipo, id_taller)
        if not tipo_actualizado:
            raise TipoEquipoNoEncontradoException()
        return tipo_actualizado

    def eliminar_tipo(self, id_tipo: int, id_taller: str) -> None:
        if not id_taller:
            raise TallerNoEspecificadoException()
        tipo = self.tipo_equipos_repository.obtener_por_id(id_tipo, id_taller)
        if not tipo:
            raise TipoEquipoNoEncontradoException()
        self.tipo_equipos_repository.delete(id_tipo, "id_tipo")
