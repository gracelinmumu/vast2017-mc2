<template>
  <div
    class="panel {{ fullHeight ? 'panel-full-height' : '' }} uk-panel uk-panel-box uk-panel-box-secondary">
    <div class="uk-panel-header" @click="doHeaderClick">
      <h3 class="uk-panel-title" v-if="title || btnFolder || btnRemove">
        <slot name="title"></slot>
      </h3>
      <div class="uk-panel-badge" v-if="btn || btnFolder || btnRemove">
        <slot name="btns"></slot>
        <a @click.stop.prevent="doFolder" v-if="btnFolder">
          <i class="fa fa-chevron-{{ isFolder ? 'down': 'up' }}"></i>
        </a>
        <a @click.stop.prevent="doRemove" v-if="btnRemove">
          <i class="uk-icon-close"></i>
        </a>
      </div>
    </div>
    <div v-show="!isFolder" class="uk-panel-body">
      <slot name="body"></slot>
    </div>
  </div>

</template>
<script>
  export default {
    props: {
      isFolder: {
        type: Boolean,
        default: false
      },
      title: {
        type: Boolean,
        default: false
      },
      fullHeight: {
        type: Boolean,
        default: false
      },
      btn: {
        type: Boolean,
        default: false
      },
      btnFolder: {
        type: Boolean,
        default: false
      },
      btnRemove: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      doHeaderClick () {
        this.$dispatch('panel-header-click')
      },
      doFolder () {
        this.isFolder = !this.isFolder
        this.$dispatch('panel-folder')
      },
      doRemove () {
        this.$dispatch('panel-remove')
      }
    }
  }

</script>
<style lang="less" scoped>
  .panel {
    position: relative;
    display: block;
    padding: 0;
    :global(.uk-panel-header) {
      position: relative;
      width: calc(~"100% - 16px");
      padding: 8px 8px 0;
    }
    :global(.uk-panel-title) {
      border-bottom: 0;
    }
    &.panel-full-height {
      height: 100%;
      overflow: hidden;
      :global(.uk-panel-body) {
        height: calc(~"100% - 54px");
        position: relative;
        overflow: auto;
        padding: 0 8px 8px;
      }
    }
  }
</style>
