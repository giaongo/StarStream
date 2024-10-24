from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/video",
    tags=["video_archives"],
    responses={404: {"msg": "Not found"}},
)


class VideoInfo(BaseModel):
    video_url: str
    subtitle_url: str


@router.post("/")
async def process_video_info(video_info: VideoInfo):
    return {"message": f"Information received ${video_info.video_url} and ${video_info.subtitle_url}"}
