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
| **Crew Sheets** | `/sheet/` | Each player | The players' own Montero characters — stats, talent, per-Act agenda, condition trackers, their initiative card, and a full ALIEN dice roller. |
| **Main Display** | `/display/` | Middle of the table (iPad) | The MU/TH/UR 6500 ship computer: two ship states (Montero / Cronus), ambient systems and registry, an on-screen motion-detector tab, and a self-destruct takeover. |
| **GM Control** | `/control/` | The Game Mother (phone) | An off-fiction remote that pairs to the display: rolls for the NPCs, deals the initiative deck, and drives the self-destruct sequence (arm → countdown → signal-lost). |
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
- **Critical injuries that do the arithmetic.** Take a hit while Broken and
  **⚄ Critical Injury** rolls d66, highlights the row and offers **＋ Add to my
  injuries**. Stored injuries sit in their own panel and their penalties are
  **applied to matching rolls automatically** — the roll pop-up names the injury
  that's costing you dice. You can also add one **without rolling**: pick the
  entry the Game Mother called (*"critical injury #61"* — the scenario's
  signature attacks name them outright) from the **Add an injury** dropdown, or
  choose **Custom…** and write your own — a name, a note, any number of
  per-skill penalties, *Stress +1 when taken*, and a fatality clock. A custom
  injury penalises rolls exactly like a rolled one, and survives a reload.
- **Weapons that roll themselves.** Each weapon in the kit is a card with a
  **⌖ Fire** button: tap it and the roller opens on the right skill — **Ranged
  Combat** for anything with a firing range, **Close Combat** for Engaged-range
  gear — with the weapon's **bonus already applied**. Fire full-auto by *pushing*
  the roll as normal. (Per the ALIEN RPG, ammunition isn't counted — there's no
  reload tracker.)
- **Supplies that run out on you.** **Air**, **food**, **water** and **power**
  each carry a rating you set with **− / +**. Draw on one and tap
  **⚄ Supply roll**: it throws **stress dice equal to that rating** (six at most)
  and **every 1 spends a step**, writing the new rating straight back onto the
  sheet. The pop-up shows the dice, the new figure and an *out of air* warning at
  zero, with **Roll again** for the next Turn — and the whole table sees the
  spend in the roll log.
- **A scanner at the bottom of the sheet.** **◫ Scan access card** is a
  full-width button under the roll log — one thumb-sized target for opening the
  camera on a crew card's QR code, instead of a link buried in the footer.
