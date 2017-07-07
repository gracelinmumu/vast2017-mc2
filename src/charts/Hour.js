/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config'
import {formatFunc} from '../commons/utils'
let {dangerColor, safeColor, colorMap} = config
safeColor
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

  draw (data, day, thresholdMap, chemicals) {
    this.svg.selectAll('.hour').remove()

    let height = $(this.el).height()
    let pad = 2
    let width = $(this.el).width() - pad * 2

    this.svg
      .attr('width', '100%')
      .attr('height', height)
    let hourCount = 24
    let cellH = height / hourCount
    let cellW = width
    let timesArr = []
    let oneHour = 1000 * 60 * 60
    for (let i = 0; i < hourCount; i++) {
      timesArr.push(formatFunc(new Date(day + i * oneHour)))
    }
    let hour = this.svg.selectAll('.hour')
      .data(timesArr)
      .enter()
      .append('g')
      .attr('class', 'hour')
      .attr('transform', (d, i) => 'translate(' + pad + ',' + (i) * cellH + ')')
      .attr('cursor', 'pointer')

    let chLen = chemicals.length
    let w = chLen < 4 ? cellW / chLen : cellW / 2
    let h = chLen > 3 ? (cellH - 5) / 2 : (cellH - 5)
    chemicals.forEach((ch, index) => {
      let threshold = thresholdMap[ch]
      let chemicalData = data[ch].time
      hour.append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('x', index < 2 ? w * index : (chLen === 4 ? (index - 2) : 2) * w)
        .attr('y', chLen > 3 && index > 1 ? h : 0)
        .attr('fill', d => chemicalData[d] ? (chemicalData[d] > threshold ? dangerColor : safeColor) : 'none')
        .attr('fill-opacity', d => chemicalData[d] > threshold ? 0.8 : 0.3)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .on('click', (d) => {
          this.clickHour(d, ch)
        })
    })
    // hour.append('rect')
    //   .attr('width', cellW)
    //   .attr('height', cellH)
    //   .attr('fill', 'none')
    //   .attr('stroke', '#fff')
    //   .attr('stroke-width', 5)
    // hour.append('text')
    //   .text((d) => {
    //     console.log(d, new Date(d), new Date(d).getHours())
    //     return new Date(d).getHours()
    //   })
    //   .attr('dy', cellH * 0.5)
    //   .attr('dx', cellW * 0.5 - 3)
    //   // .attr('text-anchor', 'middle')
    //   // .attr('text-baseline', 'middle')
    //   .attr('color', '#fff')
    return this
  }
  on (evt, cb) {
    this[evt] = cb
    return this
  }
}
