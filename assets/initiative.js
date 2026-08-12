/* ============================================================
   CHARIOT OF THE GODS — INITIATIVE DECK
   ------------------------------------------------------------
   The ALIEN RPG initiative deck, shared across the table.

   In the game every combatant draws one card from a deck of
   ten numbered 1–10 when a fight starts. Lowest number acts
   first, and the order stands for the whole fight — nobody
   redraws each round. A creature with Speed 2 or more draws
   one card per point of Speed and acts on each of them.

   Here, one screen is the dealer: the GM Control console holds
   the deck, draws the cards and publishes the whole order over
   the roll bus (assets/rollbus.js). The player sheets and the
   main display follow along, and a player can ask the dealer
   for a card from their own sheet.

   Everything degrades the way the rest of the kit does: with
   no network the dealer still runs the fight on the GM's own
   phone, and the followers simply say the deck isn't reachable.

   Public API (window.Initiative):
     Initiative.deal(bus, opts)   -> dealer  (GM control)
     Initiative.follow(bus, fn)   -> follower (sheet, display)
     Initiative.order(state)      -> the cards, in acting order
     Initiative.turn(state)       -> index of the card acting now
     Initiative.mine(state, cid)  -> that client's own cards
     Initiative.SIZE              -> 10, the size of the deck
   ============================================================ */
