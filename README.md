# Synth Studio

Browser simulators of three classic machines, plus a studio page that runs them side by side in sync.
No build step and no dependencies: plain HTML + JavaScript, sound generated live with the Web Audio API (AudioWorklet).

| Page | Machine |
|---|---|
| `studio.html` | All three on one screen; click one to enlarge it. Shared tempo and **Start all** to launch them on the same downbeat. |
| `index.html` | **FM-1** style 6-operator FM synth: 32 DX7-style algorithms, 12 voices, arpeggiator, 16-step sequencer, MIDI input. |
| `tb303.html` | **TB-303 / TD-3** style acid bass line: resonant filter, accent, slide, 16-step sequencer, 4 patterns. |
| `tr909.html` | **TR-909** style drum machine: 11 synthesized instruments, accent row, shuffle, live recording. |

`skins.js` holds the six shared colour skins (picker in the top-right corner of every page).

## Run

AudioWorklet needs the pages served over http (or opened as local files in Chrome/Edge):

```bash
python -m http.server 8792
```

Then open http://localhost:8792/studio.html.

## Notes

- Approximations, not circuit-accurate emulations; the trademarks belong to their owners.
- Patterns, settings and the chosen skin are saved in the browser's local storage.
