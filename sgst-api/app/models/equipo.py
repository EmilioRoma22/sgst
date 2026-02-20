from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class EquipoDTO(BaseModel):
    id_equipo: int
    id_taller: str
    id_tipo: int
    num_serie: str
    marca_equipo: str | None = None
    modelo_equipo: str | None = None
    descripcion_equipo: str | None = None
    activo: int = 1
    fecha_registro: datetime
    ultima_actualizacion: datetime | None = None
    nombre_tipo: str | None = None  # opcional ya que se usa LEFT JOIN en la consulta

class CrearEquipoDTO(BaseModel):
    id_tipo: int
    num_serie: str = Field(..., max_length=100, min_length=1)
    marca_equipo: str | None = Field(None, max_length=100)
    modelo_equipo: str | None = Field(None, max_length=100)
    descripcion_equipo: str | None = None

    @field_validator("num_serie")
    @classmethod
    def num_serie_trim(cls, v: str) -> str:
        return v.strip() if v else v

    @field_validator("marca_equipo")
    @classmethod
    def marca_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v

    @field_validator("modelo_equipo")
    @classmethod
    def modelo_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v

    @field_validator("descripcion_equipo")
    @classmethod
    def descripcion_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v


class ActualizarEquipoDTO(BaseModel):
    id_tipo: int | None = None
    num_serie: str | None = Field(None, max_length=100, min_length=1)
    marca_equipo: str | None = Field(None, max_length=100)
    modelo_equipo: str | None = Field(None, max_length=100)
    descripcion_equipo: str | None = None

    @field_validator("num_serie")
    @classmethod
    def num_serie_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v

    @field_validator("marca_equipo")
    @classmethod
    def marca_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v

    @field_validator("modelo_equipo")
    @classmethod
    def modelo_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v

    @field_validator("descripcion_equipo")
    @classmethod
    def descripcion_trim(cls, v: str | None) -> str | None:
        if v is None or (isinstance(v, str) and v.strip() == ""):
            return None
        return v.strip() if isinstance(v, str) else v
