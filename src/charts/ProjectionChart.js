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

  draw (data, domain) {
    let width = $(this.el).width()
    let height = $(this.el).height()
    let svg = d3.select(this.el).select('svg')
    svg
      .attr('width', width)
      .attr('height', height)
    // let xMax = Math.max(...data.map(d => d[0]))
    // let xMin = Math.min(...data.map(d => d[0]))
    // let yMax = Math.max(...data.map(d => d[1]))
    // let yMin = Math.min(...data.map(d => d[1]))
    // console.log(xMax, xMin, yMax, yMin)
    // let xScale = d3.scale.linear().range([0, width]).domain([xMin, xMax])
    // let yScale = d3.scale.linear().range([height, 0]).domain([yMin, yMax])
    let xScale = d3.scale.linear().range([0, width]).domain(domain.x)
    let yScale = d3.scale.linear().range([height, 0]).domain(domain.y)

    let {label, pos} = data
    let night = [0, 1, 2, 3, 4, 5, 6, 20, 21, 22, 23]
    night
    let day = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

    let point = svg.selectAll('.point')
      .data(label)
      .enter()
      .append('circle')
      .attr('cx', (d, index) => {
        // d.$x = xScale(pos[index][0])
        return xScale(pos[index][0])
      })
      .attr('cy', (d, index) => {
        // d.$y = yScale(pos[index][1])
        return yScale(pos[index][1])
      })
      .attr('r', 3)
      // .attr('fill', safeColor)
      .attr('fill', d => {
        let hour = new Date(d).getHours()
        let color = day.indexOf(hour) !== -1 ? '#c7e1f0' : '#999'
        return color
      })
      .attr({
        'cursor': 'pointer',
        'stroke': '#999',
        'fill-opacity': 0.7
      })
      .attr('class', 'point')
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
    this.point = point

    function zoomHandler () {
      let tx = d3.event.translate[0]
      let ty = d3.event.translate[1]
      let ss = d3.event.scale
      point
        .attr('cx', (d, index) => xScale(pos[index][0]) * ss + tx)
        .attr('cy', (d, index) => yScale(pos[index][1]) * ss + ty)
    }

    let zoomListener = d3.behavior.zoom()
      .scaleExtent([0.1, 10])
      .center([0, 0])
      .on('zoom', zoomHandler)

    zoomListener(svg)
    return this
  }

  highlightCurrent (time) {
    this.point
      .attr('stroke', d => d === time ? currentTime.color : '#999')
      .attr('stroke-width', d => d === time ? currentTime.width : 1)
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
