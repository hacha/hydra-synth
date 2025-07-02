# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hydra-Synth Overview

Hydra-Synth is a WebGL-based live coding visual synthesizer that provides a functional DSL for creating complex visual effects. The library transforms GLSL functions into chainable JavaScript methods.

## Key Commands

### Development
```bash
npm run dev      # Start development server on port 8000
npm run dev-ssl  # Start SSL development server
npm run build    # Build dist/hydra-synth.js
```

## Architecture

### Core Components

1. **HydraRenderer** (src/hydra-synth.js): Main class managing WebGL context, rendering loop, and transform chains
2. **Output** (src/output.js): Manages output buffers with ping-pong buffering for feedback effects
3. **Source** (src/hydra-source.js): Handles input sources (video, webcam, screen capture)
4. **GeneratorFactory** (src/generator-factory.js): Dynamically generates JavaScript DSL from GLSL functions

### Rendering Pipeline

- Sources (s0-s3) → Transform chains → Output buffers (o0-o3)
- Ping-pong buffering enables feedback effects
- Each output buffer can be used as a source for other transforms

### Function Categories in GLSL

Located in `src/glsl/glsl-functions.js`:
- `src`: Source generators (osc, noise, voronoi, shape)
- `color`: Color transforms (brightness, contrast, saturate, invert)
- `coord`: Coordinate transforms (rotate, scale, pixelate, repeat)
- `combine`: Blending operations (diff, mult, add, blend)
- `combineCoord`: Coordinate-based combinations (modulate, modulateRotate)

## Important Implementation Details

### Hydra Instance Options
```javascript
{
  canvas: null,        // Use existing canvas element
  width: 1280,         
  height: 720,         
  autoLoop: true,      // Auto render loop
  makeGlobal: true,    // Add functions to global namespace
  detectAudio: true,   // Enable audio analysis
  numSources: 4,       
  numOutputs: 4,       
  precision: null,     // Shader precision ('highp'/'mediump'/'lowp')
  extendTransforms: [] // Custom transform functions
}
```

### iOS Compatibility
- Always use `highp` precision for iOS devices
- Video autoplay requires user interaction
- MediaSource API is not supported

### Vite Integration
Add to vite.config.js to avoid "global is not defined" error:
```javascript
define: {
  global: {},
},
```

## Key Files to Understand

1. **src/hydra-synth.js**: Core rendering logic and WebGL setup
2. **src/generator-factory.js**: DSL generation from GLSL - understand how chainable methods are created
3. **src/glsl/glsl-functions.js**: All visual transform definitions
4. **src/output.js**: Ping-pong buffering implementation for feedback effects
5. **dev/editor.js**: Example of integrating Hydra with CodeMirror editor

## Development Notes

- The library uses CommonJS modules with browserify for bundling
- Each GLSL function in `glsl-functions.js` automatically becomes a chainable method
- Transform chains are compiled into fragment shaders at runtime
- The `regl` library provides the WebGL abstraction layer
- Audio reactivity uses the Meyda library for real-time audio feature extraction