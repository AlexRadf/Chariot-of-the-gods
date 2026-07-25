# USCSS CRONUS — Personal Access Terminal

A single-file, in-fiction computer terminal you host on the web and hand to
your players as a prop for the **ALIEN RPG** cinematic scenario *Chariot of the
Gods*. A player scans a crew access card — a QR code or a link carrying an
`?id=` parameter — and the screen boots up logged in as that crew member,
showing their private inbox and whatever ship systems their security clearance
unlocks.

Everything lives in one file, [`index.html`](index.html): no build step, no
dependencies, no server-side code, no database. You host it as a static
**GitHub Pages** site and it just runs in any modern browser, phone or laptop.

> **Spoiler warning for Game Mothers.** The terminal contains the Cronus
> crew's final messages, the corporate directives behind the mission, and the
> ship's security state — i.e. most of the scenario's mysteries. Read it before
> your session; hand cards to players only when you want them to have the
> information.

---

## What it's for

*Chariot of the Gods* opens with the players' towing ship intercepting a
derelict — the **USCSS Cronus**, whose crew went into hypersleep decades ago and
never came home. This prop is the diegetic way to hand the Cronus's story to
your table: instead of you reading backstory aloud, players **find and read it
themselves** on a working terminal, in the dead crew's own words.

Because access is keyed to individual crew cards, you control *who learns what
and when*:

- Give a player the **Reynolds** card and they get Security's deck-by-deck
  survey of what's damaged, sealed, or moving in the vents.
- Give another the **Clayton** card and they read the Company's *eyes-only*
  orders — and learn the crew were expendable.
- Hand out cards one at a time as the party physically reaches consoles, and the
  truth assembles across the group instead of arriving in one lump.

Each card is a self-contained slice of the mystery, so the prop doubles as
pacing tool and as a reason for players to explore the ship.

---

## How it works

The whole terminal is driven by the `?id=` on the URL:

```
https://alexradf.github.io/Chariot-of-the-gods/?id=8654
                                                └─ C. Reynolds, Chief of Security
```

1. **Boot.** A period-styled boot log types out (skippable, and skipped
   automatically for players who prefer reduced motion), then the terminal
   "reads the card."
2. **Identity.** The `id` is looked up in the crew manifest. A **known** id logs
   that crew member in; an **unknown or missing** id shows the in-fiction
   `ACCESS DENIED` screen — that's correct behaviour, not a bug, so the bare
   site URL is safe to share.
3. **Mail + clearance modules.** Every crew member sees their **MAIL** inbox.
   Alongside it are four clearance-gated system tabs. A tab only opens if the
   card's clearance matches; otherwise it reads `ACCESS RESTRICTED`. This is how
   different cards reveal different material:

   | Clearance  | Extra module unlocked                          | Carried by            |
   |------------|------------------------------------------------|-----------------------|
   | `COMMAND`  | **COMMAND** — flight recorders & MU/TH/UR logs | A. Johns, R. Walker   |
   | `SECURITY` | **SECURITY** — interactive deck maps A–D       | V. Reid, C. Reynolds  |
   | `SCIENCE`  | **SCIENCE** — LV-1113 research archive         | D. Cooper, E. Tenwick |
   | `WY-EXEC`  | **COMPANY** — Weyland Special Projects files   | L. Clayton            |
   | `MEDICAL`  | *(mail only)*                                  | L. Flynn              |
   | `SPECIAL`  | *(mail only)*                                  | Ava 6                 |

   The **SECURITY** module is the showpiece: a clickable ship schematic with
   isometric and flat-plan views of all four decks, every compartment
   colour-coded (secure / caution / compromised / offline) with a tap-to-read
   security note.

The CRT look — scanlines, glow, flicker, amber warnings — is pure CSS, and all
motion is disabled for visitors whose browser requests reduced motion. On a
phone the mail list and reader swap places; on a desktop they sit side by side.

---

## Repository layout

