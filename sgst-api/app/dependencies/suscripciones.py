from fastapi import Depends, Request
from app.dependencies.database import obtener_conexion_bd
from app.core.exceptions import EmpresaSinSuscripcionException, EmpresaYaTieneMaxTalleresException, NoHayTallerActivoException, TallerNoTieneEmpresaAsociadaException
from app.repositories.suscripciones_repository import SuscripcionesRepository
from app.repositories.talleres_repository import TalleresRepository
from app.dependencies.auth import obtener_usuario_actual
from app.models.usuarios import UsuarioDTO

def verificar_suscripcion_y_max_talleres(request: Request, db = Depends(obtener_conexion_bd), usuario: UsuarioDTO = Depends(obtener_usuario_actual)):
    # Verificamos que su suscripción activa tenga talleres disponibles para agregar.
    suscripcion_activa = SuscripcionesRepository(db).obtener_suscripcion_activa_por_empresa(usuario.id_empresa)
    if not suscripcion_activa:
        raise EmpresaSinSuscripcionException()
    
    max_talleres = SuscripcionesRepository(db).obtener_max_talleres_por_suscripcion(usuario.id_empresa)
    cantidad_talleres = len(TalleresRepository(db).listar_por_empresa(usuario.id_empresa))
    if max_talleres > 0 and cantidad_talleres >= max_talleres:
        raise EmpresaYaTieneMaxTalleresException()
    
    return usuario

def verificar_suscripcion_taller(request: Request, db = Depends(obtener_conexion_bd)):
    id_taller_actual = request.cookies.get("id_taller_actual")
    if not id_taller_actual:
        raise NoHayTallerActivoException()
    
    # Se obtiene la id_empresa del taller actual.
    id_empresa = TalleresRepository(db).obtener_id_empresa_por_taller(id_taller_actual)
    if not id_empresa:
        raise TallerNoTieneEmpresaAsociadaException()
    
    # Se verifica que la suscripción de la empresa esté activa.
    suscripcion_activa = SuscripcionesRepository(db).obtener_suscripcion_activa_por_empresa(id_empresa)
    if not suscripcion_activa:
        raise EmpresaSinSuscripcionException()
    
    # Es una verificación solamente, no se devuelve ningun valor.
    return None