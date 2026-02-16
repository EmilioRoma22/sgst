from pydantic import BaseModel

class TallerDTO(BaseModel):
    id_taller: int
    rol_taller: str
    
class TallerRolDTO(BaseModel):
    rol_taller: str
    id_taller: int