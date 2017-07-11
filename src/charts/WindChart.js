/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config'
import {skyeyeTooltip} from '../commons/utils'
let {windColor, currentTime} = config
let domainMap = {
  4: [new Date('4/1/2016 00:00:00'), new Date('5/1/2016 1:00:00')],
  8: [new Date('8/1/2016 00:00:00'), new Date('9/1/2016 1:00:00')],
  12: [new Date('12/1/2016 00:00:00'), new Date('1/1/2017 1:00:00')]
}

export default class {
  constructor (el) {
    this.el = el
    this.init()
  }

  init () {
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    let defs = this.svg.append('defs')
    let arrowTarget = defs.append('marker')
      .attr('id', 'arrow-target')
      .attr('markUnits', 'userSpaceOnUse')
      .attr('markerWidth', '8')
      .attr('markerHeight', '8')
      .attr('viewBox', '0 0 6 6')
      .attr('refX', '4')
      .attr('refY', '4')
      .attr('orient', 'auto')
    let arrowPathTarget = 'M0 0 L8 4 L0 8 L 4 4 L0 0'
    arrowTarget.append('path')
      .attr('d', arrowPathTarget)
      .attr('fill', windColor)
      .attr('fill-opacity', 0.6)
      .attr('stroke', windColor)
    return this
  }

  draw (data, month) {
    this.svg.append('line').attr('class', 'current-hour')
    this.svg.selectAll('.wind-g').remove()
    let width = $(this.el).width()
    let height = $(this.el).height()
    let g = this.svg.append('g').attr('class', 'wind-g')
      .attr('transform', 'translate(0, ' + height * -0.5 + ')')

    this.width = width
    this.height = height
    this.svg.attr('width', width).attr('height', height)
    let x = d3.time.scale()
      .range([0, width])
      .domain(domainMap[month])
    this.x = x
    g.append('line')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', width)
      .attr('y2', height)
      .attr('stroke', '#000')
    let wind = g.selectAll('.wind')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'wind')
      .attr('d', d => {
        let r = d.speed * 5
        let xx = x(new Date(d.timestamp))
        let direction = Math.PI * (-d.direction) / 180
        return 'M' + xx + ', ' + height + 'L' + (xx + Math.sin(direction) * r) + ',' + (height + Math.cos(direction) * r)
      })
      .attr('marker-end', 'url(#arrow-target)')
      .attr('fill', windColor)
      .attr('stroke', windColor)
      .on('mouseover', (d) => {
        let {speed, direction, date} = d
        skyeyeTooltip.show({time: date, speed, direction}, d3.event)
      })
      .on('mouseout', (d) => {
        skyeyeTooltip.hide()
      })
    this.clearHighLight()
    wind
    return this
  }
  clearHighLight () {
    this.svg.select('.current-hour').attr('stroke', 'rgba(0,0,0,0)')
    return this
  }
  highlight (hour) {
    this.svg.select('.current-hour')
      .attr('x1', this.x(hour))
      .attr('x2', this.x(hour))
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('stroke', currentTime.color)
      .attr('stroke-width', currentTime.width)
      .attr('pointer-events', 'none')
    return this
  }
  on (evt, cb) {
    this[evt] = cb
    return this
  }
}
