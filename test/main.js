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