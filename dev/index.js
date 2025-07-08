
const Hydra = require('./../')
// import Hydra from './../src/index.js'
const loop = require('raf-loop')
const { fugitiveGeometry, exampleVideo, exampleResize, nonGlobalCanvas } = require('./examples.js')

// console.log('HYDRA', Hydra)
// const HydraShaders = require('./../shader-generator.js')

function init() {

    //   const canvas = document.createElement('canvas')
    //   canvas.style.backgroundColor = "#000"
    //   canvas.width = 800
    //   canvas.height = 200
    //   document.body.appendChild(canvas)
    //   // canvas.style.width = '100%'
    //   // canvas.style.height = '100%'
    // //  exampleCustomCanvas()



    var hydra = new Hydra({ detectAudio: false, makeGlobal: true })

    // Test noise shorthand noi()
    // noi()
    // .modScale(vor(4, .9).thr(.6, 0), .1)
    // .bri(-.3)
    // .pstr(6)
    // .rot(0, .3)
    // .sca([1, 1.5].smooth())
    // .pix(160, 9999)
    // .mul(grad().scr(.0, .0, 0, .2))
    // .cont(.84)
    // .modRep(osc(2))
    // .inv([0, 1])
    // .col(1, .43, 1.93)
    // .sat(2)
    // .out()

    solid()
    .add(shape(4,.1).scrY(.2).scrX([-.2,.2].eoQuint()))
    .add(shape(4,.1).scrY(-.0).scrX([-.2,.2].eQuart()))
    .add(shape(4,.1).scrY(-.2).scrX([-.2,.2].eiCubic()))
    .add(shape(4,.1).scrY(-.4).scrX([-.2,.2].lin()))
    .out()

    // console.log(hydra)
    // window.hydra = hydra
    // exampleVideo()
    // exampleResize()
    //nonGlobalCanvas()

    //s0.initVideo("https://media.giphy.com/media/26ufplp8yheSKUE00/giphy.mp4", {})
    //src(s0).repeat().out()
}

window.onload = init
