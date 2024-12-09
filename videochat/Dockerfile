FROM python:3.10

WORKDIR /videochat

RUN python -m pip install --no-cache-dir --upgrade pip \ 
    && apt-get update \
    && apt-get install -y git

COPY ./ImageBind ./ImageBind

RUN python -m pip install --default-timeout=500 --no-cache-dir ./ImageBind

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002

CMD ["fastapi", "run", "main.py", "--port", "5002"]