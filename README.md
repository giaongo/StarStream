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
- **Video Subtitles**: The solution offers audio transcription capabilities for every past video archives, ensuring the accessibility for individuals with disabilities.
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

1. Create an AWS user specifically for this streaming solution:

- Head to IAM
- Create user with your preferred name: e.g starstream_user
- In starstream_user dashboard -> select "Permissions" tab -> add "IAMFullAccess" and "AmazonS3FullAccess" as permissions policies
- In starstream_user dashboard -> select "Security credentials" tab -> In "Access keys", click "Create access key"
- Note all the values in access key for later use.

2. Set up AWS S3 and AWS CloudFront to efficiently manage video archives. After streaming, all video recordings will be stored in AWS S3, and audiences can seamlessly access them through AWS CloudFront.

3. In your IDE, Create a list of envs:

- In backend folder: Create an .env inside the backend directory with the below format. Create a data field freely on your own:<br/>
  APP_SECRET=\
  POSTGRES_USER=\
  POSTGRES_PASSWORD=\
  POSTGRES_DB=\
  ADMIN_EMAIL=\
  ADMIN_PASSWORD=\
  JWT_SECRET=<br/>

- In nms folder: Create an .env inside the nms directory with the below format.
  Refer to AWS documentation to create a user in AWS and get the necessary accesskey and key id from step 1.
  More information can be found in [AWS SDK Info](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html) <br/>
  AWS_BUCKET_NAME=\
  AWS_ACCESSKEYID=\
  AWS_SECRETACCESSKEY=\
  AWS_REGION=<br/>

- In videochat folder: Create an .env inside the videochat directory with the below format.
  Refer to [KDB.AI](https://code.kx.com/kdbai/latest/index.html) and [Google AI Studio](https://aistudio.google.com/app/prompts/new_chat) <br/>
  KDB_ENDPOINT_URL=\
  KDB_API_KEY=\
  GOOGLE_API_KEY=<br/>

4. Ensure that Docker is installed in your computer.
5. Open command prompt and go to main directory where docker-compose.yaml locates
6. Run docker containers (Depending on your computer resources, this process may take quite long): `docker-compose up --build`
7. Stop and remove docker containers(This clears out the running containers and network resources): `docker-compose down`
8. **DEBUG:** Get into the docker database for further inspection: `docker exec -ti postgresql psql -U streamuser -d starstream_db`
9. **DEV:** When there are fronend code changes, frontend react auto-reloads the frontend container
10. **DEV:** When changes need to be made in backend, nms, and videochat -> manual restarting container is necessary by: `docker-compose restart backend` OR `docker-compose restart nms` OR `docker-compose restart videochat`
11. **DEV:** If you want to remove the persistent volume of postgres database: `docker volume rm  starstream_persist-volume`

### For Demonstration Purposes:

Due to budget constraints, we have chosen to host the streaming solutions on AWS. For demonstration purposes, three remote AWS instances are allocated to separate services, ensuring optimal network bandwidth and computing performance. 3 resources are below:

1. t3.medium - hosting web server (frontend, backend, postgres) with 10GB EBS
2. c5.xlarge - hosting streaming server and whisperAI with 10GB EBS
3. m5.2xlarge - hosting video Q&A with 20GB EBS and 20GB EBS /dev/sdf (attached to /var/lib/docker)

**Steps to setup**:

1. Create 3 above-mentioned remote machines on EC2
2. Installing docker:[Docker Installation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html)
3. Installing docker compose: [Docker Compose Installation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html)
4. Allocate 20GB EBS to m5.2xlarge: [Make an Amazon EBS volume available for use](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html) and the final step is -> `sudo mount /dev/sdf /var/lib/docker`
5. Small edit and rebuild docker images with the given ip addresses of the remote machines:

   - `cd frontend/utils; nano variables.js`:
     - Change wsUrl to "http://<t3.medium public ip>:5001"
     - Change videoChatBaseUrl to "<c5.xlarge public ip>:5002"
   - Rebuild the docker images in frontend folder and push to your dockerhub:

     For example: (Please change the giaongo/starstream-frontend:1.2 to yourdockerhub/starstream-frontend:1.2)

     - `cd frontend`
     - `docker build -t giaongo/starstream-frontend:1.2 -f Dockerfile.prod .`
     - `docker push giaongo/starstream-frontend:1.2`

   - `cd production; nano docker-compose_stream.yaml`:

     - Change BACKEND_URL to "http://<t3.medium public ip>/api";
     - Change CDN_URL to "https://<cdn address>;

   - `cd production`:

     - Replace giaongo/starstream-frontend:1.1 in docker-compose_web.yaml with yourdockerhub/starstream-frontend:1.2

   - `mkdir web; cd web` in t3.medium, `mkdir stream;cd stream` in c5.xlarge, `mkdir videochat; cd videochat` in m5.2xlarge
   - Secured copy docker-compose_web.yaml to t3.medium, docker-compose_stream.yaml to c5.xlarge and docker-compose_videochat
     to m5.2xlarge
   - Change the name of all yaml files to docker-compose.yaml
   - Copy all of the .env files to corresponsing web, stream and videochat folder of the remote machines
   - Run `docker-compose up --build -d` for each remote machine
   - Visit the web dns name of t3.medium to check the site

## Solution Trailer Video

<h3 align="center">Click to watch</h3>
<p align="center">
  <a href="https://youtu.be/P6h1FYovY6U" target="_blank">
    <img src="https://img.youtube.com/vi/P6h1FYovY6U/0.jpg" alt="Watch the video">
  </a>
</p>
