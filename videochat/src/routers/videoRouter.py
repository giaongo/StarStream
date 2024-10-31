from fastapi import APIRouter, HTTPException, WebSocket, Request, WebSocketDisconnect
from pydantic import BaseModel
import os
from pathlib import Path
from ..controllers.videoController import KDB_API_KEY, KDB_ENDPOINT, clear_temp, generate_rag, process_image_text_embeddings, retrieve_url_to_local_file, process_video_subtitle_to_metadata, similarity_search, table_exists
from ..controllers.videoController import upload_dataframe_to_KDB
import kdbai_client as kdbai
from fastapi.responses import JSONResponse
from fastapi.responses import HTMLResponse
from ..controllers.helpers import prompt_text_to_embedding

router = APIRouter(
    prefix="/video",
    tags=["video_archives"],
    responses={404: {"msg": "Not found"}}
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

        # remove the video and subtitle files
        clear_temp(video_path)

        return JSONResponse(status_code=201, content={"msg": f"Table created and upload result is: {uploadResult}"})
    except Exception as err:
        print(f"Error processing video {err}")
        raise HTTPException(
            status_code=400, detail="Error checking and processing video info")

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:5002/video/ws/video_2024_10_29_11_41_58");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@router.get("/greeting")
async def greeting():
    """ This route is for testing the websocket chat with the given html template

    Returns:
        _type_
    """
    return HTMLResponse(html)


@router.get("/search")
async def similar_search(data: str):
    """This route is for testing the prompt response from Gemini with the given input prompt and embeddings from database

    Args:
        data (str)
    Raises:
        HTTPException

    Returns:
        _type_
    """
    try:
        session = kdbai.Session(endpoint=KDB_ENDPOINT, api_key=KDB_API_KEY)
        embeddings = prompt_text_to_embedding(data)
        search_formatted_embeddings = [embeddings.tolist()]
        result = similarity_search(text_embedding=search_formatted_embeddings,
                                   table_name="video_2024_10_20_13_26_49", session=session)
        result_transcript = result[0]["transcript"].iat[0]
        print("Result transcript ", result_transcript)
        output_response = generate_rag(
            prompt_text=data, retrieved_text=result_transcript)
        return {"msg": output_response}
    except Exception as err:
        print(f"Error at similar_search {err}")
        raise HTTPException(status_code=400, detail="Error at similar_search")


@router.websocket("/ws/{table_name}")
async def websocket_videochat(websocket: WebSocket, table_name: str):
    """
    Innitiate the chat with the nearest similarity search result from the given input text.

    Args:
        websocket (WebSocket):
        table_name (str)

    Raises:
        HTTPException
    """
    try:
        await websocket.accept()
        session = kdbai.Session(endpoint=KDB_ENDPOINT, api_key=KDB_API_KEY)
        while True:
            data = await websocket.receive_text()
            print("Data received ", data)
            embeddings = prompt_text_to_embedding(data)
            search_formatted_embeddings = [embeddings.tolist()]
            result = similarity_search(text_embedding=search_formatted_embeddings,
                                       table_name=table_name, session=session)
            result_transcript = result[0]["transcript"].iat[0]
            output_response = generate_rag(
                prompt_text=data, retrieved_text=result_transcript)
            await websocket.send_text(output_response)
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as err:
        print(f"Error at websocket_endpoint {err}")
        raise HTTPException(
            status_code=400, detail="Error at websocket_endpoint")
    finally:
        session.close()
