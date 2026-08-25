/* ============================================================
   CHARIOT OF THE GODS — GM DATA
   ------------------------------------------------------------
   Everything the Game Mother needs to roll for the scenario,
   lifted straight out of the Chariot of the Gods booklet:

     · NPCS        the crews of the Montero, the Cronus and the
                   Sotillo, with their real attributes, skills,
                   talents, gear and personal agendas — the
                   players' own crew carry pc:true and their
                   per-Act goals, so the GM can roll for anyone
                   who has stepped away from the table
     · XENOS       Bloodburster / Neophyte / adult Neomorph and
                   the Abomination stages, with Speed, Health,
                   skills and Armor Rating
     · ATTACKS     the D6 signature-attack tables (Bloodburster,
                   Neomorph, Abomination III–IV), including the
                   Base Dice and Damage of each attack so the
                   roller can load the pool for you
     · CRITS       the D6 critical injury table for Xenomorphs
     · EVENTS      every scripted event of Acts I, II and III,
                   laid out on a rough timeline of phases, flagged
                   mandatory or optional, with the skill roll each
                   one calls for
     · TABLES      the scenario's odd little rolls — egg sac
                   clutches, decompressed compartments, doses,
                   Blast Power, Virulence

   Pure data + a couple of tiny helpers. No DOM, no network, so
   any page can include it and it works offline.

   Dice pools follow the ALIEN RPG: a human rolls
   ATTRIBUTE + SKILL Base Dice, a Xenomorph rolls its skill
   level only. Every 6 is a success.

   Public API (window.GMData):
     GMData.SKILLS            ordered skill list w/ attribute
     GMData.PCS               the players' crew (id/name/role)
     GMData.NPCS / XENOS / ATTACKS / CRITS / EVENTS / TABLES
     GMData.pool(npc, skillKey)   -> Base Dice for that NPC
     GMData.skillsOf(npc)         -> [{key,name,attr,pool}, …]
     GMData.stage2(npc)           -> NPC turned Stage II Abomination
     GMData.npc(id) / GMData.xeno(id)
     GMData.d6() / GMData.pick(arr)
     GMData.drawAttack(tableKey)  -> {roll, entry}
     GMData.eventsFor(act)        -> that Act's events, in timeline order
     GMData.phasesFor(act)        -> that Act's phases, in order
     GMData.drawEvent(act, opts)  -> an event, from the earliest phase
                                     that still has one (see the function)
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- skills, and the attribute each one hangs off ---------- */
  var SKILLS = [
    { key: "closeCombat",    name: "Close Combat",    short: "Close Cbt",  attr: "STR"  },
    { key: "heavyMachinery", name: "Heavy Machinery", short: "Heavy Mach", attr: "STR"  },
    { key: "stamina",        name: "Stamina",         short: "Stamina",    attr: "STR"  },
    { key: "rangedCombat",   name: "Ranged Combat",   short: "Ranged Cbt", attr: "AGI"  },
    { key: "mobility",       name: "Mobility",        short: "Mobility",   attr: "AGI"  },
    { key: "piloting",       name: "Piloting",        short: "Piloting",   attr: "AGI"  },
    { key: "observation",    name: "Observation",     short: "Observ.",    attr: "WITS" },
    { key: "survival",       name: "Survival",        short: "Survival",   attr: "WITS" },
    { key: "comtech",        name: "Comtech",         short: "Comtech",    attr: "WITS" },
    { key: "command",        name: "Command",         short: "Command",    attr: "EMP"  },
    { key: "manipulation",   name: "Manipulation",    short: "Manip.",     attr: "EMP"  },
    { key: "medicalAid",     name: "Medical Aid",     short: "Med Aid",    attr: "EMP"  }
  ];
  var SKILL_BY_KEY = {};
  SKILLS.forEach(function (s) { SKILL_BY_KEY[s.key] = s; });

  var ATTR_NAME = { STR: "Strength", AGI: "Agility", WITS: "Wits", EMP: "Empathy" };

  /* ============================================================
     NON-PLAYER CHARACTERS  (booklet pp. 8–13)
     ============================================================ */
  var NPCS = [
    /* ---------------- the players' own crew, aboard the Montero ----------------
       Here so the Game Mother can roll for a player who has stepped away, read
       what each of them is chasing this Act, and deal them an initiative card.
       sheet/index.html is the source of truth for play — these are the same
       numbers, kept in the GM's data so the console works on its own. */
    {
      id: "miller", group: "Crew of the Montero", pc: true,
      name: "Cpt. Vanessa Miller", role: "Officer", full: "Cpt. Vanessa Miller",
      ship: "USCSS Montero",
      note: "Commanding officer of the USCSS Montero, tired of being under the thumb of Weyland-Yutani.",
      attr: { STR: 4, AGI: 3, WITS: 2, EMP: 5 }, health: 4,
      skills: { piloting:2, rangedCombat:1, mobility:1, observation:2, command:3, medicalAid:1 },
      talent: "Pull Rank", gear: "WY Jacket Patch",
      agenda: "Get out from under the Company — the money to lease the Montero, or a ship of her own.",
      acts: [
        "Follow company protocol, get the job done and cash in. Don't do anything to risk your paycheck. Maybe the next run pays better.",
        "Finding the Cronus is a huge opportunity, even with monsters onboard. Find a way to get out from under the corporate yoke with an upgraded ship or enough money to buy a new one.",
        "Things are going south fast. Get all the cash you can and get the hell out of dodge, by any means necessary."
      ],
      buddy: "Davis", rival: "Wilson", turns: true
    },
    {
      id: "davis", group: "Crew of the Montero", pc: true,
      name: "Leah Davis", role: "Pilot", full: "Leah Davis",
      ship: "USCSS Montero",
      note: "A reckless pilot, willing to do anything for a thrill, up to, and including stimulant abuse. MDMA preferred.",
      attr: { STR: 2, AGI: 5, WITS: 3, EMP: 4 }, health: 2,
      skills: { heavyMachinery:1, rangedCombat:2, mobility:2, piloting:3, observation:2, command:1 },
      talent: "Reckless", gear: "Almost empty pill bottle",
      agenda: "Break the monotony, and find something to take the edge off.",
      acts: [
        "God, these cargo runs are boring. Take any chance to break the monotony.",
        "You really need another fix right now. Search the labs on the Cronus for stimulants.",
        "This will all go to hell unless you save the day. Take any risk necessary to kill the monsters and other enemies on the Cronus."
      ],
      buddy: "Miller", rival: "—", turns: true
    },
    {
      id: "rye", group: "Crew of the Montero", pc: true,
      name: "Kayla Rye", role: "Roughneck", full: "Kayla Rye",
      ship: "USCSS Montero",
      note: "A technician with a chip on her shoulder, money to earn, and a family in need of support.",
      attr: { STR: 4, AGI: 3, WITS: 4, EMP: 3 }, health: 4,
      skills: { heavyMachinery:1, stamina:2, mobility:2, comtech:3, medicalAid:2 },
      talent: "The Long Haul", gear: "A well-worn photo of your brother",
      agenda: "Money for her sick brother back home, by whatever angle presents itself.",
      acts: [
        "Find any angle to get more money out of this cargo run. Your sick brother back home needs the cash badly.",
        "Search the Cronus for cash or any other valuable items that you might sell back home if you survive. The ship is a derelict anyway, right?",
        "Strike any deal to get enough money to support yourself and your family for good, no matter what the cost to your soul."
      ],
      buddy: "Cham", rival: "Miller", turns: true
    },
    {
      id: "cham", group: "Crew of the Montero", pc: true,
      name: "Lyron Cham", role: "Roughneck", full: "Lyron Cham",
      ship: "USCSS Montero",
      note: "A loner with a new-found family who is willing to do anything and everything to keep them safe.",
      attr: { STR: 5, AGI: 3, WITS: 2, EMP: 4 }, health: 5,
      skills: { closeCombat:2, heavyMachinery:3, stamina:2, observation:1, survival:1, comtech:1 },
      talent: "True Grit", gear: "Rosary",
      agenda: "The crew is family. Keep them alive.",
      acts: [
        "Do your duty and help your fellow crewmates as best you can.",
        "The crew is in danger and the crew is your family. Protect them with your life, if need be.",
        "Get all the surviving crew from the Montero to safety off the Cronus — by any means necessary."
      ],
      buddy: "Rye", rival: "—", turns: true
    },
    {
      id: "wilson", group: "Crew of the Montero", pc: true,
      name: "John J. Wilson", role: "Company Agent", full: "John J. Wilson",
      ship: "USCSS Montero",
      note: "A Company man, through and through, desperate for advancement, whatever the cost.",
      attr: { STR: 2, AGI: 4, WITS: 3, EMP: 5 }, health: 2,
      skills: { rangedCombat:1, mobility:2, observation:2, comtech:1, manipulation:3, medicalAid:1 },
      talent: "Personal Safety", gear: "Access keycard",
      agenda: "Special Order 966 — secure the xenomorphic material for the Company. Crew expendable.",
      acts: [
        "Shortly before the cargo run to Sutter's World, you received Special Order 966 from Weyland-Yutani headquarters. The Montero will be redirected en route to investigate the USCSS Cronus, a Weyland-Yutani science ship missing for 73 years. Make sure the Montero crew investigates the Cronus, but tread carefully — don't do anything to raise suspicions. Be helpful and make the crew trust you.",
        "The discoveries on the Cronus are beyond your wildest dreams. It's dangerous to be sure, but if you pull this off and manage to salvage the xenomorphic material, you can parlay it into a fortune. No matter what, Special Order 966 is your goal — but don't risk open confrontation with the rest of the Montero crew. You still need them.",
        "This is the endgame. With the Montero gone, your goal is to bring the Cronus back to Earth at any cost. Join forces with Clayton if need be, but even she's expendable for you to reach your goal — just like the rest of the crew."
      ],
      buddy: "—", rival: "Miller", turns: true
    },

    /* ---------------- crew of the USCSS Cronus ---------------- */
    {
      id: "johns", group: "Crew of the Cronus",
      name: "Johns", role: "Officer", full: "Albert Johns", age: 47,
      personality: "Submissive", ship: "USCSS Cronus",
      note: "De facto Captain of the Cronus and no good at giving orders. He falls in behind whoever starts making the hard calls.",
      attr: { STR: 4, AGI: 3, WITS: 3, EMP: 4 }, health: 4,
      skills: { heavyMachinery: 1, stamina: 2, rangedCombat: 2, piloting: 2, observation: 2, command: 1 },
      talent: "Pull Rank", gear: "M4A3 Pistol (1 reload), key card",
      agenda: "Find a leader to follow and help them save human lives.",
      buddy: "—", rival: "Clayton", turns: true
    },
    {
      id: "reid", group: "Crew of the Cronus",
      name: "Reid", role: "Colonial Marine", full: "Sgt. Valerie Reid", age: 34,
      personality: "On Edge", ship: "USCSS Cronus",
      note: "ORDF veteran of Torin Prime with a synthetic arm and PTSD from LV-1113. 1.50m, and badly underestimated.",
      attr: { STR: 5, AGI: 4, WITS: 2, EMP: 3 }, health: 5,
      skills: { closeCombat: 3, heavyMachinery: 1, rangedCombat: 3, mobility: 2, command: 1 },
      talent: "Overkill", gear: "Armat 37A2 12 Shotgun (2 reloads)",
      agenda: "Terminate all threats to the Cronus crew with extreme prejudice, whatever the risk to you.",
      buddy: "Johns", rival: "Flynn", turns: true
    },
    {
      id: "flynn", group: "Crew of the Cronus",
      name: "Flynn", role: "Medic", full: "Dr. Liam Flynn", age: 27,
      personality: "Fearful", ship: "USCSS Cronus",
      note: "Helped synthesize the 26 Draconis cure and suspects it isn't safe. He has told nobody that it contains the black goo.",
      attr: { STR: 2, AGI: 3, WITS: 4, EMP: 5 }, health: 2,
      skills: { mobility: 1, observation: 2, comtech: 2, manipulation: 2, medicalAid: 3 },
      talent: "Compassion", gear: "Personal Medkit, Surgical Kit",
      agenda: "Get out of this mess alive, whatever it costs and whatever lies you have to tell.",
      buddy: "Cooper", rival: "Reid", turns: true
    },
    {
      id: "cooper", group: "Crew of the Cronus",
      name: "Cooper", role: "Scientist", full: "Prof. Daniel Cooper", age: 53,
      personality: "Rational", ship: "USCSS Cronus",
      note: "Infected by Neomorphic Motes and never took his inoculation — his syringe is still full in his pocket. See the event \"Mother of All Migraines\".",
      attr: { STR: 2, AGI: 3, WITS: 5, EMP: 4 }, health: 2,
      skills: { mobility: 1, observation: 2, comtech: 3, manipulation: 1, medicalAid: 3 },
      talent: "Analysis", gear: "Personal data tablet",
      agenda: "Make sure the 26 Draconis Strain never becomes a threat to human civilization.",
      buddy: "Flynn", rival: "Clayton", turns: false
    },
    {
      id: "clayton", group: "Crew of the Cronus",
      name: "Clayton", role: "Company Agent", full: "Lori Clayton", age: 42,
      personality: "Ruthless", ship: "USCSS Cronus",
      note: "Only Clayton has the codes to the wall safe and the EEV in her quarters on Deck B. Don't turn her early — she carries Act III.",
      attr: { STR: 2, AGI: 3, WITS: 4, EMP: 5 }, health: 2,
      skills: { rangedCombat: 2, mobility: 1, observation: 2, command: 2, manipulation: 3 },
      talent: "Personal Safety", gear: "M4A3 Pistol (2 reloads), key card",
      agenda: "Bring Flynn and a sample of the 26 Draconis Strain back to Weyland-Yutani — no matter who you have to kill.",
      buddy: "—", rival: "Cooper", turns: true
    },
    {
      id: "ava", group: "Crew of the Cronus",
      name: "Ava 6", role: "Synthetic", full: "Ava 6", age: "Appears to be in her twenties",
      personality: "Helpful", ship: "USCSS Cronus", synthetic: true,
      note: "Female-presenting Walter-series equivalent, head-wounded and wandering for decades. Repair her (rulebook p. 77) and she helps — and the creatures ignore her, because she smells wrong.",
      attr: { STR: 5, AGI: 6, WITS: 5, EMP: 4 }, health: 5,
      skills: { mobility: 1, stamina: 2, observation: 2, comtech: 3, medicalAid: 2 },
      talent: "—", gear: "None",
      agenda: "Help the humans on the Cronus survive, without regard for your own safety.",
      buddy: "—", rival: "—", turns: false
    },

    /* ---------------- crew of the USCSS Sotillo ---------------- */
    {
      id: "bolaji", group: "Crew of the Sotillo",
      name: "Bolaji", role: "Officer", full: "Capt. Adisa Bolaji", age: 30,
      personality: "Resolute", ship: "USCSS Sotillo",
      note: "Paid by Seegson to harass Weyland-Yutani ships. Business first — but he knows some things are too dangerous to hand over.",
      attr: { STR: 3, AGI: 5, WITS: 3, EMP: 3 }, health: 3,
      skills: { heavyMachinery: 1, mobility: 2, piloting: 1, rangedCombat: 3, manipulation: 1, command: 2 },
      talent: "Pull Rank", gear: "Rexim RXF-M5 EVA Pistol (3 reloads)",
      agenda: "Turn this tricky situation into a profit without risking your ship and crew.",
      buddy: "Pin", rival: "—", turns: true
    },
    {
      id: "pin", group: "Crew of the Sotillo",
      name: "Pin", role: "Mercenary", full: "Pinion", age: 31,
      personality: "Steadfast", ship: "USCSS Sotillo",
      note: "1.95m of loyalty. Bolaji took the fall for her as a kid and she has enforced his will ever since.",
      attr: { STR: 5, AGI: 4, WITS: 3, EMP: 2 }, health: 5,
      skills: { closeCombat: 3, heavyMachinery: 1, stamina: 1, rangedCombat: 2, mobility: 2, command: 1 },
      talent: "Overkill", gear: "Armat M41A Pulse Rifle (2 reloads)",
      agenda: "Follow and protect Bolaji, whatever the cost or risk.",
      buddy: "Bolaji", rival: "Bein", turns: true
    },
    {
      id: "bein", group: "Crew of the Sotillo",
      name: "Bein", role: "Pilot", full: "Helen Bein", age: 53,
      personality: "Cynical", ship: "USCSS Sotillo",
      note: "Dishonorably discharged for nuking the wrong outpost at Tientsin. Alcoholic (rulebook p. 67) — still a better pilot drunk than most are sober.",
      attr: { STR: 3, AGI: 5, WITS: 3, EMP: 3 }, health: 3,
      skills: { heavyMachinery: 2, rangedCombat: 2, piloting: 3, observation: 1, command: 2 },
      talent: "Reckless", gear: ".357 Magnum Revolver (2 reloads)",
      agenda: "Find a drink on this goddamn ship.",
      buddy: "Horton", rival: "Pin", turns: true
    },
    {
      id: "horton", group: "Crew of the Sotillo",
      name: "Horton", role: "Mechanic", full: "Micky Horton", age: 12,
      personality: "Friendly", ship: "USCSS Sotillo",
      note: "Twelve years old, kidnapped and then kept by Bolaji. Rebuilding sensor suites since he was nine, and well-liked by the whole crew.",
      attr: { STR: 2, AGI: 4, WITS: 5, EMP: 3 }, health: 2,
      skills: { mobility: 2, observation: 2, survival: 2, comtech: 3, medicalAid: 1 },
      talent: "Beneath Notice", gear: "M240 Incinerator Unit (1 reload)",
      agenda: "Help your crewmates from the Sotillo get out alive.",
      buddy: "Bein", rival: "—", turns: true
    }
  ];

  /* The players' own crew, pulled back out of the list above — the GM's
     initiative roster offers these by name, and the names have to match what
     the sheets publish, so they are derived rather than typed twice. */
  var PCS = NPCS.filter(function (n) { return n.pc; })
                .map(function (n) { return { id: n.id, name: n.name, role: n.role }; });

  /* ============================================================
     XENOMORPHS  (Appendix I, booklet pp. 36–46)
     Skills only — no attributes. Roll Base Dice equal to the
     skill level. Signature attacks replace close combat.
     ============================================================ */
  var XENOS = [
    {
      id: "bloodburster", group: "Neomorph", name: "Neomorphic Bloodburster", stage: "Stage III",
      speed: 3, health: 2, armor: "3 (zero against fire)",
      skills: { mobility: 9, observation: 6 }, attacks: "bloodburster",
      note: "Born from a Stage III host, always fatally. Takes one Round to free itself from the amniotic sack — hit it now or not at all. Grows into a Neophyte after a few Turns.",
      special: "SPRINT (slow action): move two zones, or straight from an adjacent zone into ENGAGED."
    },
    {
      id: "neophyte", group: "Neomorph", name: "Neophyte (juvenile Neomorph)", stage: "Stage IV",
      speed: 3, health: 4, armor: "4 (2 against fire)",
      skills: { mobility: 10, observation: 6 }, attacks: "neomorph",
      note: "1.2–1.8m, still on all fours. Picks one prey animal out of the pack and ignores its own wounds until they turn critical. Becomes an adult after one Shift.",
      special: "SPRINT (slow action): move two zones, or straight from an adjacent zone into ENGAGED."
    },
    {
      id: "neomorph", group: "Neomorph", name: "Adult Neomorph", stage: "Stage V",
      speed: 2, health: 6, armor: "6 (3 against fire)",
      skills: { mobility: 9, observation: 8 }, attacks: "neomorph",
      note: "2.1m, bipedal, a stealth hunter. Burns itself out and dies of natural causes within 24 hours (four Shifts). A finishing shot to the head is a good idea.",
      special: "SPRINT (slow action): move two zones, or straight from an adjacent zone into ENGAGED."
    },
    {
      id: "revenant", group: "Abomination", name: "“Revenant”", stage: "Stage III",
      speed: 2, health: 8, armor: "3 (none against fire)",
      skills: { mobility: 5, observation: 3 }, attacks: "abomination",
      note: "Handled as a full Xenomorph. Immune to MANIPULATION and to panic; no WITS-based skills except OBSERVATION. Advances to Stage IV within four Shifts.",
      special: "Gelatinous cowl, knuckle-runs like a primate."
    },
    {
      id: "beluga", group: "Abomination", name: "“Beluga-Head”", stage: "Stage IV",
      speed: 2, health: 10, armor: "6 (3 against fire)",
      skills: { mobility: 5, observation: 3 }, attacks: "abomination",
      note: "Complete cellular metamorphosis — nothing human left. One hibernates in Reactor Control, one on the outer hull, and one lies vivisected in the Medlab.",
      special: "Solidified opaque cowl, Armor Rating 6."
    }
  ];

  /* Stage II “Mutant” — not a stat block of its own: a living crew
     member with STRENGTH +3 (Health with it), AGILITY +1, EMPATHY 1
     and Speed 2. Applied to any NPC by GMData.stage2(). */
  var STAGE2 = {
    name: "Stage II “Mutant” Abomination",
    note: "STRENGTH +3 (and Health with it), AGILITY +1, EMPATHY 1. No EMPATHY-based skills, no firearms or tech, immune to MANIPULATION. Speed 2 — acts twice per Round. Attacks other humans on sight; advances to Stage III within one Shift."
  };

  /* ============================================================
     SIGNATURE ATTACK TABLES — roll a D6 or just pick one
     ============================================================ */
  var ATTACKS = {
    bloodburster: {
      name: "Bloodburster attacks",
      rows: [
        { roll: "1–3", hits: [1, 2, 3], name: "Escape",
          text: "With a snarl it flees two zones in a single action, into the nearest air duct if it can. Once line of sight is lost, combat ends and stealth mode begins. After D6 Turns it returns as a Neophyte and starts stalking." },
        { roll: "4", hits: [4], name: "Terrifying Hiss", panic: true,
          text: "It jumps onto the victim, showing its teeth and hissing. The victim makes an immediate Panic Roll." },
        { roll: "5", hits: [5], name: "Leg Bite", dice: 6, damage: 2, panic: true, crit: "#53",
          text: "It bites the victim's leg. Damage inflicts critical injury #53 even if the victim isn't Broken, and triggers an immediate Panic Roll." },
        { roll: "6", hits: [6], name: "Throat Bite", dice: 8, damage: 1, panic: true, crit: "#61",
          text: "It bites the victim's throat. Damage inflicts critical injury #61 even if the victim isn't Broken, and triggers an immediate Panic Roll." }
      ]
    },
    neomorph: {
      name: "Neomorph attacks",
      rows: [
        { roll: "1", hits: [1], name: "Terrifying Hiss", panic: true,
          text: "It leans in close, showing its razor teeth and hissing. The victim makes an immediate Panic Roll." },
        { roll: "2", hits: [2], name: "Tail Slash", dice: 10, damage: 2,
          text: "It pivots and slashes with its sharp tail. Armor piercing — halve any Armor Rating." },
        { roll: "3", hits: [3], name: "Deadly Grab", dice: 8, damage: 1, panic: true,
          text: "It grabs the victim and drags them into the next zone (MEDIUM range) before letting go. The victim falls prone, drops held items and makes an immediate Panic Roll." },
        { roll: "4", hits: [4], name: "Leaping Attack", dice: 8, damage: 1, panic: true,
          bonus: { dice: 10, damage: 2, note: "unblockable, not an action" },
          text: "It jumps at the victim. On a hit the victim is thrown down and makes an immediate Panic Roll, then the Neomorph makes an extra attack with ten Base Dice, Damage 2 — it can't be blocked and doesn't cost an action." },
        { roll: "5", hits: [5], name: "Throat Bite", dice: 8, damage: 1, panic: true, crit: "#61",
          text: "It bites the victim's throat. Damage inflicts critical injury #61 even if the victim isn't Broken, and triggers an immediate Panic Roll." },
        { roll: "6", hits: [6], name: "Tail Spike", dice: 7, damage: 1, crit: "#66",
          text: "It impales the victim on its tail. Armor piercing — halve any Armor Rating. Damage triggers critical injury #66 even if the victim isn't Broken: killed outright." }
      ]
    },
    abomination: {
      name: "Abomination attacks (Stage III & IV)",
      rows: [
        { roll: "1", hits: [1], name: "Horrible Roar", panic: true,
          text: "It screams in fury. Every human at SHORT range makes an immediate Panic Roll." },
        { roll: "2", hits: [2], name: "Fist Strike", dice: 10, damage: 1,
          text: "A powerful punch." },
        { roll: "3", hits: [3], name: "Throw", dice: 9, damage: 1, panic: true,
          text: "It slams the victim into the nearest hard surface. On a hit they land prone at SHORT range, drop held items and make an immediate Panic Roll." },
        { roll: "4", hits: [4], name: "Pounce", dice: 8, damage: 1, panic: true,
          bonus: { dice: 12, damage: 2, note: "immediate bonus attack" },
          text: "It leaps onto the victim like a big monkey. On a hit they're knocked down, drop held items and make an immediate Panic Roll — then it pounds them with twelve Base Dice, Damage 2." },
        { roll: "5", hits: [5], name: "Arm Pull", dice: 6, damage: 1, panic: true, crit: "#54",
          text: "It tries to pull the victim's arm clean off. Damage triggers critical injury #54 even if the victim isn't Broken, and an immediate Panic Roll." },
        { roll: "6", hits: [6], name: "Head Crush", dice: 7, damage: 1, crit: "#64",
          text: "It grabs the victim's head and crushes it. Damage triggers critical injury #64 even if the victim isn't Broken: killed outright." }
      ]
    }
  };

  /* Critical injuries on Xenomorphs — rolled when one hits zero Health */
  var CRITS = {
    name: "Critical injuries on Xenomorphs",
    rows: [
      { roll: "1", hits: [1], name: "Rise Again",
        text: "It falls, seemingly dead — a ruse. If attacked again, or on its next initiative, it regains one Health and rises." },
      { roll: "2", hits: [2], name: "Wounded",
        text: "Bleeding severely: Speed −1 (minimum 1, losing the lowest initiative) but it regains one Health. Roll a D6 at the start of each Round — on 1–3 it tries to escape." },
      { roll: "3", hits: [3], name: "Desperate Action",
        text: "It cries out and immediately takes a fast and a slow action outside the turn order. Roll a D6: on 1–3 it tries to escape (regaining half its Health if it does); on 4–6 it attacks the closest opponent — if that inflicts no damage it dies, if it does it regains one Health." },
      { roll: "4", hits: [4], name: "Last Breath",
        text: "Mortally wounded. On its next initiative it tries to kill the nearest victim, then dies. Wounded again before then, it dies instantly." },
      { roll: "5–6", hits: [5, 6], name: "Torn Apart",
        text: "Instant death, amidst shrieks of rage. So mutilated it can only be Analyzed at OBSERVATION −2." }
    ]
  };

  /* ============================================================
     EVENTS — the GM's arsenal of drama, Acts I–III

     The booklet is explicit that these need not all happen, nor happen in
     the order printed. What follows is a *rough timeline* rather than a
     script: each Act is broken into phases that run top to bottom, with
     the mandatory beats forming the spine and the optional ones sitting in
     the phase where they land most naturally. Events that float free of
     the timeline carry `when`:

       "anytime"     — works in any phase, and often in a later Act too
       "conditional" — fires off a player decision, not off the clock

     Array order IS timeline order; phasesFor() derives the phase list
     from it, so moving an entry moves it on the GM's screen.
     ============================================================ */
  var EVENTS = [
    /* ------------------------- ACT I: PANDORA'S BOX ------------------------- */
    { act: 1, phase: "Waking on the Montero", id: "ping",
      name: "Ping", mandatory: false, roll: "COMTECH",
      text: "MU/TH/UR 6500 reports a ship closing on the Montero when there is none. A sensor diagnosis puts it down to a malfunction, nothing more. (It isn't.)" },
    { act: 1, phase: "Waking on the Montero", id: "nobody-home",
      name: "Nobody's Home", mandatory: true, roll: "COMTECH",
      text: "Sutter's World answers no hails and its beacon tower never pings back — because the Montero is nowhere near the colony. The star charts are off. They are in deep space, between stars." },
    { act: 1, phase: "Waking on the Montero", id: "new-orders",
      name: "New Orders", mandatory: true,
      text: "Mother wants a word with Captain Miller: a distress call from an unknown ship, too garbled to identify. The crew must triangulate it and investigate — company rules, or they forfeit every share." },

    { act: 1, phase: "Closing on the derelict", id: "brace-for-impact",
      name: "Brace for Impact", mandatory: false, roll: "PILOTING −2",
      text: "A starless patch grows in the viewport — a derelict running dark, on a collision course. Failure means severe damage: the FTL drive crippled, explosive decompression in some sections, at least 18 hours (three Shifts) of repairs. The crew are unharmed." },
    { act: 1, phase: "Closing on the derelict", id: "ghost-ship",
      name: "Ghost Ship", mandatory: true,
      text: "The derelict is the USCSS Cronus, a Weyland SEV M3 Heliades-class launched in 2110 and missing for three quarters of a century, dark but for a looping SOS. Salvage is mandated: 1. recover data and samples, 2. escort her to a W-Y facility, 3. save her crew. Hand out the deck plans." },
    { act: 1, phase: "Closing on the derelict", id: "boarding-party",
      name: "Boarding Party", mandatory: true, roll: "PILOTING, then MOBILITY or HEAVY MACHINERY",
      text: "Match speed and course, then spacewalk across or rig the umbilical — the Cronus's main airlock is damaged either way. Someone has to decide who stays behind. Once aboard: stealth mode, and roll air supply after every Turn." },

    { act: 1, phase: "Searching the dark ship", id: "headless-man",
      name: "The Headless Man", mandatory: false, stress: "+1 all present",
      text: "A slumped body in a spacesuit, brain matter on the wall behind it, a Model 37A2 shotgun beside it — and the arms are too long, tearing the compression suit at the forearms. He was a Stage II Abomination with wits enough left to end it. One reload of shells on him, more in the weapon." },
    { act: 1, phase: "Searching the dark ship", id: "movement",
      name: "I've Got Movement", mandatory: false, stress: "+1 all present",
      text: "Motion trackers pick up blips a few zones off that vanish before anyone reaches them. It's the damaged android Ava wandering the ship, or an adult Neomorph woken by the boarding party — or both." },
    { act: 1, phase: "Searching the dark ship", id: "egg-sacs",
      name: "Egg Sacs Afoot", mandatory: false, roll: "OBSERVATION (Analysis)",
      text: "Neomorphic Egg Sacs beyond the ones in the room descriptions. Harmless while the suits stay on. A Scientist can Analyze them to learn more." },
    { act: 1, phase: "Searching the dark ship", id: "hunter-prey",
      name: "Hunter and Prey", mandatory: false, when: "anytime",
      text: "An adult Neomorph hibernating aboard is woken by the crew's arrival and begins to stalk them. It can strike at any time — and this event works just as well in Act II or III." },
    { act: 1, phase: "Searching the dark ship", id: "sensor-ghost-redux",
      name: "Sensor Ghost Redux", mandatory: false, when: "anytime",
      text: "Repair the bridge sensor station and it pings a nearby ship that doesn't appear to exist. It's the Sotillo shadowing them, but nobody can learn that yet. Works in Act II as well, and pays off in Act III." },

    { act: 1, phase: "The ship wakes up", id: "mother-awakes",
      name: "Mother Awakes", mandatory: true,
      text: "The Cronus's MU/TH/UR 2000 comes online in reaction to the boarders, powering the reactor and life support. Temperature climbs, lights come up, vapor hazes the corridors, and after a few Turns the cold and darkness effects lift. The air scrubbers roar into life but deliver nothing — the carbon filters need repairs." },
    { act: 1, phase: "The ship wakes up", id: "sleep-of-ages",
      name: "Sleep of Ages", mandatory: true, roll: "MEDICAL AID (one per survivor)",
      text: "“Warning, cryochambers deactivated.” Over a few Turns the five surviving Cronus crew thaw out — Johns, Reid, Cooper, Flynn and Clayton — amnesiac and acutely disoriented. Each needs medical attention to start recovering, preferably in the Medlab." },
    { act: 1, phase: "The ship wakes up", id: "migraines",
      name: "Mother of All Migraines", mandatory: true, stress: "Panic Roll, all present",
      text: "Cooper's migraines become nonsense, then seizures, then a Bloodburster tearing out through his skull. All present make an immediate Panic Roll. The newborn attacks the nearest PC, then flees into a duct at the first damage — and returns within a few Turns fully grown. Play it in stealth mode." },

    { act: 1, phase: "If they try to leave", id: "out-of-dodge",
      name: "Getting Out of Dodge?", mandatory: false, when: "conditional",
      text: "If the crew try to leave the Cronus behind, MU/TH/UR 6500 triggers the destruction of the Montero under Special Order 966. Run “T-Minus Ten Minutes” now, an Act early." },

    /* ------------------------- ACT II: THE LONG NIGHT ------------------------- */
    { act: 2, phase: "Taking stock", id: "partial-truths",
      name: "Partial Truths", mandatory: true,
      text: "Johns describes LV-1113 and the ancient ruins — Clayton cuts in to call it archaeology. The team brought back artifacts and, with them, spores. Everyone was inoculated, so Johns is confused… until Cooper's still-full syringe turns up in his pocket. Flynn wants anyone who's been out of their suit inoculated immediately." },
    { act: 2, phase: "Taking stock", id: "bad-air",
      name: "Bad Air", mandatory: false,
      text: "Nobody aboard can take a deep breath — the air is stale and heavy with carbon dioxide. Johns knows why: after decades the filters in the central air scrubber shaft need replacing." },

    { act: 2, phase: "The Montero dies", id: "t-minus-ten",
      name: "T-Minus Ten Minutes", mandatory: true, roll: "PILOTING −2", stress: "+1 all PCs",
      text: "Mother, direct to their comms: “Displacement Drive malfunction. Cascade failure imminent. Fission reactor overload in T-minus ten minutes.” She counts down every minute, then every second under thirty. It cannot be stopped — she triggered it herself under Special Order 966. The Montero must be sent away on autopilot; a failed roll and the blast causes explosive decompression in D6 compartments of the Cronus." },
    { act: 2, phase: "The Montero dies", id: "breaking-loose",
      name: "Breaking Loose", mandatory: false, when: "conditional", roll: "HEAVY MACHINERY (cutting torch) or STRENGTH",
      text: "Only if the ships are joined by the passageway umbilical: it won't decouple while the countdown runs. Others can help. If every roll fails, the Cronus tears free under engine power — and takes structural damage doing it." },
    { act: 2, phase: "The Montero dies", id: "no-money",
      name: "No Money", mandatory: false, when: "conditional", roll: "STRENGTH or HEAVY MACHINERY, per tank",
      text: "Someone — Rye or Miller, and they'll insist if they're NPCs — wants the Tritium saved. The Daisy carries ten tanks. A failed roll drops one: roll a Stress Die, and a ✦ destroys the Daisy and kills everyone in the hold. Anything caught outside when the Montero goes takes Blast Power 12." },

    { act: 2, phase: "Making the Cronus fly", id: "change-of-plans",
      name: "Change of Plans", mandatory: true, roll: "COMTECH · HEAVY MACHINERY",
      text: "The Cronus is the only way home now. Comm array: spacewalk, four Turns, COMTECH — with a Stage IV Abomination hibernating on the outer hull. Engines: spacewalk, three Turns, HEAVY MACHINERY — and Reactor Control has to be cleared first. Air scrubbers: filters. Spring other events while they work." },
    { act: 2, phase: "Making the Cronus fly", id: "ava",
      name: "Encountering Ava", mandatory: false,
      text: "A body slumped against a corridor wall — whole, unlike the others. Lift her and the back of her head is slick with white. Repair the wound (rulebook p. 77) and Ava helps: she knows the ship, and the creatures disregard her because she smells wrong." },

    { act: 2, phase: "The crew turn", id: "aggressive-tendencies",
      name: "Aggressive Tendencies", mandatory: true, stress: "Panic Roll, attacked PC",
      text: "The inoculation turns them. One Cronus crew member attacks without warning, in a rage, with no regard for their own survival and no reasoning with them. Then one or two more turn — head-on, or vanishing to stalk and return as Stage III. Keep Clayton back; she has a role in Act III." },
    { act: 2, phase: "The crew turn", id: "infected",
      name: "Infected", mandatory: false, roll: "Sickness Roll vs Virulence 6 (optional)", stress: "+1 per infected PC",
      text: "A PC's skin starts to itch and their head splits — Stage I. Shortly after, Stage II and the rage. Hand over the “Infected Agenda” and “Effects of Infection” cards, let them play out one attack, then take the character over as an NPC and give the player Ava or a Cronus survivor. Lucas can't be infected; don't take Wilson early." },
    { act: 2, phase: "The crew turn", id: "cant-handle-truth",
      name: "You Can't Handle the Truth", mandatory: false,
      text: "Once Ava is repaired, she tells them what the inoculation really does, and that anyone who took the cure could still turn — though they have a chance to resist. She also reveals what's aboard: Agent A0-3959X.91–15. Clayton's precious “artifacts” are weapons." },

    /* ------------------------- ACT III: DIVIDED WE FALL ------------------------- */
    { act: 3, phase: "The ship decides", id: "going-home",
      name: "Going Home", mandatory: false, roll: "COMTECH",
      text: "The engines come back online and MU/TH/UR 2000 immediately locks a course for Earth. The mainframe is under Special Order 966 to bring the Cronus home. No PC can override it." },

    { act: 3, phase: "Clayton's play", id: "medicinal-purposes",
      name: "Medicinal Purposes", mandatory: false,
      text: "Clayton pitches the strain as priceless — cancer, a host of diseases, and a cure that would make the spores harmless if it could be perfected. These things aren't native to LV-1113; they could be on countless worlds. Let the crew react. She will defend herself if attacked." },
    { act: 3, phase: "Clayton's play", id: "mutiny",
      name: "Mutiny!", mandatory: false, when: "conditional", roll: "MANIPULATION",
      text: "Resist her and Clayton starts buying people — Wilson first, if he lives. She wants the 26 Draconis syringes from the Medlab, cash and her MCD cube from the safe, and as much Agent A0-3959X.91–15 loaded into the EEV as she can manage. Failing all that, she'll kidnap Flynn and run." },
    { act: 3, phase: "Clayton's play", id: "infection-spreads",
      name: "The Infection Spreads", mandatory: false,
      text: "While they're busy with Clayton, more PCs succumb to the inoculation — turning player after player into an antagonist, possibly until a single unturned PC is left." },

    { act: 3, phase: "Boarders", id: "prepare-boarded",
      name: "Prepare to be Boarded", mandatory: false, when: "conditional",
      text: "A heavy clang against the hull: the marauder Sotillo has docked and is blasting through the airlock. No compression suits, and no idea what they've walked into. Optional — use it for a twist, a longer game, or replacement PCs; skip it if the finale is already landing." },
    { act: 3, phase: "Boarders", id: "whose-side",
      name: "Who's on Whose Side Now?", mandatory: false,
      text: "Clayton tries to buy the marauders; Bolaji weighs the paycheck against letting these things loose on the Frontier. The PCs have no bargaining chip — but they might board the Sotillo and take her. Her crew can be infected on the Cronus, or turn if they take the inoculation." },

    { act: 3, phase: "Endgame", id: "contamination-protocol",
      name: "Contamination Protocol", mandatory: false, roll: "HEAVY MACHINERY (EEV locks)",
      text: "Lucas moves to stop Weyland-Yutani getting the strain by any means — a confrontation with Clayton is near certain, and sabotaging the Cronus is on the table. Destroy his body and he uploads to the mainframe, triggers a reactor overload and freezes the locks on Clayton's EEV (a Turn of work to release)." },
    { act: 3, phase: "Endgame", id: "run-as-fast",
      name: "Run as Fast as You Can", mandatory: false, roll: "PILOTING −2 (Sotillo)",
      text: "One way or another the Cronus most likely dies. The EEV pod survives automatically; on the Sotillo a failed roll destroys her FTL drive and leaves her adrift. Read “Surviving the Blast” and let them think it's over." },
    { act: 3, phase: "Endgame", id: "it-isnt-over",
      name: "It Isn't Over Until It's Over", mandatory: false, stress: "+1 all inside",
      text: "Stage III or IV Abominations rode out on the Sotillo's hull. Two fists slam the cockpit viewport; on the fourth blow a hairline crack splinters across it. Closing the viewport shields has a good chance of maiming or killing one. Leave them out there and they cripple the ship, and she drifts too." }
    ];

  /* ============================================================
     THE SCENARIO'S ODD LITTLE ROLLS
     ============================================================ */
  var TABLES = [
    { id: "eggsacs",   name: "Egg sac clutch", dice: "2D6", n: 2,
      note: "Bird's-egg-sized pods grow in clutches of 2D6, and there are often several clutches in an infected area." },
    { id: "compart",   name: "Compartments decompressed", dice: "D6", n: 1,
      note: "A failed PILOTING −2 on the Montero's last course: the blast blows out D6 compartments of the Cronus. Pick them for maximum drama." },
    { id: "doses",     name: "Doses on hand", dice: "D6", n: 1,
      note: "Stims, surgical instruments and other Medlab supplies come in D6 doses." },
    { id: "bbgrow",    name: "Turns before it returns", dice: "D6", n: 1,
      note: "After escaping, the Bloodburster grows into a Neophyte in D6 Turns and starts stalking." },
    { id: "generic",   name: "Plain D6", dice: "D6", n: 1,
      note: "For everything else the booklet asks a D6 for." }
  ];

  /* Dice pools that aren't a skill — loaded straight into the roller */
  var POOLS = [
    { id: "blast",     name: "Blast Power 12 — Montero detonation", dice: 12,
      note: "Anything caught outside the Cronus when the Montero goes. The Daisy is crippled and totally decompressed if she's in it." },
    { id: "virulence9", name: "Sickness Roll — Neomorphic Motes", dice: 9,
      note: "Virulence 9. Fail and the patient is Stage III within one Shift; no further Sickness Rolls. You're within your rights to skip the roll and just decide." },
    { id: "virulence6", name: "Sickness Roll — 26 Draconis Strain", dice: 6,
      note: "Virulence 6. Fail and the patient enters Stage I, showing symptoms within a Shift and typically Stage II a Shift later." }
  ];

  /* ============================================================
     HELPERS
     ============================================================ */
  function d6() { return 1 + Math.floor(Math.random() * 6); }
  function pick(arr) { return arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; }

  function npc(id) {
    for (var i = 0; i < NPCS.length; i++) if (NPCS[i].id === id) return NPCS[i];
    return null;
  }
  function xeno(id) {
    for (var i = 0; i < XENOS.length; i++) if (XENOS[i].id === id) return XENOS[i];
    return null;
  }

  /* Base Dice for a human NPC: attribute + skill level. */
  function pool(n, skillKey) {
    if (!n) return 0;
    var s = SKILL_BY_KEY[skillKey];
    if (!s) return 0;
    var a = (n.attr && n.attr[s.attr]) || 0;
    var lv = (n.skills && n.skills[skillKey]) || 0;
    return a + lv;
  }

  /* Every skill an NPC actually has, ready to drop into the roller. */
  function skillsOf(n) {
    var out = [];
    if (!n) return out;
    SKILLS.forEach(function (s) {
      var lv = (n.skills && n.skills[s.key]) || 0;
      if (!lv) return;
      out.push({ key: s.key, name: s.name, short: s.short, attr: s.attr, level: lv, pool: pool(n, s.key) });
    });
    return out;
  }

  /* A Xenomorph rolls its skill level alone — no attributes. */
  function xenoSkillsOf(x) {
    var out = [];
    if (!x || !x.skills) return out;
    SKILLS.forEach(function (s) {
      var lv = x.skills[s.key];
      if (!lv) return;
      out.push({ key: s.key, name: s.name, short: s.short, level: lv, pool: lv });
    });
    return out;
  }

  /* Turn a crew member into a Stage II "Mutant": STRENGTH +3 (Health
     with it), AGILITY +1, EMPATHY 1, Speed 2. EMPATHY skills, firearms
     and tech are gone, so the roller only offers what's left. */
  function stage2(n) {
    if (!n) return null;
    var t = {
      id: n.id + "-stage2", name: n.name + " — Stage II", role: STAGE2.name,
      group: n.group, ship: n.ship, base: n.id, stage2: true,
      attr: { STR: n.attr.STR + 3, AGI: n.attr.AGI + 1, WITS: n.attr.WITS, EMP: 1 },
      health: n.health + 3, speed: 2, skills: {}, talent: "—",
      gear: "No firearms, no technological items", note: STAGE2.note,
      agenda: "Attack every human on sight.", buddy: "—", rival: "—"
    };
    Object.keys(n.skills || {}).forEach(function (k) {
      var s = SKILL_BY_KEY[k];
      if (!s || s.attr === "EMP") return;              // EMPATHY skills can't be used
      if (k === "rangedCombat" || k === "comtech") return;  // no firearms, no tech
      t.skills[k] = n.skills[k];
    });
    return t;
  }

  /* Roll on a signature attack table (or the Xenomorph crit table). */
  function tableRoll(table) {
    var r = d6(), rows = table.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].hits.indexOf(r) !== -1) return { roll: r, entry: rows[i] };
    }
    return { roll: r, entry: rows[rows.length - 1] };
  }
  function drawAttack(key) {
    var t = ATTACKS[key];
    return t ? tableRoll(t) : null;
  }
  function drawCrit() { return tableRoll(CRITS); }

  /* Events of an Act, in timeline order (the array's own order). */
  function eventsFor(act) {
    return EVENTS.filter(function (e) { return e.act === act; });
  }

  /* The Act's phases, in the order they run, derived from the array so the
     data stays the single source of truth. */
  function phasesFor(act) {
    var out = [];
    eventsFor(act).forEach(function (e) {
      var p = e.phase || "";
      if (out.indexOf(p) === -1) out.push(p);
    });
    return out;
  }

  /* Draw an event, timeline-aware.
       opts.skip         array/Set of event ids already run
       opts.optionalOnly skip the mandatory spine (default false)
       opts.phase        confine the draw to one phase
     With none of those it's a plain random pick, as before. Otherwise it
     draws from the EARLIEST phase that still has an eligible event, so what
     you get suits where the group actually is rather than the whole Act. */
  function drawEvent(act, opts) {
    opts = opts || {};
    var skip = opts.skip;
    var has = skip && typeof skip.has === "function"
      ? function (id) { return skip.has(id); }
      : function (id) { return !!skip && skip.indexOf(id) !== -1; };

    var pool = eventsFor(act).filter(function (e) {
      if (opts.phase && e.phase !== opts.phase) return false;
      if (opts.optionalOnly && e.mandatory) return false;
      return !has(e.id);
    });
    if (!pool.length) return null;

    var first = pool[0].phase;
    return pick(pool.filter(function (e) { return e.phase === first; }));
  }

  global.GMData = {
    SKILLS: SKILLS, SKILL_BY_KEY: SKILL_BY_KEY, ATTR_NAME: ATTR_NAME,
    PCS: PCS, NPCS: NPCS, XENOS: XENOS, STAGE2: STAGE2,
    ATTACKS: ATTACKS, CRITS: CRITS, EVENTS: EVENTS, TABLES: TABLES, POOLS: POOLS,
    npc: npc, xeno: xeno, pool: pool, skillsOf: skillsOf, xenoSkillsOf: xenoSkillsOf,
    stage2: stage2, drawAttack: drawAttack, drawCrit: drawCrit, tableRoll: tableRoll,
    eventsFor: eventsFor, phasesFor: phasesFor, drawEvent: drawEvent,
    d6: d6, pick: pick
  };
})(window);