(function (global) {
  "use strict";

  var SIZE = 10;                       // cards in the deck: 1–10

  function shuffle() {
    var a = [], i, j, t;
    for (i = 1; i <= SIZE; i++) a.push(i);
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function uid(prefix) {
    return prefix + Date.now().toString(36).slice(-4) +
      Math.random().toString(36).slice(2, 6);
  }

  function emptyState() {
    return {
      rev: 0,          // bumped on every change, so stale packets can be dropped
      fight: null,     // id of the current fight — changes when a new one starts
      active: false,
      round: 1,
      turnId: null,    // id of the card acting right now
      cards: [],
      deckLeft: SIZE,
      decks: 1         // how many times the deck has been dealt through
    };
  }

  /* Cards act low to high; two on the same number act in the order drawn
     (which only happens once the ten are gone and a second deck comes out). */
  function order(state) {
    if (!state || !state.cards) return [];
    return state.cards.slice().sort(function (a, b) {
      return (a.n - b.n) || (a.seq - b.seq);
    });
  }

  function turn(state) {
    var o = order(state), i;
    if (!state || !state.turnId) return -1;
    for (i = 0; i < o.length; i++) if (o[i].id === state.turnId) return i;
    return -1;
  }

  function mine(state, cid) {
    if (!state || !state.cards || !cid) return [];
    return order(state).filter(function (c) { return c.owner === cid; });
  }

  function isMsg(o) {
    return !!o && (o.kind === "init" || o.kind === "init-req");
  }

  /* ============================================================
     DEALER — holds the deck. One per room (the GM's console).
     ============================================================ */
  function deal(bus, opts) {
    opts = opts || {};
    var st = emptyState();
    var deck = shuffle();
    var seq = 0;                       // draw order, for stable sorting
    var lastHello = 0;
    var onChange = opts.onChange || function () {};

    function commit() {
      st.rev++;
      st.deckLeft = deck.length;
      /* publish a copy: the local echo hands the very same object to any
         follower on this page, and the dealer keeps mutating its own. */
      bus.publish({ kind: "init", state: JSON.parse(JSON.stringify(st)) });
      onChange(st);
    }

    function take() {
      if (!deck.length) { deck = shuffle(); st.decks++; }
      return deck.pop();
    }

    /* A card handed back goes into the remaining deck at a random spot,
       so a redraw can turn it up again exactly as a real deck would. */
    function give(n) {
      if (!n) return;
      deck.splice(Math.floor(Math.random() * (deck.length + 1)), 0, n);
    }

    function makeCard(c, gid, part, of) {
      seq++;
      return {
        id: uid("c-"), gid: gid, n: take(), seq: seq,
        who: c.who || "?", role: c.role || "", type: c.type || "npc",
        owner: c.owner || null, part: part, of: of
      };
    }

    function firstCard() { var o = order(st); return o.length ? o[0].id : null; }

    /* Keep the turn pointer on a card that still exists. */
    function anchor() {
      if (st.turnId && turn(st) !== -1) return;
      st.turnId = firstCard();
    }

    var API = {
      state: function () { return st; },
      order: function () { return order(st); },
      turn:  function () { return turn(st); },

      /* Add a combatant and draw for them. Speed 2+ draws one card per point. */
      add: function (c) {
        var gid = uid("g-"), speed = Math.max(1, Math.min(6, (c.speed | 0) || 1)), i;
        if (!st.active) { st.active = true; st.round = 1; st.fight = uid("f-"); }
        for (i = 0; i < speed; i++) st.cards.push(makeCard(c, gid, i + 1, speed));
        anchor();
        commit();
        return gid;
      },

      /* A player asking for a card from their own sheet — one per client. */
      join: function (c) {
        var found = API.find(c.owner, c.who);
        if (found) return found;
        return API.add({
          who: c.who, role: c.role, type: "pc", owner: c.owner, speed: 1
        });
      },

      find: function (owner, who) {
        var hit = null, name = String(who || "").toLowerCase();
        st.cards.forEach(function (c) {
          if (hit) return;
          if (owner && c.owner === owner) hit = c.gid;
          else if (!c.owner && name && String(c.who).toLowerCase() === name) hit = c.gid;
        });
        return hit;
      },

      /* Hand a combatant's cards back and draw again. */
      redraw: function (gid) {
        st.cards.forEach(function (c) {
          if (c.gid !== gid) return;
          give(c.n); c.n = take(); seq++; c.seq = seq;
        });
        anchor();
        commit();
      },

      remove: function (gid) {
        var dropped = st.turnId && st.cards.some(function (c) {
          return c.gid === gid && c.id === st.turnId;
        });
        var after = dropped ? API.after(st.turnId) : null;
        st.cards = st.cards.filter(function (c) {
          if (c.gid !== gid) return true;
          give(c.n);
          return false;
        });
        if (dropped) st.turnId = after;
        anchor();
        commit();
      },

      /* id of the card that acts after this one, ignoring the round roll-over */
      after: function (id) {
        var o = order(st), i;
        for (i = 0; i < o.length; i++) if (o[i].id === id) break;
        return o.length ? (o[i + 1] || o[0]).id : null;
      },

      /* Two combatants trading cards — allowed by agreement at the table. */
      swap: function (idA, idB) {
        var a = null, b = null, n;
        st.cards.forEach(function (c) {
          if (c.id === idA) a = c;
          if (c.id === idB) b = c;
        });
        if (!a || !b || a === b) return false;
        n = a.n; a.n = b.n; b.n = n;
        commit();
        return true;
      },

      next: function () {
        var o = order(st), i = turn(st);
        if (!o.length) return;
        if (i === -1) { st.turnId = o[0].id; }
        else if (i + 1 >= o.length) { st.round++; st.turnId = o[0].id; }
        else { st.turnId = o[i + 1].id; }
        commit();
      },

      prev: function () {
        var o = order(st), i = turn(st);
        if (!o.length) return;
        if (i <= 0) {
          if (st.round > 1) { st.round--; st.turnId = o[o.length - 1].id; }
          else st.turnId = o[0].id;
        } else st.turnId = o[i - 1].id;
        commit();
      },

      /* A fresh fight: same faces, new shuffle, everyone draws again. */
      begin: function () {
        deck = shuffle(); st.decks = 1;
        st.fight = uid("f-"); st.active = true; st.round = 1;
        seq = 0;
        st.cards.forEach(function (c) { seq++; c.n = take(); c.seq = seq; });
        st.turnId = firstCard();
        commit();
      },

      end: function () {
        deck = shuffle(); st.decks = 1; seq = 0;
        st.active = false; st.round = 1; st.turnId = null;
        st.cards = []; st.fight = null;
        commit();
      },

      publish: function () { commit(); }
    };

    /* Requests from the sheets: a player drawing, dropping out, or a screen
       joining the room and asking what the current order is. */
    bus.on("msg", function (o) {
      if (!o || o.kind !== "init-req" || o.src === bus.clientId) return;
      var owner = o.owner || o.src, gid;
      if (o.op === "hello") {
        var now = Date.now();
        if (now - lastHello < 400) return;      // several screens waking at once
        lastHello = now;
        commit();
      } else if (o.op === "draw") {
        API.join({ owner: owner, who: o.who, role: o.role });
      } else if (o.op === "leave") {
        gid = API.find(owner, o.who);
        if (gid) API.remove(gid);
      }
    });

    return API;
  }

  /* ============================================================
     FOLLOWER — a sheet or the main display, reading the order.
     ============================================================ */
  function follow(bus, onState) {
    var st = null, dealer = null, seenAt = 0;

    bus.on("msg", function (o) {
      if (!o || o.kind !== "init" || !o.state) return;
      if (st && o.src === dealer && o.state.rev < st.rev) return;   // stale packet
      dealer = o.src; st = o.state; seenAt = Date.now();
      try { onState(st); } catch (e) {}
    });

    var API = {
      state: function () { return st; },
      /* when the dealer was last heard from — 0 means never */
      seenAt: function () { return seenAt; },
      mine: function () { return mine(st, bus.clientId); },
      hello: function () { bus.publish({ kind: "init-req", op: "hello" }); },
      draw: function (who, role) {
        bus.publish({
          kind: "init-req", op: "draw", who: who, role: role, owner: bus.clientId
        });
      },
      leave: function (who) {
        bus.publish({ kind: "init-req", op: "leave", who: who, owner: bus.clientId });
      }
    };

    /* Ask for the current order a few times as the page comes up — the relay
       takes a moment to connect, and a dropped hello is otherwise a blank panel. */
    [300, 1500, 5000].forEach(function (ms) { setTimeout(API.hello, ms); });

    return API;
  }

  global.Initiative = {
    SIZE: SIZE,
    deal: deal, follow: follow,
    order: order, turn: turn, mine: mine, isMsg: isMsg
  };
})(window);
