const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 4096,
    gop_cache: false,
    ping: 10,
    ping_timeout: 20
  },
  http: {
    port: 8000,
    allow_origin: '*', 
    mediaroot: './media', 
    api: true
  }, 
  trans: {
    ffmpeg: '/usr/bin/ffmpeg', 
    tasks: [
      {
        app: 'live', 
        mp4: true, 
        mp4Flags: '[movflags=flag_keyframe+empty_moov]',
        hls: true, 
        hlsFlags: '[hls_time=1:hls_list_size=3:hls_flags=delete_segments+omit_endlist]', 
        dash: true,
        dashFlags: '[f=dash:window_size=2:extra_window_size=4]'
      }
    ]

  }
};

var nms = new NodeMediaServer(config)
nms.run();