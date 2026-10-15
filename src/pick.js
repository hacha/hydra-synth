// pick(index, fade, scene0, scene1, ...) - switch between scenes with a cross-fade.
// Ported from Neodelic (PickState in ParamEvaluator.cs).
//
// pick is sugar for scene0.blend(scene1, w1).blend(scene2, w2)... where the weights are
// solved on the CPU every frame. A blend chain lets later scenes overwrite earlier ones,
// so a fade from i to j is "weight 1 for the lower index, progress (or 1 - progress) for
// the higher one, 0 for the rest" - a cross-fade between just those two scenes.
//
// Progress accumulates from the beat delta, so evaluating the weights several times per
// frame does not change the speed, and moving time backwards only pauses the fade.

import arrayUtils from './lib/array-utils.js'

// beats in the same unit as one array step: time * bpm / 60
const toBeats = ({ time, bpm }) => time * bpm / 60

const evalParam = (param, props) => {
  if (typeof param === 'function') return param(props)
  if (Array.isArray(param)) return arrayUtils.getValue(param)(props)
  return param
}

// fraction is truncated, out of range is clamped to the ends, NaN is scene 0
export const toScene = (index, count) => {
  if (!(index >= 1)) return 0
  if (index >= count - 1) return count - 1
  return Math.floor(index)
}

export class PickState {
  constructor (index, fade, count) {
    this.index = index
    this.fade = fade
    this.count = count
    this.from = 0
    this.to = 0
    this.progress = 1
    this.lastBeats = NaN
  }

  // weight for the blend of scene (1..count-1)
  weight (scene, props) {
    this.step(props)
    if (this.progress >= 1) return scene === this.to ? 1 : 0

    const lo = Math.min(this.from, this.to)
    const hi = Math.max(this.from, this.to)
    if (scene === lo) return 1
    if (scene === hi) return this.to === hi ? this.progress : 1 - this.progress
    return 0
  }

  step (props) {
    const target = toScene(evalParam(this.index, props), this.count)
    const beats = toBeats(props)
    if (Number.isNaN(this.lastBeats)) {
      // the first evaluation starts at the current scene without fading
      this.from = this.to = target
      this.progress = 1
      this.lastBeats = beats
      return
    }

    const fade = evalParam(this.fade, props)
    const delta = beats - this.lastBeats
    this.lastBeats = beats
    if (this.progress < 1 && delta > 0) {
      this.progress = fade > 0 ? Math.min(this.progress + delta / fade, 1) : 1
    }

    if (target === this.to) return
    if (this.progress >= 1) {
      this.from = this.to
      this.progress = 0
    } else if (target === this.from) {
      // coming back: retrace from the current mix (the only interruption without a jump)
      this.from = this.to
      this.progress = 1 - this.progress
    } else {
      // three scenes cannot be mixed, so restart from the heavier one (the image jumps here)
      this.from = this.progress >= 0.5 ? this.to : this.from
      this.progress = 0
    }
    this.to = target
    if (!(fade > 0)) this.progress = 1
  }
}

export default function createPick (src) {
  return function pick (index, fade, ...scenes) {
    if (scenes.length === 0) throw new Error('pick: needs at least one scene')
    if (typeof fade === 'number' && fade < 0) throw new Error('pick: fade must not be negative')
    if (fade === undefined) fade = 0

    // a buffer name (o1, s0) is the same as src(o1)
    scenes = scenes.map((scene) => scene && scene.getTexture ? src(scene) : scene)

    // a constant index keeps only that scene
    if (typeof index === 'number' || index === undefined) {
      return scenes[toScene(index === undefined ? 0 : index, scenes.length)]
    }

    const state = new PickState(index, fade, scenes.length)
    return scenes.slice(1).reduce(
      (chain, scene, i) => chain.blend(scene, (props) => state.weight(i + 1, props)),
      scenes[0]
    )
  }
}
