import React, { useEffect } from "react";
import { Box } from "@mui/material";
import VideoArchiveList from "../components/VideoArchiveList";
import { useVideo } from "../hooks/ApiHooks";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addArchives } from "../reducers/archiveReducer";

const ITEM_WIDTH = 350;

const VideoArchiveScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const archive = useSelector((state) => state.archive);

  const { getArchives } = useVideo(navigate, dispatch);

  useEffect(() => {
    const fetchVideoArchives = async () => {
      try {
        const archives = (await getArchives()).archives;
        const archivesLength = archives.length;
        dispatch(
          addArchives({
            popularStream: archives.slice(
              Math.round(archivesLength / 2),
              archives.length
            ),
            latestStream: archives.slice(0, Math.round(archivesLength / 2)),
          })
        );
      } catch (error) {
        console.error(`fetchVideoArchivesError: ${error.message}`);
      }
    };
    fetchVideoArchives();
  }, []);

  return (
    <Box>
      <VideoArchiveList videos={archive.latestStream} title="Latest Stream" />
      <VideoArchiveList videos={archive.popularStream} title="Popular Stream" />
    </Box>
  );
};

export default VideoArchiveScreen;
