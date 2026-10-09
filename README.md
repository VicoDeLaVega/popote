# Synth Studio

Browser simulators of three classic machines, and a studio page where several people can jam on them together.
Plain HTML + JavaScript in the browser (sound generated live with the Web Audio API), plus a tiny Python server for multiplayer.

| Page | Machine |
|---|---|
| `index.html` | **Studio**: two rows (A and B) of all three machines. Click one to enlarge it. Shared tempo, **Start all** on the same downbeat, and multiplayer rooms. |
| `fm1.html` | **FM-1** style 6-operator FM synth: 32 DX7-style algorithms, 12 voices, arpeggiator, 16-step sequencer, MIDI input. |
| `tb303.html` | **TB-303 / TD-3** style acid bass line: resonant filter, accent, slide, 16-step sequencer, 4 patterns. |
| `tr909.html` | **TR-909** style drum machine: 11 synthesized instruments, accent row, shuffle, live recording. |

`skins.js` holds the six shared colour skins (picker in the top-right corner of every page).

## Playing together

Everyone who opens the studio with the same `?room=` name shares one session: knobs, patterns, steps,
tempo and Start/Stop are synced, and notes played live are heard by the others. Each player's browser
generates the full sound locally, so only small control messages travel over the network.
Use **Copy invite link** to share the room.

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
