from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class TipoEquipoDTO(BaseModel):
    id_tipo: int
    id_taller: str
    nombre_tipo: str
    activo: int = 1
    fecha_creacion: datetime


class CrearTipoEquipoDTO(BaseModel):
    nombre_tipo: str = Field(..., max_length=100, min_length=1)

    @field_validator("nombre_tipo")
    @classmethod
    def nombre_trim(cls, v: str) -> str:
        return v.strip() if v else v


class ActualizarTipoEquipoDTO(BaseModel):
    nombre_tipo: str | None = Field(None, max_length=100, min_length=1)

    @field_validator("nombre_tipo")
    @classmethod
    def nombre_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v
