from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..controllers.videoController import retrieve_url_to_local_file, process_video_subtitle

router = APIRouter(
    prefix="/video",
    tags=["video_archives"],
    responses={404: {"msg": "Not found"}},
)
video_path = "./videos"


class VideoInfo(BaseModel):
    video_url: str
    subtitle_url: str


@router.post("/")
async def process_video_info(video_info: VideoInfo):
    try:

        video_file_path, vtt_file_path, video_dir_path = retrieve_url_to_local_file(
            video_path=video_path,
            video_url=video_info.video_url,
            vtt_url=video_info.subtitle_url)

        return {"message": f"Information received ${video_info.video_url} and ${video_info.subtitle_url} successfully"}
    except Exception as err:
        print(f"Error processing video {err}")
        raise HTTPException(
            status_code=400, detail="Error processing video info")
