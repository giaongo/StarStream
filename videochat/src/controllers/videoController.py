from typing import List, Tuple
import os
from pathlib import Path
from urllib.request import urlretrieve
import webvtt
import cv2
import json


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

        return stored_video_file, stored_vtt_file, extracted_video_dir_path
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


def process_video_subtitle(video_path: str, vtt_path: str, path_to_save_extracted_frame: str) -> List[dict]:
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
        raise Exception(f'Error processing video subtitle {err}')


def store_metadata_to_local_file(metadata: list[dict], path_to_save_metadata: str):
    """ Store metadata to local file

    Args:
        metadata (List[dict]): metadata to store
        path_to_save_metadata (str): path to store metadata

    Raises:
        Exception: Error storing metadata

    """
    try:
        print("Type is ", type(metadata))
        with open(path_to_save_metadata, "w") as file:
            json.dump(metadata, file)
    except Exception as err:
        raise Exception(f'Error storing metadata {err}')


# result = process_vtt(vtt_path="videos/communication/2024-10-20-13-26-49.vtt")
# for data in result:
#     print("transcript start ", str_to_time_in_ms(data.start))
#     print("transcript end ", str_to_time_in_ms(data.end))
#     print("transcript data ", data.text)

result = process_video_subtitle(video_path="./videos/communication/2024-10-20-13-26-49.mp4",
                                vtt_path="./videos/communication/2024-10-20-13-26-49.vtt",
                                path_to_save_extracted_frame="./videos/communication/proccessed_data")

try:
    Path("./videos/communication/proccessed_data").mkdir(exist_ok=True, parents=True)
    store_metadata_to_local_file(metadata=result,
                                 path_to_save_metadata="./videos/communication/proccessed_data/metadata.json")
except Exception as err:
    print(f"Error storing metadata {err}")
