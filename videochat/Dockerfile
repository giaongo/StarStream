FROM python:3.10-slim

WORKDIR /videochat

RUN python -m pip install --upgrade pip

RUN apt-get update && apt-get install -y git

COPY ./ImageBind ./ImageBind

RUN python -m pip install --default-timeout=100 ./ImageBind

RUN cd ./ImageBind && python -m vtk==9.2.4 git+https://github.com/enthought/mayavi.git@master

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002

CMD [ "python", "main.py" ]