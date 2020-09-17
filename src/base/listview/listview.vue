<template>
  <scroll
    class="listview"
    ref="listview"
    :data="data"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll"
  >
    <ul>
      <li
        class="list-group"
        v-for="group in data"
        :key="group.title"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item in group.items"
            :key="item.id"
            @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :data-index="index"
          :class="{ current: currentIndex === index }"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  name: "listview",
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  created() {
    this.probeType = 3;
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
  },
  props: {
    data: {
      type: Array
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    onShortcutTouchStart(e) {
      // 当一个或多个触摸点与触控设备表面接触时触发touchstart 事件。
      let ancheorIndex = getData(e.target, "index"); // 获取当前触摸点的 index 值
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY; // 把触摸点的 pageY 值赋值给 touch.y1
      this.touch.ancheorIndex = ancheorIndex; // 把触摸点的 index 值赋值给 touch.ancheorIndex
      this._scrollTo(ancheorIndex);
    },
    onShortcutTouchMove(e) {
      //当触点在触控平面上移动时触发touchmove事件
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      //移动的距离 即第一次触摸时到移动过程中 index 变化
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let ancheorIndex = parseInt(this.touch.ancheorIndex) + delta;
      this._scrollTo(ancheorIndex);
    },
    scroll(pos) {
      // 获取移动时的 Y轴的值 负值
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      // 移动到指定的 dom 元素
      if (!index && index !== 0) {
        // 点击时为 null 时不执行
        return;
      }
      if (index < 0) {
        // 当 touchmove 滑动到顶部时 index 为负数，把 index 赋值为0
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        // 当 touchmove 滑动到顶部时
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      // 获取每个字母(a-z，top)的高度，并存在listHeight数组里
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        // 按顺序把所有的侧边栏的高度遍历出来
        this.listHeight.push(height);
      }
    }
  },
  computed: {
    shortcutList() {
      // 处理右侧边栏的数据
      return this.data.map(item => {
        return item.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  watch: {
    data() {
      // DOM更新完成后，再获取侧边栏相关的高度
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // 每次页面滚动时，进行判断
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      border-top: 1px solid #222;
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
