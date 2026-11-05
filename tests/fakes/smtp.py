"""시험용 SMTP 받기 서버 — 받은 메일의 Subject 를 한 줄씩 파일에 적는다 (실제로 보내지 않음)

견적 폼(스팸 의심 제목 등)·주문 메일 제목을 로컬에서 확인할 때 쓴다.
    python3 tests/fakes/smtp.py 2525 /tmp/mails.txt &
    SMTP_HOST=127.0.0.1 SMTP_PORT=2525 SMTP_USER=test@example.com SMTP_PASS=x npm run dev
    → 폼을 보낸 뒤 cat /tmp/mails.txt
AUTH 는 무엇이든 통과시킨다. 운영 코드가 아니다.
"""
import socket, threading, sys, email
from email.header import decode_header, make_header
PORT, OUT = int(sys.argv[1]), sys.argv[2]
def handle(c):
    f = c.makefile("rb")
    def send(x): c.sendall((x + "\r\n").encode())
    send("220 sink ESMTP")
    while True:
        line = f.readline()
        if not line: break
        cmd = line.decode(errors="replace").strip(); up = cmd.upper()
        if up.startswith(("EHLO", "HELO")):
            c.sendall(b"250-sink\r\n250-AUTH PLAIN LOGIN\r\n250 8BITMIME\r\n")
        elif up.startswith("AUTH PLAIN"):
            if len(cmd.split()) == 2: send("334 "); f.readline()
            send("235 ok")
        elif up.startswith("AUTH LOGIN"):
            send("334 VXNlcm5hbWU6"); f.readline(); send("334 UGFzc3dvcmQ6"); f.readline(); send("235 ok")
        elif up == "DATA":
            send("354 go"); buf = b""
            while True:
                l = f.readline()
                if l in (b".\r\n", b".\n", b""): break
                buf += l
            msg = email.message_from_bytes(buf)
            subj = str(make_header(decode_header(msg.get("Subject", ""))))
            open(OUT, "a", encoding="utf-8").write(subj + "\n")
            send("250 queued")
        elif up == "QUIT":
            send("221 bye"); break
        else:
            send("250 ok")
    c.close()
s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1); s.bind(("127.0.0.1", PORT)); s.listen()
while True:
    conn, _ = s.accept(); threading.Thread(target=handle, args=(conn,), daemon=True).start()
