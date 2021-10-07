import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote
import utils
import articles
import sounds
import ServerController
import dictionary
import Search
import translator
import text_align
import security
import time
from functools import wraps


def timing(f):
    @wraps(f)
    def wrap(*args, **kw):
        ts = time.time()
        result = f(*args, **kw)
        te = time.time()
        print('func:%r args:[%r, %r] took: %2.4f sec' % \
          (f.__name__, args, kw, te-ts))
        return result
    return wrap

soundCol = sounds.SoundCollection()
controller = ServerController.ServerController("main")
#dictionaries = [yo_dictionary.Dictionary(utils.langs[i]) for i in range(len(utils.langs))]
#dictionaries = [yo_dictionary.Dictionary(utils.langs[i]) for i in [4]]
search = Search.Search()
dictionaries = []
aligners = []
CNST = 20000

for i in range(len(utils.langs)):
    if i == 0 or i == 7 or i == 4:
        dictionaries.append(dictionary.Dictionary(utils.langs[i]))
    else:
        dictionaries.append(None)
    if i == 7 or i == 4:
        aligners.append(text_align.Aligner(utils.langs[i], dictionaries[i], dictionaries[0]))
    else:
        aligners.append(None)

from datetime import date




class PageHandlerClass1(BaseHTTPRequestHandler):
    chars_today = 0
    max_chars_today = 100000
    today = date.today()
    day = today.strftime("%d/%m/%Y")
    CNST = 10000

    def set_CNTS(self, lang):
        if lang == "ru":
            self.CNST = 20000
        else:
            self.CNST = 10000

    def _set_headers(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        #self.send_header('Access-Control-Allow-Credentials', 'true')
        #self.send_header('Access-Control-Allow-Origin', 'http://174.138.15.163')
        self.send_header('Access-Control-Allow-Origin', '*')
        #self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        #self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
        self.end_headers()

    def generic_handler(self):
        data, idd, ttt, abuse = security.write_request(self)

        #self.request.settimeout(3)
        url = unquote(self.requestline)
        url = url.replace(" ", "?")
        url = url.replace("989", " ")
        parts = url.split("?")

        if parts is None or abuse:
            security.answer_request(idd, "Abuse", ttt)
            encoded = bytes("Hi", "utf8")
            self.wfile.write(encoded)
            return

        if len(parts) != 4:
            print("Ignored request", parts)
            self._set_headers()
            encoded = bytes("Hi", "utf8")
            self.wfile.write(encoded)
            return

        if len(parts) == 4:
            print("Accepted request", parts)

            page = parts[1]
            args = utils.make_args(parts[2])

            level = None
            if ("login" in args) and ("password" in args):
                level = security.authorize(args["login"], args["password"])

            if page == "/api/article":
                self.set_CNTS(args["lang"])

                pulled_article = articles.pull_article(args)
                head = dictionaries[utils.reverse_index(args["lang"])].get_article_head(args["word"])
                all = head+pulled_article
                all = dictionaries[utils.reverse_index(args["lang"])].manage_article(all, args["word"])

                if level is None or level < 1:
                    html = dictionaries[utils.reverse_index(args["lang"])].convert(all, "full", True, None, dictionaries[0], self.CNST, False, args["word"])
                else:
                    html = dictionaries[utils.reverse_index(args["lang"])].convert(all, "full", True, None, dictionaries[0], 1000000000, False, args["word"])

                encoded = bytes(html, "utf8")
                security.answer_request(idd, html, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return

            if page == "/api/sound/lis":
                res = sounds.get_ids(soundCol, args)
                encoded = bytes(res, "utf8")
                security.answer_request(idd, res, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return

            if page == "/api/register":
                login = args["login"]
                password = args["password"]
                key = args["key"]
                success = security.register(login, password, key)
                encoded = bytes(success, "utf8")
                security.answer_request(idd, success, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return

            if page == "/api/authorize":
                login = args["login"]
                password = args["password"]
                res = str(security.authorize(login, password))
                encoded = bytes(res, "utf8")
                security.answer_request(idd, res, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return

            if page == "/api/search":
                pulled_search = ""
                if args["type"] == "word":
                    pulled_search = search.do_search(args["word"], args["lang"], native_lang=args["native"], lim = 100000000)
                if args["type"] == "distance":
                    pulled_search = search.distance_search(args["word"], args["lang"])
                html = dictionaries[utils.reverse_index(args["lang"])].convert(pulled_search, 'full', hs=False)
                #html = pulled_search
                encoded = bytes(html, "utf8")
                security.answer_request(idd, html, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return


            if page == "/api/encrypt":
                val = args["text"]
                res = security.encrypt(val)
                encoded = bytes(res, "utf8")
                security.answer_request(idd, res, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return

            if page == "/api/decrypt":
                #val = args["text"]
                val = parts[2][5:]
                res = security.decrypt(val)
                encoded = bytes(res, "utf8")
                security.answer_request(idd, res, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return


            if page == "/api/vocabtest":
                vocab_thing = utils.make_vocab_question(dictionaries[utils.reverse_index(args["lang"])], search, args["lang"], args["native"], int(args["freq"]))
                #vocab_thing[1] = vocab_thing[1].replace(',', ';')
                res = vocab_thing[0]+"^"+",".join(vocab_thing[1])+"^"+str(vocab_thing[2])
                encoded = bytes(res, "utf8")
                security.answer_request(idd, res, ttt)
                self._set_headers()
                self.wfile.write(encoded)
                return



        print("Exception", parts)


    def do_GET(self):
        self.generic_handler()


    def do_POST(self):
        try:
            data, idd, ttt, abuse = security.write_request(self)

            url = unquote(self.requestline)
            url = url.replace(" ", "?")
            parts = url.split("?")

            if parts is None or abuse:
                encoded = bytes("Hi", "utf8")
                self.wfile.write(encoded)
                return

            if len(parts) == 4:
                #print("Accepted request", parts)

                page = parts[1]
                args = utils.make_args(parts[2])

                level = None
                if ("login" in args) and ("password" in args):
                    level = security.authorize(args["login"], args["password"])

                if page == "/api/linkify":
                    content_length = len(data)
                    self.set_CNTS(args["lang"])

                    if content_length < 10000:
                        decoded = data

                        aligner = None
                        if args["align"] == "1":
                            aligner = aligners[utils.reverse_index(args["lang"])]

                        if not (aligner is None):
                            if level is None or level < 2:
                                encoded = bytes("Not enough rights for this action", "utf8")
                                security.answer_request(idd, "Not enough rights for this action", ttt)
                                self._set_headers()
                                self.wfile.write(encoded)
                                return

                        #print("Data", decoded)


                        if level is None or level < 1:
                            html = dictionaries[utils.reverse_index(args["lang"])].convert(decoded, "short", False, aligner, None, self.CNST)
                        else:
                            html = dictionaries[utils.reverse_index(args["lang"])].convert(decoded, "short", False, aligner, None)

                        encoded = bytes(html, "utf8")

                        security.answer_request(idd, html, ttt)
                        self._set_headers()
                        self.wfile.write(encoded)
                        return
                    else:
                        encoded = bytes("Error: the text is too large", "utf8")
                        security.answer_request(idd, "Error: the text is too large", ttt)
                        self._set_headers()
                        self.wfile.write(encoded)

                if page == "/api/trans":
                    if level is None or level < 2:
                        encoded = bytes("Not enough rights for this action", "utf8")
                        security.answer_request(idd, "Not enough rights for this action", ttt)
                        self._set_headers()
                        self.wfile.write(encoded)
                        return

                    content_length = len(data)
                    decoded = data

                    today2 = date.today()
                    day2 = today2.strftime("%d/%m/%Y")

                    if day2 != self.day:
                        self.chars_today = 0

                    PageHandlerClass1.chars_today += content_length

                    if PageHandlerClass1.chars_today > PageHandlerClass1.max_chars_today:
                        encoded = bytes("Error: daily translation limit is exceeded", "utf8")
                        security.answer_request(idd, "Error: daily translation limit is exceeded", ttt)
                        self._set_headers()
                        self.wfile.write(encoded)
                        return

                    if content_length < 3000:
                        inn = [decoded]
                        #input = translator.sent_tokenize(args["lang"])
                        res = translator.do_translate(inn, args["lang"], "en")[0]
                        html = res
                        encoded = bytes(html, "utf8")
                        security.answer_request(idd, html, ttt)
                        self._set_headers()
                        self.wfile.write(encoded)
                    else:
                        encoded = bytes("Error: the text is too large", "utf8")
                        security.answer_request(idd, "Error: the text is too large", ttt)
                        self._set_headers()
                        self.wfile.write(encoded)
                    return

            if len(parts) != 4:
                #print("Ignored request", parts)
                self._set_headers()
                encoded = bytes("Hi", "utf8")
                self.wfile.write(encoded)
                return

        except BaseException as e:
           print("Exception", e)

"""
for i in range(100):
    vc = utils.make_vocab_question(dictionaries[7], search, "nl", "ru", 50)
print(vc)
"""