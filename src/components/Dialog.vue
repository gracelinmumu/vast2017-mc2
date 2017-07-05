<template>
  <div class="dialog" v-show="isShow">
    <div class="container">
      <panel v-ref:panel
             :btn-remove="true"
             @panel-folder=""
             @panel-remove="close(true)">
        <template slot="title">
          <slot name="title"></slot>
        </template>
        <template slot="body">
          <slot name="body"></slot>
          <!--<div class="uk-align-right footer" v-if="footer">-->
            <!--<button class="uk-button" @click="no">-->
              <!--{{ btnNoText }}-->
            <!--</button>-->
            <!--<button class="uk-button uk-button-primary" @click="yes">-->
              <!--{{ btnYesText }}-->
            <!--</button>-->
          <!--</div>-->
        </template>
      </panel>
    </div>
  </div>
</template>
<script>
  import Panel from './Panel.vue'

  export default {
    props: {
      title: {
        type: Boolean,
        default: false
      },
      footer: {
        type: Boolean,
        default: true
      },
      btnYesText: {
        type: String,
        default: 'yes'
      },
      btnNoText: {
        type: String,
        default: 'cancle'
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        isShow: false
      }
    },
    methods: {
      show () {
        this.isShow = true
      },
      close (isSelf) {
        this.isShow = false
        if (isSelf) this.$dispatch('dialog-close')
      },
      yes () {
        if (this.autoClose) {
          this.close()
        }
        this.$dispatch('dialog-yes')
      },
      no: function () {
        if (this.autoClose) {
          this.close()
        }
        this.$dispatch('dialog-no')
      }
    },
    components: {
      Panel
    }
  }
</script>
<style lang="less" scoped>
  @import "../commons/base.vars.less";
  .dialog {
    position: fixed;
    right: @app-margin-right;
    left: @app-margin-left;
    top: @app-margin-top;
    bottom: @app-margin-bottom;
    z-index: @skyeye-z-dialog;
    overflow: hidden;
    outline: 0;
    .container {
      position: relative;
      min-width: 300px;
      height: 100%;
      overflow: auto;
    }
    .footer {
      margin-top: 8px;
    }
  }
</style>
