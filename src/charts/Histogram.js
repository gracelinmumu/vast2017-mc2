/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'

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

  draw (data) {
    this.svg.selectAll('.bar').remove()
    let width = $(this.el).width()
    let height = $(this.el).height()
    this.svg.attr('height', height)
    let bin = 20
    let hei = height / bin

    let histogram = d3.layout.histogram()
    histogram.bins(bin)
    let dataHis = histogram(data)

    let max = d3.max(dataHis, d => d.y)
    let maxWid = width - 20

    let scale = d3.scale.sqrt()
    scale.domain([ 0, max ])
      .range([ 0, maxWid ])

    let rect = this.svg.selectAll('.bar')
      .data(dataHis)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', (d, index) => 'translate(0,' + index * hei + ')')

    rect.append('rect')
      .attr('width', d => scale(d.y))
      .attr('height', hei)
      .attr('fill', '#27b8e7')
      .attr('stroke', '#fff')

    rect.append('text')
      .text(d => d.y)
      .attr('x', d => scale(d.y))
      .attr('y', 20)

    return this
  }
}
