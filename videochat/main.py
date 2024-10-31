from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .src.controllers.helpers import init_image_bind
from .src.routers import videoRouter
from contextlib import asynccontextmanager
from .src.controllers.variables import AI_MODEL, ml_models
import google.generativeai as genai
import os
origins = ["*"]
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("LifeSpan started")
    genai.configure(api_key=GOOGLE_API_KEY)
    # Load the imagebind embeddings model
    if AI_MODEL.IMAGEBIND.name not in ml_models:
        ml_models[AI_MODEL.IMAGEBIND.name] = init_image_bind()

    if AI_MODEL.GEMINI.name not in ml_models:
        ml_models[AI_MODEL.GEMINI.name] = genai.GenerativeModel(
            "gemini-1.5-flash")
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
