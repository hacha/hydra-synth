# Hydra-Synth (Fork)

This is a fork of [hydra-synth](https://github.com/ojack/hydra-synth) with enhanced shorthand syntax and additional features for live coding.

For detailed documentation about Hydra itself, please visit:
- [Original repository](https://github.com/ojack/hydra-synth)
- [Getting Started Guide](https://github.com/ojack/hydra#basic-functions)
- [Interactive Function Documentation](https://ojack.xyz/hydra-functions/)
- [Hydra Book by Naoto Hieda](https://hydra-book.naotohieda.com/#/)

## Changes from Original

### New Features

#### `mirror()` Function
Added `mirror()` coordinate transformation for mirroring visual effects.

**Parameters:**
- `axis` (default: 0.5): The x-axis position to mirror around

**Example:**
```javascript
osc().mirror(0.5).out()
```

#### `PI` Constant
Added `PI` constant as a global shorthand for `Math.PI`.

**Example:**
```javascript
// Before
osc().rotate(Math.PI / 4).out()

// After
osc().rotate(PI / 4).out()
```

#### `noise1()` Function
Added `noise1()` source function that generates 1D noise varying only with time. This provides a uniform value across the entire screen that changes over time - useful as a lightweight alternative to the `noise().pix(1,1)` workaround.

**Parameters:**
- `scale` (default: 1): Speed of time variation
- `offset` (default: 0): Initial phase offset (useful when using multiple noise1 calls)

**Example:**
```javascript
// Basic usage - uniform value that changes over time
noise1().out()

// Modulate with time-varying noise
osc().modulate(noise1(), 0.1).out()

// Using alias
noi1(2).out()

// Multiple independent noise values with different offsets
solid(noise1(1, 0), noise1(1, 100), noise1(1, 200)).out()
```

#### `aspect()` Function
Added `aspect()` (alias: `asp()`) coordinate transformation that scales the Y coordinate based on window aspect ratio. This is useful for maintaining correct proportions when the window is resized.

**Parameters:**
- `ratio` (default: dynamic `window.innerHeight / window.innerWidth`): The aspect ratio to apply

**Example:**
```javascript
// Maintain circle shape regardless of window size
shape(100).aspect().out()

// Custom aspect ratio
osc().aspect(0.5).out()
```

#### `text()` Function
Added `text()` for rendering text as a source, without consuming HydraSource slots (s0-s3). Text is rendered to an internal Canvas2D and used as a texture. Supports dynamic text via function arguments, multiline (`\n`), and customizable font/color/size.

**Parameters:**
- `str` (default: `''`): Text string to render, or a function that returns a string (for dynamic updates)
- `fontSize` (optional): Font size in pixels (default: canvas height / 8)
- `opts` (optional): Object with additional options:
  - `font`: CSS font string (default: `'<fontSize>px system-ui'`)
  - `color`: Text color (default: `'white'`)
  - `bg`: Background color (default: `'black'`)
  - `align`: Text alignment (default: `'center'`)
  - `baseline`: Text baseline (default: `'middle'`)
  - `lineHeight`: Line height in pixels (default: `fontSize * 1.2`)

**Example:**
```javascript
// Basic text
text('hello').out()

// Custom font size
text('hydra', 80).out()

// Dynamic text (re-evaluated each frame)
text(() => new Date().toLocaleTimeString()).out()

// Multiline with options
text('line1\nline2', { color: 'cyan', bg: 'transparent' }).out()

// Use as a source in transform chains
text('wow').rot(0.1).color(1, 0, 0).out()
```

#### `src()` Wrap Option
Added a `wrap` parameter to `src()` to control whether the source texture repeats (tiles) when coordinates go outside the `[0,1]` range. By default, `src()` repeats the texture (existing behavior). Set `wrap` to `0` to clamp instead, which is useful when applying coordinate transforms like `scale()` to a source buffer.

**Parameters:**
- `tex`: Source texture (output buffer or source)
- `wrap` (default: 1): Set to `1` for repeat (default), `0` for clamp (no repeat)

**Example:**
```javascript
// Default: texture repeats when scaled down
sha(3).out(o1)
src(o1).sca(.5).out(o0) // repeats around the edges

// With wrap=0: no repeat, edges are clamped
sha(3).out(o1)
src(o1, 0).sca(.5).out(o0) // no repeat
```

#### `saw()` Array Method
Added `saw()` (alias: `s()`) for sawtooth-style array interpolation. Unlike normal interpolation which smoothly transitions from the last element back to the first, `saw()` skips that transition - the value jumps immediately to the first element and continues interpolating from there.

**Example:**
```javascript
// Normal interpolation: 0 → 1 → 0 → 1 → ...
osc([0, 1]).out()

// Sawtooth: 0 → 1, jump to 0 → 1, jump to 0 → ...
osc([0, 1].saw()).out()

// Using alias
osc([0, 1].s()).out()
```

#### `hold()` Array Method
Added `hold()` (alias: `h()`) for holding each array element before transitioning to the next. `hold(h)` extends each step by `h` (in step units): each value is held for `h` and then interpolated to the next over `1`. So `hold(.5)` makes each value last 1.5 steps (0.5 held + 1 transitioning), and `hold(1)` doubles each step (1 held + 1 transitioning). Useful for replacing repetitive value patterns like `[0, 0, 1, 1, 2, 2]` with concise `[0, 1, 2].lin().hold(.5)`.

**Example:**
```javascript
// Hold each value briefly, then interpolate
osc([0, 1, 2].lin(1).hold(.5)).out()

// hold(1): held for one step, then transitions over the next step (no jumps)
osc([0, 1].lin(1).hold(1)).out()

// Using alias
osc([0, 1, 2].lin(1).h(.5)).out()

// Works with any easing
osc([10, 50].sin(1).hold(.3)).out()
```

When `hold > 0`, the step is anchored at integer boundaries (no centering shift), so the held value occupies the beginning of each (stretched) step and the transition reaches the target exactly at the step end — eliminating jumps even at large hold values.

#### `kaleid()` / `modulateKaleid()` Smoothness Parameter
Added a `smoothness` parameter (default: `0`) to `kaleid()` and `modulateKaleid()`. When `0`, behavior matches the original (hard mirror seams). Larger values smooth the polar fold so that the kaleidoscope seams become rounded rather than creased.

**Parameters:**
- `nSides` (default: 4): Number of mirrored slices
- `smoothness` (default: 0): Smoothing amount applied to the fold. Useful range is roughly `0`–`2`; higher values flatten the kaleidoscope toward a single direction. Based on gaz's polar smooth fold (`asin(sin(θ·n)/(k+1))/n`).

**Example:**
```javascript
osc(20, 0.1, 1).kaleid(6, 0.5).out()
osc(20, 0.1, 1).modulateKaleid(noise(3), 6, 0.5).out()
```

#### `gamma()` Function
Added `gamma()` for gamma correction. Applies `pow(color, amount)` per channel, lifting shadows and midtones while keeping pure black and white unchanged — unlike `brightness()`, which adds a flat offset and can blow out highlights. This makes it well suited to brightening dark camera input (e.g. low-light club footage) so detail becomes visible without clipping bright lights.

**Parameters:**
- `amount` (default: 0.5): Gamma exponent. `1.0` is no change; values below `1.0` brighten (lower = stronger lift, e.g. `0.3`); values above `1.0` darken. Negative inputs are clamped to `0` to avoid `NaN`.

**Example:**
```javascript
// Brighten dark webcam input while preserving bright lights
s0.initCam()
src(s0).gamma(0.4).out()
```

#### `toLog()` / `fromLog()` Log-Polar Space
Added a pair of coordinate transforms that warp the image into **log-polar ("log") space** and back, so you can sandwich ordinary coordinate ops between them and have them act on the logarithm of the coordinate. `toLog()` interprets the coordinate (relative to a center) as a complex number and enters log space; `fromLog()` is its exact inverse. Because hydra applies coordinate transforms innermost-first, write them in the natural order `src().toLog().<ops>().fromLog()`.

The point of log-polar space is a change of algebra: **multiplication becomes addition**. So a plain translation in log space turns into a scale/rotation in the original image:
- A shift on **x** (e.g. `scrollX`) → **zoom** (radius scales by `e^shift`)
- A shift on **y** (e.g. `scrollY`) → **rotation** (one full turn over a height of `1.0`)
- A **`repeat`** → **self-similar (Droste) tiling** — concentric, infinitely-nested copies

**Parameters (both functions):**
- `centerX` (default: 0.5), `centerY` (default: 0.5): The origin of the log-polar mapping. **Must match between `toLog()` and `fromLog()`** for the round trip to cancel (the defaults already match).

**Notes:**
- Because hydra's `scroll`/`repeat` ops wrap with `fract()`, the zoom is a *self-similar tiling* zoom, not an unbounded clean zoom — which is what produces the nested, spiralling look.
- The center is a singularity (`log(0) = -∞`), so expect noise at the exact center point.

**Example:**
```javascript
// Continuous zoom-spiral: a slow horizontal scroll in log space
osc(20, 0.1, 1).toLog().scrollX(0, 0.05).fromLog().out()

// Droste tiling: repeating the log-radius axis nests the image into itself
osc(30, 0.1, 1).toLog().repeatX(3).fromLog().out()

// Rotation via a vertical scroll in log space
noise(3).toLog().scrollY(0, 0.05).fromLog().out()
```

#### `spiral()` Log-Polar Shear
Added `spiral()`, a coordinate shear meant to sit between `toLog()` and `fromLog()`. It shifts the log-radius in proportion to the angle, so straight features become **logarithmic spirals** and one full turn zooms the radius by `e^arms`.

The point of the `arms` parameter is seamless meshing on round numbers: **integer `arms` align the spiral seam with the radial period (`×e`)**, so paired with `repeatX()` or a self-similar (feedback) source the spiral closes cleanly; non-integer values leave an open spiral seam. (The radial seam is fundamental for a non-self-similar source — `arms` controls where it lands and how many times it wraps, not whether it exists.)

**Parameters:**
- `arms` (default: 1): Number of radial periods per full turn. Integers mesh seamlessly; `0` is identity. Negative values wind the spiral the other way.

**Example:**
```javascript
// Single-arm spiral
osc(30, 0.1, 1).toLog().spiral(1).fromLog().out()

// Three-arm spiral
osc(30, 0.1, 1).toLog().spiral(3).fromLog().out()

// To close the radial seam, give it a self-similar source — e.g. a feedback
// loop, where each frame is a zoomed copy of the last (tune to taste):
src(o0).scale(0.96).toLog().spiral(1).fromLog().blend(osc(30, 0.1, 1), 0.03).out(o0)
```

### Shorthand Function Aliases

All of the following shorthand aliases are available in addition to the original function names. These aliases are particularly useful for live coding where brevity is important.

#### Source Functions
| Original | Alias |
|----------|-------|
| `gradient()` | `grad()` |
| `voronoi()` | `vor()` |
| `noise()` | `noi()` |
| `noise1()` | `noi1()` |
| `shape()` | `sha()` |
| `solid()` | `sol()` |

#### Modulate Functions
All `modulateXXX()` functions have `modXXX` aliases. Additionally, some have even shorter aliases:

| Original | Standard Alias | Short Alias |
|----------|---------------|-------------|
| `modulate()` | `mod()` | - |
| `modulateRepeat()` | `modRepeat()` | `modRep()` |
| `modulateRepeatX()` | `modRepeatX()` | `modRepX()` |
| `modulateRepeatY()` | `modRepeatY()` | `modRepY()` |
| `modulateKaleid()` | `modKaleid()` | `modKal()` |
| `modulateScrollX()` | `modScrollX()` | `modScrX()` |
| `modulateScrollY()` | `modScrollY()` | `modScrY()` |
| `modulateScale()` | `modScale()` | `modSca()` |
| `modulatePixelate()` | `modPixelate()` | `modPix()` |
| `modulateRotate()` | `modRotate()` | `modRot()` |
| `modulateHue()` | `modHue()` | - |

#### Color & Effect Functions
| Original | Alias |
|----------|-------|
| `posterize()` | `pstr()` |
| `brightness()` | `bri()` |
| `saturate()` | `sat()` |
| `contrast()` | `cont()` |
| `thresh()` | `thr()` |
| `color()` | `col()` |
| `invert()` | `inv()` |
| `colorama()` | `colama()` |
| `luma()` | `lu()` |

#### Coordinate Transform Functions
| Original | Alias |
|----------|-------|
| `pixelate()` | `pix()` |
| `repeat()` | `rep()` |
| `repeatX()` | `repX()` |
| `repeatY()` | `repY()` |
| `scroll()` | `scr()` |
| `scrollX()` | `scrX()` |
| `scrollY()` | `scrY()` |
| `rotate()` | `rot()` |
| `scale()` | `sca()` |
| `aspect()` | `asp()` |

#### Combine Functions
| Original | Alias |
|----------|-------|
| `mult()` | `mul()` |
| `layer()` | `lay()` |
| `blend()` | `ble()` |

#### Array Method Aliases

Hydra uses arrays for sequencing values over time. These methods have shorter aliases:

| Original | Alias |
|----------|-------|
| `fast()` | `f()` |
| `ease()` | `e()` |
| `offset()` | `off()` |
| `saw()` | `s()` |
| `hold()` | `h()` |

**Example:**
```javascript
// Using shorthand
osc([10, 20, 30].f(2).off(0.5)).out()

// Equivalent to
osc([10, 20, 30].fast(2).offset(0.5)).out()
```

#### Easing Function Shortcuts

Shorthand methods for applying easing functions to arrays:

| Shorthand | Equivalent |
|-----------|------------|
| `lin()` | `ease('linear')` |
| `sin()` | `ease('sin')` |
| `eiCubic()` | `ease('easeInCubic')` |
| `eoCubic()` | `ease('easeOutCubic')` |
| `eCubic()` | `ease('easeInOutCubic')` |
| `eiQuad()` | `ease('easeInQuad')` |
| `eoQuad()` | `ease('easeOutQuad')` |
| `eQuad()` | `ease('easeInOutQuad')` |
| `eiQuart()` | `ease('easeInQuart')` |
| `eoQuart()` | `ease('easeOutQuart')` |
| `eQuart()` | `ease('easeInOutQuart')` |
| `eiQuint()` | `ease('easeInQuint')` |
| `eoQuint()` | `ease('easeOutQuint')` |
| `eQuint()` | `ease('easeInOutQuint')` |

All easing shortcuts accept an optional `speed` argument for more concise syntax:

**Example:**
```javascript
// Using easing shorthand
osc([10, 20, 30, 40].eiCubic()).out()

// Equivalent to
osc([10, 20, 30, 40].ease('easeInCubic')).out()

// With speed argument (new)
osc([0, 1].eCubic(2)).out()

// Equivalent to
osc([0, 1].ease('easeInOutCubic').fast(2)).out()
```

### Example Usage

```javascript
// Using shorthand syntax for functions
osc().rot(PI/4).mod(noi(3)).sat(2).cont(1.5).out()

// Equivalent using original syntax
osc().rotate(Math.PI/4).modulate(noise(3)).saturate(2).contrast(1.5).out()

// Using shorthand with arrays and easing
osc([10, 20, 30].f(2).eiQuad()).rot([0, PI].sin()).out()

// Equivalent using original syntax
osc([10, 20, 30].fast(2).ease('easeInQuad')).rotate([0, Math.PI].ease('sin')).out()
```

## Installation

### Via npm
```bash
npm install --save hydra-synth
```

### As a bundled script
```html
<script src="https://unpkg.com/hydra-synth"></script>
<script>
  const hydra = new Hydra({ detectAudio: false })
  osc().rot(PI/4).out()
</script>
```

## Quick Start

### ES Modules
```javascript
import Hydra from 'hydra-synth'

const hydra = new Hydra({ detectAudio: false })
osc(4, 0.1, 1.2).out()
```

### CommonJS
```javascript
const Hydra = require('hydra-synth')

const hydra = new Hydra({ detectAudio: false })
osc(4, 0.1, 1.2).out()
```

## Development

```bash
npm run dev      # Start development server on port 8000
npm run build    # Build distribution file
```

## License

See [original repository](https://github.com/ojack/hydra-synth) for license information.
