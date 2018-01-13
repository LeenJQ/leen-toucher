import Toucher from '../src/index.js'

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
Toucher(document.querySelector('#demo2 .container .can-drag')).swipeStart((_, {target})=>{
  startX = parseInt(target.style.left) || 0
  startY = parseInt(target.style.top) || 0
}).swipe((e, {target, moveX, moveY})=>{
  target.style.left = startX + moveX + 'px'
  target.style.top = startY + moveY + 'px'
})