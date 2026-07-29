# Chariot of the Gods — Digital Prop Kit

A set of in-fiction browser screens for running the **ALIEN RPG** cinematic
scenario *Chariot of the Gods*. It turns any phones, tablets and laptops on your
table into the working technology of the story: a boot-up crew terminal, live
character sheets with dice built in, the ship's main computer (with a
phone-triggered self-destruct), and a handheld motion tracker — all talking to
each other, all hosted as one static **GitHub Pages** site.

No build step, no dependencies, no server-side code, no database. Every screen is
plain HTML/CSS/JS that runs in any modern browser.

```
https://alexradf.github.io/Chariot-of-the-gods/
```

> **Spoiler warning for Game Mothers.** These screens contain the Cronus crew's
> final messages, the corporate directives behind the mission, the players'
> secret agendas, and the scenario's mysteries. Read this guide before your
> session; reveal each piece to players only when you want them to have it.

---

## The screens at a glance

| Screen | URL | Who holds it | What it is |
|--------|-----|--------------|------------|
| **Access Terminal** | `/` | Players, at "consoles" | Boots up as a Cronus crew member from a card `?id=`. Shows that crew member's inbox and clearance-gated ship systems. This is how the derelict's story is discovered. |
| **Crew Sheets** | `/sheet/` | Each player | The players' own Montero characters — stats, talent, per-Act agenda, condition trackers, and a full ALIEN dice roller. |
| **Main Display** | `/display/` | Middle of the table (iPad) | The MU/TH/UR 6500 ship computer: two ship states (Montero / Cronus), ambient systems and registry, an on-screen motion-detector tab, and a self-destruct takeover. |
| **GM Control** | `/control/` | The Game Mother (phone) | An off-fiction remote that pairs to the display and drives the self-destruct sequence (arm → countdown → signal-lost). |
| **Motion Tracker** | `/tracker/` | The Game Mother (phone) | The M314 scope for the reveal moments — you hand-place the blips and walk them in; players watch them close. |

**Two crews, don't mix them up.** The *Access Terminal* cards are the **Cronus's
dead crew** (Reynolds, Clayton, Johns…) — the people whose story your players are
uncovering. The *Crew Sheets* are the **players' own characters** aboard the
towing ship Montero (Miller, Davis, Rye, Cham, Wilson) — who your players
actually *play*. One is the mystery; the other is the party reading it.

Everything is optional and modular — run just the terminal, or the full kit.

---

## Quick start (Game Mother)