| Path | What it is |
|------|------------|
| [`index.html`](index.html) | The crew access terminal — markup, styling, story data, and logic in one file. |
| [`display/`](display/) | The **MU/TH/UR 6500 main display** — an ambient bridge screen for an iPad on the table. |
| [`tracker/`](tracker/) | The **M314 motion tracker** — a mobile scope with a synthesized proximity ping. |
| [`qr/`](qr/) | Per-crew access-card QR codes, PNG **and** SVG (e.g. `qr/reynolds-8654.png`). |
| [`cards/access-cards.html`](cards/access-cards.html) | Print-ready sheet of all nine cards. |
| [`scripts/generate_qr.py`](scripts/generate_qr.py) | Regenerates the codes and card sheet for any site URL. |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Builds and publishes the Pages site on every push. |
| `.nojekyll` | Tells Pages to serve the files as-is instead of running Jekyll. |

---

## Quick start (Game Mother)

1. **Publish the site.** Enable GitHub Pages (see below) and wait for the first
   deploy to finish.
2. **Sanity-check it.** Open the site with no parameter — you should get
   `ACCESS DENIED`. Then open `…/?id=8654` — you should boot in as Reynolds with
   the SECURITY tab live.
3. **Prep the cards.** Open [`cards/access-cards.html`](cards/access-cards.html)
   and print it (it switches to black-on-white for the printer), or just share
   the per-crew links directly.
4. **Run it.** Hand out cards as the party reaches terminals. Let them read.

### Enabling GitHub Pages

The included workflow does the publishing; you just point Pages at it once:

1. Repo **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to the deployment branch, or run the workflow from the **Actions** tab.
   The live URL appears in the workflow summary and under **Settings → Pages**
   once the first run finishes (allow a few minutes).

---

## Table displays

Two extra screens turn the site into a set-dressing kit for the table. Both are
self-contained pages under the same site, and both open with a **tap to
activate** panel — that first tap is what lets iOS play sound and go
full-screen, so tap once and hand the device over.

### Main display — MU/TH/UR 6500 (iPad, landscape)

```
https://alexradf.github.io/Chariot-of-the-gods/display/
```

Leave it running in the middle of the table as the crew's own ship computer.
It shows the **USCSS Montero's** live systems (reactor, life support, hull,
O₂, the disengaged displacement drive, the hypersleep bank), a long-range
proximity scan sweeping over the derelict **Cronus**, the inbound distress
beacon decoding line by line, a ticking stardate, and a MU/TH/UR command ticker
— with a low reactor hum underneath. It's ambient: nothing to operate, it just
runs. Best on a plugged-in iPad in landscape with auto-lock off and the browser
in full-screen.

### Motion tracker — M314 (phone, portrait)

```
https://alexradf.github.io/Chariot-of-the-gods/tracker/
```

Your handheld motion-tracker prop for the reveal moment: a sweeping scope with
range rings out to 20 metres, contacts that drift inward as they close, a live
distance readout, and the unmistakable ping that quickens as the nearest
contact approaches (the tone is synthesized in-browser, nothing to download).

It doubles as a GM tool:

| Control | Effect |
|---------|--------|
| **Tap the scope** | Drop a contact exactly where you want the players to think something is. |
| **＋ Contact** | Add a contact at a random bearing near the edge. |
| **Auto** | Spawn contacts on their own for a "the walls are alive" scene. |
| **Sound** | Mute / unmute the ping (also buzzes the phone when a contact is right on top of you). |
| **Clear** | Wipe the scope. |

Hold it so players see the blips march toward the centre and hear the ping tighten — then let them decide whether to open that door.

---

## Crew directory

Card IDs match the ones from the original supplement, so any codes you've
already printed keep working.

| ID   | Name        | Role                | Clearance | Link |
|------|-------------|---------------------|-----------|------|
| 1987 | A. Johns    | Second Officer      | COMMAND   | `?id=1987` |
| 2654 | V. Reid     | Security Officer    | SECURITY  | `?id=2654` |
| 3321 | L. Flynn    | Ship Medic          | MEDICAL   | `?id=3321` |
| 4987 | D. Cooper   | Chief Scientist     | SCIENCE   | `?id=4987` |
| 5654 | Ava 6       | Synthetic           | SPECIAL   | `?id=5654` |
| 6321 | R. Walker   | Captain             | COMMAND   | `?id=6321` |
| 7987 | E. Tenwick  | Research Scientist  | SCIENCE   | `?id=7987` |
| 8654 | C. Reynolds | Chief of Security   | SECURITY  | `?id=8654` |
| 9321 | L. Clayton  | Corporate Liaison   | WY-EXEC   | `?id=9321` |

