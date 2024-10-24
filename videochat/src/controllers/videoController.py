from typing import Tuple
import os
from pathlib import Path
from urllib.request import urlretrieve
import webvtt

def retrieve_url_to_local_file(video_path: str, video_url: str, vtt_url: str) -> Tuple[str, str]:
    """ Retrieve video urls and vtt urls into a designated directories for later processing

    Args:
        video_path (str): _description_
        video_url (str): _description_
        vtt_url (str): _description_

    Raises:
        Exception: _description_

    Returns:
        Tuple[str, str]: _description_
    """
    try: 
        video_dir_name = os.path.basename(os.path.dirname(video_url))
        extracted_video_dir_path = os.path.join(video_path, video_dir_name)

        #Create extracted video dir path: 
        Path(extracted_video_dir_path).mkdir(exist_ok=True, parents=True)
        video_file_name = os.path.basename(video_url)
        vtt_file_name = os.path.basename(vtt_url)
        stored_video_file = urlretrieve(video_url, os.path.join(extracted_video_dir_path, video_file_name))
        stored_vtt_file = urlretrieve(vtt_url, os.path.join(extracted_video_dir_path, vtt_file_name))

        return stored_video_file, stored_vtt_file
    except Exception as err:
        raise Exception(f'Error retrieving urls to local file {err}')
    
def process_vtt(vtt_path): 
    return webvtt.read(vtt_path)
    
def str_to_time_in_ms(text: str) -> float:
    """convert str time to float 

    Args:
        text (str): _description_

    Returns:
        int: _description_
    """
    hour, min, second = [float(data) for data in text.split(":")]
    total_millisecond = (hour*60*60 + min*60 + second)*1000
    return total_millisecond

def process_video_subtitle():
    pass
result = process_vtt(vtt_path="videos/communication/2024-10-20-13-26-49.vtt")
for data in result:
    print("transcript start ", str_to_time_in_ms(data.start))
    print("transcript end ", str_to_time_in_ms(data.end))
    print("transcript data ", data.text)

