ios端兼容input光标高度

问题详情描述：
input输入框光标，在安卓手机上显示没有问题，但是在苹果手机上 当点击输入的时候，光标的高度和父盒子的高度一样。例如下图，左图是正常所期待的输入框光标，右边是ios的input光标。
图片
出现原因分析：
通常我们习惯用height属性设置行间的高度和line-height属性设置行间的距离（行高），当点击输入的时候，光标的高度就自动和父盒子的高度一样了。（谷歌浏览器的设计原则，
还有一种可能就是当没有内容的时候光标的高度等于input的line-height的值，当有内容时，光标从input的顶端到文字的底部
解决办法：
高度height和行高line-height内容用padding撑开
.content {
  float: left;
  box-sizing: border-box;
  height: 88px;
  width: calc(100% - 240px);
  .content-input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    color: #333333;
    font-size: 28px;
    //line-height: 88px;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
ios端上下滑动时卡顿、页面缺失

问题详情描述：
在ios端，上下滑动页面时，如果页面高度超出了一屏，就会出现明显的卡顿，页面有部分内容显示不全的情况，例如下图，右图是正常页面，左边是ios上下滑动后，卡顿导致如左图下面部分丢失。
图片
出现原因分析：
笼统说微信浏览器的内核，Android上面是使用自带的WebKit内核，iOS里面由于苹果的原因，使用了自带的Safari内核，Safari对于overflow-scrolling用了原生控件来实现。
对于有-webkit-overflow-scrolling的网页，会创建一个UIScrollView，提供子layer给渲染模块使用。(注：有待考证)
解决办法：
只需要在公共样式加入下面这行代码
*{
  -webkit-overflow-scrolling: touch;
}
But，这个属性是有bug的，比如如果你的页面中有设置了绝对定位的节点，那么该节点的显示会错乱，当然还有会有其他的一些bug。
拓展知识：
-webkit-overflow-scrolling:touch是什么？
-webkit-overflow-scrolling 属性控制元素在移动设备上是否使用滚动回弹效果.auto: 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。touch: 使用具有回弹效果的滚动, 
  当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。
ios键盘唤起后收起页面不归位

问题详情描述：
输入内容，软键盘弹出，页面内容整体上移，但是键盘收起，页面内容不下滑
出现原因分析：
固定定位的元素 在元素内 input 框聚焦的时候 弹出的软键盘占位 失去焦点的时候软键盘消失 但是还是占位的 导致input框不能再次输入 在失去焦点的时候给一个事件
解决办法：
<div class="list-warp">
  <div class="title">
    <span>投·被保险人姓名</span>
  </div>
  <div class="content">
    <input
      class="content-input"
      placeholder="请输入姓名"
      v-model="peopleList.name"
      @focus="changefocus()"
      @blur.prevent="changeBlur()"
    />
  </div>
</div>
changeBlur(){
  let u = navigator.userAgent, app = navigator.appVersion;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if(isIOS){
    setTimeout(() => {
      const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
      window.scrollTo(0, Math.max(scrollHeight - 1, 0))
    }, 200)
  }
}
拓展知识：
position: fixed的元素在ios里，收起键盘的时候会被顶上去，特别是第三方键盘
安卓弹出的键盘遮盖文本框

问题详情描述：
安卓微信H5弹出软键盘后挡住input输入框，如下左图是期待唤起键盘的时候样子，右边是实际唤起键盘的样子
图片
出现原因分析：
待补充
解决办法：
给input和textarea标签添加focus事件，如下，先判断是不是安卓手机下的操作，当然，可以不用判断机型，Document 对象属性和方法，setTimeout延时0.5秒，因为调用安卓键盘有一点迟钝，
导致如果不延时处理的话，滚动就失效了
changefocus(){
  let u = navigator.userAgent, app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  if(isAndroid){
    setTimeout(function() {
      document.activeElement.scrollIntoViewIfNeeded();
      document.activeElement.scrollIntoView();
    }, 500);       
  }
},
拓展知识：
Element.scrollIntoView()方法让当前的元素滚动到浏览器窗口的可视区域内。而Element.scrollIntoViewIfNeeded()方法也是用来将不在浏览器窗口的可见区域内的元素滚动到浏览器窗口的可见区域。
但如果该元素已经在浏览器窗口的可见区域内，则不会发生滚动
问题详情描述：
(Vue中路由使用hash模式，开发微信H5页面分享时在安卓上设置分享成功，但是ios的分享异常,)ios当前页面分享给好友，点击进来是正常，如果二次分享，则跳转到首页；
使用vue router跳转到第二个页面后在分享时，分享设置失败；以上安卓分享都是正常
图片
出现原因分析：
jssdk是后端进行签署，前端校验，但是有时跨域，ios是分享以后会自动带上 from=singlemessage&isappinstalled=0 以及其他参数，分享朋友圈参数还不一样，貌似系统不一样参数也不一样，
但是每次获取url并不能获取后面这些参数
解决办法：
可以使用改页面this.$router.push跳转，为window.location.href去跳转，而不使用路由跳转，这样可以使地址栏的地址与当前页的地址一样，
可以分享成功（适合分享的页面不多的情况下，作为一个单单页运用，这样刷新页面跳转，还是..）
把入口地址保存在本地，等需要获取签名的时候 取出来，注意：sessionStorage.setItem(‘href’,href); 只在刚进入单应用的时候保存！(注：该方法未验证)
