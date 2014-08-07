import tornado
import tornado.ioloop
import tornado.websocket
import tornado.web
import json
from urlparse import parse_qs as qs_decode
import Enums
import Database


class APIRoot(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        print args
        print kwargs


class APIHandler(tornado.web.RequestHandler):

    def get(self, *args):
        self.write(json.dumps(APIHandler.parse_uri_to_action(args, self.request.query)))

    @staticmethod
    def parse_uri_to_action(url, qstring):
        qstring = qs_decode(qstring)
        url_parts = url[0].split("/")
        print url_parts
        print qstring
        print len(url_parts)
        if len(url_parts) > 2:
            # get id
            if len(qstring):
                #filtering

                pass
            else:
                # not filtering

                pass
        else:
            #get all
            if len(qstring) > 0:
                if qstring["media_type"][0] == "audio":

                    return Database.DB.get_music()

            else:
                # not filtering

                return Database.DB.get_all()


def main():
    app = tornado.web.Application([
        (r"/api/?", APIRoot),
        (r"/api/(.+)/?", APIHandler),
        (r"/media/(.*)", tornado.web.StaticFileHandler, {'path': Enums.Paths.MEDIA_BASE}),
        (r"/(.*)", tornado.web.StaticFileHandler, {'path': Enums.Paths.HTML_BASE}),
    ]
    )
    fh = Database.FileHelper(Enums.Paths.MEDIA_BASE)
    fh.filter()

    app.listen(Enums.Server.PORT)
    tornado.ioloop.IOLoop.instance().start()  # This is a blocking operation...

main()