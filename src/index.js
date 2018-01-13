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
      x1:0,y1:0,x2:0,y2:0,moveX:0, moveY:0,
      isLongTap: false, // 用来在 touchend 时判断是否为长按
      longTapTimer: null,
      singleTapTimer: null,
      _isActive: true  // 当false 时，停止一切监听
    })

    // 注册默认的事件函数
    const _usedMehod = [
      'tap', 
      'longTap', 
      'dbTap', 
      'swipeStart', 
      'swipe', 
      'swipeEnd'
    ]
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
    this.target.addEventListener('touchstart', this._proxy('touchStart'),  false)
    this.target.addEventListener('touchend', this._proxy('touchEnd'),  false)
    this.target.addEventListener('touchmove', this._proxy('touchMove'),  false)
    // DOM.addEventListener('touchcancel',actionOver);
  }

  /**
   * 停止一切监听
   */
  stop() {
    this._stopWatchLongTap()
    this._isActive = false
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
   * 停止监听长按事件
   */
  _stopWatchLongTap() {
    clearTimeout(this.longTapTimer);        
  }

  /**
   * start touch
   * 
   * @param {Event} e 
   */
  touchStart(e) {
    this.isLongTap = false
    this._isActive = true
    
    // 这里记录最新的触摸信息
    Object.assign(this, {
			x1: e.touches[0].pageX,
			y1: e.touches[0].pageY,
			x2: 0,
      y2: 0,
      moveX: 0,
      moveY: 0,
      touchStartTime: new Date()
    })

    this._emit('swipeStart', e.touches[0])

    // 把上一次的定时器清除
    this._stopWatchLongTap()
    // 延时判断是否为长按事件
		this.longTapTimer = setTimeout(()=>{
      // 如果超过 LONG_TAP_DELAY_TIME，判定为长按事件  
      this.isLongTap = true    
      this._emit('longTap',e);
    }, LONG_TAP_DELAY_TIME);
  }

  /**
   * touch moving
   * 
   * @param {Event} e - 事件对象
   */
  touchMove(e) {
    this.stop()

    // 当前坐标
    const curX = e.touches[0].pageX
    const curY = e.touches[0].pageY
    
    // 更新最后坐标
    Object.assign(this, {
      x2: curX,
      y2: curY,
      moveX: curX - this.x1,  // 计算移动 x 距离
      moveY: curY - this.y1,  // 计算移动 y 距离
      touchStartTime: new Date()
    })
    
    this._emit('swipe', e.touches[0])
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

    this._emit('swipeEnd', e.touches[0])    

    // 到这都没有触发 longTapTimer， 
    // 说明不是长按事件
    this._stopWatchLongTap()

    if(!this._isActive) {
      return false
    }
    
    var now = new Date()
    if(!this.events['dbTap'] || this.events['dbTap'].length == 0){
      // 如果未绑定双击，直接判定为单击      
      this._emit('tap', e)
    } else if(now - this.lastTouchTime > TAP_DELAY_TIME) {
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

const factory = (target, option)=>{ 
  if(!supportTouch) {
    console.log('当前环境不支持触摸手势')
    return null
  }

  const t = new Toucher(target, option)
  t.init()
  return t
}

if(window && !window.leenToucher ) {
  window.leenToucher = factory
}

export default factory