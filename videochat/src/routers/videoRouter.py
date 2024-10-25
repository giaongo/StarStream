from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from pathlib import Path

from ..controllers.videoController import process_image_text_embeddings, retrieve_url_to_local_file, process_video_subtitle_to_metadata

router = APIRouter(
    prefix="/video",
    tags=["video_archives"],
    responses={404: {"msg": "Not found"}},
)
video_path = os.path.join(os.getcwd(), "videos")
Path(video_path).mkdir(exist_ok=True, parents=True)


class VideoInfo(BaseModel):
    video_url: str
    subtitle_url: str


@router.post("/process")
async def process_video_info(video_info: VideoInfo):
    try:

        video_file_path, vtt_file_path, video_dir_path = retrieve_url_to_local_file(
            video_path=video_path,
            video_url=video_info.video_url,
            vtt_url=video_info.subtitle_url)

        metadata_result = process_video_subtitle_to_metadata(video_path=video_file_path,
                                                             vtt_path=vtt_file_path,
                                                             path_to_save_extracted_frame=os.path.join(
                                                                 video_dir_path, "processed_data"))
        process_image_text_embeddings(
            path_to_save_extracted_frame=os.path.join(
                video_dir_path, "processed_data"),
            metadata_result=metadata_result
        )

        return {"message": f"Information received ${video_info.video_url} and ${video_info.subtitle_url} successfully"}
    except Exception as err:
        print(f"Error processing video {err}")
        raise HTTPException(
            status_code=400, detail="Error processing video info")