1. **Publish the site.** Enable GitHub Pages once (see
   [Publishing](#publishing-the-site-github-pages)) and wait for the first deploy.
2. **Sanity-check it.** Open the bare URL — you should get `ACCESS DENIED` (that's
   correct). Open `…/?id=8654` — you should boot in as Reynolds with the SECURITY
   tab live. Open `…/sheet/` — you should get the character-select cards.
3. **Prep the players' side.** Send every player the `…/sheet/` link and agree on
   a shared **room code** (see [At the table](#at-the-table-how-the-screens-connect)).
   Have them each pick a character.
4. **Prep the terminal cards.** Print [`cards/access-cards.html`](cards/access-cards.html)
   or share per-crew `?id=` links, to hand out as the party reaches consoles.
5. **Set the mood.** Put the **Main Display** on an iPad in the middle of the
   table; keep the **Motion Tracker** on your own phone for later.
6. **Run it.** Players roll on their sheets and the whole room sees it; you hand
   out terminal cards to feed the mystery; you drop tracker blips when the walls
   start moving.

---

## Screen 1 — Access Terminal (the mystery)

```
https://alexradf.github.io/Chariot-of-the-gods/?id=8654
                                                └─ C. Reynolds, Chief of Security
```

The derelict **USCSS Cronus** intercepted by the players went into hypersleep
decades ago and never came home. Instead of you reading its backstory aloud,
players **find and read it themselves** on this terminal, in the dead crew's own
words. Access is keyed to individual crew cards, so you control *who learns what
and when*.

**How it works — driven entirely by the `?id=` on the URL:**

1. **Boot.** A period-styled boot log types out (skippable, and skipped
   automatically for reduced-motion users), then the terminal "reads the card."
2. **Identity.** The `id` is looked up in the crew manifest. A **known** id logs
   that crew member in; an **unknown or missing** id shows the in-fiction
   `ACCESS DENIED` screen — so the bare site URL is safe to share.
3. **Mail + clearance modules.** Every crew member sees their **MAIL** inbox.
   Alongside it are four clearance-gated system tabs; a tab only opens if the
   card's clearance matches, otherwise it reads `ACCESS RESTRICTED`. This is how
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
   note.

**Pacing tip.** Hand cards out one at a time as the party physically reaches
consoles, and the truth assembles across the group instead of arriving in one
lump. Give a player **Reynolds** and they get Security's survey of what's damaged
or moving in the vents; give another **Clayton** and they read the Company's
*eyes-only* orders — and learn the crew were expendable.

---

## Screen 2 — Crew Sheets (the players)

```
https://alexradf.github.io/Chariot-of-the-gods/sheet/
```

The players' side of the prop: the regenerated Montero crew who board the Cronus.
Share the one link; each player picks their own character and everything they
need for play lives on their own device.

- **Choose your character.** Five cards — Cpt. Miller (Officer), Davis (Pilot),
  Rye and Cham (Roughnecks), and Wilson (Company Agent) — each with the exact
  attributes, skills, talent and signature item from the character sheets. The
  choice is remembered on that device, and a direct link like
  `…/sheet/?char=davis` drops a player straight into their character.
- **Live condition trackers.** Tap the pips to set **Health** (equal to your
  Strength), **Stress Level**, and **Radiation**. Stress feeds the dice roller
  automatically.
- **A hidden agenda, togglable per Act.** The agenda stays sealed behind
  *Open sealed agenda* until the player chooses to read it, then **Act I / II /
  III** tabs switch between that act's goal — so players reveal only the act
  they're in. Wilson's Act I also shows the redacted **Special Order 966**.
- **Sealed orders (GM secret roles).** If you quietly hand a player a codeword —
  **`LUCAS`** (the undercover synthetic) or **`INFECTED`** (the Abomination) —
  entering it unlocks that secret agenda and its stat changes, right on the
  player's own sheet. No codeword, nothing to see. Give it privately (a whisper,
  a DM) so the rest of the table stays in the dark.
- **The dice, built in.** A full **ALIEN *Year Zero*** roller: tap any skill (or
  set attribute + skill + gear + stress by hand) to roll base **and** stress
  dice, count 6s for successes, **push** to reroll for +1 stress, and make a
  **Panic Roll** when a pushed stress die comes up 1. Every roll is broadcast to
  the room (see [At the table](#at-the-table-how-the-screens-connect)).
- **A rules window, one tap away.** An *Open ALIEN rules window* button (also a
  *rules ▸* link by the dice and a *Rules* link in the footer) pops up the full
  **Game Mother Screen** quick reference as a toggle overlay — dice & pushing,
  the complete Panic table, stress triggers, time & range, slow/fast actions,
  ranged & cover mods, stealth, every skill's stunts, synthetic and xenomorph
  rules, and the full d66 critical-injury table. Collapsible, closes on
  <kbd>Esc</kbd> or a tap outside.

### The player roster

| Character | Career | STR | AGI | WITS | EMP | Talent |
|-----------|--------|-----|-----|------|-----|--------|
| **Cpt. Vanessa Miller** | Officer | 4 | 3 | 2 | 5 | Pull Rank |
| **Leah Davis** | Pilot | 2 | 5 | 3 | 4 | Reckless |
| **Kayla Rye** | Roughneck | 4 | 3 | 4 | 3 | The Long Haul |
| **Lyron Cham** | Roughneck | 5 | 3 | 2 | 4 | True Grit |
| **John J. Wilson** | Company Agent | 2 | 4 | 3 | 5 | Personal Safety |

Two more identities are **GM-assigned secret roles** with no card of their own —
**Lucas** (a synthetic working for a rival corp) and **Infected** (a crewmate
turning into an Abomination). Hand a player the matching codeword when the story
calls for it, and it overlays onto whichever character they're already playing.

---

## Screen 3 — Main Display · MU/TH/UR 6500 (iPad, landscape)

```
https://alexradf.github.io/Chariot-of-the-gods/display/
```

Leave it running in the middle of the table as the ship's computer. It has **two
states** you flip between with a **secret triple-tap on the top bar** (no visible
button, so players never see the switch):

- **USCSS Montero** — the crew's own hauler: reactor, life support, hull, O₂,
  cargo-tow tension and the hypersleep bank, plus the vessel registry and mundane
  MU/TH/UR housekeeping notices.
- **USCSS Cronus** — the derelict they board: degraded systems (life support
  offline, reactor on standby, hull breach sealed, emergency power), the old
  Weyland science-division registry, and a glitchy, redacted system log.

The Montero runs in the green house phosphor; flipping to the Cronus **shifts the
whole palette to a cold blue**, so the derelict reads as a different machine at a
glance.

Everything on this screen is **spoiler-free** — the scenario's mysteries stay
behind the terminal's clearance-gated modules. There is **no ship radar**;
instead the top bar carries a visible **`SHIP | ◎ TRACKER`** button that turns the
whole screen into the **M314 motion detector** (and back). Open the display with a
`?room=` code and that on-iPad scope **mirrors the GM's tracker** — blips placed
on the [GM Control](#screen-4--gm-control--self-destruct-phone-portrait) console
show up on the table screen live. The embedded scope is **muted**, and the ship's
own reactor hum **drops out while the tracker tab is open** so it doesn't play
underneath. A stardate ticks and the readouts drift slowly. Crew dice rolls land
in a **`SYSTEM LOG` panel top-right**; the rotating MU/TH/UR **notices sit
bottom-right**.

On the very first tap the screen runs a short **power-on diagnostic sweep**
(systems checked off with a progress bar) before the display comes up.

**Self-destruct.** On a signal from the [GM Control](#screen-4--gm-control--self-destruct-phone-portrait)
phone, the display is taken over by the emergency destruct sequence: **ARMED** →
a big **countdown** with a rising klaxon → and at zero (or on command) it cuts to
a **SIGNAL ERROR — TRANSMISSION LOST** dead-channel screen. The reactor hum and interface
blips **fall silent under the report** so only the klaxon carries. **Abort**
returns it to the ship view. If the network drops, a **hidden fallback** works locally:
long-press the bottom-**left** corner to arm/abort, the bottom-**right** to start
the countdown (or cut the signal while it runs).

It's ambient otherwise: nothing to operate, it just runs. Best on a plugged-in
iPad in landscape with auto-lock off. It opens with a **tap to activate** panel —
that first tap is what lets iOS play sound — then just fills the browser (no forced
full-screen); use the browser's own full-screen control if you want it edge to edge.

---

## Screen 4 — GM Control · self-destruct (phone, portrait)

```
https://alexradf.github.io/Chariot-of-the-gods/control/
```

Your off-fiction remote for the Main Display, and now your **one GM console**: it
**pairs to the display over a room code** and, from your own phone, drives the ship
state and self-destruct **and** carries the **motion-tracker blips and the NPC /
event dice roller** in the same page — no separate tracker link to juggle.

| Control | Effect on the display |
|---------|-----------------------|
| **Montero / Cronus** | Flip which ship state the big screen is showing (green ↔ blue). |
| **10:00 / 05:00 / 01:00 / 00:10** | Pick the countdown length. |
| **Arm** | Put the display into the armed self-destruct standby. |
| **Start** | Begin the countdown (arm first). |
| **Abort** | Cancel and return the display to the ship view. |
| **Cut Signal** (hold) | Jump straight to the SIGNAL ERROR screen — hold to fire so it can't misfire. |

The **Motion Tracker** card holds a live scope: **tap to drop a contact, drag to
move it, tap to remove**, and the blips mirror out to the players' trackers and the
table display on the same room. **⚄ Roll** opens the **NPC / event roller** — set
base + stress dice and a modifier, roll, and (optionally) push the result to the
table dice feed. There's also an **Open full-screen** link if you'd rather run the
scope on its own.

**Pairing:** open the control page, note its **room code**, then open the display
with the *same* room (**Copy link** gives you the exact `…/display/?room=CODE` URL
to send to the iPad). Both devices must be **online** — the link runs over the
free public [ntfy.sh](https://ntfy.sh) relay (no account, nothing to install). The
hidden corner fallback on the display covers you if the relay is unavailable.

---

## Screen 5 — Motion Tracker · M314 (phone, portrait)

```
https://alexradf.github.io/Chariot-of-the-gods/tracker/
```

Your handheld motion-tracker prop for the reveal moment: a sweeping scope with
range rings out to 20 metres, a live distance readout, and the unmistakable ping
that quickens as the nearest contact approaches (the tone is synthesized
in-browser, nothing to download). It also shows a compact **feed of the crew's
dice rolls**, so as GM you never miss a roll or a panic.

Contacts are **fully under your control** — they stay exactly where you put them
and never drift on their own, so *you* decide when the creatures move:

| Control | Effect |
|---------|--------|
| **Tap empty scope** | Drop a static contact exactly where you want one. |
| **Drag a contact** | Slide it inward between beats to fake something closing in. |
| **Tap a contact** | Remove that one contact. |
| **＋ Contact** | Add a contact at a random bearing near the edge. |
| **Sound** | The ping starts **muted**; tap to turn it on (it also buzzes the phone when a contact is right on top of you). |
| **Clear** | Wipe the scope. |

Most of the time you'll drive blips from the embedded scope on the **GM Control**
console rather than this standalone page — but the full page is still here if you
want the tracker on a dedicated phone.

**Two-screen mode.** Add the same `?room=CODE` to two tracker links and they
**mirror**: place and drag contacts on your own phone (`…/tracker/?room=CODE`) and
they appear live on a second tracker screen you've handed the players — you walk
the blips toward the centre from across the table while they watch and sweat.
(The on-iPad `SHIP | ◎ TRACKER` tab mirrors the same way.) With no `?room=` it's
just the standalone handheld prop.

---

## At the table: how the screens connect

The screens aren't just separate pages: the **dice tie them together**. When
a player rolls on their sheet, that roll appears live on:

- their own sheet's **Table Feed**, and every other player's sheet,
- the **Main Display** (a corner pop-up with a blip), and
- the **Motion Tracker** in your hand.

So the whole room sees successes and — crucially — **panics** the instant they
happen, without anyone reading dice aloud.

This runs with **no server and no accounts**, via a small shared "roll bus"
([`assets/rollbus.js`](assets/rollbus.js)):

- **Same-device** screens (e.g. you running the display and tracker on one
  browser) sync instantly through `BroadcastChannel`.
- **Across devices**, it uses a public [ntfy.sh](https://ntfy.sh) topic keyed to
  a **room code** — shown at the foot of the sheet, default `montero`.

**Setting the room up:** pick a room code and make sure every device uses the
same one. Change it in the sheet's footer, or add `?room=yourcode` to any of the
four links (e.g. `…/sheet/?room=blackstar`, `…/display/?room=blackstar`). Give
each table a different code to keep them apart. If the network is blocked, rolls
still work locally — nothing is lost on the device that made them.

> **Privacy note.** The ntfy topic is public to anyone who knows the room code,
> and it only ever carries dice results (who rolled what) — never the agendas or
> secret roles, which stay on each player's own device. Pick a hard-to-guess room
> code if that matters to you.

---

## A session, screen by screen

A rough flow showing how the pieces come into play — adapt freely.

- **Before play.** Publish the site. Send players the `…/sheet/` link and the
  room code; each picks a character and reads their **Act I** agenda. Put the
  **Main Display** on the table (Montero state) and keep the **GM Control** and
  **Motion Tracker** on your own phone. Privately decide if anyone is **Lucas**,
  and give them the codeword.
- **Act I — the approach.** The Main Display sells the intercept of the Cronus.
  Players roll Piloting/Comtech/Observation on their sheets to close on and board
  the derelict; the whole table sees the rolls. Secretly triple-tap the display's
  top bar to flip it to the **Cronus** state as they board. Hand out the first
  **terminal cards** as they reach working consoles and start reading the dead
  crew's mail.
- **Act II — the truth.** More terminal cards deepen the mystery (Security deck
  maps, the Company's orders). Nudge players to switch their agenda to **Act II**.
  Stress climbs, pushes start triggering **Panic Rolls** — visible to everyone.
  Break out the **Motion Tracker** for the first "something's moving" beat; flip
  the display to its **◎ TRACKER** tab (with a shared `?room=`) so the scope
  mirrors onto the table screen.
- **Act III — the endgame.** Players flip to their **Act III** agenda; if the
  scenario calls for it, hand out the **`INFECTED`** codeword. The tracker earns
  its keep as things close in, and — when the ship is lost — the **GM Control**
  phone arms the **self-destruct** and takes the big screen down to the
  SIGNAL ERROR dead channel. The dice feed keeps the table synced through the
  chaos.

---

## Publishing the site (GitHub Pages)

The included workflow does the publishing; you point Pages at it once:

1. Repo **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to the deployment branch, or run the workflow from the **Actions** tab.
   The live URL appears in the workflow summary and under **Settings → Pages**
   once the first run finishes (allow a few minutes).

The workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
deploys on every push to the site's main branch, so any edit you commit goes
live automatically. `.nojekyll` tells Pages to serve the files as-is.

---

## Repository layout

| Path | What it is |
|------|------------|
| [`index.html`](index.html) | The **Access Terminal** — markup, styling, story data, and logic in one file. |
| [`sheet/`](sheet/) | The **player crew sheets** — pick a character, track Health/Stress, read your per-Act agenda, roll dice that broadcast to the room, and open the rules window. |
| [`display/`](display/) | The **MU/TH/UR 6500 main display** — the ambient bridge screen for an iPad, with two ship states, an on-screen motion-detector tab, and the self-destruct takeover. |
| [`control/`](control/) | The **GM Control** remote — a phone page that pairs to the display and drives the self-destruct sequence. |
| [`tracker/`](tracker/) | The **M314 motion tracker** — the mobile scope with hand-placed contacts and a synthesized proximity ping. |
| [`assets/rollbus.js`](assets/rollbus.js) | The shared **roll bus** — makes a dice roll on one device show up on every screen in the room. |
| [`qr/`](qr/) | Per-crew access-card QR codes, PNG **and** SVG (e.g. `qr/reynolds-8654.png`). |
| [`cards/access-cards.html`](cards/access-cards.html) | Print-ready sheet of all nine terminal cards. |
| [`scripts/generate_qr.py`](scripts/generate_qr.py) | Regenerates the codes and card sheet for any site URL. |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Builds and publishes the Pages site on every push. |
| `.nojekyll` | Tells Pages to serve the files as-is instead of running Jekyll. |

---

## Terminal crew directory

The cards for **Screen 1**. IDs match the ones from the original supplement, so
any codes you've already printed keep working.

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

### QR codes & printable cards

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

## Customising

Everything is plain data you can edit in place; there's nothing to compile —
just reload the page.

### The terminal story (`index.html`)

All the prose is data at the top of the `<script>` block; you don't need to touch
the logic below it.

| Object | Controls |
|--------|----------|
| `CREW_DATA` | Each Cronus crew member's identity, clearance, and inbox, keyed by card ID. |
| `SECURITY_DATA` | The deck maps: room positions, status colours, and security notes. |
| `SCIENCE_DOCS` | The SCIENCE archive documents. |
| `COMPANY_DOCS` | The COMPANY (Special Projects) documents. |
| `COMMAND_DOCS` | The COMMAND flight-recorder and MU/TH/UR logs. |

A crew member is one entry in `CREW_DATA`:

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

- **Editing mail/docs:** change the text in place; use `\n` for a line break.
- **Adding a crew member:** add a keyed entry with an unused four-digit ID and one
  of the clearance strings (`COMMAND`, `SECURITY`, `SCIENCE`, `MEDICAL`,
  `SPECIAL`, `WY-EXEC`), then rerun `scripts/generate_qr.py` and add them to the
  directory above.
- **New clearance / module:** clearances and modules are wired together in the
  `MODULES` array further down the script; copy an existing entry to add one.

### The player characters (`sheet/index.html`)

Near the top of the `<script>` block:

| Object | Controls |
|--------|----------|
| `CREW` | Each playable character — attributes, skills, talent, signature item, relationships, and their per-Act agenda (keyed `miller`, `davis`, …). |
| `SECRETS` | The GM-assigned secret roles (`LUCAS`, `INFECTED`) — their agenda text, act goals, and rules notes; the key is the unlock codeword. |
| `SKILLS` | The attribute→skill map that builds the sheet and the dice-roller menus. |

To reskin the whole scenario with your own crew, rewrite `CREW` and `SECRETS`;
the dice, trackers, agenda toggle and rules window all follow the data.

### The room code

Default `montero`. Override per session with the sheet footer field or `?room=`
on any link. It lives in `assets/rollbus.js` (the `defaultRoom` fallback) if you
want to change the built-in default.

---

## Accessibility & compatibility

- **Reduced motion:** visitors whose browser requests reduced motion get the boot
  sequence and CRT flicker turned off automatically.
- **Keyboard & screen readers:** terminal tabs, mail rows and map rooms, and the
  sheet's skills, agenda tabs and rules window are focusable and operable by
  keyboard; the rules window traps <kbd>Esc</kbd> to close.
- **Devices:** works on current mobile and desktop browsers; the terminal and
  sheet both reflow between phone and desktop layouts.
- **Discovery:** every page is marked `noindex`, so it won't turn up in search
  results — fine for a prop you share by link and QR.

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| Terminal shows `ACCESS DENIED` on a crew link | The `?id=` was dropped or altered — some chat apps strip query strings; check the full URL survived. |
| A page 404s | Pages hasn't finished its first deploy, or **Settings → Pages → Source** isn't set to **GitHub Actions**. |
| Rolls don't appear on other devices | The devices aren't on the same **room code**, or the network blocks ntfy.sh. Match the room code in each footer; rolls still show locally regardless. |
| Sync says **local** instead of **LIVE** | The browser couldn't reach ntfy.sh (offline, or a restrictive network). Same-device screens still sync; cross-device won't until the connection is back. |
| A player can't see their secret agenda | The codeword must be entered exactly (`LUCAS` / `INFECTED`); it's stored per device, so it won't follow them to a different phone. |
| QR codes open the wrong address | They were generated for a different URL — rerun `scripts/generate_qr.py` with your real site URL. |
| Edits don't show up | Hard-refresh the browser; on the live site, wait for the deploy to finish. |

---

## Credits

Prop content is original table material written for *Chariot of the Gods*. The
in-app rules reference is adapted from the ALIEN RPG Game Mother Screen by Tim
Bannock as a play aid. *ALIEN* and *Weyland-Yutani* are trademarks of their
respective owners; this is a non-commercial fan prop.
