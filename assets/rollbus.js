/* ============================================================
   CHARIOT OF THE GODS — ROLL BUS
   ------------------------------------------------------------
   A tiny, backend-free way to make a dice roll on one device
   show up on every other screen in the room — the player
   sheets, the MU/TH/UR main display, and the M314 tracker the
   GM holds ("the gym phone").

   Two transports, used together:
     1. BroadcastChannel — instant sync between tabs/windows on
        the SAME browser (e.g. GM running display + tracker).
     2. ntfy.sh pub/sub  — cross-DEVICE sync over the open web.
        No account, no server, no build step. Everyone in a
        "room" publishes to and subscribes from the same public
        topic (cotg-rolls-<room>).

   Everything degrades gracefully: if the network is blocked the
   local echo and BroadcastChannel still work, so a roll is never
   lost on the device that made it.

   The bus also carries the table's other shared traffic — the
   initiative deck (assets/initiative.js) rides on it — so
   'roll' only fires for actual dice, and 'msg' fires for
   everything. A roll-log listener wants 'roll'; anything
   speaking its own protocol wants 'msg'.

   Public API (window.RollBus):
     RollBus.config({ room })   -> join a room, start listening
     RollBus.on('roll', fn)     -> fn(rollObject) on every roll
     RollBus.on('msg', fn)      -> fn(payload) on every message
     RollBus.on('status', fn)   -> fn({net:bool}) on connectivity
     RollBus.publish(obj)       -> broadcast to the room
     RollBus.setRoom(code)      -> switch rooms live
     RollBus.room()             -> current room slug
   ============================================================ */
(function (global) {
  "use strict";

  var NTFY = "https://ntfy.sh";
  var seen = new Set();                 // de-dupe by roll id (BC + ntfy + echo)
  var room = null, topic = null, es = null, bc = null;
  var handlers = { roll: [], msg: [], status: [] };
  var ROLLS = { roll: 1, push: 1, panic: 1, supply: 1 };   // kinds a roll log shows
  var clientId = Math.random().toString(36).slice(2, 10);

  function slug(s) {
    return (String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "").slice(0, 32)) || "montero";
  }

  function defaultRoom() {
    try {
      var u = new URLSearchParams(location.search).get("room");
      if (u) return slug(u);
    } catch (e) {}
    try {
      var s = localStorage.getItem("cotg_room");
      if (s) return slug(s);
    } catch (e) {}
    return "montero";
  }

  function emit(type, data) {
    (handlers[type] || []).forEach(function (fn) {
      try { fn(data); } catch (e) {}
    });
  }

  function handleIncoming(obj) {
    if (!obj || !obj.id) return;
    if (seen.has(obj.id)) return;
    seen.add(obj.id);
    if (seen.size > 800) { seen.clear(); seen.add(obj.id); }
    emit("msg", obj);
    /* untagged payloads are rolls from before the bus carried anything else */
    if (!obj.kind || ROLLS[obj.kind]) emit("roll", obj);
  }

  function openSSE() {
    if (es) { try { es.close(); } catch (e) {} es = null; }
    if (typeof EventSource === "undefined") { emit("status", { net: false }); return; }
    try {
      es = new EventSource(NTFY + "/" + topic + "/sse");
      es.onopen = function () { emit("status", { net: true }); };
      es.onerror = function () { emit("status", { net: false }); };
      es.onmessage = function (ev) {
        var d;
        try { d = JSON.parse(ev.data); } catch (e) { return; }
        if (d.event && d.event !== "message") return;   // skip open/keepalive
        var p;
        try { p = JSON.parse(d.message); } catch (e) { return; }
        handleIncoming(p);
      };
    } catch (e) { es = null; emit("status", { net: false }); }
  }

  function connect() {
    try {
      bc = new BroadcastChannel("cotg-rolls");
      bc.onmessage = function (e) {
        if (e.data && e.data.room === room) handleIncoming(e.data.payload);
      };
    } catch (e) { bc = null; }
    openSSE();
  }

  var Bus = {
    clientId: clientId,

    config: function (opts) {
      opts = opts || {};
      room = slug(opts.room || defaultRoom());
      try { localStorage.setItem("cotg_room", room); } catch (e) {}
      topic = "cotg-rolls-" + room;
      connect();
      return room;
    },

    on: function (type, fn) {
      (handlers[type] = handlers[type] || []).push(fn);
      return this;
    },

    room: function () { return room; },

    setRoom: function (code) {
      room = slug(code);
      try { localStorage.setItem("cotg_room", room); } catch (e) {}
      topic = "cotg-rolls-" + room;
      openSSE();
      return room;
    },

    publish: function (payload) {
      payload = payload || {};
      if (!payload.id) {
        payload.id = clientId + "-" + Date.now() + "-" +
          Math.random().toString(36).slice(2, 6);
      }
      payload.room = room;
      payload.src = clientId;
      if (!payload.ts) payload.ts = Date.now();

      handleIncoming(payload);                     // instant local echo
      if (bc) { try { bc.postMessage({ room: room, payload: payload }); } catch (e) {} }
      try {
        fetch(NTFY + "/" + topic, {
          method: "POST",
          body: JSON.stringify(payload)
        }).catch(function () {});
      } catch (e) {}
      return payload;
    }
  };

  global.RollBus = Bus;
})(window);
