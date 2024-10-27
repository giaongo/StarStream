from typing import List, Tuple
import os
from pathlib import Path
from urllib.request import urlretrieve
import webvtt
import cv2
import json
from .helpers import full_data_to_embedding
import pandas as pd
from dotenv import load_dotenv, find_dotenv
import kdbai_client as kdbai
from tqdm import tqdm
import numpy as np
import pandas as pd
import kdbai_client as kdbai

load_dotenv(find_dotenv())
KDB_ENDPOINT = os.getenv("KDB_ENDPOINT_URL")
KDB_API_KEY = os.getenv("KDB_API_KEY")
table_schema = [
    {"name": "image_path", "type": "str"},
    {"name": "transcript", "type": "str"},
    {
        "name": "embeddings",
        "type": "float64s"
    },
]

indexes = [
    {
        "name": "vectorIndex",
        "type": "flat",
        "column": "embeddings",
        "params": {"dims": 1024, "metric": "CS"}
    }
]


class VideoExtractedMetadata:
    def __init__(self, transcript: str, extracted_image_path: str, video_segment_id: int, video_path: str, mid_time_ms: float):
        self.transcript = transcript
        self.extracted_image_path = extracted_image_path
        self.video_segment_id = video_segment_id
        self.video_path = video_path
        self.mid_time_ms = mid_time_ms


def retrieve_url_to_local_file(video_path: str, video_url: str, vtt_url: str) -> Tuple[str, str, str]:
    """ Retrieve video urls and vtt urls into a designated directories for later processing

    Args:
        video_path (str): video path to store the video
        video_url (str): video url
        vtt_url (str): vtt url

    Raises:
        Exception: Error retrieving urls to local file

    Returns:
        Tuple[str, str, str]: return the stored video file, stored vtt file, and extracted video dir path
    """
    try:
        video_dir_name = os.path.basename(os.path.dirname(video_url))
        extracted_video_dir_path = os.path.join(video_path, video_dir_name)

        # Create extracted video dir path:
        Path(extracted_video_dir_path).mkdir(exist_ok=True, parents=True)
        video_file_name = os.path.basename(video_url)
        vtt_file_name = os.path.basename(vtt_url)
        stored_video_file = urlretrieve(video_url, os.path.join(
            extracted_video_dir_path, video_file_name))
        stored_vtt_file = urlretrieve(vtt_url, os.path.join(
            extracted_video_dir_path, vtt_file_name))

        return stored_video_file[0], stored_vtt_file[0], extracted_video_dir_path
    except Exception as err:
        raise Exception(f'Error retrieving urls to local file {err}')


def str_to_time_in_ms(text: str) -> float:
    """convert str time to float

    Args:
        text (str): text of time in format HH:MM:SS

    Returns:
        float: time in ms
    """
    hour, min, second = [float(data) for data in text.split(":")]
    total_millisecond = (hour*60*60 + min*60 + second)*1000
    return total_millisecond


def maintain_aspect_ratio_resize(image, width=None, height=None, inter=cv2.INTER_AREA):
    """Resize image ratio

    Args:
        image (_type_): 
        width (_type_, optional): Defaults to None.
        height (_type_, optional):Defaults to None.
        inter (_type_, optional): Defaults to cv2.INTER_AREA.

    Returns:
        _type_: resized image
    """
    # Grab the image size and initialize dimensions
    dim = None
    (h, w) = image.shape[:2]

    # Return original image if no need to resize
    if width is None and height is None:
        return image

    # We are resizing height if width is none
    if width is None:
        # Calculate the ratio of the height and construct the dimensions
        r = height / float(h)
        dim = (int(w * r), height)
    # We are resizing width if height is none
    else:
        # Calculate the ratio of the width and construct the dimensions
        r = width / float(w)
        dim = (width, int(h * r))

    # Return the resized image
    return cv2.resize(image, dim, interpolation=inter)


def process_video_subtitle_to_metadata(video_path: str, vtt_path: str, path_to_save_extracted_frame: str) -> List[dict]:
    """ Generate metadata from video and subtitle

    Args:
        video_path (str): local path of video
        vtt_path (str): local path of vtt
        path_to_save_extracted_frame (str): path to store extracted frame

    Raises:
        Exception: Error processing video subtitle

    Returns:
        List[dict]: list of metadata
    """
    # create folder to store metadata

    Path(path_to_save_extracted_frame).mkdir(exist_ok=True, parents=True)
    metadata = []

    try:
        # retrieve video
        video = cv2.VideoCapture(video_path)
        # retrieve vtt
        trans = webvtt.read(vtt_path)

    # loop through transcripts
        for index, tran in enumerate(trans):
            start_time = str_to_time_in_ms(tran.start)
            end_time = str_to_time_in_ms(tran.end)
            mid_time = (start_time + end_time) / 2

            # filter transcript
            filtered_transcript = tran.text.replace("\n", "")

            # get the video frame at mid_time
            video.set(cv2.CAP_PROP_POS_MSEC, mid_time)

            # read the frame
            success, image = video.read()

            # if the frame is read successfully
            if success:
                # resize the image
                resized_image = maintain_aspect_ratio_resize(image, height=350)

                # save the image
                extracted_frame_path = os.path.join(
                    path_to_save_extracted_frame, f"frame_{index}.jpg")
                cv2.imwrite(extracted_frame_path, resized_image)

                extracted_video_metadata = VideoExtractedMetadata(
                    extracted_image_path=extracted_frame_path,
                    transcript=filtered_transcript,
                    video_segment_id=index,
                    video_path=video_path,
                    mid_time_ms=mid_time
                )

                metadata.append(extracted_video_metadata.__dict__)
        return metadata

    except Exception as err:
        raise Exception(f'Error processing video subtitle to metadata {err}')


