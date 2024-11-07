<a name="readme-top"></a>
<h1 align="center">StarStream Application</h1> 
<p align="center">
  <img src="https://github.com/user-attachments/assets/0ae5d729-6446-44e4-bb05-1699937be683" alt="App Logo">
</p>

<h3 align="center">Your Custom Streaming Hub: Watch, Chat Live, and Get Instant AI Answers!</h3>
<hr/>

## Web Application Project With Streaming Capabilities

StarStream is an innovative web-based application developed for Nokia Garage Innovation. The solution provides a seamless streaming platform for the public event participants to experience and interact with the latest events hosted by Nokia Garage.
The solution objective is to develop a custom streaming hub where the event broadcasting and cutting-edge AI features can all be present. 

## Table of Contents

- [Overview](#overview)
- [Contributors](#contributors)
- [Features](#features)
- [Technologies](#technologies)
- [Installation Instruction](#installation-instructions)
- [Demo Video](#demo-video)
- [Screenshots](#screenshots)



## Overview

As part of Innovation Project, StartStream is a web-based solution developed for Nokia Garage Innovation to enhance the public event interaction and experiences with Nokia. 
The project is a joint efforts of a team of five students from different degree majors. Our goal is to create fully-functional and creative streaming site for the public users and Nokia staff, meeting the Nokia's client requirements. 

## Contributors
1. [Giao Ngo](https://github.com/giaongo)
2. [Adam Ahmethanov](https://github.com/adamahmethanov)
3. [Teemu Salovaara](https://github.com/teemusalovaara)
4. [Matias Lehtelä](https://github.com/Matiaslehtela)
5. [Ricu Ruotsinsalo](https://github.com/Labrat32)

## Features
- **Custom-built Streaming Server**: A fast and secured streaming server holding full control over the configuration and functionalities.
- **Today Event Streaming**: The users can track today events with timing and scheduling.
- **Real-time Event Broadcasting**: The users can watch the live streaming broadcasted from the Nokia event venue. The streamings are performed by the Nokia staff, given the security streaming information provided for the admin in the solution.
- **Real-time Live Chat**: The users can send real-time messages to other audiences in the event.
- **Video Archives**: The uers can find the list of past event videos and watch them if they are interested in. 
- **Video Subtitles**:  The solution offers audio transcription capabilities for every past video archives, ensuring the accessibility for individuals with disabilities.
- **AI Video Q&A**: To enhance the event understanding, the solutions offers an instant AI Video Q&A in every past event videos, allowing the users to ask questions about the related video, and graph the key concepts that the event demonstrated.
- **Event Monitoring for Admin**: This feature allows the event admin to add, delete events, and view the security streaming info for every event. 

## Technologies
The solutions are built into different microservices using docker and docker compose. The solution will be hosted on AWS Cloud

- **Web**:
1. Frontend: ReactJS, React Redux, JavaScript, Material UI.
2. Backend: Python Quart, Python-socketio
3. Database: PostgreSQL

- **Streaming**:
1. Node Media Server: NodeJS, AWS SDK for JavaScript
2. Whisper AI

- **AI Video Q&A**:
1. ImageBind by MetaAI: [ImageBind Info](https://imagebind.metademolab.com/)
2. KDB Vector Database: [KDB.AI](https://cloud.kdb.ai/auth/realms/kdbai/protocol/openid-connect/auth?response_type=code&nonce=fbacaaf20166bb28bcc84574c4bbf269&state=4e847319b9c87366386a866648531965&client_id=gui&redirect_uri=https%3A%2F%2Fcloud.kdb.ai%2Fredirect_uri&scope=openid%20email%20profile)
3. Gemini Flash 1.5: [Gemini 1.5](https://deepmind.google/technologies/gemini/flash/)
4. FastAPI

**AWS Resources**:
1. AWS EC2 (m5.2xlarge, c5.xlarge, t3.medium)
2. EBS (40GB)
3. AWS S3
4. AWS CDN

## Installation Instructions 
### For Development Purposes:
1. Create a list of envs:
* In backend folder:  Create an .env inside the backend directory with the below format. Create a data field freely on your own:<br/>
APP_SECRET=\
POSTGRES_USER=\
POSTGRES_PASSWORD=\
POSTGRES_DB=\
ADMIN_EMAIL=\
ADMIN_PASSWORD=\
JWT_SECRET=<br/>

* In nms folder: Create an .env inside the nms directory with the below format.
Refer to AWS documentation to create a user in AWS and get the necessary accesskey and key id. More information can be found in [AWS SDK Info](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html) <br/>
AWS_BUCKET_NAME=\
AWS_ACCESSKEYID=\
AWS_SECRETACCESSKEY=\
AWS_REGION=<br/>

* In videochat folder: Create an .env inside the videochat directory with the below format.
Refer to [KDB.AI](https://code.kx.com/kdbai/latest/index.html) and [Google AI Studio](https://aistudio.google.com/app/prompts/new_chat) <br/>
KDB_ENDPOINT_URL=\
KDB_API_KEY=\
GOOGLE_API_KEY=<br/>

2. Ensure that Docker is installed in your computer.
3. Open command prompt and go to main directory where docker-compose.yaml locates
4. Run docker containers (Depending on your computer resources, this process may take quite long): `docker-compose up --build`
5. Stop and remove docker containers(This clears out the running containers and network resources): `docker-compose down`
6. **DEBUG:** Get into the docker database for further inspection: `docker exec -ti postgresql psql -U streamuser -d starstream_db`
7. **DEV:** When there are fronend code changes, frontend react auto-reloads the frontend container
8. **DEV:** When changes need to be made in backend, nms, and videochat -> manual restarting container is necessary by: `docker-compose restart backend`
9. **DEV:** If you want to remove the persistent volume of postgres database: `docker volume rm  starstream_persist-volume`
## Demo Video
<h3 align="center">Click to watch</h3>
<p align="center">
  <a href="https://youtu.be/9cOfdv-tzQg" target="_blank">
    <img src="https://img.youtube.com/vi/9cOfdv-tzQg/0.jpg" alt="Watch the video">
  </a>
</p>




