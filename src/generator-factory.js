import GlslSource from './glsl-source.js'
import glslFunctions from './glsl/glsl-functions.js'

class GeneratorFactory {
  constructor({
    defaultUniforms,
    defaultOutput,
    extendTransforms = [],
    changeListener = (() => { })
  } = {}
  ) {
    this.defaultOutput = defaultOutput
    this.defaultUniforms = defaultUniforms
    this.changeListener = changeListener
    this.extendTransforms = extendTransforms
    this.generators = {}
    this.init()
  }
  init() {
    const functions = glslFunctions()
    this.glslTransforms = {}
    this.generators = Object.entries(this.generators).reduce((prev, [method, transform]) => {
      this.changeListener({ type: 'remove', synth: this, method })
      return prev
    }, {})

    this.sourceClass = (() => {
      return class extends GlslSource {
      }
    })()



    // add user definied transforms
    if (Array.isArray(this.extendTransforms)) {
      functions.concat(this.extendTransforms)
    } else if (typeof this.extendTransforms === 'object' && this.extendTransforms.type) {
      functions.push(this.extendTransforms)
    }

    return functions.map((transform) => this.setFunction(transform))
  }

  _addMethod(method, transform) {
    const self = this
    this.glslTransforms[method] = transform
    if (transform.type === 'src') {
      const func = (...args) => new this.sourceClass({
        name: method,
        transform: transform,
        userArgs: args,
        defaultOutput: this.defaultOutput,
        defaultUniforms: this.defaultUniforms,
        synth: self
      })
      this.generators[method] = func
      this.changeListener({ type: 'add', synth: this, method })
      
      // Add function aliases for src functions
      if (method === 'gradient') {
        this.generators.grad = this.generators.gradient
        this.changeListener({ type: 'add', synth: this, method: 'grad' })
      } else if (method === 'voronoi') {
        this.generators.vor = this.generators.voronoi
        this.changeListener({ type: 'add', synth: this, method: 'vor' })
      } else if (method === 'noise') {
        this.generators.noi = this.generators.noise
        this.changeListener({ type: 'add', synth: this, method: 'noi' })
      }
      
      return func
    } else {
      this.sourceClass.prototype[method] = function (...args) {
        this.transforms.push({ name: method, transform: transform, userArgs: args, synth: self })
        return this
      }

      // Add function aliases
      if (method.startsWith('modulate')) {
        const aliasName = method.replace('modulate', 'mod')
        this.sourceClass.prototype[aliasName] = this.sourceClass.prototype[method]
        
        // Add additional short aliases for specific modulate functions
        if (method === 'modulateRepeat') {
          this.sourceClass.prototype.modRep = this.sourceClass.prototype[method]
        } else if (method === 'modulateRepeatX') {
          this.sourceClass.prototype.modRepX = this.sourceClass.prototype[method]
        } else if (method === 'modulateRepeatY') {
          this.sourceClass.prototype.modRepY = this.sourceClass.prototype[method]
        } else if (method === 'modulateKaleid') {
          this.sourceClass.prototype.modKal = this.sourceClass.prototype[method]
        } else if (method === 'modulateScrollX') {
          this.sourceClass.prototype.modScrX = this.sourceClass.prototype[method]
        } else if (method === 'modulateScrollY') {
          this.sourceClass.prototype.modScrY = this.sourceClass.prototype[method]
        } else if (method === 'modulateScale') {
          this.sourceClass.prototype.modSca = this.sourceClass.prototype[method]
        } else if (method === 'modulatePixelate') {
          this.sourceClass.prototype.modPix = this.sourceClass.prototype[method]
        } else if (method === 'modulateRotate') {
          this.sourceClass.prototype.modRot = this.sourceClass.prototype[method]
        } else if (method === 'modulateHue') {
          this.sourceClass.prototype.modHue = this.sourceClass.prototype[method]
        }
      } else if (method === 'posterize') {
        this.sourceClass.prototype.pstr = this.sourceClass.prototype.posterize
      } else if (method === 'pixelate') {
        this.sourceClass.prototype.pix = this.sourceClass.prototype.pixelate
      } else if (method === 'brightness') {
        this.sourceClass.prototype.bri = this.sourceClass.prototype.brightness
      } else if (method === 'saturate') {
        this.sourceClass.prototype.sat = this.sourceClass.prototype.saturate
      } else if (method === 'contrast') {
        this.sourceClass.prototype.cont = this.sourceClass.prototype.contrast
      } else if (method === 'repeat') {
        this.sourceClass.prototype.rep = this.sourceClass.prototype.repeat
      } else if (method === 'repeatX') {
        this.sourceClass.prototype.repX = this.sourceClass.prototype.repeatX
      } else if (method === 'repeatY') {
        this.sourceClass.prototype.repY = this.sourceClass.prototype.repeatY
      } else if (method === 'scroll') {
        this.sourceClass.prototype.scr = this.sourceClass.prototype.scroll
      } else if (method === 'scrollX') {
        this.sourceClass.prototype.scrX = this.sourceClass.prototype.scrollX
      } else if (method === 'scrollY') {
        this.sourceClass.prototype.scrY = this.sourceClass.prototype.scrollY
      } else if (method === 'rotate') {
        this.sourceClass.prototype.rot = this.sourceClass.prototype.rotate
      } else if (method === 'thresh') {
        this.sourceClass.prototype.thr = this.sourceClass.prototype.thresh
      } else if (method === 'color') {
        this.sourceClass.prototype.col = this.sourceClass.prototype.color
      } else if (method === 'invert') {
        this.sourceClass.prototype.inv = this.sourceClass.prototype.invert
      } else if (method === 'scale') {
        this.sourceClass.prototype.sca = this.sourceClass.prototype.scale
      } else if (method === 'mult') {
        this.sourceClass.prototype.mul = this.sourceClass.prototype.mult
      }
    }
    return undefined
  }

