#!/usr/bin/env python3
"""Set every ?v= cache-busting hash in index.html to its file's current
content hash (first 8 hex digits of the MD5), so browsers refetch changed
assets. Run after editing any asset: python3 scripts/bump_versions.py"""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
index = ROOT / "index.html"
html = index.read_text()


def bump(m):
    path = ROOT / m.group(1)
    if not path.is_file():
        return m.group(0)
    return f"{m.group(1)}?v={hashlib.md5(path.read_bytes()).hexdigest()[:8]}"


new = re.sub(r"((?:assets|data)/[\w./-]+)\?v=[0-9a-f]+", bump, html)
if new != html:
    index.write_text(new)
print("\n".join(re.findall(r"(?:assets|data)/[\w./-]+\?v=[0-9a-f]+", new)))
