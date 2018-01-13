# leen-toucher

轻量级的手势库，支持

* 轻击(tap)
  > 如果未绑定 dbTap，则会尽快响应

  > 如果绑定了 dbTap，延时 190ms，用来判定是否为双击
* 双击(dbTap)
  > 两次Tap间隔在200ms内视为双击
* 滑动
  * swipeStart
  * swipe
    > 滑动中，会停止 tap, dbTap, longTap
  * swipeEnd
* 长按(longTap)
  > Tap 持续500ms，视为长按
* 缩放
* 旋转

