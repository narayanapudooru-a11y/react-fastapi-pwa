from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Task
from ..schemas import (
    TaskCreate,
    TaskResponse
)

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.get(
    "",
    response_model=list[TaskResponse]
)
def get_tasks(
    db: Session = Depends(get_db)
):

    return db.query(Task).all()


@router.post(
    "",
    response_model=TaskResponse
)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):

    db_task = Task(
        title=task.title,
        completed=task.completed
    )

    db.add(db_task)

    db.commit()

    db.refresh(db_task)

    return db_task