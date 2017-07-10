/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config.js'

let {dangerColor, safeColor} = config

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

  draw (data, threshold, month) {
    let self = this
    month = month - 1
    self.svg.selectAll('.barchart').remove()
    let container = self.svg.append('g').attr('class', 'barchart')

    let width = $(self.el).width()
    let height = $(self.el).height()
    let widthBar
    console.log('height', height)
    self.svg.attr('height', height)
      .attr('width', width)

    let x = d3.time.scale()
      .rangeRound([0, width])

    let y = d3.scale.linear().range([height, 0])

    // let xAxis = d3.svg.axis()
    //   .scale(x)
    //   .orient('bottom')
    //   .ticks(d3.time.hour, 1)
    //
    // let yAxis = d3.svg.axis()
    //   .scale(y)
    //   .orient('left')
    //   .ticks(10)

    if (month === 4) {
      x.domain([new Date(2016, month, 1), new Date(2016, month, 30)])
      widthBar = width / 720
    } else {
      x.domain([new Date(2016, month, 1), new Date(2016, month, 31)])
      widthBar = width / 744
    }
    y.domain([0, d3.max(data)])
    console.log('max', d3.max(data))

    // self.svg.append('g')
    //   .attr('class', 'x axis')
    //   .attr('transform', 'translate(0,' + height + ')')
    //   .call(xAxis)
    //   .selectAll('text')
    //   .style('text-anchor', 'end')
    //   .attr('dx', '-.8em')
    //   .attr('dy', '-.55em')
    //   .attr('transform', 'rotate(-90)')

    // self.svg.append('g')
    //   .attr('class', 'y axis')
    //   .call(yAxis)
    //   .append('text')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', 6)
    //   .attr('dy', '.71em')
    //   .style('text-anchor', 'end')
    //   .text('Value')

    console.log('data', data)
    let xMonth = []
    if (month === 4) {
      xMonth = d3.time.hours(new Date(2016, month, 1), new Date(2016, month, 30))
    } else {
      xMonth = d3.time.hours(new Date(2016, month, 1), new Date(2016, month, 31))
    }
    console.log(xMonth)

    // self.svg.selectAll('bar')
    let rect = container.selectAll('.bar')
      .data(data)
      .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', (d, index) => 'translate(' + x(xMonth[index]) + ',' + y(d) + ')')

    rect.append('rect')
      .style('fill', d => d > threshold ? dangerColor : safeColor)
      .attr('width', widthBar)
      .attr('height', function (d) { return height - y(d) })

//     let bin = 20
//     let wid = width / bin
//
//     let histogram = d3.layout.histogram()
//     histogram.bins(bin)
//     let dataHis = histogram(data)
//
//     let max = d3.max(dataHis, d => d.y)
//     // let left = 35
//     // let right = 20
//     let top1 = 0
//     let bottom = 0
//
//     let maxHei = height - top1 - bottom
//
//     let scale = d3.scale.sqrt()
//     scale.domain([ 0, max ])
//       .range([ 0, maxHei ])
//
//     let rect = container.selectAll('.bar')
//       .data(dataHis)
//       .enter()
//       .append('g')
//       .attr('class', 'bar')
//       .attr('transform', (d, index) => 'translate(' + index * wid + ',' + (top1 + (maxHei - scale(d.y))) + ')')
//
//     rect.append('rect')
//       .attr('width', wid)
//       .attr('height', d => scale(d.y))
//       .attr('fill', d => d.x > threshold ? 'red' : '#27b8e7')
//       .attr('stroke', '#fff')
//
// /* rect.append('text')
//       .text(d => d.y)
//       .attr('x', d => scale(d.y))
//       .attr('y', 20)
//
//     rect.append('text')
//       .text(d => d.x.toFixed(2))
//       .attr('x', d => -left)
//       .attr('y', 10)*/
//
//     let maxX = d3.max(dataHis, d => d.x + d.dx)
//     let axisScale = d3.scale.linear()
//     axisScale.domain([ 0, maxX ])
//       .range([ 0, width ])
//
//     let x = d3.scale.identity().domain([ 0, width ])
//     let y = d3.scale.identity().domain([ 0, height ])
//     let defaultExtent = [ [ axisScale(threshold), 0 ], [ width, height ] ]
//     let brush = d3.svg.brush()
//       .x(x)
//       .y(y)
//       .extent(defaultExtent)
//       .on('brushend', brushended)
//
//     container.append('g')
//       .attr('class', 'brush')
//       .call(brush)
//       .call(brush.event)
//
//     container
//       .selectAll('.extent')
//       .attr('stroke', '#fff')
//       .attr('fill-opacity', 0.125)
//       .attr('shap-rendering', 'crispEdges')
//
//     function brushended () {
//       let ext = brush.extent()
//
//       let newThresh = axisScale.invert(ext[ 0 ][ 0 ])
//       self.updateThreshold(newThresh)
//
//       if (!d3.event.sourceEvent) return
//
//       rect.selectAll('rect')
//         .attr('fill', d => d.x > newThresh ? 'red' : '#27b8e7')
//
//       d3.select(this).transition()
//         .duration(brush.empty() ? 0 : 750)
//         .call(brush.extent([ [ ext[ 0 ][ 0 ], 0 ], defaultExtent[ 1 ] ]))
//         .call(brush.event)
//     }

    return this
  }

  update (threshold) {
    // console.log('bar chart hello', threshold)
    this.svg.select('.barchart')
      .selectAll('.bar')
      .selectAll('rect')
      .style('fill', d => {
        // console.log('bar chart hello update', d, threshold)
        return d > threshold ? dangerColor : safeColor
      })
  }

  on (eventsMap) {
    if (eventsMap.hasOwnProperty('updateThreshold')) this.updateThreshold = eventsMap.updateThreshold
    return this
  }
}
