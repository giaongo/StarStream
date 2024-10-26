from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .src.controllers.helpers import init_image_bind
from .src.routers import videoRouter
from contextlib import asynccontextmanager
from .src.controllers.variables import ml_models
origins = ["*"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("LifeSpan started")
    # Load the imagebind embeddings model
    if "imagebind" not in ml_models:
        ml_models["imagebind"] = init_image_bind()
    yield
    # clean up the ML models and release the resources
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(videoRouter.router)
