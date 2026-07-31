from typing import List
from fastapi import APIRouter, Depends
from psycopg2.extensions import cursor as PgCursor

from app.core.database import get_db
from app.middleware.auth import get_current_user
from app.repositories.activity_log_repository import ActivityLogRepository
from app.schemas.responses import SuccessResponse

router = APIRouter(prefix="/api/admin/activities", tags=["activities"])

@router.get("", response_model=SuccessResponse[List[dict]])
def get_activities(
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ActivityLogRepository(cursor)
    user_id = int(current_user.get("sub")) if current_user.get("sub") else 0
    activities = repo.get_recent_activities(user_id=user_id, limit=50)
    return SuccessResponse(data=activities)

@router.put("/{log_id}/read", response_model=SuccessResponse[dict])
def mark_read(
    log_id: int,
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ActivityLogRepository(cursor)
    user_id = int(current_user.get("sub")) if current_user.get("sub") else 0
    repo.mark_as_read(log_id, user_id=user_id)
    return SuccessResponse(data={"id": log_id}, message="Marked as read")

@router.put("/read-all", response_model=SuccessResponse[dict])
def mark_all_read(
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ActivityLogRepository(cursor)
    user_id = int(current_user.get("sub")) if current_user.get("sub") else 0
    repo.mark_all_as_read(user_id=user_id)
    return SuccessResponse(data={}, message="All marked as read")
