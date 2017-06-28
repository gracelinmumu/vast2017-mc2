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

  draw (data, domain, colorMap) {
    this.svg.selectAll('.hour').remove()
    this.domain = domain
    this.colorMap = colorMap

    let height = $(this.el).height()
    let pad = 2
    let width = $(this.el).width() - pad * 2

    this.svg
      .attr('width', '100%')
      .attr('height', height)

    console.log(height)
    let cellSize = height / 24

    let hour = this.svg.selectAll('.hour')
      .data(Object.keys(data))
      .enter()
      .append('g')
      .attr('class', 'hour')
      .attr('transform', d => 'translate(' + pad + ',' + (d - 1) * cellSize + ')')

    hour.append('rect')
      .attr('width', width)
      .attr('height', cellSize)
      .attr('fill', d => this.getColor(data[ d ]))
      .attr('stroke', '#fff')

    hour.append('text')
      .text((d) => d)
      .attr('dy', 16)
      .attr('dx', 5)
      .attr('color', '#fff')
    return this
  }

  getColor (d) {
    // console.log(d)
    let color = '#ddd'
    let domain = this.domain
    if (d < domain[ 0 ]) {
      color = this.colorMap[ 0 ]
    } else if (d < domain[ 1 ]) {
      color = this.colorMap[ 1 ]
    } else if (d < domain[ 2 ]) {
      color = this.colorMap[ 2 ]
    } else if (d < domain[ 3 ]) {
      color = this.colorMap[ 3 ]
    } else {
      color = this.colorMap[ 4 ]
    }
    return color
  }
}
