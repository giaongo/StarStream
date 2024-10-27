from typing import List
from ...ImageBind.imagebind.models import imagebind_model
from ...ImageBind.imagebind import data
from .variables import ml_models
import torch
import json

device = "cuda:0" if torch.cuda.is_available() else "cpu"


def init_image_bind() -> imagebind_model.ImageBindModel:
    """ Instantiate imagebind model

    Returns:
        imagebind_model.ImageBindModel: imagebind model
    """

    # Instantiate model
    model = imagebind_model.imagebind_huge(pretrained=True)
    model.eval()
    model.to(device)
    return model


def read_metadata_from_file(file_path: str) -> List[dict]:
    """_summary_

    Args:
        file_path (str): _description_

    Returns:
        List[dict]: _description_
    """
    with open(file_path, "r") as file:
        metadata = json.load(file)
    return metadata


def get_embedding_vector(inputs: object):
    """ Get the embedding vector

    Args:
        inputs (object): inputs to the model

    Returns:
        np.ndarray: embedding vector
    """
    if "imagebind" not in ml_models:
        print("Imagebind model not found")
        return None

    try:
        with torch.no_grad():
            embedding_result = ml_models["imagebind"](inputs)
        for _, value in embedding_result.items():
            vec = value.reshape(-1)
            vec = vec.numpy()
            return (vec)
    except Exception as err:
        raise Exception(f"Error at get_embedding_vector {err}")


def full_data_to_embedding(imagePath: str, text: str):
    """Collect metadata input for imagebind model

    Args:
        imagePath (str): path to extracted frame
        text (str): transcript

    Raises:
        Exception: error message

    Returns:
        np.ndarray | None: embedding vector for joint image and text data
    """

    try:
        inputs = {
            imagebind_model.ModalityType.VISION: data.load_and_transform_vision_data([imagePath], device),
            imagebind_model.ModalityType.TEXT: data.load_and_transform_text([
                                                                            text], device)
        }
        return get_embedding_vector(inputs)
    except Exception as err:
        raise Exception(f"Error at full_data_to_embedding {err}")
