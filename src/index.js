import {supportTouch} from './env'

const TAP_DELAY_TIME = 200
const DB_TAP_DELAY_TIME = 190
const LONG_TAP_DELAY_TIME = 500
/**
 * Toucher 类
 * @constructor
 * @param {DOM} target - 绑定的DOM对象
 */
class Toucher {
  constructor(
    target
  ) {
    // init data
    Object.assign(this, {
      target,
      events: {},
      touchStartTime: 0,
      lastTouchTime: 0,
      x1:0,y1:0,x2:0,y2:0,
      isLongTap: false, // 用来在 touchend 时判断是否为长按
      longTapTimer: null,
      singleTapTimer: null
    })

    // 初始化内部事件函数
    const _usedMehod = ['tap', 'fastTap','longTap', 'dbTap']
    for(let m of _usedMehod) {
      this[m] = (fn, option) => {
        this.register(m, fn, option)
        return this
      }
    }
  }

  /**
   * 初始化事件绑定
   */
  init() {
    this.target.addEventListener('touchstart', this._proxy('touchStart'))
    this.target.addEventListener('touchend', this._proxy('touchEnd'))
    // DOM.addEventListener('touchmove',touchmove);
    // DOM.addEventListener('touchcancel',actionOver);
  }

  /**
   * 调用所有向事件类型注册的回调
   * 
   * @param {String} type - 事件类型
   * @param {Event} e - 事件对象
   */
  _emit(type, e) {
    const fns = this.events[type]
    if(fns) {
      for(var fn of fns) {
        fn.call(this, e, this)
      }
    }
  }
  
  /**
   * 订阅模式，注册回调函数
   * 
   * @param {DOM} target - 绑定的DOM 对象
   * @param {String} type - 事件类型 (tap, longTap...)
   * @param {Function} fn - 回调注册
   * @param {Object} Option - 配置对象
   */
  _addEvent(
    target, 
    type, 
    fn, 
    option={}) {
    if(!target || !target.nodeType) {return false}

    if(typeof this.events[type] === 'undefined') {
      this.events[type] = []         
    }

    this.events[type].push(fn)    
  }

  /**
   * 简单的代理函数
   * 这里绑定了 this 作用域
   * 
   * @param {String} type - 事件类型
   */
  _proxy(type) {
    var that = this
    return function(e) {
      // 防止冒泡
      if (e.stopPropagation) { 
        e.stopPropagation() 
      }

      e.preventDefault()

      that[type](e)
    }
  }

  /**
   * start touch
   * 
   * @param {Event} e 
   */
  touchStart(e) {
    this.isLongTap = false
    
    // 这里记录最新的触摸信息
    Object.assign(this, {
			x1: e.touches[0].pageX,
			y1: e.touches[0].pageY,
			x2: 0,
			y2: 0,
      touchStartTime: new Date()
    })

    // 把上一次的定时器清除
    clearTimeout(this.longTapTimer);
		this.longTapTimer = setTimeout(()=>{
      // 如果超过 LONG_TAP_DELAY_TIME，判定为长按事件  
      this.isLongTap = true    
      this._emit('longTap',e);
    }, LONG_TAP_DELAY_TIME);
  }

  /**
   * touch ended
   * 
   * @param {Event} e 
   */
  touchEnd(e) {
    // 如果已经是长按事件，其他事件不触法
    if(this.isLongTap) {
      return;
    }

    // 到这都没有触发 longTapTimer， 
    // 说明不是长按事件
    clearTimeout(this.longTapTimer);    
    
    var now = new Date()
    if(now - this.lastTouchTime > TAP_DELAY_TIME) {
      this._emit('fastTap', e)
      this.singleTapTimer = setTimeout(()=>{         
        this._emit('tap', e)
      }, DB_TAP_DELAY_TIME)
    } else {
      clearTimeout(this.singleTapTimer)
      this._emit('dbTap', e)
    }
    this.lastTouchTime = now
  }

  /**
   * 注册事件函数
   * 外部可访问接口
   * 
   * @param {String} type - 事件类型
   * @param {Function} fn - 回调
   * @param {Object} option - 配置
   */
  register(type, fn, option) {
    this._addEvent(this.target, type, fn, option)
  }
}

export default (target, option)=>{ 
  if(!supportTouch) {
    console.log('当前环境不支持触摸手势')
    return null
  }
 
  const t = new Toucher(target, option)
  t.init()
  return t
}