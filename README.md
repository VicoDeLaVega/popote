# Synth Studio

Browser simulators of three classic machines, and a studio page where several people can jam on them together.
Plain HTML + JavaScript in the browser (sound generated live with the Web Audio API), plus a tiny Python server for multiplayer.

| Page | Machine |
|---|---|
| `index.html` | **Studio**: the three machines, with + buttons to add more and ▶ / ■ on each one. Click a machine to enlarge it. Shared tempo, **Start all** on the same downbeat, and multiplayer rooms. |
| `fm1.html` | **FM-1** style 6-operator FM synth: 32 DX7-style algorithms, 12 voices, arpeggiator, 16-step sequencer. |
| `tb303.html` | **TB-303 / TD-3** style acid bass line: resonant filter, accent, slide, 16-step sequencer, 4 patterns. |
| `tr909.html` | **TR-909** style drum machine: 11 synthesized instruments, accent row, shuffle, live recording. |

`skins.js` holds the six shared colour skins (picker in the top-right corner of every page).
`visuals.js` draws audio-reactive cyberpunk fractal worlds (WebGL) behind the studio: three worlds that switch every 8 bars,
deformed by the bass and lit by the highs. **⛶ VJ mode** hides the machines and shows only the visuals (Esc to come back).

## Playing together

Everyone who opens the studio with the same `?room=` name shares one session: knobs, patterns, steps,
tempo and Start/Stop are synced, and notes played live are heard by the others. Each player's browser
generates the full sound locally, so only small control messages travel over the network.
Use **Copy invite link** to share the room.

## MIDI controllers

Use Chrome or Edge (Web MIDI needs https or localhost; Safari has no Web MIDI).
On a machine's own page, every connected controller plays it. In the studio, the **MIDI** row lists each controller:
by default it plays the **selected machine** (the one you clicked last, marked 🎹), or pick a machine for it in its menu.
The TB-303 plays the notes you send (legato = slide, hard hits = accent); the TR-909 follows the General MIDI drum map
(pads on notes 36-51), other keys walk the instrument rows from C. The routing is saved per browser.

## Run locally

```bash
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt     # macOS/Linux: .venv/bin/pip
.venv/Scripts/python server.py                    # macOS/Linux: .venv/bin/python
```

Then open http://localhost:8000. Other people on the same Wi-Fi can join at `http://<your-PC-IP>:8000`.

## Put it online (free, on Render)

1. Push this repo to GitHub.
2. On https://render.com, sign in with GitHub, then **New → Blueprint** and pick this repo.
   `render.yaml` sets everything up (Python, `pip install`, `python server.py`).
3. Render gives you a URL such as `https://popote.onrender.com`. Share it with `?room=yourroom`.

The free plan sleeps after 15 minutes without visitors; the first visit after that takes about a minute to wake it up.
Sessions live in the server's memory, so they reset when it restarts.

Opening the HTML files without the server (or on GitHub Pages) still works, in solo mode.
A static copy can also join a hosted server with `?server=wss://popote.onrender.com/ws`.

## Notes

- Approximations, not circuit-accurate emulations; the trademarks belong to their owners.
- Patterns, settings and the chosen skin are also saved in each browser's local storage.
