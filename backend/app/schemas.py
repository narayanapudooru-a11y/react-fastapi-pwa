from pydantic import BaseModel


class TaskCreate(BaseModel):

    title: str
    completed: bool = False


class TaskResponse(BaseModel):

    id: int
    title: str
    completed: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):

    username: str
    password: str


class UserCreate(BaseModel):

    username: str
    password: str


class UserResponse(BaseModel):

    id: int
    username: str
    is_active: bool

    class Config:
        from_attributes = True        