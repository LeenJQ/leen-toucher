import Toucher from '../src/index.js'

/**
 * helper
 */
function range(val, min, max) {
  return val <= 0 ? min : val >= max ? max : val
}

Toucher(document.getElementById('element2')).tap(()=>{
  console.log('taped')
}).tap(()=> {
  console.log('taped also')
}).longTap(()=>{
  console.log('long taped')
}).dbTap(()=> {
  console.log('double Taped')
}).swipe((e)=>{
  console.log('swiping', e)
}).swipeStart(()=>{
  console.log('start swipe')
}).swipeEnd(()=>{
  console.log('end swipe')
})

var startX, startY;
Toucher(document.querySelector('#demo2 .container .can-drag'))
  .swipeStart((_, {target})=>{
    startX = parseInt(target.style.left) || 0
    startY = parseInt(target.style.top) || 0
  }).swipe((e, {target, moveX, moveY})=>{
    target.style.left = startX + moveX + 'px'
    target.style.top = startY + moveY + 'px'
  })

Toucher(document.querySelector('#demo3 .container .swipe-btn'))
  .swipeStart((_, that) => {
    that.state.minX = 0
    that.state.maxX = typeof that.state.maxX === 'undefined' 
      ? document.querySelector('#demo3 .container .swipe-bar').offsetWidth - that.target.offsetWidth
      : that.state.maxX      
    that.state.startX = that.state.startX || 0
  })
  .swipe((e, {target, moveX, state})=>{
    const {startX, minX, maxX} = state
    target.style.left = range(startX + moveX, minX, maxX) + 'px'
  })
  .swipeEnd((e, that)=> {
    const {startX, minX, maxX} = that.state
    that.startX = range(startX + that.moveX, minX, maxX)
  })

Toucher(document.querySelector('#demo4 .container .swipe-btn'))
  .swipeStart((e, that) => {
    const state = that.state
    state.stop = false
    state.minX = 0
    state.parentTarget = document.querySelector('#demo4 .container .swipe-bar')
    state.maxX = typeof state.maxX === 'undefined' 
      ? state.parentTarget.offsetWidth - that.target.offsetWidth
      : state.maxX      
    state.startX = state.startX || 0
  })
  .swipe((e, {target, moveX, state})=>{
    const {startX, minX, maxX, stop, parentTarget} = state
    if(!stop) {
      target.style.left = range(startX + moveX, minX, maxX) + 'px'
    
      if(target.style.left == maxX+'px') {
        parentTarget.parentNode.innerHTML = '<div>解锁成功</div>'
        state.stop = true
      }
    }
  })
  .swipeEnd((e, that)=> {
    const {startX, minX, maxX} = that.state
    that.state.startX = range(startX + that.moveX, minX, maxX)

    if(that.state.startX < maxX) {
      that.state.startX = 0
      that.target.style.left = 0+'px'
    }
  })

Toucher(document.querySelector('#demo5 .container .box'))
  .do(({state})=>{
    state.trigger = false
    state.menue = document.querySelector('#demo5 .container .menue')
    state.menue.style.display = 'none'
  })
  .longTap((e, {state})=>{
    state.trigger = !state.trigger
    state.menue.style.display = state.trigger ? 'block' : 'none'     
  })
  