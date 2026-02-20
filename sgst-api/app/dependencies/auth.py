from fastapi import Depends, Request
from app.core.exceptions import UsuarioNoEncontradoException, UsuarioNoPerteneceAlTallerException, NoEsAdministradorDelTallerException, TallerNoEspecificadoException, NoTienesPermisoParaAccederARecursoException
from app.core.security import decodificar_token
from app.dependencies.database import obtener_conexion_bd
from app.models.usuarios import UsuarioDTO
from app.core.exceptions import TokenInvalidoException, TokenException
from app.repositories.usuarios_repository import UsuariosRepository
from app.models.taller import TallerDTO
from app.repositories.usuarios_talleres_repository import UsuariosTalleresRepository
from app.constants.roles import Roles

def obtener_usuario_actual(request: Request, db = Depends(obtener_conexion_bd)) -> UsuarioDTO:
    token = request.cookies.get("access_token")
    
    if not token:
        raise TokenException()

    payload = decodificar_token(token)
    id_usuario = payload.get("id_usuario")
    
    if not id_usuario:
        raise TokenInvalidoException()

    usuarios_repository = UsuariosRepository(db)
    usuario = usuarios_repository.obtener_usuario_por_id(id_usuario)

    if not usuario:
        raise UsuarioNoEncontradoException()

    if not usuario.activo:
        raise UsuarioNoEncontradoException()

    return usuario

def obtener_taller_actual(request: Request, db = Depends(obtener_conexion_bd)) -> TallerDTO | None:
    token = request.cookies.get("access_token")
    id_taller_actual = request.cookies.get("id_taller_actual")
    
    if not id_taller_actual:
        return None

    if not token:
        raise TokenException()

    payload = decodificar_token(token)
    id_usuario = payload.get("id_usuario")

    if not id_usuario:
        raise TokenInvalidoException()

    usuarios_talleres_repository = UsuariosTalleresRepository(db)
    usuario_taller = usuarios_talleres_repository.obtener_rol_por_usuario_y_taller(id_usuario, id_taller_actual)

    if not usuario_taller:
        raise UsuarioNoPerteneceAlTallerException()
    
    return TallerDTO(id_taller=usuario_taller.id_taller, rol_taller=usuario_taller.rol_taller)

# Se cambió para consumir la función obtener_taller_actual obteniendo el id del taller y el rol del usuario. Verificando que el usuario si pertenezca al taller.
# Después simplemente se verifica que el rol del usuario ea uno de los roles permitidos que pueda acceder al recurso.
def verificar_acceso(roles_permitidos: list[str]):
    def _verificar_acceso(
        request: Request,
        db=Depends(obtener_conexion_bd),
    ) -> TallerDTO:
        taller_actual = obtener_taller_actual(request, db)
        if not taller_actual:
            raise TallerNoEspecificadoException()
        if taller_actual.rol_taller not in roles_permitidos:
            raise NoTienesPermisoParaAccederARecursoException()
        return taller_actual
    return _verificar_acceso