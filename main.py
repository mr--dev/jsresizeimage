import tornado.ioloop
import tornado.options
import tornado.web
import base64
import os
import config

class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render("index.html")
    
    def post(self):
        filename = self.get_argument('filename').split(".")[0]+".jpg"
        img = self.get_argument('img')
        file_path = os.path.join(config.upload_path, filename)
        f = open(file_path, 'wb')
        img = img.replace("data:image/jpeg;base64,", "")
        f.write(base64.b64decode(img))
        f.close()
        file_size = os.path.getsize(file_path)/1024
        
        self.write(tornado.escape.json_encode({
            'msg': 'OK', 
            'file_size': file_size,
        }))

application = tornado.web.Application([
        (r"/static/(.*)", tornado.web.StaticFileHandler, dict(path=config.static_path)),
        (r"/(favicon.ico)", tornado.web.StaticFileHandler, dict(path=config.static_path)),
        (r"/", MainHandler),
    ],
    autoescape=None,
    debug=True,
)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    application.listen(config.port, max_buffer_size=config.max_buffer_size)
    tornado.ioloop.IOLoop.instance().start()
    tornado.autoreload.wait()
