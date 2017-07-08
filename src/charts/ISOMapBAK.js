/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'

import factoryImg from '../../assets/images/factory2.png'
import monitorImg from '../../assets/images/monitor2.png'

import config from '../commons/config'
let { factoriesLoc, sensorsLoc, colorMap } = config

const getAngles = (pos1, pos2) => {
  let radius = Math.atan((pos1[1] - pos2[1]) / (pos1[0] - pos2[0])) * 180 / Math.PI
  return radius
}

let angelsMap = {}
Object.keys(sensorsLoc).forEach((s) => {
  angelsMap[s] = {}
  Object.keys(factoriesLoc).forEach((f) => {
    angelsMap[s][f] = getAngles(sensorsLoc[s], factoriesLoc[f])
  })
})

let windColor = 'rgba(189,217,252,0.5)'
let nodeSize = 15
export default class {
  constructor (el) {
    this.el = el
    this.width = 0
    this.height = 0
    this.scale = 7
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
      .attr('transform', 'translate(' + (this.width - gridS * this.scale) * 0.5 + ',' + this.height * 0.8 + ')')

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

    factory.append('circle')
      .attr('r', nodeSize)
      .attr('fill', 'none')
      .attr('stroke', '#888')
      .attr('class', 'factory-circle')
      .attr('stroke-dasharray', '3, 3')
      .on('click', (d) => this.trigger('clickFactory', d))
    factory.append('circle')
        .attr('r', nodeSize + 3)
        .attr('fill', 'none')
        .attr('stroke', '#888')
        .attr('class', 'factory-circle')
        .attr('stroke-dasharray', '3, 3')
        .on('click', (d) => this.trigger('clickFactory', d))
    factory.append('image')
      .attr('xlink:href', (d) => factoryImg)
      .attr('width', nodeSize)
      .attr('height', nodeSize)
      .attr('x', -nodeSize * 0.5)
      .attr('y', -nodeSize * 0.5)
      .attr('cursor', 'pointer')
      .on('click', (d) => this.trigger('clickFactory', d))
    // factory.append('text')
    //   .text(d => d)
    return this
  }
  trigger (cbName, ...args) {
    if (this[cbName]) this[cbName](...args)
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
      .attr('id', d => 'Sensor' + d)
      .attr('transform', d => 'translate(' + sensorsLoc[ d ][ 0 ] + ',' + sensorsLoc[ d ][ 1 ] + ')')

    sensor.append('image')
      .attr('xlink:href', (d) => monitorImg)
      .attr('width', nodeSize)
      .attr('height', nodeSize)
    sensor.append('text')
      .attr('dy', nodeSize * 2)
      .text(d => d)
    return this
  }
  clearISOLine () {
    d3.select(this.el).selectAll('.iso-line').remove()
    return this
  }
  drawWind (data) {
    let containerG = d3.select(this.el).select('.wind-g')
    containerG.selectAll('path').remove()

    this.windData = data
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
  clearWind () {
    d3.select(this.el).select('.wind-g').selectAll('path').remove()
    return this
  }
  highlightFactory (factory) {
    d3.select(this.el).selectAll('.factory-circle').attr('stroke', '#888')
    d3.select(this.el).select('#' + factory).selectAll('circle').attr('stroke', '#f00')
    return this
  }
  drawISOLine ({sensorData, factory, maxValue, maxRadius, chemical}) {
    this.sensorData = sensorData
    let g = d3.select(this.el).select('#' + factory)
    d3.select(this.el).selectAll('.iso-line').remove()
    let containerG = g.insert('g')
      .attr('class', 'iso-g')
      .attr('pointer-events', 'none')

    let radius = maxRadius
    this.rScale
      .range([ 0, radius ])
      .domain([ 0, maxValue ])

    var radarLine = d3.svg.line.radial()
      .interpolate('basis-closed')
      .radius(d => this.rScale(d.value))
      .angle(d => d.angle)

    var isoLine = containerG.selectAll('.iso-line')
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
      .attr('stroke', colorMap[chemical][1])
      .attr('stroke-opacity', 0.5)
      .attr('fill', color)
      .attr('fill-opacity', (d, i) => i * 0)
  }

  drawPeriodLine ({current, periodData, chemical, factory}) {
    d3.select(this.el).selectAll('.time-period-line').remove()
    let { domain, data, periodWind } = periodData
    let width = 60
    let height = 30
    Object.keys(data).forEach((sensor) => {
      let sensorData = data[ sensor ]
      let g = d3.select(this.el).select('#Sensor' + sensor)
      let containerG = g.append('g')
        .attr('class', 'time-period-line')
        .attr('transform', 'translate(' + nodeSize + ',' + -height + ')')

      let x = d3.scale.ordinal().rangeRoundPoints([ 0, width ])
      let y = d3.scale.linear().range([ height, 0 ])
      x.domain(Object.keys(sensorData))
      y.domain([ domain.min, domain.max ])

      let line = d3.svg.line()
        .x((d) => x(d))
        .y((d) => y(sensorData[ d ]))
      containerG.selectAll('path')
        .data([ Object.keys(sensorData) ])
        .enter()
        .append('path')
        .attr('d', line)
        .attr('stroke', colorMap[chemical][1])
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      containerG.append('circle')
        .attr('cx', x(current))
        .attr('cy', y(sensorData[ current ]))
        .attr('r', 2)
        .attr('fill', 'red')

      var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(0)
        .tickFormat(d => '')
        .innerTickSize(0)
        .outerTickSize(0)
        .orient('bottom')
      var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(2)
        .innerTickSize(0)
        .outerTickSize(0)
        // .tickFormat(d => '')
        .orient('left')
      containerG.append('g')
        .attr('class', 'axis')
        .call(yAxis)
      containerG.append('g').attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      containerG.selectAll('.axis').selectAll('path')
        .attr('fill', 'none')
        .attr('stroke', '#888')
      let diffRanger = [1, height]
      let minAdd = 10
      let maxResult = 1.0 / (0 + minAdd)
      let minResult = 1.0 / (180 + minAdd)
      Object.keys(periodWind).forEach((t) => {
        let result = periodWind[t].direction - angelsMap[sensor][factory]
        while (result < -180) {
          result += 360
        }
        while (result > 180) {
          result -= 360
        }
        result = Math.abs(result)
        let flag = false
        if (result < 10) {
          flag = true
        }
        flag
        result += minAdd
        result = 1 / result
        result = diffRanger[0] + (diffRanger[1] - diffRanger[0]) * (result - minResult) / (maxResult - minResult)

        periodWind[t].calcValue = result
      })
      let getDiffPath = () => {
        let str = 'M'
        Object.keys(periodWind).forEach((d) => {
          let xx = x(d)
          let yy = periodWind[d].calcValue
          str += xx + ' ' + yy + 'L'
          containerG.append('circle')
            .attr('cx', xx)
            .attr('cy', yy)
            .attr('r', 1)
            .attr('fill', 'blue')
        })
        str = str.substr(0, str.length - 2)
        return str
      }
      containerG.append('path')
        .attr('d', getDiffPath)
        .attr('fill', 'none')
        .attr('stroke', windColor)
        .attr('stroke-width', 2)
    })
    return this
  }

  draw ({ periodData, sensorData, windData, factory, maxValue, maxRadius, current, chemical }) {
    // this.windData = windData
    // this.sensorData = sensorData
    // this.periodData = periodData
    // if (windData) this.drawWind()
    // this.drawPeriodLine(current, periodData, chemical)
    // // this.drawISOLine(factory, maxValue, maxRadius)
    return this
  }
  on (name, cb) {
    this[name] = cb
  }
}
