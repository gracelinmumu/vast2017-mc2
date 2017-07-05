<template>
  <div class="float-menu"
       :style="{top: top +'px', left: left + 'px'}"
       v-show="isShow"
       @click.stop.prevent="">
    <div class="uk-button-group uk-flex uk-flex-column btn-group-vertical" v-if="menu.length">
      <button class="uk-button btn-prev"
              v-if="prev"
              @click.stop.prevent="goBack">
        <i class="fa fa-chevron-left"></i>
        <template v-if="typeof prev.text != 'object'">
          {{ prev.text }}
        </template>
      </button>
      <button class="uk-button uk-button-large btn-option {{ m.class || '' }}"
              v-for="m in menu"
              @click.stop.prevent="onClick(m, menu)"
              disabled="{{ m.disabled }}">
            <span class="btn-text">
                <i class="{{ m.icon }}" v-if="m.icon"></i>
                <template v-if="typeof m.text != 'object'">
                    {{ m.text }}
                </template>
            </span>
        <span class="btn-icon align-right">
                 <i class="fa fa-chevron-right" v-if="m.children"></i>
            </span>
      </button>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'

  /*
   菜单数据结构
   child {
   text: String | {
   chinese: String
   english: String
   }
   onActive: Function
   params: [] // onActive 参数列表
   }

   {
   text: String | {
   chinese: String
   english: String
   },
   children: [child, ...]
   }
   */

  export default {
    props: ['containerSelector', 'onActiveCallback'],
    data: function () {
      return {
        isShow: false,
        configs: [],
        top: 0,
        left: 0,
        prev: null, // 上级元素
        active: null, // 当前菜单
        itemStack: [], // 元素栈
        menuStack: [] // 菜单栈
      }
    },
    computed: {
      menu: function () {
        if (this.active) {
          return this.active
        }
        return this.configs
      }
    },
    methods: {
      start: function (configs, top, left) {
        // reset
        this.prev = null
        this.active = null
        this.itemStack = []
        this.menuStack = []
        this.configs = configs
        this.top = top
        this.left = left

        if (!(this.configs instanceof Array)) {
          this.configs = []
        }

        this.isShow = this.configs.length
      },
      goBack: function () {
        this.active = this.menuStack.pop()
        this.prev = this.itemStack[ this.menuStack.length - 1 ]
        this.itemStack.pop()
      },
      onClick: function (item, menu) {
        if (item.hasOwnProperty('children')) {
          this.prev = item
          this.active = item.children
          this.itemStack.push(item)
          this.menuStack.push(menu)
        } else {
          item.onActive.apply(item, item.params instanceof Array ? item.params : [])
          this.onActiveCallback instanceof Function && this.onActiveCallback(item)
          this.isShow = false
        }
      },
      // 递归(暂时不用)
      recursion: function (data, f) {
        if (data instanceof Array) {
          data.forEach(_do)
        }

        function _do () {
          let item = arguments[ 0 ]
          if (item.hasOwnProperty('children') && item.children instanceof Array) {
            item.children.forEach(_do)
          } else {
            f(...arguments)
          }
        }
      }
    },
    ready: function () {
      let self = this
      $(this.containerSelector).on('click', function () {
        if (self) {
          self.isShow = false
        }
      })
    }
  }
</script>
<style lang="less" scoped>
  @import "../commons/base.vars.less";
  .float-menu {
    position: fixed;
    z-index: @skyeye-z-tips;
    max-height: 360px;
    max-width: 400px;
    padding: 0 !important;
    overflow: auto;
    > .btn-group-vertical {
      margin: 0;
      width: 100%;
    }
    .btn-prev {
      text-align: left;
      padding-left: 8px;
      padding-right: 8px;
    }
    .btn-option {
      text-align: left;
      padding-left: 22px;
      padding-right: 22px;
    }
    .btn-text {
      display: inline-block;
      width: calc(~"100% - 22px");
    }
    .btn-icon {
      display: inline-block;
      width: 22px;
    }
  }
</style>
