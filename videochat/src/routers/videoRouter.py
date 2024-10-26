from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from pathlib import Path
from ..controllers.videoController import KDB_API_KEY, KDB_ENDPOINT, process_image_text_embeddings, retrieve_url_to_local_file, process_video_subtitle_to_metadata, table_exists
from ..controllers.videoController import upload_dataframe_to_KDB
import kdbai_client as kdbai
import pandas as pd
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

        # Retrieve video and subtitle files
        video_file_path, vtt_file_path, video_dir_path = retrieve_url_to_local_file(
            video_path=video_path,
            video_url=video_info.video_url,
            vtt_url=video_info.subtitle_url)

        # Process video and subtitle files to metadata
        metadata_result = process_video_subtitle_to_metadata(video_path=video_file_path,
                                                             vtt_path=vtt_file_path,
                                                             path_to_save_extracted_frame=os.path.join(
                                                                 video_dir_path, "processed_data"))

        # Generate embeddings with the given metadata
        dataframe = process_image_text_embeddings(
            path_to_save_extracted_frame=os.path.join(
                video_dir_path, "processed_data"),
            metadata_result=metadata_result
        )

        # Upload the dataframe to the KDB.AI Vector Database
        upload_result = await upload_dataframe_to_KDB(dataframe)

        return {"message": f"Information received ${video_info.video_url} and ${video_info.subtitle_url} successfully"}
    except Exception as err:
        print(f"Error processing video {err}")
        raise HTTPException(
            status_code=400, detail="Error processing video info")


@router.get("/greet")
async def check_and_upload_KDB():
    try:
        session = kdbai.Session(endpoint=KDB_ENDPOINT, api_key=KDB_API_KEY)
        tableExist = table_exists(
            table_name="test_table", session=session)
        if tableExist:
            return {"msg": "Table exists"}
        uploadResult = upload_dataframe_to_KDB(table_name="test_table", session=session, dataframe=pd.DataFrame(data={
            "image_path": ["test1"],
            "transcript": ["test2"],
        }))
        session.close()
        return {"msg": f"Upload result is {uploadResult}"}
    except Exception as err:
        print(f"Error greeting {err}")
        raise HTTPException(
            status_code=400, detail="Error greeting")
