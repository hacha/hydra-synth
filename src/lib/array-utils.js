// WIP utils for working with arrays
// Possibly should be integrated with lfo extension, etc.
// to do: transform time rather than array values, similar to working with coordinates in hydra

import easing from './easing-functions.js'

var map = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export default {
  init: () => {

    Array.prototype.fast = function(speed = 1) {
      this._speed = speed
      return this
    }
    
    Array.prototype.f = Array.prototype.fast

    Array.prototype.smooth = function(smooth = 1) {
      this._smooth = smooth
      return this
    }

    Array.prototype.ease = function(ease = 'linear') {
      if (typeof ease == 'function') {
        this._smooth = 1
        this._ease = ease
      }
      else if (easing[ease]){
        this._smooth = 1
        this._ease = easing[ease]
      }
      return this
    }
    
    Array.prototype.e = Array.prototype.ease

    Array.prototype.lin = function() {
      return this.ease('linear')
    }

    Array.prototype.sin = function() {
      return this.ease('sin')
    }
    
    Array.prototype.eiCubic = function() {
      return this.ease('easeInCubic')
    }
    
    Array.prototype.eoCubic = function() {
      return this.ease('easeOutCubic')
    }
    
    Array.prototype.eCubic = function() {
      return this.ease('easeInOutCubic')
    }
    
    Array.prototype.eiQuad = function() {
      return this.ease('easeInQuad')
    }
    
    Array.prototype.eoQuad = function() {
      return this.ease('easeOutQuad')
    }
    
    Array.prototype.eQuad = function() {
      return this.ease('easeInOutQuad')
    }
    
    Array.prototype.eiQuart = function() {
      return this.ease('easeInQuart')
    }
    
    Array.prototype.eoQuart = function() {
      return this.ease('easeOutQuart')
    }
    
    Array.prototype.eQuart = function() {
      return this.ease('easeInOutQuart')
    }
    
    Array.prototype.eiQuint = function() {
      return this.ease('easeInQuint')
    }
    
    Array.prototype.eoQuint = function() {
      return this.ease('easeOutQuint')
    }
    
    Array.prototype.eQuint = function() {
      return this.ease('easeInOutQuint')
    }

    Array.prototype.offset = function(offset = 0.5) {
      this._offset = offset%1.0
      return this
    }
    
    Array.prototype.off = Array.prototype.offset

    // Array.prototype.bounce = function() {
    //   this.modifiers.bounce = true
    //   return this
    // }

    Array.prototype.fit = function(low = 0, high =1) {
      let lowest = Math.min(...this)
      let highest =  Math.max(...this)
      var newArr = this.map((num) => map(num, lowest, highest, low, high))
      newArr._speed = this._speed
      newArr._smooth = this._smooth
      newArr._ease = this._ease
      return newArr
    }
  },

  getValue: (arr = []) => ({time, bpm}) =>{
    let speed = arr._speed ? arr._speed : 1
    let smooth = arr._smooth ? arr._smooth : 0
    let index = time * speed * (bpm / 60) + (arr._offset || 0)

    if (smooth!==0) {
      let ease = arr._ease ? arr._ease : easing['linear']
      let _index = index - (smooth / 2)
      let currValue = arr[Math.floor(_index % (arr.length))]
      let nextValue = arr[Math.floor((_index + 1) % (arr.length))]
      let t = Math.min((_index%1)/smooth,1)
      return ease(t) * (nextValue - currValue) + currValue
    }
    else {
      const val = arr[Math.floor(index % (arr.length))]
      return arr[Math.floor(index % (arr.length))]
    }
  }
}
