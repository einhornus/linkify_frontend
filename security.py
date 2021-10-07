import sqlite3
import hashlib
import time
from urllib.parse import unquote
from datetime import date
import random
from cryptography.fernet import Fernet

SALT = "Ziemo"
KEYS1 = ["wat5Vl10mw", "gRdr6OhuJG", "SjfAUdxQYH", "CT7HceQn2a", "jOYNSdCSW1", "SWXYMLLgxa", "Kz3Wt8XuWf", "g3ZAa6ETin", "BfToqFrTpe", "qgmyGiMHkj"]
KEYS2 = ["NqkGkGyt50", "HraC4vJr2p", "4KBGbGKfjT", "8W3uQxC86J", "PSTANVYT0h", "VR0ibTmrzT", "R38nUtuX6K", "YeVuQCt8CM", "O9ccRIdIGN", "1hkHmlMPMu"]
KEYS3 = ["zV7e8TaAPK", "iHATSZofLb", "nWhZL14yX4", "3cHkpjL4aW", "EBZFO8fKHB", "BPThhcI7Eo", "LphRrYp9Tg", "HDTiRpBkEn", "NQR8TeKWrS", "Ojgn43DQ02"]

#lsss = time.time()
ip_activity = {}
abuselist = set()

valid_pairs = {}

do_log = False
do_text_lot = True

text_log_req = []
text_log_ans = []
text_log_freq = 1

prefix_encrypted = 'encrypted___'

def register(login, password, key):
    my_level = 0
    if key in KEYS1:
        my_level = 1

    if key in KEYS2:
        my_level = 2

    if key in KEYS3:
        my_level = 3

    if my_level == 0:
        return "-1"

    conn = sqlite3.connect('data//mt.db')
    c = conn.cursor()

    c.execute("SELECT * from users WHERE login = ?", (login,))
    records = c.fetchall()

    found = "1"

    if len(records) == 0:
        hashed_pas = hashlib.md5((password + SALT).encode("utf8")).hexdigest()
        c.execute("INSERT INTO users (login, password, active) VALUES (?, ?, ?)",
                  (login, hashed_pas, my_level))
        found = "0"

    conn.commit()
    conn.close()

    return found

def authorize(login, password):
    """
    if login+"+"+password in valid_pairs:
        return valid_pairs[]
    """

    conn = sqlite3.connect('data//mt.db')
    c = conn.cursor()

    found = None

    hashed_pas = hashlib.md5((password + SALT).encode("utf8")).hexdigest()
    c.execute("SELECT id, active from users WHERE login = ? and password = ?", (login, hashed_pas))
    d = c.fetchall()
    if len(d) == 1:
        for rec in d:
            found = rec[1]

    conn.commit()
    conn.close()

    """
    if not(found is None):
        valid_pairs[login+"+"+password] = found
    """

    return found

def register_ip(ip, l, t):
    if ip in abuselist:
        return True

    if not ip in ip_activity:
        ip_activity[ip] = []
    ip_activity[ip].append((l, t))

    total_last_hour = 0
    total_last_minute = 0
    reqs_last_hour = 0
    reqs_last_minute = 0

    for i in range(len(ip_activity[ip])):
        past_l, past_t = ip_activity[ip][i]
        time_diff = t - past_t
        if time_diff < 60*60:
            total_last_hour += time_diff
            reqs_last_hour += 1
        if time_diff < 60:
            total_last_minute += time_diff
            reqs_last_minute += 1

    added = False

    #print(ip, total_last_hour, total_last_minute, reqs_last_hour, reqs_last_minute)

    if total_last_hour > 4000000 or total_last_minute > 200000:
        print("Added IP to abuselist", ip, ":total:", total_last_hour, total_last_minute)
        added = True
        abuselist.add(ip)

    if reqs_last_hour > 3000 or reqs_last_minute > 200:
        print("Added IP to abuselist", ip, ":number:", reqs_last_hour, reqs_last_minute)
        added = True
        abuselist.add(ip)

    if added:
        with open("data//abuse.txt", mode='w', encoding='utf-8') as f:
            lst = list(abuselist)
            sss = "\n".join(lst)
            f.write(sss)

    res = ip in abuselist

    if len(ip_activity) > 1000:
        ip_activity.clear()

    return res


