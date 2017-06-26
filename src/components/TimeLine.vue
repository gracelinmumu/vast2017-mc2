<template>timeline
</template>
<script>
  import sensorData from '../data/sensor.json'
  export default {
    data () {
      return {
        xx: 'ccc'
      }
    },
    created () {
      console.log(sensorData[0])
    },
    methods: {
    }
  }
</script>
