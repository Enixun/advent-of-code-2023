import { Matrix, Coordinates } from '../utils/Matrix'

class Graph {
  static idCount = 1
  id: number
  position: Coordinates
  children: { distance: number, node: Graph}[]
  constructor(position: Coordinates) {
    this.id = Graph.idCount++
    this.position = position
    this.children = []
  }
}

class GalaxyMatrix extends Matrix {
  graph: Graph[] = []
  constructor(file: string) {
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
        this.matrix = this.matrix.map(row => [...row.slice(0, j), '.', ...row.slice(j)])
        j += 1
      }
    }
    const rowMap: typeof this.matrix = []
    this.matrix = this.matrix.reduce((acc, cur) => {
      acc.push(cur)
      if (cur.every(el => el === '.')) acc.push(cur)
      return acc
    }, rowMap)

    this.traverse((val, pos, m) => {
      if (val === '#') {
        const g = new Graph(pos)
        this.graph = this.graph.map(n => {
          const distance = Math.abs(n.position[0] - g.position[0]) + Math.abs(n.position[1] - g.position[1])
          n.children.push({
            distance,
            node: g
          })
          return n
        })
        this.graph.push(g)
      }
    })
  }
}

const g = new GalaxyMatrix('galaxies.txt')
console.log(g.graph.reduce((acc: number, cur) => {
  return acc + cur.children.reduce((acc: number, cur) => acc + cur.distance, 0)
}, 0))
