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
    this.svg.selectAll('.day').remove()
    this.domain = domain
    this.colorMap = colorMap

    let a = '#00b32d'
    let b = '#db4b0b'

    let compute = d3.interpolate(a, b)
    let linear = d3.scale.linear()
      .domain(domain)
      .range([ 0, 1 ])
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
    compute
    linear
    day.append('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', d => this.getColor(data[ d ]))
      // .attr('fill', d => compute(linear(data[ d ])))
      .attr('stroke', '#fff')

    day.append('text')
      .text((d) => new Date(+d).getDate())
      .attr('dy', 16)
      .attr('dx', 5)
      .attr('color', '#fff')
    return this
  }

  getColor (d) {
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
