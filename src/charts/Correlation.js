/**
 * Created by huangwei on 2017/7/3.
 */
import d3 from 'd3'
import $ from 'jquery'

let strokeColor = '#999'

export default class {
  constructor (el) {
    this.el = el
    this.init()
    return this
  }

  init () {
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    this.nodeList = [ 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9' ]
    this.isDrawed = false
    return this
  }

  draw (data, chemical) {
    this.chemical = chemical
    this.width = $(this.el).width()
    this.height = $(this.el).height()
    console.log(this.width, this.height)
    this.svg.selectAll('.matrix').remove()
    this.matrix = this.processData(data)
    let matrixWidth = Math.min(this.width / (this.nodeList.length + 1), this.height / (this.nodeList.length + 2))

    let container = this.svg
      .append('g')
      .attr('class', 'matrix')

    let rect = container.selectAll('rect')
      .data(this.matrix)
      .enter()
      .append('g')
      .attr('transform', d => 'translate(' + d.x * matrixWidth + ',' + d.y * matrixWidth + ')')

    rect.append('rect')
      .attr('width', matrixWidth)
      .attr('height', matrixWidth)
      .attr('stroke', strokeColor)
      .attr('stroke-width', '1px')
      .attr('fill', 'green')
      .attr('fill-opacity', (d) => d.x === d.y ? 0 : Math.abs(d.value[ this.chemical ]))
      .on('mouseover', gridOver)

    container.selectAll('.row-name')
      .data(this.nodeList)
      .enter()
      .append('text')
      .attr('class', 'row-name')
      .text(d => d)
      .attr('transform', (d, index) => 'translate(' + (index + 1) * matrixWidth + ',' + matrixWidth * 0.6 + ')')
    container.selectAll('.col-name')
      .data(this.nodeList)
      .enter()
      .append('text')
      .attr('class', 'col-name')
      .text(d => d)
      .attr('transform', (d, index) => 'translate(' + matrixWidth * 0.2 + ',' + (index + 1.6) * matrixWidth + ')')
    this.isDrawed = true
    function gridOver (d, i) {
      container.selectAll('rect').style('stroke-width', (p) => p.x === d.x || p.y === d.y ? '2px' : '1px')
    }

    return this
  }

  update (chemical) {
    this.chemical = chemical
    if (this.isDrawed) {
      this.svg.selectAll('rect')
        .attr('fill-opacity', d => d.x === d.y ? 0 : Math.abs(d.value[ this.chemical ]))
    }
  }

  processData (data) {
    let matrix = {}
    for (let i = 1, len = this.nodeList.length; i <= len; i++) {
      for (let j = 1; j <= len; j++) {
        matrix[ i + '-' + j ] = { x: i, y: j, value: 0 }
      }
    }
    data.forEach((d) => {
      matrix[ d.x + '-' + d.y ].value = d.correlation
      matrix[ d.x + '-' + d.y ].orginal = d
      matrix[ d.y + '-' + d.x ].orginal = d
      matrix[ d.y + '-' + d.x ].value = d.correlation
    })

    return Object.keys(matrix).map((d) => matrix[ d ])
  }
}
