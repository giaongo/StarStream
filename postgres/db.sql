CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL, 
    event_start_date TIMESTAMP NOT NULL,
    event_end_date TIMESTAMP NOT NULL, 
    event_image VARCHAR(255), 
    streaming_key VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS videos_archives (
    video_id SERIAL PRIMARY KEY, 
    video_path VARCHAR(255),
    key_name VARCHAR(50),
    video_file_name VARCHAR(100),
    subtitle_path VARCHAR(255),
    CONSTRAINT fk_video
        FOREIGN KEY (key_name)
            REFERENCES events(streaming_key)
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

/* 12 sample events*/
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('Futurecom 2024', '2024-10-04 08:00:00', '2024-10-5 11:00:00', 'sample1.png', 'sample1');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('MWC Las Vegas 2024', '2024-10-04 09:00:00', '2024-10-5 12:00:00', 'sample2.jpg', 'sample2');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('MWC Barcelona 2024', '2024-10-01 10:00:00', '2024-10-1 13:00:00', 'sample3.jpg', 'sample3');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('InnoTrans 2024', '2024-10-02 11:00:00', '2024-10-2 14:00:00', 'sample4.jpg', 'sample4');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('Digital X 2024', '2024-09-18 12:00:00', '2024-9-19 15:00:00', 'sample5.jpg', 'sample5');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('Infobip Shift', '2024-09-15 13:00:00', '2024-9-17 16:00:00', 'sample6.jpg', 'sample6');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('Web Summit 2024', '2024-09-14 14:00:00', '2024-9-15 17:00:00', 'sample7.jpg', 'sample7');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('NANOG 91', '2024-06-10 15:00:00', '2024-9-14 18:00:00', 'sample8.jpg', 'sample8');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('RWA Summit', '2024-06-25 16:00:00', '2024-6-27 19:00:00', 'sample9.jpg', 'sample9');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('MWC Shanghai 2024', '2024-06-26 17:00:00', '2024-6-28 20:00:00', 'sample10.jpg', 'sample10');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('Autocon 1', '2024-05-27 18:00:00', '2024-5-31 21:00:00', 'sample11.jpg', 'sample11');
INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES ('ONUG Spring', '2024-05-15 19:00:00', '2024-5-15 22:00:00', 'sample12.jpg', 'sample12');

/* 12 samples video archives*/
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample1v.mp4', 'sample1', 'samples/sample1v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample2v.mp4', 'sample2', 'samples/sample2v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample3v.mp4', 'sample3', 'samples/sample3v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample4v.mp4', 'sample4', 'samples/sample4v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample5v.mp4', 'sample5', 'samples/sample5v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample6v.mp4', 'sample6', 'samples/sample6v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample7v.mp4', 'sample7', 'samples/sample7v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample8v.mp4', 'sample8', 'samples/sample8v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample9v.mp4', 'sample9', 'samples/sample9v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample10v.mp4', 'sample10', 'samples/sample10v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample11v.mp4', 'sample11', 'samples/sample11v.mp4');
INSERT INTO videos_archives (video_path, key_name, video_file_name) VALUES ('https://d2svo8w7e6o53b.cloudfront.net/samples/sample12v.mp4', 'sample12', 'samples/sample12v.mp4');


ALTER DATABASE starstream_db SET TIMEZONE TO  'posix/Europe/Helsinki';              