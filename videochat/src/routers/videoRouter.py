from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from pathlib import Path
from ..controllers.videoController import KDB_API_KEY, KDB_ENDPOINT, process_image_text_embeddings, retrieve_url_to_local_file, process_video_subtitle_to_metadata, table_exists
from ..controllers.videoController import upload_dataframe_to_KDB
import kdbai_client as kdbai
import pandas as pd
from fastapi.responses import JSONResponse

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


@router.post("/process", responses={
    200: {"description": "Table exists", "content": {"application/json": {"example": {"msg": "Table exists"}}}},
    201: {"description": "Table created and uploaded to KDB.AI Vector Database", "content": {"application/json": {"example": {"msg": "Table created and upload result is ..."}}}},
    400: {"description": "Error checking and processing video info", "content": {"application/json": {"example": {"msg": "Error checking and processing video info"}}}}
})
async def check_and_process_video_info(video_info: VideoInfo):
    """ 
    Check the existence of table in KDB.AI vectordatabase.
    If the table exists -> return "Table exists", otherwise process the video info by following the steps:

    - Generate the metadata from the video frames and subtitle files
    - Generate embeddings with the given metadata
    - Upload the dataframe to the KDB.AI Vector Database
    Note: The table name is deprived of the video url. Each video archive will have its own table in the KDB.AI Vector Database.
    """
    try:
        # Create a session to interact with KDB.AI Vector Database
        session = kdbai.Session(endpoint=KDB_ENDPOINT, api_key=KDB_API_KEY)

        parse_videpo_filename = os.path.basename(
            video_info.video_url).split(".")[0].split("-")
        table_name = f"video_{'_'.join(parse_videpo_filename)}"

        tableExist = table_exists(
            table_name=table_name, session=session)
        if tableExist:
            return JSONResponse(status_code=200, content={"msg": "Table exists"})

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
        uploadResult = upload_dataframe_to_KDB(
            table_name=table_name, session=session, dataframe=dataframe)

        # close the session
        session.close()
        return JSONResponse(status_code=201, content={"msg": f"Table created and upload result is: {uploadResult}"})
    except Exception as err:
        print(f"Error processing video {err}")
        raise HTTPException(
            status_code=400, detail="Error checking and processing video info")


@router.get("/greet")
async def greet():
    return "Hello, this is the video archive API"