def store_metadata_to_local_file(metadata: list[dict], path_to_save_metadata: str):
    """ Store metadata to local file

    Args:
        metadata (List[dict]): metadata to store
        path_to_save_metadata (str): path to store metadata

    Raises:
        Exception: Error storing metadata

    """
    try:
        with open(path_to_save_metadata, "w") as file:
            json.dump(metadata, file)
    except Exception as err:
        raise Exception(f'Error storing metadata {err}')


def adjust_vid_transcription(adjust_level: int, metadata: List[dict]) -> List[dict]:
    """ Adjust video transcription with more meaningful text by joining the text of the previous and next adjust_level/2

    Args:
        adjust_level (int): a level to adjust the transcription
        metadata (List[dict]): metadata to adjust

    Returns:
        List[dict]: adjusted metadata
    """
    # get list of transcript
    transcripts = [data["transcript"] for data in metadata]
    new_transcripts = [''.join(transcripts[i - int(adjust_level / 2): i + int(adjust_level / 2)]) if i - int(adjust_level / 2) >= 0
                       else ''.join(transcripts[0: i + int(adjust_level/2)])
                       for i in range(len(transcripts))]

    # # update metadata with new transcript
    for i, data in enumerate(metadata):
        data["transcript"] = new_transcripts[i]
    return metadata


def process_image_text_embeddings(path_to_save_extracted_frame: str, metadata_result: List[dict]) -> pd.DataFrame:
    """ Process image and text embeddings and return a dataframe storing info of each frame of a video

    Args:
        path_to_save_extracted_frame (str)
        metadata_result (List[dict])

    Raises:
        Exception

    Returns:
        pd.DataFrame
    """
    try:
        # create empty dataframe
        columns = ["image_path", "transcript", "embeddings"]
        dataframe = pd.DataFrame(columns=columns)

        # adjust transcript in metadata
        adjusted_metadata = adjust_vid_transcription(
            adjust_level=5, metadata=metadata_result)

        # store metadata to local file
        store_metadata_to_local_file(metadata=adjusted_metadata,
                                     path_to_save_metadata=os.path.join(path_to_save_extracted_frame, "metadata.json"))

        # generate embeddings for images and text
        for _, data in enumerate(adjusted_metadata):
            embedding = full_data_to_embedding(
                imagePath=data["extracted_image_path"], text=data["transcript"])

            new_row = pd.DataFrame([{
                "image_path": data["extracted_image_path"],
                "transcript": data["transcript"],
                "embeddings": embedding}])

            dataframe = pd.concat([dataframe, new_row], ignore_index=True)
        return dataframe
    except Exception as err:
        raise Exception(f"Error processing image and text embeddings {err}")


def table_exists(table_name: str, session: kdbai.Session) -> bool:
    """ Check if table exists in KDB.AI Vector Database

    Args:
        table_name (str)

    Raises:
        Exception

    Returns:
        bool
    """
    try:
        database = session.database("default")
        database.table(table=table_name)
        return True
    except Exception as err:
        return False


def upload_dataframe_to_KDB(table_name: str, dataframe: pd.DataFrame, session: kdbai.Session) -> bool:
    """ Insert dataframe to KDB.AI Vector Database

    Args:
        table_name (str): table name
        dataframe (pd.DataFrame): uploaded dataframe
        session (kdbai.Session): session to connect to KDB.AI Vector Database

    Raises:
        Exception

    Returns:
        dict:  result of the upload
    """
    try:
        database = session.database("default")
        table = database.create_table(table_name, table_schema, indexes)
        chunk_row = 100

        for i in tqdm(range(0, dataframe.shape[0], chunk_row)):
            table.insert(dataframe[i:i+chunk_row].reset_index(drop=True))
        return True
    except Exception as err:
        raise Exception(f"Error uploading dataframe to KDB {err}")


def similarity_search(text_embedding: np.ndarray, session: kdbai.Session, table_name: str) -> pd.DataFrame:
    """ Search for similar result from KDB vector database

    Args:
        text_embedding (_ndarray_): text embedding

    Returns:
        pd.DataFrame: the result of the search
    """
    try:
        table = session.table(table_name)
        result_df = table.search(text_embedding, n=1)
        return result_df
    except Exception as err:
        raise Exception(f"Error at similarity_search {err}")
