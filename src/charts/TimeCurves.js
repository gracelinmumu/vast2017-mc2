/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config'
import {skyeyeTooltip} from '../commons/utils'
let {dangerColor, safeColor, colorMap, currentTime} = config
safeColor
dangerColor
colorMap
export default class {
  constructor (el) {
    this.el = el
    this.init()
  }

  init () {
    d3.select(this.el).selectAll('svg').remove()
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    return this
  }

  draw ({timeCurves, pos}) {
    let container = d3.select(this.el).select('svg')
    container.selectAll('.container').remove()
    let width = $(this.el).width()
    let height = $(this.el).height()

    let svg = container.append('g').attr('class', 'container')
    svg
      .attr('width', width)
      .attr('height', height)

    let curve = svg.append('path')
      .attr('stroke', '#c7e1f0')
      .attr('fill', 'none')

    let xMax = Math.max(...pos.map(d => d[0]))
    let xMin = Math.min(...pos.map(d => d[0]))
    let yMax = Math.max(...pos.map(d => d[1]))
    let yMin = Math.min(...pos.map(d => d[1]))
    let xScale = d3.scale.linear().range([0, width]).domain([xMin, xMax])
    let yScale = d3.scale.linear().range([height, 0]).domain([yMin, yMax])

    let {timeLabel} = timeCurves
    let night = [0, 1, 2, 3, 4, 5, 6, 20, 21, 22, 23]
    night
    let day = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    let pointArr = svg.selectAll('.point')
      .data(timeLabel)
      .enter()
      .append('g')
      .attr('transform', (d, index) => 'translate(' + xScale(pos[index][0]) + ',' + yScale(pos[index][1]) + ')')
      .on('cursor', 'pointer')
      .on('mouseover', d => {
        skyeyeTooltip.show({
          time: d
        }, d3.event)
      })
      .on('mouseout', d => {
        skyeyeTooltip.hide()
      })
      .on('click', d => {
        this.trigger('clickHour', d)
      })
    let pointR = 6
    this.circles = pointArr.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', pointR)
      // .attr('fill', safeColor)
      .attr('fill', d => {
        let hour = new Date(d).getHours()
        let color = day.indexOf(hour) !== -1 ? '#c7e1f0' : '#999'
        return color
      })
      .attr({
        'stroke': '#ddd',
        'stroke-width': 2,
        'fill-opacity': 0.9
      })
      .attr('class', 'point')
    pointArr.append('text')
      .text(d => new Date(d).getHours())
      .attr('x', 0)
      .attr('y', 0)
      .attr({
        'text-anchor': 'middle',
        'dominant-baseline': 'middle'
      })
    this.point = pointArr

    let pathStr = 'M'
    timeLabel.forEach((d, index) => {
      pathStr += xScale(pos[index][0]) + ' ' + yScale(pos[index][1])
      index !== (timeLabel.length - 1) && (pathStr += ' L')
    })

    curve.attr('d', pathStr)

    function zoomHandler () {
      let tx = d3.event.translate[0]
      let ty = d3.event.translate[1]
      let ss = d3.event.scale
      pointArr
        .attr('transform', (d, index) => 'translate(' + (xScale(pos[index][0]) * ss + tx) + ',' + (yScale(pos[index][1]) * ss + ty) + ')')
      let pathStr = 'M'
      timeLabel.forEach((d, index) => {
        pathStr += xScale(pos[index][0]) * ss + tx + ' ' + (yScale(pos[index][1]) * ss + ty)
        index !== (timeLabel.length - 1) && (pathStr += ' L')
      })
      curve.attr('d', pathStr)
    }

    let zoomListener = d3.behavior.zoom()
      .scaleExtent([0.1, 10])
      .center([0, 0])
      .on('zoom', zoomHandler)

    zoomListener(container)
    return this
  }

  highlightCurrent (time) {
    this.circles
      .attr('stroke', d => d === time ? currentTime.color : '#ddd')
      .attr('stroke-width', d => d === time ? currentTime.width : 2)
    return this
  }

  trigger (evtName, ...args) {
    if (this[evtName]) {
      this[evtName](...args)
    }
  }

  on (evt, cb) {
    this[evt] = cb
    return this
  }
}
