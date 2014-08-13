##############################################################
# Module:       Enums
# Author:       Jacob Calvert (jacob+github@jacobncalvert.com)
# Revision:     1.5.1 (major.minor.maint)
# Description:  This modules is used like a set of enums in C
# based languages. It contains the definitions for several
# parts of the app and server
###############################################################

import socket


class Paths(object):
    """
    class Paths -- static class object that holds the definitions for paths used by the server and app
    """
    HTML_BASE = "html/"  # web app interface html root
    MEDIA_BASE = "/home/jacob/Downloads/"  # media base directory

    DEFAULT_DIR_THUMB = "/img/default_dir_thumb.png"  # default directory icon (unused)

    DEFAULT_FILE_THUMB = "/img/default_file_thumb.png"  # default file icon (unused)

    WEB_BASE = None  # string containing the full base url of the media


class Server(object):
    """
    class Server -- static class object containing Server definitions
    """
    PORT = 8080  # server port
    LAN_IP = "0.0.0.0"  # default LAN ip, gets


class App(object):
    """
    class App -- static class object that defines stuff about the entire App ???
    """
    VALID_FILE_TYPES = [".mp3", ".ogg", ".mp4", ".m4v", ".jpg", ".png", ".mkv"]  # array of file types that we will scan

if Paths.WEB_BASE is None:
    """
    When this module is loaded, check to see if we have guessed at the Server.LAN_IP variable. If not
    try that here by connecting to google and getting our response LAN IP. Use that to construct our
    Paths.WEB_BASE variable
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("google.com", 0))
    Server.LAN_IP = str(s.getsockname()[0])
    Paths.WEB_BASE = "http://"+Server.LAN_IP + ":" + str(Server.PORT) + "/media/"