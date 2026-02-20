from fastapi import APIRouter, status, Depends, Query
from app.dependencies.database import obtener_conexion_bd
from app.dependencies.auth import obtener_usuario_actual, verificar_acceso
from app.dependencies.pagination import pagination_params
from app.models.usuarios import UsuarioDTO
from app.models.taller import TallerDTO
from app.models.equipo import CrearEquipoDTO, ActualizarEquipoDTO
from app.models.tipo_equipo import CrearTipoEquipoDTO, ActualizarTipoEquipoDTO
from app.models.pagination import PaginationParams
from app.services.equipos_service import EquiposService
from app.services.tipo_equipos_service import TipoEquiposService
from app.dependencies.suscripciones import verificar_suscripcion_taller
from app.constants.roles import Roles

router = APIRouter(
    prefix="/equipos",
    tags=["equipos"],
)

# ----- Tipos de equipo -----

@router.get("/tipos", status_code=status.HTTP_200_OK)
async def listar_tipos_equipo(
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    tipo_equipos_service = TipoEquiposService(bd)
    return tipo_equipos_service.listar_tipos(taller_actual.id_taller)

@router.post("/tipos", status_code=status.HTTP_201_CREATED)
async def crear_tipo_equipo(
    datos: CrearTipoEquipoDTO,
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    tipo_equipos_service = TipoEquiposService(bd)
    tipo_equipos_service.crear_tipo(datos, taller_actual.id_taller)
    return {"message": f"Tipo de equipo {datos.nombre_tipo} creado correctamente"}

@router.put("/tipos/{id_tipo}", status_code=status.HTTP_200_OK)
async def actualizar_tipo_equipo(
    id_tipo: int,
    datos: ActualizarTipoEquipoDTO,
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    tipo_equipos_service = TipoEquiposService(bd)
    tipo_equipos_service.actualizar_tipo(id_tipo, datos, taller_actual.id_taller)
    return {"message": f"Tipo de equipo {datos.nombre_tipo} actualizado correctamente"}

@router.delete("/tipos/{id_tipo}", status_code=status.HTTP_200_OK)
async def eliminar_tipo_equipo(
    id_tipo: int,
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    tipo_equipos_service = TipoEquiposService(bd)
    tipo_equipos_service.eliminar_tipo(id_tipo, taller_actual.id_taller)
    return {"message": "Tipo de equipo eliminado correctamente"}

# ----- Equipos -----

@router.get("", status_code=status.HTTP_200_OK)
async def listar_equipos(
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    pagination: PaginationParams = Depends(pagination_params),
    id_tipo: int | None = Query(None, description="Filtrar por tipo de equipo"),
    bd=Depends(obtener_conexion_bd),
):
    equipos_service = EquiposService(bd)
    resultado = equipos_service.listar_equipos(
        taller_actual.id_taller, pagination, id_tipo=id_tipo
    )
    return resultado

@router.get("/{id_equipo}", status_code=status.HTTP_200_OK)
async def obtener_equipo(
    id_equipo: int,
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    equipos_service = EquiposService(bd)
    equipo = equipos_service.obtener_equipo(id_equipo, taller_actual.id_taller)
    return equipo

@router.post("", status_code=status.HTTP_201_CREATED)
async def crear_equipo(
    datos: CrearEquipoDTO,
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    equipos_service = EquiposService(bd)
    equipos_service.crear_equipo(datos, taller_actual.id_taller)
    return {"message": f"Equipo {datos.num_serie} creado correctamente"}

@router.put("/{id_equipo}", status_code=status.HTTP_200_OK)
async def actualizar_equipo(
    id_equipo: int,
    datos: ActualizarEquipoDTO,
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    equipos_service = EquiposService(bd)
    equipos_service.actualizar_equipo(id_equipo, datos, taller_actual.id_taller)
    return {"message": f"Equipo {datos.num_serie} actualizado correctamente"}

@router.delete("/{id_equipo}", status_code=status.HTTP_200_OK)
async def eliminar_equipo(
    id_equipo: int,
    usuario: UsuarioDTO = Depends(obtener_usuario_actual),
    taller_actual: TallerDTO = Depends(verificar_acceso(roles_permitidos=[Roles.ADMIN])),
    _=Depends(verificar_suscripcion_taller),
    bd=Depends(obtener_conexion_bd),
):
    equipos_service = EquiposService(bd)
    equipos_service.eliminar_equipo(id_equipo, taller_actual.id_taller)
    return {"message": "Equipo eliminado correctamente"}
