import * as Tone from 'tone'

let synth = null
let started = false
let muted = true

function ensureSynth() {
  if (!synth) {
    synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.1 },
      volume: -18,
    }).toDestination()
  }
  return synth
}

export async function unlockAudio() {
  if (!started) {
    await Tone.start()
    started = true
  }
}

export function setMuted(v) {
  muted = v
}

export function isMuted() {
  return muted
}

export function playHover() {
  if (muted || !started) return
  ensureSynth().triggerAttackRelease('C6', 0.02)
}

export function playClick() {
  if (muted || !started) return
  ensureSynth().triggerAttackRelease('A5', 0.05)
}

export function playSuccess() {
  if (muted || !started) return
  const s = ensureSynth()
  const now = Tone.now()
  s.triggerAttackRelease('E5', 0.06, now)
  s.triggerAttackRelease('A5', 0.08, now + 0.08)
}
