from quart import Blueprint, request
from tempfile import NamedTemporaryFile
from urllib.request import urlretrieve
import whisper
import torch
import ffmpeg
from pathlib import Path
import os

# Check if NVIDIA GPU is available
torch.cuda.is_available()
DEVICE = "cude" if torch.cuda.is_available() else "cpu"
model = whisper.load_model('small', device=DEVICE)
video = Blueprint('video', __name__)
video_temp_dir_path = "./video/temp"


def convert_video_to_audio(video_path, audio_path):
    """ Convert video to audio
    """
    try:

        ffmpeg.input(video_path).output(audio_path).run()
    except Exception as e:
        raise Exception('Error converting video to audio:', e)


@video.route('/caption', methods=['POST'])
async def generate_caption():
    """ Generate caption for video
    """
    video_url = request.args.get('video_url')
    Path(video_temp_dir_path).mkdir(parents=True, exist_ok=True)
    video_path = os.path.join(video_temp_dir_path, 'video.mp4')
    audio_path = os.path.join(video_temp_dir_path, 'audio.mp3')

    try:
        urlretrieve(video_url, video_path)

        convert_video_to_audio(video_path, audio_path)
    except Exception as e:
        print('Error with video:', e)
        return {'msg': 'Error with video'}, 400
    # model = whisper.load_model('small')
    # options = dict(task='translate', best_of=1, language='en')
    # result = whisper.transcribe(video_url, **options)
    # print('transcription result is:', result)

    return {'transcription_result': video_url}, 200
