class TextSource {
  constructor (regl, width, height, str, opts = {}) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')
    this.tex = regl.texture(this.canvas)
    this.str = str
    this.opts = opts
    this._isDynamic = typeof str === 'function'
    this._lastStr = null

    this._draw(this._isDynamic ? str() : str)
  }

  _draw (str) {
    if (str === this._lastStr) return
    this._lastStr = str

    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height
    const opts = this.opts

    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = opts.bg !== undefined ? opts.bg : 'black'
    ctx.fillRect(0, 0, w, h)

    const fontSize = opts.fontSize || Math.floor(h / 8)
    ctx.font = opts.font || `${fontSize}px system-ui`
    ctx.fillStyle = opts.color || 'white'
    ctx.textAlign = opts.align || 'center'
    ctx.textBaseline = opts.baseline || 'middle'

    const lines = String(str).split('\n')
    const lineHeight = opts.lineHeight || fontSize * 1.2
    const totalHeight = lineHeight * (lines.length - 1)
    const startY = h / 2 - totalHeight / 2

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], w / 2, startY + i * lineHeight)
    }

    this.tex.subimage(this.canvas)
  }

  getTexture () {
    if (this._isDynamic) {
      this._draw(this.str())
    }
    return this.tex
  }
}

export default TextSource
