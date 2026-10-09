"""Synth Studio server: serves the static pages and relays shared state between players.

Players join a room (?room=name). The server keeps the latest state of every machine and the
transport per room, so late joiners get the current session, and relays live notes to the others.
"""
import json
import os
import time
from pathlib import Path

from aiohttp import WSMsgType, web

ROOT = Path(__file__).parent
MAX_MSG = 256 * 1024
rooms = {}  # name -> {"clients": set, "state": {inst: {path: value}}, "transport": dict | None}


def room_of(name):
    return rooms.setdefault(name, {"clients": set(), "state": {}, "transport": None})


async def broadcast(room, msg, skip=None):
    data = json.dumps(msg)
    for ws in list(room["clients"]):
        if ws is not skip and not ws.closed:
            try:
                await ws.send_str(data)
            except ConnectionResetError:
                pass


async def ws_handler(request):
    ws = web.WebSocketResponse(heartbeat=25, max_msg_size=MAX_MSG)
    await ws.prepare(request)
    name = (request.query.get("room") or "main")[:40]
    room = room_of(name)
    room["clients"].add(ws)
    await ws.send_str(json.dumps({"t": "welcome", "room": name, "state": room["state"],
                                  "transport": room["transport"], "peers": len(room["clients"])}))
    await broadcast(room, {"t": "peers", "n": len(room["clients"])}, skip=ws)
    try:
        async for raw in ws:
            if raw.type != WSMsgType.TEXT:
                continue
            try:
                m = json.loads(raw.data)
            except ValueError:
                continue
            t = m.get("t")
            if t == "ping":
                await ws.send_str(json.dumps({"t": "pong", "c": m.get("c"), "s": time.time() * 1000}))
            elif t == "set" and isinstance(m.get("changes"), dict):
                inst = str(m.get("inst"))[:20]
                room["state"].setdefault(inst, {}).update(m["changes"])
                await broadcast(room, {"t": "set", "inst": inst, "changes": m["changes"]}, skip=ws)
            elif t == "get":
                inst = str(m.get("inst"))[:20]
                await ws.send_str(json.dumps({"t": "state", "inst": inst, "state": room["state"].get(inst, {})}))
            elif t == "note":
                await broadcast(room, {"t": "note", "inst": m.get("inst"), "msg": m.get("msg")}, skip=ws)
            elif t == "transport" and isinstance(m.get("transport"), dict):
                room["transport"] = m["transport"]
                await broadcast(room, {"t": "transport", "transport": m["transport"]}, skip=ws)
    finally:
        room["clients"].discard(ws)
        await broadcast(room, {"t": "peers", "n": len(room["clients"])})
        if not room["clients"]:
            # keep the session for a while so a quick reload doesn't lose it; drop empty rooms beyond 50
            if len(rooms) > 50:
                rooms.pop(name, None)
    return ws


async def index(request):
    return web.FileResponse(ROOT / "index.html")


def make_app():
    app = web.Application()
    app.router.add_get("/ws", ws_handler)
    app.router.add_get("/", index)
    for f in ("index.html", "fm1.html", "tb303.html", "tr909.html", "skins.js", "visuals.js"):
        app.router.add_get("/" + f, lambda r, f=f: web.FileResponse(ROOT / f))
    return app


if __name__ == "__main__":
    web.run_app(make_app(), host=os.environ.get("HOST", "0.0.0.0"), port=int(os.environ.get("PORT", 8000)))
