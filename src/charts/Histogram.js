/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config.js'

let {dangerColor, safeColor} = config

export default class {
  constructor (el, chemical) {
    this.el = el
    this.chemical = chemical
    this.updateThreshold = null
    this.brush = null
    this.height = -1
    this.width = -1
    this.axisScale = null
    this.percent = 0.0
    this.data = null
    this.init()
  }

  init () {
    d3.select(this.el).selectAll('svg')
      .remove()
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    return this
  }

  calPercent (data, threshold) {
    let s = data.length
    if (s === 0) return 0.0
    let n = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i] > threshold) n++
    }
    return n / (s + 0.0)
  }

  draw (data, threshold) {
    this.data = data
    this.svg.selectAll('.histogram').remove()
    let self = this
    let container = this.svg.append('g').attr('class', 'histogram')

    let width = $(this.el).width()
    let height = $(this.el).height()
    this.width = width
    this.height = height
    this.svg.attr('height', height)
    let bin = 20
    let wid = width / bin

    this.percent = this.calPercent(data, threshold)
    container.append('text')
      .attr('class', 'percenttext')
      .text(this.percent.toFixed(6))
      .attr('x', width - 60)
      .attr('y', 10)

    let histogram = d3.layout.histogram()
    histogram.bins(bin)
    let dataHis = histogram(data)

    let max = d3.max(dataHis, d => d.y)
    // let left = 35
    // let right = 20
    let top1 = 0
    let bottom = 0

    // let maxWid = width - left - right
    let maxHei = height - top1 - bottom

    let scale = d3.scale.sqrt()
    scale.domain([ 0, max ])
      .range([ 0, maxHei ])

    let rect = container.selectAll('.bar')
      .data(dataHis)
      .enter()
      .append('g')
      .attr('class', 'bar')
      // .attr('transform', (d, index) => 'translate(' + left + ',' + index * hei + ')')
      .attr('transform', (d, index) => 'translate(' + index * wid + ',' + (top1 + (maxHei - scale(d.y))) + ')')

    rect.append('rect')
      // .attr('width', d => scale(d.y))
      // .attr('height', hei)
      .attr('width', wid)
      .attr('height', d => scale(d.y))
      .attr('fill', d => d.x > threshold ? dangerColor : safeColor)
      .attr('stroke', '#fff')

    rect.append('text')
      .text(d => d.x.toFixed(2))
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', d => 'rotate(90)translate(0,0)')

    let maxX = d3.max(dataHis, d => d.x + d.dx)
    let axisScale = d3.scale.linear()
    axisScale.domain([ 0, maxX ])
      .range([ 0, width ])
    this.axisScale = axisScale

    let x = d3.scale.identity().domain([ 0, width ])
    let y = d3.scale.identity().domain([ 0, height ])
    let defaultExtent = [ [ axisScale(threshold), 0 ], [ width, height ] ]
    let brush = d3.svg.brush()
      .x(x)
      .y(y)
      .extent(defaultExtent)
      .on('brushend', brushended)
    this.brush = brush

    container.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.event)

    container
      .selectAll('.extent')
      .attr('stroke', '#fff')
      .attr('fill-opacity', 0.125)
      .attr('shap-rendering', 'crispEdges')

    function brushended () {
      let ext = brush.extent()

      let newThresh = axisScale.invert(ext[ 0 ][ 0 ])
      // todo: 改变语句顺序
      // self.updateThreshold(newThresh)

      if (!d3.event.sourceEvent) return

      rect.selectAll('rect')
        .attr('fill', d => d.x > newThresh ? dangerColor : safeColor)

      d3.select(this).transition()
        .duration(brush.empty() ? 0 : 750)
        .call(brush.extent([ [ ext[ 0 ][ 0 ], 0 ], defaultExtent[ 1 ] ]))
        .call(brush.event)
      self.updateThreshold(newThresh, this.chemical)
    }

    return this
  }

  update (threshold) {
    // console.log('histogram hello', threshold)
    this.svg.select('.histogram')
      .selectAll('.bar')
      .selectAll('rect')
      .attr('fill', d => d.x > threshold ? dangerColor : safeColor)

    let brush = this.brush
    let svgBrush = this.svg.select('.histogram')
      .select('.brush')

    svgBrush.transition()
      .duration(brush.empty() ? 0 : 750)
      .call(brush.extent([ [ this.axisScale(threshold), 0 ], [this.width, this.height] ]))
      // .call(brush.event)

    this.percent = this.calPercent(this.data, threshold)
    // console.log('hist update percent', this.percent)
    this.svg.select('.histogram')
      .select('.percenttext')
      .text(this.percent.toFixed(6))
  }

  on (eventsMap) {
    if (eventsMap.hasOwnProperty('updateThreshold')) this.updateThreshold = eventsMap.updateThreshold
    return this
  }
}

/*    rect.append('text')
      .text(d => d.y)
      .attr('x', d => scale(d.y))
      .attr('y', 20)

    rect.append('text')
      .text(d => d.x.toFixed(2))
      .attr('x', d => -left)
      .attr('y', 10)*/

/*    let maxY = d3.max(dataHis, d => d.x + d.dx)
    let axisScale = d3.scale.linear()
    axisScale.domain([ 0, maxY ])
      .range([ 0, height ])

    let x = d3.scale.identity().domain([ 0, width ])
    let y = d3.scale.identity().domain([ 0, height ])
    let defaultExtent = [ [ 0, axisScale(threshold) ], [ width, height ] ]
    let brush = d3.svg.brush()
      .x(x)
      .y(y)
      .extent(defaultExtent)
      .on('brushend', brushended)

    container.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.event)

    container
      .selectAll('.extent')
      .attr('stroke', '#fff')
      .attr('fill-opacity', 0.125)
      .attr('shap-rendering', 'crispEdges')

    function brushended () {
      let ext = brush.extent()

      let newThresh = axisScale.invert(ext[ 0 ][ 1 ])
      self.updateThreshold(newThresh)

      if (!d3.event.sourceEvent) return

      rect.selectAll('rect')
        .attr('fill', d => d.x > newThresh ? 'red' : '#27b8e7')

      d3.select(this).transition()
        .duration(brush.empty() ? 0 : 750)
        .call(brush.extent([ ext[ 0 ], defaultExtent[ 1 ] ]))
        .call(brush.event)
    }

    return this
  }

  on (eventsMap) {
    if (eventsMap.hasOwnProperty('updateThreshold')) this.updateThreshold = eventsMap.updateThreshold
    return this
  }
}*/
