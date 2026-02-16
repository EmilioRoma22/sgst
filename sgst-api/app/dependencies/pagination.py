from fastapi import Query
from app.models.pagination import PaginationParams

def pagination_params(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    order_by: str | None = Query(None),
    order_dir: str = Query("ASC", regex="^(ASC|DESC)$"),
    search: str | None = Query(None)
) -> PaginationParams:

    offset = (page - 1) * limit

    return PaginationParams(
        page=page,
        limit=limit,
        offset=offset,
        order_by=order_by,
        order_dir=order_dir,
        search=search
    )
