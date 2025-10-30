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

### Shorthand Function Aliases

All of the following shorthand aliases are available in addition to the original function names. These aliases are particularly useful for live coding where brevity is important.

#### Source Functions
| Original | Alias |
|----------|-------|
| `gradient()` | `grad()` |
| `voronoi()` | `vor()` |
| `noise()` | `noi()` |

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

#### Combine Functions
| Original | Alias |
|----------|-------|
| `mult()` | `mul()` |

#### Array Method Aliases

Hydra uses arrays for sequencing values over time. These methods have shorter aliases:

| Original | Alias |
|----------|-------|
| `fast()` | `f()` |
| `ease()` | `e()` |
| `offset()` | `off()` |

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

**Example:**
```javascript
// Using easing shorthand
osc([10, 20, 30, 40].eiCubic()).out()

// Equivalent to
osc([10, 20, 30, 40].ease('easeInCubic')).out()
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