  setFunction(obj) {
    var processedGlsl = processGlsl(obj)
    if (processedGlsl) this._addMethod(obj.name, processedGlsl)
  }
}

const typeLookup = {
  'src': {
    returnType: 'vec4',
    args: ['vec2 _st']
  },
  'coord': {
    returnType: 'vec2',
    args: ['vec2 _st']
  },
  'color': {
    returnType: 'vec4',
    args: ['vec4 _c0']
  },
  'combine': {
    returnType: 'vec4',
    args: ['vec4 _c0', 'vec4 _c1']
  },
  'combineCoord': {
    returnType: 'vec2',
    args: ['vec2 _st', 'vec4 _c0']
  }
}
// expects glsl of format
// {
//   name: 'osc', // name that will be used to access function as well as within glsl
//   type: 'src', // can be src: vec4(vec2 _st), coord: vec2(vec2 _st), color: vec4(vec4 _c0), combine: vec4(vec4 _c0, vec4 _c1), combineCoord: vec2(vec2 _st, vec4 _c0)
//   inputs: [
//     {
//       name: 'freq',
//       type: 'float', // 'float'   //, 'texture', 'vec4'
//       default: 0.2
//     },
//     {
//           name: 'sync',
//           type: 'float',
//           default: 0.1
//         },
//         {
//           name: 'offset',
//           type: 'float',
//           default: 0.0
//         }
//   ],
//  glsl: `
//    vec2 st = _st;
//    float r = sin((st.x-offset*2/freq+time*sync)*freq)*0.5  + 0.5;
//    float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
//    float b = sin((st.x+offset/freq+time*sync)*freq)*0.5  + 0.5;
//    return vec4(r, g, b, 1.0);
// `
// }

// // generates glsl function:
// `vec4 osc(vec2 _st, float freq, float sync, float offset){
//  vec2 st = _st;
//  float r = sin((st.x-offset*2/freq+time*sync)*freq)*0.5  + 0.5;
//  float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
//  float b = sin((st.x+offset/freq+time*sync)*freq)*0.5  + 0.5;
//  return vec4(r, g, b, 1.0);
// }`

function processGlsl(obj) {
  let t = typeLookup[obj.type]
  if (t) {
    let baseArgs = t.args.map((arg) => arg).join(", ")
    // @todo: make sure this works for all input types, add validation
    let customArgs = obj.inputs.map((input) => `${input.type} ${input.name}`).join(', ')
    let args = `${baseArgs}${customArgs.length > 0 ? ', ' + customArgs : ''}`
    //  console.log('args are ', args)

    let glslFunction =
      `
  ${t.returnType} ${obj.name}(${args}) {
      ${obj.glsl}
  }
`

    // add extra input to beginning for backward combatibility @todo update compiler so this is no longer necessary
    if (obj.type === 'combine' || obj.type === 'combineCoord') obj.inputs.unshift({
      name: 'color',
      type: 'vec4'
    })
    return Object.assign({}, obj, { glsl: glslFunction })
  } else {
    console.warn(`type ${obj.type} not recognized`, obj)
  }

}

export default GeneratorFactory