def write_request(handler):
    type = 0
    if handler.command == "POST":
        type = 1
    ip = str(handler.client_address[0])+":"+str(handler.client_address[1])
    s = unquote(handler.requestline)

    if "password=" in s:
        begin = s[0:s.index("password=")]
        rest = s[s.index("password=") + len("password="):]
        ns = begin+"password="

        ended = False
        for i in range(len(rest)):
            if rest[i] == ' ' or rest[i] == '&':
                ended = True
            if ended:
                ns += rest[i]
            else:
                ns += '*'
        s = ns
    data = ""
    t = time.time()

    if type == 1:
        content_length = int(handler.headers['Content-Length'])

        if content_length > 10000 and not("POST /api/send_audio" in s):
            data = ""
        else:
            post_data = handler.rfile.read(content_length)

            if ("POST /api/send_audio" in s):
                data = post_data
            else:
                data = post_data.decode("utf8")
                data = data.replace("\n", "<br>")

    if ("POST /api/send_audio" in s):
        abusive = register_ip(handler.client_address[0], len(data)//10+len(s), t)
    else:
        abusive = register_ip(handler.client_address[0], len(data)+len(s), t)


    rs = random.randint(0, 10000000000000)
    if do_log:
        conn = sqlite3.connect('data//mt.db')
        c = conn.cursor()
        c.execute("INSERT INTO requests (type, timestamp, url, ip, data) VALUES (?, ?, ?, ?, ?)",
                  (type, t, s, ip, data))

        rs = c.lastrowid
        conn.commit()
        conn.close()

    if do_text_lot:
        text_log_req.append(str(rs)+" "+str(type)+";"+str(t)+";"+str(s)+";"+str(ip)+";"+str(len(data))+"\n")

        if len(text_log_req) >= text_log_freq:
            with open("data//log_requests.txt", mode='a', encoding='utf-8') as f:
                lst = list(text_log_req)
                sss = "".join(lst)
                f.write(sss)
            text_log_req.clear()

    return data, rs, t, abusive, str(handler.client_address[0])



def answer_request(id, answer, initial_time):
    current_time = time.time()
    diff = current_time - initial_time

    if do_log:
        conn = sqlite3.connect('data//mt.db')
        c = conn.cursor()
        c.execute("INSERT INTO answers (id, time, result) VALUES (?, ?, ?)",
                  (id, diff, answer))
        conn.commit()
        conn.close()

    if do_text_lot:
        """
        nnss = str(answer)
        if len(nnss) > 20:
            nnss = nnss[0:99]
        """

        text_log_ans.append(str(id)+";"+str(diff)+";"+str(current_time)+"\n")

        if len(text_log_ans) >= text_log_freq:
            with open("data//log_answers.txt", mode='a', encoding='utf-8') as f:
                lst = list(text_log_ans)
                sss = "".join(lst)
                f.write(sss)
            text_log_ans.clear()

def encrypt(text):
    key = bytes("NMgBKTKmc-asKUznbbql8gAeHe-x7SCMvR4W8e7OOCs=", "utf8")
    cipher_suite = Fernet(key)
    ciphered_text = cipher_suite.encrypt(bytes(text, "utf8")).decode("utf8")
    ciphered_text = prefix_encrypted+ciphered_text
    return ciphered_text

def decrypt(text):
    if prefix_encrypted in text:
        if text.index(prefix_encrypted) == 0:
            text = text[len(prefix_encrypted):]
    else:
        raise Exception()

    key = bytes("NMgBKTKmc-asKUznbbql8gAeHe-x7SCMvR4W8e7OOCs=", "utf8")
    cipher_suite = Fernet(key)
    ciphered_text = text.encode("utf8")
    unciphered_text = (cipher_suite.decrypt(ciphered_text))
    unciphered_text = unciphered_text.decode("utf8")
    return unciphered_text