---

## QR codes & printable cards

Ready-made codes live in [`qr/`](qr/) — one per crew member, each encoding the
site URL with that member's `?id=`, so scanning drops the player straight into
their terminal. PNGs are handy for slides and screens; SVGs stay crisp at any
print size.

The codes are generated for the default Pages URL
(`https://alexradf.github.io/Chariot-of-the-gods/`). **If you move to a custom
domain, regenerate them** so the cards point at the new address:

```bash
pip install segno
python3 scripts/generate_qr.py https://your-domain.example/
```

That rewrites every file in `qr/` and rebuilds `cards/access-cards.html`.

---

## Customising the story

All the prose is plain data at the top of the `<script>` block in
`index.html` — you don't need to touch any of the logic below it.

| Object | Controls |
|--------|----------|
| `CREW_DATA` | Each crew member's identity, clearance, and inbox, keyed by card ID. |
| `SECURITY_DATA` | The deck maps: room positions, status colours, and security notes. |
| `SCIENCE_DOCS` | The SCIENCE archive documents. |
| `COMPANY_DOCS` | The COMPANY (Special Projects) documents. |
| `COMMAND_DOCS` | The COMMAND flight-recorder and MU/TH/UR logs. |

**Editing an email or document:** change the text in place. Use `\n` for a line
break inside a body string.

**A crew member** is one entry in `CREW_DATA`:

```js
"8654": {                                 // the card ID (the ?id= value)
  name: "C. REYNOLDS",
  role: "CHIEF OF SECURITY",
  clearance: "SECURITY",                  // decides which module tab unlocks
  emails: [
    { from:"R.WALKER", to:"C.REYNOLDS", subject:"Cryodeck defence",
      date:"2110-11-03 17:30", body:"Reynolds,\n\nApproved on all counts..." }
  ]
}
```

- **Adding a crew member:** add a new keyed entry. Pick an unused four-digit ID,
  give them one of the existing clearance strings (`COMMAND`, `SECURITY`,
  `SCIENCE`, `MEDICAL`, `SPECIAL`, `WY-EXEC`) so a tab lights up as intended,
  then rerun `scripts/generate_qr.py` and add them to the crew table above.
- **Changing an ID:** update the key in `CREW_DATA`, regenerate the QR codes,
  and reprint that card.
- **New clearance / new module:** clearances and modules are wired together in
  the `MODULES` array further down the script; copy an existing module entry to
  add one.

After any edit, just reload the page — there's nothing to compile.

---

## Accessibility & compatibility

- **Reduced motion:** visitors whose browser requests reduced motion get the
  boot sequence and CRT flicker turned off automatically.
- **Keyboard & screen readers:** tabs, mail rows, and map rooms are focusable
  and operable by keyboard; the boot log announces politely.
- **Devices:** works on current mobile and desktop browsers; layout adapts
  between a phone (list *or* reader) and a desktop (both at once).
- **Discovery:** the page is marked `noindex`, so it won't turn up in search
  results — fine for a prop you share by link and QR.

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| Site shows `ACCESS DENIED` on a crew link | The `?id=` was dropped or altered — check the full URL survived (some chat apps strip query strings). |
| A crew link 404s | Pages hasn't finished its first deploy, or **Settings → Pages → Source** isn't set to **GitHub Actions**. |
| QR codes open the wrong address | They were generated for a different URL — rerun `scripts/generate_qr.py` with your real site URL. |
| Edits don't show up | Hard-refresh the browser; if it's the live site, wait for the deploy to finish. |

---

## Credits

Prop content is original table material written for *Chariot of the Gods*.
*ALIEN* and *Weyland-Yutani* are trademarks of their respective owners; this is
a non-commercial fan prop.
