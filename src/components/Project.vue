<template>
    <!--title-->
    <span class="comps-title"><b>Time Projection View</b></span>
</template>
<script>
  export default {
    watch: {
      selectedBar: {
        deep: true,
        handler () {
          if (this.selectedBar) this.update()
        }
      },
      threshold: {
        deep: true,
        handler () {
          this.update()
        }
      }
    },
    computed: {
      selectedChemicals () {
        return Object.keys(this.chemicalsMap).filter((c) => this.chemicalsMap[c])
      },
      hoursDataMap () {
        let dict = {}
        this.hoursData.forEach((d, index) => {
          dict[d.day + d.chemical + d.sensor] = index + 1
        })
        return dict
      }
    },
    data () {
      return {
        hoursData: []
      }
    },
    methods: {},
    ready () {
      console.log('xxxxxxxx')
    }
  }
</script>
<style lang="less" scoped>
</style>