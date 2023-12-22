import { Matrix, Coordinates } from '../utils/Matrix'

class Graph {
  static idCount = 1
  id: number
  position: Coordinates
  children: { distance: number, node: Graph }[]
  constructor(position: Coordinates) {
    this.id = Graph.idCount++
    this.position = position
    this.children = []
  }
}

class GalaxyMatrix extends Matrix {
  graph: Graph[] = []
  constructor(file: string, emptyScale: number) {
    super(file)

    for (let j = 0; j < this.matrix[0].length; j++) {
      let emptyCol = true
      for (let i = 0; i < this.matrix.length; i++) {
        if (this.matrix[i][j] === '#') {
          emptyCol = false
          break
        }
      }
      if (emptyCol) {
        this.matrix = this.matrix.map(row => [...row.slice(0, j), '*', ...row.slice(j + 1)])
      }
    }

    this.matrix = this.matrix.map((row) => {
      return (row.every(el => el !== '#')) ? row.map(_ => '*') : row
    })

    this.traverse((val, pos, m) => {
      if (val === '#') {
        const calcPos: Coordinates = [
          m.matrix.slice(0, pos[0]).reduce((acc, cur) => acc + (cur[pos[1]] !== '*' ? 1 : emptyScale), 0),
          m.matrix[pos[0]].slice(0, pos[1]).reduce((acc, cur) => acc + (cur !== '*' ? 1 : emptyScale), 0),
        ]
        const g = new Graph(calcPos)
        m.graph = m.graph.map(n => {
          const distance = Math.abs(n.position[0] - g.position[0]) + Math.abs(n.position[1] - g.position[1])
          n.children.push({
            distance,
            node: g
          })
          return n
        })
        m.graph.push(g)
      }
    })
  }
}

const g = new GalaxyMatrix('galaxies.txt', 1000000)
// g.print()
console.log(g.graph.reduce((acc: number, cur) => {
  return acc + cur.children.reduce((acc: number, cur) => acc + cur.distance, 0)
}, 0))
