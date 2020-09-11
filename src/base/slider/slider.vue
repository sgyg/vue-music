<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script>
import { addClass } from "common/js/dom";
import BScroll from "better-scroll";
export default {
  name: "slider",
  data() {
    return {
      dots: [], //小点个数
      currentPageIndex: 0 //当前banner处在第几页
    };
  },
  props: {
    loop: {
      // 是否无缝循环
      type: Boolean,
      default: true
    },
    autoplay: {
      // 自动播放
      type: Boolean,
      default: true
    },
    interval: {
      // 自动播放间隔时间
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      if (this.autoplay) {
        this._play();
      }
    }, 20);
    window.addEventListener("resize", () => {
      // 监听页面变化
      if (!this.slider) {
        // 第一次渲染
        return;
      }
      // 重新获取宽度
      this._setSliderWidth(true);
      // 重新计算
      this.slider.refresh();
    });
  },
  methods: {
    _setSliderWidth(isResize) {
      // 设置 slider-group 的总宽度和单个图片的宽度，并且添加类名
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let clientWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = clientWidth + "px";
        width += clientWidth;
      }
      // 如果是 loop 为 true 时整体 slider-group 的长度加两个 slider 的宽度
      if (this.loop && !isResize) {
        width += 2 * clientWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initSlider() {
      // 实例化 better-scroll 设置相关的 loop 等
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      });
      // 每次滑动结束触发 scroll-end 方法
      this.slider.on("scrollEnd", () => {
        // 获取当前轮播图的页数
        let pageIndex = this.slider.getCurrentPage().pageX;
        if (this.loop) {
          // 如果当前 loop 为 true 页数减一
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;
        if (this.autoplay) {
          // 如果设置 autoplay, 当第一次自动播放结束时，清除定时器，并重新执行播放 _play() 函数
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _initDots() {
      // 获取轮播图的长度
      this.dots = new Array(this.children.length);
    },
    _play() {
      // 自动播放设置
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        // 400ms 跳到指定的 page 页面
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  }
};
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
