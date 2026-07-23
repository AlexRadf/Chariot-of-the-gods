#!/usr/bin/env python3
"""Generate per-crew access-card QR codes for the USCSS Cronus terminal.

Each code encodes the Pages site URL with the crew member's ?id= parameter,
matching the card IDs baked into index.html (CREW_DATA).

Usage:
    python3 scripts/generate_qr.py                 # default Pages URL
    python3 scripts/generate_qr.py https://cronus.example.com/

Outputs:
    qr/<slug>-<id>.png     high-contrast raster code (for quick use)
    qr/<slug>-<id>.svg     vector code (crisp at any print size)
    cards/access-cards.html   print-ready sheet of all nine cards

Requires: segno  (pip install segno)
"""
import io
import os
import sys

import segno

# Default GitHub Pages project URL for this repo. Override via argv[1].
DEFAULT_BASE = "https://alexradf.github.io/Chariot-of-the-gods/"

# id, slug, name, role, clearance  — mirrors CREW_DATA in index.html
CREW = [
    ("1987", "johns",    "A. JOHNS",    "SECOND OFFICER",     "COMMAND"),
    ("2654", "reid",     "V. REID",     "SECURITY OFFICER",   "SECURITY"),
    ("3321", "flynn",    "L. FLYNN",    "SHIP MEDIC",         "MEDICAL"),
    ("4987", "cooper",   "D. COOPER",   "CHIEF SCIENTIST",    "SCIENCE"),
    ("5654", "ava",      "AVA 6",       "SYNTHETIC",          "SPECIAL"),
    ("6321", "walker",   "R. WALKER",   "CAPTAIN",            "COMMAND"),
    ("7987", "tenwick",  "E. TENWICK",  "RESEARCH SCIENTIST", "SCIENCE"),
    ("8654", "reynolds", "C. REYNOLDS", "CHIEF OF SECURITY",  "SECURITY"),
    ("9321", "clayton",  "L. CLAYTON",  "CORPORATE LIAISON",  "WY-EXEC"),
]

# High contrast for reliable scanning, with a faint phosphor tint.
DARK = "#0a0f0c"
LIGHT = "#e9fff1"

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QR_DIR = os.path.join(HERE, "qr")
CARDS_DIR = os.path.join(HERE, "cards")


def crew_url(base, cid):
    return base.rstrip("/") + "/?id=" + cid


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def main():
    base = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_BASE
    os.makedirs(QR_DIR, exist_ok=True)
    os.makedirs(CARDS_DIR, exist_ok=True)

    cards_html = []
    for cid, slug, name, role, clearance in CREW:
        url = crew_url(base, cid)
        qr = segno.make(url, error="m")
        stem = os.path.join(QR_DIR, f"{slug}-{cid}")

        qr.save(stem + ".png", scale=10, border=4, dark=DARK, light=LIGHT)
        qr.save(stem + ".svg", scale=10, border=4, dark=DARK, light=LIGHT)

        buff = io.BytesIO()
        qr.save(buff, kind="svg", scale=4, border=2, dark=DARK, light=LIGHT,
                xmldecl=False, svgns=True, svgclass=None, lineclass=None)
        inline_svg = buff.getvalue().decode("utf-8")

        cards_html.append(f"""    <div class="card">
      <div class="ct">
        <div class="ship">USCSS CRONUS &middot; PERSONAL ACCESS CARD</div>
        <div class="name">{esc(name)}</div>
        <div class="role">{esc(role)}</div>
      </div>
      <div class="qr">{inline_svg}</div>
      <div class="cb">
        <span>CLEARANCE: <b>{esc(clearance)}</b></span>
        <span>ID {esc(cid)}</span>
      </div>
    </div>""")
        print(f"  {name:<14} id={cid}  ->  {url}")

    write_cards_sheet(base, cards_html)
    print(f"\nDone. {len(CREW)} codes in qr/, sheet at cards/access-cards.html")
    print(f"Base URL: {base}")


def write_cards_sheet(base, cards_html):
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>USCSS CRONUS — Access Cards</title>
<style>
  :root {{ --phos:#8affb0; --dim:#3d7a53; --faint:#1d3b2a; --crt:#040906; --amber:#f0b23e; }}
  * {{ box-sizing:border-box; margin:0; padding:0; }}
  body {{ background:var(--crt); color:var(--phos);
    font-family:'Share Tech Mono',ui-monospace,monospace; padding:24px; }}
  .lead {{ max-width:60ch; margin:0 auto 20px; font-size:13px; color:var(--dim);
    line-height:1.5; text-align:center; }}
  .lead b {{ color:var(--phos); font-weight:400; }}
  .sheet {{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px;
    max-width:900px; margin:0 auto; }}
  .card {{ border:1px solid var(--faint); background:#081209;
    display:flex; flex-direction:column; }}
  .ct {{ padding:10px 12px 8px; border-bottom:1px solid var(--faint); }}
  .ship {{ font-size:9px; letter-spacing:.08em; color:var(--dim);
    text-transform:uppercase; }}
  .name {{ font-size:20px; margin-top:4px; }}
  .role {{ font-size:11px; color:var(--dim); text-transform:uppercase;
    letter-spacing:.06em; }}
  .qr {{ padding:12px; display:flex; justify-content:center; align-items:center; }}
  .qr svg {{ width:150px; height:150px; display:block; }}
  .cb {{ display:flex; justify-content:space-between; gap:8px;
    padding:8px 12px 10px; font-size:11px; color:var(--dim);
    border-top:1px solid var(--faint); text-transform:uppercase;
    letter-spacing:.05em; }}
  .cb b {{ color:var(--amber); font-weight:400; }}
  @media print {{
    body {{ background:#fff; color:#000; }}
    .lead {{ display:none; }}
    .card {{ background:#fff; border-color:#000; break-inside:avoid; }}
    .ship,.role,.cb {{ color:#333; }}
    .cb b {{ color:#000; }}
  }}
</style>
</head>
<body>
  <p class="lead">Cut out and hand to players. Each card scans to its crew
  member's private terminal on the <b>USCSS Cronus</b>. Codes point at
  <b>{esc(base)}</b> — regenerate with <b>scripts/generate_qr.py</b> if the
  site URL changes.</p>
  <div class="sheet">
{chr(10).join(cards_html)}
  </div>
</body>
</html>
"""
    with open(os.path.join(CARDS_DIR, "access-cards.html"), "w") as f:
        f.write(html)


if __name__ == "__main__":
    main()
