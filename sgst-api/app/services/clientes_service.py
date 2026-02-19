from typing import Dict, Any
from app.models.cliente import CrearClienteDTO, ActualizarClienteDTO, ClienteDTO
from app.models.pagination import PaginationParams
from app.repositories.clientes_repository import ClientesRepository
from app.core.exceptions import ClienteNoEncontradoException, ClienteDuplicadoException, TallerNoEspecificadoException

class ClientesService:
    def __init__(self, bd):
        self.bd = bd
        self.clientes_repository = ClientesRepository(self.bd)

    def listar_clientes(self, id_taller: str, pagination: PaginationParams) -> Dict[str, Any]:
        if not id_taller:
            raise TallerNoEspecificadoException()

        clientes = self.clientes_repository.listar_por_taller(id_taller, pagination)
        total = self.clientes_repository.contar_por_taller(id_taller, pagination.search)

        return {
            "data": clientes,
            "pagination": {
                "page": pagination.page,
                "limit": pagination.limit,
                "total": total,
                "total_pages": (total + pagination.limit - 1) // pagination.limit if pagination.limit > 0 else 0
            }
        }

    def obtener_cliente(self, id_cliente: int, id_taller: str) -> ClienteDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()

        cliente = self.clientes_repository.obtener_por_id(id_cliente, id_taller)
        
        if not cliente:
            raise ClienteNoEncontradoException()
        
        return cliente

    def crear_cliente(self, datos: CrearClienteDTO, id_taller: str) -> ClienteDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()

        if datos.correo_cliente:
            if self.clientes_repository.existe_correo_en_taller(id_taller, datos.correo_cliente):
                raise ClienteDuplicadoException("correo")

        if datos.telefono_cliente:
            if self.clientes_repository.existe_telefono_en_taller(id_taller, datos.telefono_cliente):
                raise ClienteDuplicadoException("teléfono")

        data_insert = {
            "id_taller": id_taller,
            "nombre_cliente": datos.nombre_cliente,
            "apellidos_cliente": datos.apellidos_cliente,
            "correo_cliente": datos.correo_cliente,
            "telefono_cliente": datos.telefono_cliente,
            "direccion_cliente": datos.direccion_cliente,
            "notas_cliente": datos.notas_cliente,
        }

        id_cliente = self.clientes_repository.create(data_insert, returning="id_cliente")
        
        cliente_creado = self.clientes_repository.obtener_por_id(int(id_cliente), id_taller)
        
        if not cliente_creado:
            raise ClienteNoEncontradoException()
        
        return cliente_creado

    def actualizar_cliente(self, id_cliente: int, datos: ActualizarClienteDTO, id_taller: str) -> ClienteDTO:
        if not id_taller:
            raise TallerNoEspecificadoException()

        cliente_existente = self.clientes_repository.obtener_por_id(id_cliente, id_taller)
        
        if not cliente_existente:
            raise ClienteNoEncontradoException()

        data_update = {}
        
        if datos.nombre_cliente is not None:
            data_update["nombre_cliente"] = datos.nombre_cliente
        
        if datos.apellidos_cliente is not None:
            data_update["apellidos_cliente"] = datos.apellidos_cliente
        
        if datos.correo_cliente is not None:
            if self.clientes_repository.existe_correo_en_taller(id_taller, datos.correo_cliente, excluir_id=id_cliente):
                raise ClienteDuplicadoException("correo")
            data_update["correo_cliente"] = datos.correo_cliente
        
        if datos.telefono_cliente is not None:
            if self.clientes_repository.existe_telefono_en_taller(id_taller, datos.telefono_cliente, excluir_id=id_cliente):
                raise ClienteDuplicadoException("teléfono")
            data_update["telefono_cliente"] = datos.telefono_cliente
        
        if datos.direccion_cliente is not None:
            data_update["direccion_cliente"] = datos.direccion_cliente
        
        if datos.notas_cliente is not None:
            data_update["notas_cliente"] = datos.notas_cliente

        if data_update:
            self.clientes_repository.update(id_cliente, "id_cliente", data_update)

        cliente_actualizado = self.clientes_repository.obtener_por_id(id_cliente, id_taller)
        
        if not cliente_actualizado:
            raise ClienteNoEncontradoException()
        
        return cliente_actualizado

    def eliminar_cliente(self, id_cliente: int, id_taller: str) -> None:
        if not id_taller:
            raise TallerNoEspecificadoException()

        cliente = self.clientes_repository.obtener_por_id(id_cliente, id_taller)
        
        if not cliente:
            raise ClienteNoEncontradoException()

        self.clientes_repository.delete(id_cliente, "id_cliente")
