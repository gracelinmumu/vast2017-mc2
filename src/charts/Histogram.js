/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'

export default class {
  constructor (el) {
    this.el = el
    this.updateThreshold = null
    this.init()
  }

  init () {
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    return this
  }

  draw (data, threshold) {
    this.svg.selectAll('.histogram').remove()
    let self = this
    let container = this.svg.append('g').attr('class', 'histogram')

    let width = $(this.el).width()
    let height = $(this.el).height()
    this.svg.attr('height', height)
    let bin = 20
    let hei = height / bin

    let histogram = d3.layout.histogram()
    histogram.bins(bin)
    let dataHis = histogram(data)

    let max = d3.max(dataHis, d => d.y)
    let left = 35
    let right = 20

    let maxWid = width - left - right

    let scale = d3.scale.sqrt()
    scale.domain([ 0, max ])
      .range([ 0, maxWid ])

    let rect = container.selectAll('.bar')
      .data(dataHis)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', (d, index) => 'translate(' + left + ',' + index * hei + ')')

    rect.append('rect')
      .attr('width', d => scale(d.y))
      .attr('height', hei)
      .attr('fill', d => d.x > threshold ? 'red' : '#27b8e7')
      .attr('stroke', '#fff')

    rect.append('text')
      .text(d => d.y)
      .attr('x', d => scale(d.y))
      .attr('y', 20)

    rect.append('text')
      .text(d => d.x.toFixed(2))
      .attr('x', d => -left)
      .attr('y', 10)

    let maxY = d3.max(dataHis, d => d.x + d.dx)
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
}
