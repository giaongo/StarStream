from fastapi import APIRouter

router = APIRouter(
    prefix="/video",
    tags=["video_archives"],
    responses={404: {"msg": "Not found"}},
)


@router.post("/")
async def upload_video_info():
    return {"message": "Video information received"}
