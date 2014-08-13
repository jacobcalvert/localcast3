import socket


class Paths(object):
    HTML_BASE = "html/"
    MEDIA_BASE = "/home/jacob/Downloads/"

    DEFAULT_DIR_THUMB = "/img/default_dir_thumb.png"

    DEFAULT_FILE_THUMB = "/img/default_file_thumb.png"

    WEB_BASE = None


class Server(object):
    PORT = 8080
    LAN_IP = "0.0.0.0"


class App(object):
    VALID_FILE_TYPES = [".mp3", ".ogg", ".mp4", ".m4v", ".jpg", ".png", ".mkv"]

if Paths.WEB_BASE is None:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("google.com", 0))
    Server.LAN_IP = str(s.getsockname()[0])
    Paths.WEB_BASE = "http://"+Server.LAN_IP + ":" + str(Server.PORT) + "/media/"