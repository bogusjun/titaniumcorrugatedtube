"""JPEG 메타데이터 무손실 정리: EXIF는 Orientation만 남기고, XMP(APP1)·IPTC(APP13)·주석(COM)은 지운다.
압축 데이터(DQT/DHT/SOF/SOS 이후)는 바이트 그대로 복사하므로 화질 변화가 없다.

휴대폰 사진에는 촬영 위치(GPS)가 들어 있다. public/ 에 사진을 넣기 전에 돌린다(파일을 그 자리에서 고침).
    pip install pillow
    python3 scripts/strip-image-metadata.py public/images/products/새사진.jpg
    find public/images -iname '*.jpg' -exec python3 scripts/strip-image-metadata.py {} +
확인: `file 사진.jpg` 출력에 GPS 가 없어야 한다. 2026-11-04 에 기존 사진 30장을 이 방법으로 정리했다.
동영상(mp4)의 촬영 좌표는 ffmpeg 로: ffmpeg -i in.mp4 -map_metadata -1 -c copy out.mp4
"""
import sys, struct, io
from PIL import Image

def minimal_exif(orientation):
    e = Image.Exif(); e[0x0112] = orientation
    return e.tobytes()  # b"Exif\0\0" + TIFF

def strip(path):
    data = open(path, "rb").read()
    if data[:2] != b"\xff\xd8":
        return None, 0, ["NOT-JPEG"], len(data)
    try:
        orientation = Image.open(io.BytesIO(data)).getexif().get(0x0112, 1)
    except Exception:
        orientation = 1
    out = bytearray(b"\xff\xd8"); i = 2; removed = []
    exif_written = False
    while i < len(data):
        if data[i] != 0xFF: raise ValueError(f"bad marker at {i}")
        marker = data[i + 1]
        if marker == 0xFF: i += 1; continue  # fill byte
        if marker == 0xDA:  # SOS: 나머지 전부 그대로
            out += data[i:]; break
        if 0xD0 <= marker <= 0xD7 or marker == 0x01:
            out += data[i:i + 2]; i += 2; continue
        seglen = struct.unpack(">H", data[i + 2:i + 4])[0]
        seg = data[i:i + 2 + seglen]; payload = seg[4:]
        if marker == 0xE1 and payload.startswith(b"Exif\x00\x00"):
            removed.append("EXIF")
            if orientation != 1 and not exif_written:
                body = minimal_exif(orientation)
                out += b"\xff\xe1" + struct.pack(">H", len(body) + 2) + body
                exif_written = True
        elif marker == 0xE1:
            removed.append("XMP/APP1")
        elif marker in (0xED, 0xFE):
            removed.append("APP13" if marker == 0xED else "COM")
        else:
            out += seg
        i += 2 + seglen
    return bytes(out), orientation, removed, len(data)

if __name__ == "__main__":
    for p in sys.argv[1:]:
        new, orient, removed, oldsize = strip(p)
        if new is None:
            print(f"{p}\tSKIP not a JPEG"); continue
        if not removed:
            continue
        open(p, "wb").write(new)
        print(f"{p}\torient={orient}\tremoved={','.join(removed)}\t{oldsize}->{len(new)}")
