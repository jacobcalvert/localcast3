##############################################################
# Module:       Database
# Author:       Jacob Calvert (jacob+github@jacobncalvert.com)
# Revision:     1.3.1 (major.minor.maint)
# Description:  Contains the media object model, recursive file
# scanner, and collection manager
###############################################################

import os
import uuid
import Enums
import mimetypes


class MediaObject(object):
    """
    class MediaObject -- represents a media object in the subsystem
    """
    def __init__(self, url, title, media_type, icon_src, duration, c_type):
        """
        constructs a media object from the given attributes
        :param url: mapped access url for the media
        :param title: media title
        :param media_type: media type
        :param icon_src: media thumbnail source url
        :param duration: media duration
        :param c_type: media mime-type
        :return: an instance of MediaObject
        """
        self.uuid = str(uuid.uuid4()).replace("-", "")
        if self.uuid[0].isdigit():
            self.uuid = "x" + self.uuid
        self.url = url
        self.title = title
        self.media_type = media_type
        self.icon_src = icon_src
        self.duration = duration
        self.content_type = c_type

    def is_like(self, q):
        """
        determines if this instance of MediaObject matches some part of the parameter 'q'
        this is used for searching
        :param q: query string
        :return: True, if the media object matches, else False
        """
        q = q.lower()
        return q in self.title.lower() or q in self.url.lower() or q in self.media_type.lower()


class DB(object):
    """
    class DB -- static class that stores and categorizes media object based on media type
    all methods return a dictionary where the key is the uuid for the media, and the value
    is the media object represented as a dictionary
    """
    MUSIC = {}
    IMAGES = {}
    VIDEOS = {}
    ALL_FILES = []
    SEARCH_CACHE = {}
    @staticmethod
    def get_music():
        """
        filters all the audio type media and returns it
        :return: dictionary of the audio type media
        """
        music = {}
        for k, v in DB.MUSIC.iteritems():
            music[k] = v.__dict__
        return music

    @staticmethod
    def get_video():
        """
        filters all the video type media and returns it
        :return: dictionary of the video type media
        """
        video = {}
        for k, v in DB.VIDEOS.iteritems():
            video[k] = v.__dict__
        return video

    @staticmethod
    def get_images():
        """
        filters all the image type media and returns it
        :return: dictionary of the image type media
        """
        images = {}
        for k, v in DB.IMAGES.iteritems():
            images[k] = v.__dict__
        return images

    @staticmethod
    def get_all():
        """
        returns all media objects
        :return: dictionary of the media objects
        """
        all = {}
        for k, v in DB.MUSIC.iteritems():
            all[k] = v.__dict__
        for k, v in DB.VIDEOS.iteritems():
            all[k] = v.__dict__
        for k, v in DB.IMAGES.iteritems():
            all[k] = v.__dict__

        return all

    @staticmethod
    def search(q):
        """
        searches all media for a match on 'q'
        :param q: the query parameter
        :return: a dictionary of matched media objects
        """
        if q in DB.SEARCH_CACHE.keys():
            return DB.SEARCH_CACHE[q]
        else:
            DB.SEARCH_CACHE[q] = {}
            for k, v in DB.MUSIC.iteritems():
                if v.is_like(q):
                    DB.SEARCH_CACHE[q][v.uuid] = v.__dict__
            for k, v in DB.VIDEOS.iteritems():
                if v.is_like(q):
                    DB.SEARCH_CACHE[q][v.uuid] = v.__dict__
            for k, v in DB.IMAGES.iteritems():
                if v.is_like(q):
                    DB.SEARCH_CACHE[q][v.uuid] = v.__dict__
            return DB.SEARCH_CACHE[q]


class FileHelper(object):
    """
    class FileHelper -- recursively scans the base media path and cooperates with the DB class object
    to compile a collection of the media objects
    """
    ALL_PATHS = []

    def __init__(self, root):
        """
        builds a list of all paths in and below the given 'root' path
        :param root: root path to begin the recursive scan
        :return: FileHelper instance
        """
        FileHelper.ALL_PATHS = [os.path.join(dp, f) for dp, dn, filenames in os.walk(root) for f in filenames if os.path.splitext(f)[1] in Enums.App.VALID_FILE_TYPES]

    def filter(self):
        """
        iterates through each file in ALL_PATHS and creates a media object from it, then stores it in the DB
        :return: None
        """
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
        """
        takes a filepath f and returns the media type
        :param f: file path
        :return: media type of 'f'
        """
        tipe = mimetypes.guess_type(f)
        if tipe[0]:
            if "image" in tipe[0]:
                return "image"
            elif "video" in tipe[0]:
                return "video"
            elif "audio" in tipe[0]:
                return "audio"
    @staticmethod
    def get_ctype(f):
        """
        takes a file path f and returns the mime type
        :param f: file path
        :return: mime type string
        """
        return mimetypes.guess_type(f)[0]
    @staticmethod
    def get_icon(f):
        """
        takes a filepath f and tries to find album art or cover art for it, or sets a default icon
        :param f: file path
        :return: icon source url
        """

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
        """
        takes a file path f and returns the basename
        :param f: file path
        :return: basename
        """
        return os.path.basename(f)

    @staticmethod
    def get_url(f):
        """
        takes a file path f and returns the media access url
        :param f: file path
        :return: media access url
        """
        return f.replace(Enums.Paths.MEDIA_BASE, Enums.Paths.WEB_BASE)

    @staticmethod
    def get_duration(f):
        """
        takes a file path f and returns 0 !!TO BE IMPLEMETED!!
        :param f: file path
        :return: 0
        """
        return 0
