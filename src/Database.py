import os
import uuid
import Enums
import mimetypes

class MediaObject(object):
    def __init__(self, url, title, media_type, icon_src, duration, c_type):
        self.uuid = str(uuid.uuid4()).replace("-", "")
        if self.uuid[0].isdigit():
            self.uuid = "x" + self.uuid
        self.url = url
        self.title = title
        self.media_type = media_type
        self.icon_src = icon_src
        self.duration = duration
        self.content_type = c_type

class DB(object):
    MUSIC = {}
    IMAGES = {}
    VIDEOS = {}
    ALL_FILES = []

    @staticmethod
    def get_music():
        music = {}
        for k, v in DB.MUSIC.iteritems():
            music[k] = v.__dict__
        return music

    @staticmethod
    def get_all():
        all = {}
        for k, v in DB.MUSIC.iteritems():
            all[k] = v.__dict__
        for k, v in DB.VIDEOS.iteritems():
            all[k] = v.__dict__
        for k, v in DB.IMAGES.iteritems():
            all[k] = v.__dict__

        return all
class FileHelper(object):
    ALL_PATHS = []

    def __init__(self, root):
        FileHelper.ALL_PATHS = [os.path.join(dp, f) for dp, dn, filenames in os.walk(root) for f in filenames if os.path.splitext(f)[1] in Enums.App.VALID_FILE_TYPES]

    def filter(self):
        for f in FileHelper.ALL_PATHS:
            media_obj = MediaObject(FileHelper.get_url(f), FileHelper.get_title(f), FileHelper.get_media_type(f), FileHelper.get_icon(f), FileHelper.get_duration(f), FileHelper.get_ctype(f))
            _id = media_obj.uuid
            if media_obj.media_type == "image":
                DB.IMAGES[_id] = media_obj
            elif media_obj.media_type == "audio":
                DB.MUSIC[_id] = media_obj
            elif media_obj.media_type == "video":
                DB.VIDEOS[_id] = media_obj
            else:
                print "File '%s' doesn't play nice." % (f)
    @staticmethod
    def get_media_type(f):
        tipe = mimetypes.guess_type(f)
        if tipe[0]:
            if "image" in tipe[0]:
                return "image"
            if "video" in tipe[0]:
                return "video"
            if "audio" in tipe[0]:
                return "audio"
    @staticmethod
    def get_ctype(f):
        return mimetypes.guess_type(f)[0]
    @staticmethod
    def get_icon(f):

        url = None
        t = FileHelper.get_media_type(f)
        if t == "audio":
            url = "/img/music.png"
        elif t == "video":
            url = "/img/video.png"
        elif t == "image":
            return FileHelper.get_url(f)
        for fn in os.listdir(os.path.dirname(f)):
            if "album" in fn.lower():
                uri = os.path.join(os.path.dirname(f), fn)
                url = FileHelper.get_url(uri)

        return url

    @staticmethod
    def get_title(f):
        return os.path.basename(f)

    @staticmethod
    def get_url(f):
        return f.replace(Enums.Paths.MEDIA_BASE, Enums.Paths.WEB_BASE)

    @staticmethod
    def get_duration(f):
        return 0
