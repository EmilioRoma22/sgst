from pydantic import BaseModel, Field, model_validator

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(10, ge=1, le=100)
    offset: int = 0
    order_by: str | None = None
    order_dir: str = "ASC"
    search: str | None = None

    @model_validator(mode="after")
    def calculate_offset(self):
        self.offset = (self.page - 1) * self.limit
        return self
