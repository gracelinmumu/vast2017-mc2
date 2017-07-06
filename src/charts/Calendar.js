/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config'
let {colorMap, chemicalOpts} = config

export default class {
  constructor (el) {
    this.el = el
    this.init()
  }

  init () {
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    return this
  }

  draw (data, domainMap, selectedChemicals) {
    this.svg.selectAll('.day').remove()
    this.domain = domainMap

    let colorScale = {}
    chemicalOpts.forEach((ch) => {
      let compute = d3.interpolate(colorMap[ch][0], colorMap[ch][1])
      let linear = d3.scale.linear()
        .domain([0, domainMap[ch]])
        .range([ 0, 1 ])
      colorScale[ch] = {
        compute, linear
      }
    })

    let width = $(this.el).width()
    let height = $(this.el).height()
    let cellSize = Math.min(width / 7, height / 5)

    let week = d3.time.format('%U')

    let month = new Date(+Object.keys(data)[ 0 ]).getMonth() + 1
    let weeksBefore = month === 4 ? 13 : (month === 8 ? 31 : 48)

    let day = this.svg.selectAll('.day')
      .data(Object.keys(data))
      .enter()
      .append('g')
      .attr('class', 'day')
      .attr('transform', d => 'translate(' + new Date(+d).getDay() * cellSize + ',' + (week(new Date(+d)) - weeksBefore) * cellSize + ')')
      .attr('cursor', 'pointer')
      .on('click', (d) => {
        this.clickDay(d, data[d])
      })
    // compute
    // linear
    let chLen = selectedChemicals.length
    let w = chLen < 4 ? cellSize / chLen : cellSize / 2
    let h = chLen > 3 ? cellSize / 2 : cellSize

    selectedChemicals.forEach((ch, index) => {
      let colorS = colorScale[ch]
      day.append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('x', index < 2 ? w * index : (chLen === 4 ? (index - 2) : 2) * w)
        .attr('y', chLen > 3 && index > 1 ? h : 0)
        .attr('fill', d => this.getColor(colorS, data[d][ch].value))
    })
    day.append('text')
      .text((d) => new Date(+d).getDate())
      .attr('dy', 16)
      .attr('dx', 5)
      .attr('color', '#fff')
    day.append('rect')
      .attr('width', cellSize * 2)
      .attr('height', cellSize * 2)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 4)

    // let hourH = height / 32
    //
    // let hourRow = this.svg.selectAll('.hour-row')
    //   .data(Object.keys(data))
    //   .enter()
    //   .append('g')
    //   .attr('class', 'hour-row')
    //   .attr('transform', (d, index) => 'translate(0,' + index * hourH + ')')
    // let hourW = width / 24
    // chemicalOpts.forEach((ch, index) => {
    //   hourRow.selectAll('.hour')
    //     .data(d => Object.keys(data[d][ch].time))
    //     .enter()
    //     .append('rect')
    //     .attr('x', (d, j) => hourW * (j + index))
    //     .attr('y', (d, j) => hourH * index)
    //     .attr('width', hourW)
    //     .attr('height', hourH)
    //     .attr('fill', 'none')
    //     .attr('stroke', 'black')
    // })
    return this
  }

  on (evt, cb) {
    this[evt] = cb
    return this
  }
  getColor (colorScale, value) {
    return colorScale.compute(colorScale.linear(value))
  }
}
