/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'

import factoryImg from '../../assets/images/factory.png'
import monitorImg from '../../assets/images/monitor.png'

import config from '../commons/config'
let { factoriesLoc, sensorsLoc } = config

let windColor = 'rgba(189,217,252,0.5)'

export default class {
  constructor (el) {
    this.el = el
    this.width = 0
    this.height = 0
    this.scale = 4
    this.init()
  }

  init () {
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')

    this.width = $(this.el).width()
    this.height = $(this.el).height()
    this.svg.attr('width', this.width).attr('height', this.height)

    let defs = this.svg.append('defs')
    let arrowMarkerTarget = defs.append('marker')
      .attr('id', 'arrow-target')
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('markerWidth', '20')
      .attr('markerHeight', '20')
      .attr('viewBox', '0 0 200 200')
      .attr('refX', '100') // 位置调整
      .attr('refY', '100')
      .attr('orient', 'auto')

    let arrowPathTarget = 'M0, 0 L160, 100 L0, 200 L80, 100 L0, 0'
    // let arrowPathTarget = 'M2, 2 L10, 6 L2, 10 L6, 6 L2, 2'
    arrowMarkerTarget
      .append('path')
      .attr('d', arrowPathTarget)
      .attr('fill', windColor)
      .attr('stroke', windColor)

    this.windG = this.svg.append('g').attr('class', 'wind-g')

    let gridS = 200

    this.mapG = this.svg.append('g')
      .attr('class', 'map-g')
      .attr('transform', 'translate(' + (this.width - gridS * this.scale) * 0.5 + ',' + this.height * 0.6 + ')')

    // 画工厂和传感器
    this.drawFactory()
    this.drawSensor()

    this.rScale = d3.scale.linear()
    return this
  }

  drawFactory () {
    Object.keys(factoriesLoc)
      .forEach((d) => {
        let tem = factoriesLoc[ d ]
        factoriesLoc[ d ] = [ tem[ 0 ] * this.scale, -tem[ 1 ] * this.scale ]
      })

    let factory = this.mapG.selectAll('.factory')
      .data(Object.keys(factoriesLoc))
      .enter()
      .append('g')
      .attr('class', 'factory')
      .attr('id', d => d)
      .attr('transform', d => 'translate(' + factoriesLoc[ d ][ 0 ] + ',' + factoriesLoc[ d ][ 1 ] + ')')

    let nodeSize = 15
    factory.append('circle')
      .attr('r', nodeSize)
      .attr('fill', 'none')
      .attr('stroke', '#888')
      .attr('stroke-dasharray', '3, 3')
    factory.append('image')
      .attr('xlink:href', (d) => factoryImg)
      .attr('width', nodeSize)
      .attr('height', nodeSize)
      .attr('x', -nodeSize * 0.5)
      .attr('y', -nodeSize * 0.5)
    return this
  }

  drawSensor () {
    Object.keys(sensorsLoc)
      .forEach((d) => {
        let tem = sensorsLoc[ d ]
        sensorsLoc[ d ] = [ tem[ 0 ] * this.scale, -tem[ 1 ] * this.scale ]
      })

    let sensor = this.mapG.selectAll('.sensor')
      .data(Object.keys(sensorsLoc))
      .enter()
      .append('g')
      .attr('class', 'sensor')
      .attr('transform', d => 'translate(' + sensorsLoc[ d ][ 0 ] + ',' + sensorsLoc[ d ][ 1 ] + ')')

    let nodeSize = 15
    sensor.append('image')
      .attr('xlink:href', (d) => monitorImg)
      .attr('width', nodeSize)
      .attr('height', nodeSize)
    sensor.append('text')
      .text(d => d)
    return this
  }

  drawWind () {
    let containerG = d3.select(this.el).select('.wind-g')
    containerG.selectAll('path').remove()

    let data = this.windData
    let r = data.speed * 10
    let direction = 2 * Math.PI * (180 - data.direction) / 360
    let fw = 0
    let d = 'M' + fw * 0.5 + ',' + fw * 0.5 + 'L' + (fw * 0.5 + Math.sin(direction) * r) + ', ' + (fw * 0.5 + Math.cos(direction) * r)

    let wind = 100
    let cols = Math.floor(this.width / wind)
    let rows = Math.floor(this.height / wind)
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        containerG
          .append('path')
          .attr('transform', 'translate(' + (i + 0.5) * wind + ',' + (j + 0.5) * wind + ')')
          .attr('d', d)
          .attr('fill', windColor)
          .attr('stroke-width', 5)
          .attr('stroke', windColor)
          .attr('marker-end', (d) => 'url(#arrow-target)')
      }
    }
    return this
  }

  drawISOLine (factory, maxValue, maxRadius) {
    let g = d3.select(this.el).select('#' + factory)
    d3.select(this.el).selectAll('.iso-line').remove()
    g.append('g')
      .attr('class', 'iso-g')

    let radius = maxRadius
    this.rScale
      .range([ 0, radius ])
      .domain([ 0, maxValue ])

    var radarLine = d3.svg.line.radial()
      .interpolate('basis-closed')
      .radius(d => this.rScale(d.value))
      .angle(d => d.angle)

    var isoLine = g.selectAll('.iso-line')
      .data(this.sensorData)
      .enter()
      .append('g')
      .attr('class', 'iso-line')
    let color = 'rgba(255,0,0,0.5)'
    isoLine
      .append('path')
      .attr('class', 'iso-line-path')
      .attr('d', d => radarLine(d))
      .attr('stroke-width', '1px')
      .attr('stroke', color)
      .attr('fill', color)
      .attr('fill-opacity', (d, i) => i * 0)
  }

  draw ({ sensorData, windData, factory, maxValue, maxRadius }) {
    this.windData = windData
    this.sensorData = sensorData
    if (windData) this.drawWind()
    this.drawISOLine(factory, maxValue, maxRadius)
    return this
  }
}