- **Your initiative card.** An **Initiative** panel sits under the quick rolls.
  Tap **⚄ Draw a card** when a fight starts and the Game Mother's deck deals you
  one of the ten — your number fills the panel, the running order appears beneath
  it, and the panel lights amber with **▶ YOUR MOVE** when your card comes up, so
  nobody has to ask "am I up yet?". **✕ Drop out** hands the card back. (See
  [the initiative deck](#the-initiative-deck) for how it's dealt.)
- **A rules window, one tap away.** An *Open ALIEN rules window* button (also a
  *rules ▸* link by the dice and a *Rules* link in the footer) pops up the full
  **Game Mother Screen** quick reference as a toggle overlay — dice & pushing,
  the complete Panic table, stress triggers, initiative & the round,
  supply & consumables, time & range, slow/fast actions,
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
underneath. A stardate ticks and the readouts drift slowly.

The screen is a **2×2 panel grid**: **Ship Systems** (top-left) and **Vessel
Registry** (top-right) up top, **Notices** (bottom-left, the rotating MU/TH/UR
messages) and the **Roll Log** (bottom-right) beneath. Every dice roll made at the
table — crew skill checks, pushes, panics, and the GM's NPC rolls — drops into the
Roll Log newest-first, with a blip.

**Initiative.** While a fight is running, a strip of the drawn
[initiative cards](#the-initiative-deck) slides in along the bottom — the whole
order low card first, whoever is acting lit in amber, spent cards dimmed, and the
round number beside it. It disappears again the moment the GM ends the fight.

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

Your off-fiction remote for the Main Display, and your **one GM console**: it
**pairs to the display over a room code** and, from your own phone, drives the ship
state and self-destruct, rolls for NPCs, and places motion-tracker blips — all on
one page, with the roller and the scope **kept well apart** so you never fumble one
for the other.

The cards run top-to-bottom: **pairing → NPC / Event Roll → Initiative Deck →
ship state → self-destruct → Motion Tracker**.

**NPC / Event Roll** (near the top) is the scenario itself, loaded in — the real
stat blocks, signature attacks, Act events and odd little tables out of *Chariot
of the Gods*, in four tabs. Tapping anything only **loads the roller**; nothing is
thrown until you hit **⚄ Roll**, and only that result reaches the table.

| Tab | What's in it |
|-----|--------------|
| **Cast** | Every NPC of the **Cronus** (Johns, Reid, Flynn, Cooper, Clayton, Ava 6) and the **Sotillo** (Bolaji, Pin, Bein, Horton) with their real attributes, Health, talent, gear, agenda, buddy and rival. Their skills come up as chips already totalled to **attribute + skill** — tap *Ranged Cbt 7* and the pool is set. Four attribute chips cover anything with no skill behind it. |
| **Xenos** | The Neomorph life cycle (**Bloodburster → Neophyte → adult**) and the Abomination stages (**Revenant**, **Beluga-Head**) with Speed, Health, Armor Rating and skill pools. **⚄ Signature attack** rolls the creature's own D6 table and prints the result — then loads its Base Dice and Damage into the roller for you. **⚄ Critical injury** rolls the Xenomorph crit table for when one hits zero Health. |
| **Events** | All 34 scripted events of **Acts I, II and III**, laid out as a **rough timeline** — see below. |
| **Tables** | The scenario's stray rolls (egg sac clutches **2D6**, decompressed compartments, doses, the Turns before a Bloodburster returns) and its fixed pools — **Blast Power 12** for the Montero's detonation, **Virulence 9** for Neomorphic Motes, **Virulence 6** for the 26 Draconis Strain. |

**The Events timeline.** The booklet is explicit that its events needn't all
happen, nor happen in the order printed — so the Events tab arranges each Act
into **phases that run top to bottom**, a rough timeline rather than a script.
The mandatory beats form the spine; the optional ones sit in the phase where
they land most naturally.

| Act | Phases |
|-----|--------|
| **I — Pandora's Box** | Waking on the Montero → Closing on the derelict → Searching the dark ship → The ship wakes up → *If they try to leave* |
| **II — The Long Night** | Taking stock → The Montero dies → Making the Cronus fly → The crew turn |
| **III — Divided We Fall** | The ship decides → Clayton's play → Boarders → Endgame |

Events that float free of the timeline say so on the row: **Any time** (works in
any phase, often in a later Act too — *Hunter and Prey*, *Sensor Ghost Redux*)
and **If…** (fires off a player decision rather than the clock — *Getting Out of
Dodge?*, *Breaking Loose*, *Mutiny!*).

Tap an event to read it; tap **✓** to strike it once you've run it, and the phase
header counts off what's left. **⚄ Draw an event** then pulls an optional event
from the **earliest phase you haven't finished**, so what you get suits where the
group actually is instead of handing you an Act III beat during the boarding.
Run marks survive a reload mid-session; **↺ Clear run marks** resets them for the
next group. Draws stay on your phone — events are never pushed to the table feed.

**Turned — Stage II Abomination** on the Cast tab applies the transformation from
the booklet in one tap: **STRENGTH +3** (Health with it), **AGILITY +1**,
**EMPATHY 1**, **Speed 2**, and the chips it can no longer use — Empathy skills,
firearms, tech — simply disappear. Cooper is refused, because he doesn't turn:
he births a Bloodburster.

Under the tabs sits the shared roller. The **Who / what** box is what shows on
the table feed, and **Dice / Stress / Mod** are yours to nudge before rolling.
Each **6** is a success; the result (optionally) pushes to the table's **Roll
Log** for everyone to see.

**Initiative Deck.** Your phone holds the ALIEN RPG deck of ten — one card per
combatant, **lowest acts first**, and the order stands for the whole fight. Pick
anyone out of the roster (**the Montero crew**, every NPC of the Cronus and the
Sotillo, or any creature) and tap **＋ Deal in**; or type a name of your own for a
nobody with a shotgun. A creature with **Speed 2 or more** is dealt a card per
point and appears in the order once for each, marked *1/3*, *2/3*, *3/3*.

| Control | What it does |
|---------|--------------|
| **＋ Deal in** | Draw a card for whoever is picked (or typed), starting the fight if none is running. |
| **Next ▶ / ◀ Back** | Step the marker through the order; past the last card the round ticks over. |
| **tap a card number** | Picks that card up; tap another and the two **trade cards** — the by-agreement swap, done for you. |
| **↻** | Redeal that one combatant: their card goes back into the deck and they draw again. |
| **✕** | Drop them out of the fight — their card returns to the deck. |
| **↺ New fight** | Same faces, fresh shuffle, everyone redraws, round back to 1. |
| **■ End fight** | Clear the deck and take the order off the table screen. |

Players can deal *themselves* in from their sheets — a tap on their **⚄ Draw a
card** reaches your deck, takes the next card off it and shows up in this list
with a **◆**, so two people can never end up on the same number. The running
order mirrors to the **Main Display** as it fills. Past ten combatants a second
deck comes out and the *Cards left* readout says which deck you're on; matching
numbers act in the order they were drawn.

| Control | Effect on the display |
|---------|-----------------------|
| **Montero / Cronus** | Flip which ship state the big screen is showing (green ↔ blue). |
| **10:00 / 05:00 / 01:00 / 00:10** | Pick the countdown length. |
| **Arm** | Put the display into the armed self-destruct standby. |
| **Start** | Begin the countdown (arm first). |
| **Abort** | Cancel and return the display to the ship view. |
| **Cut Signal** (hold) | Jump straight to the SIGNAL ERROR screen — hold to fire so it can't misfire. |

**Motion Tracker** (at the bottom, **collapsed by default**): tap **▸ SHOW** to
open the live scope, then **tap to drop a contact, drag to move it, tap to
remove** — blips mirror out to the players' trackers and the table display on the
same room. Keeping it closed until you need it means a stray thumb can't drop a
blip mid-roll. Tap **▾ HIDE** to tuck it away again, or **Open full-screen** to run
the scope on its own device.

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

Running the tracker in GM mode (`?gm=1`) also gives you a **⚄ Roll** button: a
cut-down version of the console's roller whose preset list is built from the same
[`assets/gmdata.js`](assets/gmdata.js) — every NPC's skills, each creature's
skills, the signature attacks that roll dice, and the fixed pools. The full stat
blocks, the Act events and the D6 tables live on the **GM Control** console.

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

### The initiative deck

The same bus carries the **deck of ten**, and the [GM Control](#screen-4--gm-control--self-destruct-phone-portrait)
console is the dealer. It holds the cards, draws for everyone in the fight, and
publishes the running order to every screen on the room:

- **the GM's own list** — the order with the marker on whoever is acting,
- **each player's sheet** — their own card, plus **▶ YOUR MOVE** when it's theirs,
- **the Main Display** — the strip along the bottom for the whole table to read.

Because one screen deals, nobody can end up on the same number: a player tapping
**⚄ Draw a card** is asking the GM's deck for one. That does mean **the GM
Control page has to be open on the same room** for the sheets' draw button to
answer — if it isn't, the sheet says so and the Game Mother can deal everyone in
from her console instead. Nothing about the deck is stored anywhere: end the
fight (or close the console) and it's gone.

> **Privacy note.** The ntfy topic is public to anyone who knows the room code,
> and it only ever carries dice results (who rolled what) and the initiative
> order (who drew which card) — never the agendas or secret roles, which stay on
> each player's own device. Pick a hard-to-guess room
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
  When the first fight breaks out, deal the **initiative deck** from the console
  — players draw on their own sheets, you deal in the creature, and the order
  runs along the bottom of the table screen.
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
| [`control/`](control/) | The **GM Control** remote — a phone page that pairs to the display, rolls for the scenario's cast, deals the initiative deck, and drives the self-destruct sequence. |
| [`tracker/`](tracker/) | The **M314 motion tracker** — the mobile scope with hand-placed contacts and a synthesized proximity ping. |
| [`assets/rollbus.js`](assets/rollbus.js) | The shared **roll bus** — makes a dice roll on one device show up on every screen in the room, and carries the initiative traffic with it. |
| [`assets/initiative.js`](assets/initiative.js) | The **initiative deck** — the ten cards, dealt on the GM console and mirrored to the sheets and the table display. |
| [`assets/gmdata.js`](assets/gmdata.js) | The **GM data** — the scenario's NPCs, creatures, signature-attack tables, Act events and dice pools, shared by the GM console and the tracker's quick roller. |
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

### The GM's side of the table (`assets/gmdata.js`)

Everything the GM console and the tracker's quick roller offer comes out of one
plain-data file — no DOM, no network, so it works offline like the rest of the kit:

| Export | Holds |
|--------|-------|
| `PCS` | The players' own crew, names and careers only — what the GM's initiative roster offers for anyone away from their sheet. Their real stats live in `sheet/index.html`. |
| `NPCS` | The crews of the **Cronus** and the **Sotillo** — attributes, skills, Health, talent, gear, personal agenda, buddy and rival. `turns: false` marks anyone who never becomes an Abomination. |
| `XENOS` | Bloodburster, Neophyte, adult Neomorph, Revenant and Beluga-Head — Speed, Health, Armor Rating, skills, and which attack table each one uses. |
| `ATTACKS` / `CRITS` | The D6 signature-attack tables and the Xenomorph critical injury table, each row carrying its Base Dice, Damage, crit number and whether it forces a Panic Roll. |
| `EVENTS` | All 34 Act I–III events **in timeline order**: `id`, `act`, `phase`, `mandatory`, `when` (`anytime` / `conditional`), the skill roll it calls for, any stress hit, and the text you read off the phone. Array order *is* timeline order — move an entry and it moves on the GM's screen. |
| `TABLES` / `POOLS` | The stray D6/2D6 rolls, and the fixed pools (Blast Power, Virulence). |

Helpers do the arithmetic: `GMData.pool(npc, skill)` returns attribute + skill,
`GMData.skillsOf(npc)` builds the chip list, `GMData.stage2(npc)` applies the
Stage II Abomination transformation, `GMData.phasesFor(act)` derives the timeline
from the array, and `GMData.drawAttack(table)` / `GMData.drawEvent(act, opts)`
roll for you. Swap the arrays to run a different
scenario — both roller UIs are built from whatever is in here.

### The room code

Default `montero`. Override per session with the sheet footer field or `?room=`
on any link. It lives in `assets/rollbus.js` (the `defaultRoom` fallback) if you
want to change the built-in default.

---

## Accessibility & compatibility

- **Reduced motion:** visitors whose browser requests reduced motion get the boot
  sequence and CRT flicker turned off automatically.
- **Legible text:** the CRT look is carried by the phosphor palette, the vignette
  and (on the display) a slow flicker — there are **no scanlines** over any
  screen. Striping every third pixel row looked the part but made body text hard
  work to read, so it came off.
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
| **⚄ Draw a card** on a sheet gets no answer | The deck is dealt by the **GM Control** page — it has to be open on the same room code. Otherwise deal that player in from the console. |
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
