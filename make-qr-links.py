#!/usr/bin/env python3
"""Print the signed QR link for each table.  Usage: python3 make-qr-links.py 1 2 3 A3   (or: 1-20)
TABLE_SECRET must match the one in index.html. Not needed on the website, keep it locally."""
import sys
BASE = "https://joe0mran.github.io/Amori-Menu/"
TABLE_SECRET = "amori-7f3k9q2x"

def key(table):
    h = 0x811c9dc5
    for ch in TABLE_SECRET + "|" + table:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    s = ""
    while h: h, r = divmod(h, 36); s = "0123456789abcdefghijklmnopqrstuvwxyz"[r] + s
    return (s or "0").rjust(5, "0")[-5:]

tables = []
for a in sys.argv[1:]:
    if "-" in a and a.replace("-", "").isdigit():
        lo, hi = map(int, a.split("-")); tables += [str(n) for n in range(lo, hi + 1)]
    else: tables.append(a.upper())
for t in tables: print(f"{t}\t{BASE}?table={t}&k={key(t)}")
