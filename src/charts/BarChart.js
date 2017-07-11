/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config.js'
import {skyeyeTooltip, formatFunc} from '../commons/utils'
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
    self.svg.attr('height', height)
      .attr('width', width)

    let x = d3.time.scale()
      .rangeRound([0, width])

    let y = d3.scale.linear().range([height, 0])
    if (month === 4) {
      x.domain([new Date(2016, month, 1), new Date(2016, month, 30)])
      widthBar = width / 720
    } else {
      x.domain([new Date(2016, month, 1), new Date(2016, month, 31)])
      widthBar = width / 744
    }
    y.domain([0, d3.max(data)])
    let xMonth = []
    if (month === 4) {
      xMonth = d3.time.hours(new Date(2016, month, 1), new Date(2016, month, 30))
    } else {
      xMonth = d3.time.hours(new Date(2016, month, 1), new Date(2016, month, 31))
    }
    // console.log(xMonth)

    // self.svg.selectAll('bar')
    let rect = container.selectAll('.bar')
      .data(data)
      .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', (d, index) => 'translate(' + x(xMonth[index]) + ',' + y(d) + ')')

    rect.append('rect')
      .style('fill', d => d > threshold ? dangerColor : safeColor)
      .attr('width', widthBar)
      .attr('height', (d) => height - y(d))
      .on('mouseover', (d, index) => {
        let display = {
          time: formatFunc(xMonth[index]),
          value: d
        }
        skyeyeTooltip.show(display, d3.event)
      })
      .on('mouseout', d => {
        skyeyeTooltip.hide()
      })
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
