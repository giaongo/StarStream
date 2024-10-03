CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL, 
    event_start_date TIMESTAMP NOT NULL,
    event_end_date TIMESTAMP NOT NULL, 
    event_image VARCHAR(255), 
    streaming_key VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS videos_archives (
    id SERIAL PRIMARY KEY, 
    video_path VARCHAR(255),
    event_id INT,
    CONSTRAINT fk_event
        FOREIGN KEY (event_id)
            REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(100) NOT NULL, 
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS streaming_setting (
    id SERIAL PRIMARY KEY, 
    streaming_url VARCHAR(255) NOT NULL, 
    viewing_url VARCHAR(255) NOT NULL
);

INSERT INTO streaming_setting (streaming_url, viewing_url) VALUES ('rtmp://localhost/live', 'http://localhost:8000/live');

ALTER DATABASE starstream_db SET TIMEZONE TO  'posix/Europe/Helsinki';              