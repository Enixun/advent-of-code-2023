import { Matrix, Coordinates } from "../utils/Matrix"

type Directions = {
  [k: string]: Coordinates
}

const cardinalDirs: Directions = Object.freeze({
  north: [-1, 0],
  south: [1, 0],
  east: [0, 1],
  west: [0, -1]
})

const connectDict: { [k: string]: string } = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east'
}

class Pipe {
  connections: Set<string> = new Set()
  constructor(connection1: string, connection2: string) {
    this.connections.add(connection1)
    this.connections.add(connection2)
  }
}

const pipeDict: { [k: string]: Pipe } = {
  '|': new Pipe('north', 'south'),
  '-': new Pipe('east', 'west'),
  L: new Pipe('north', 'east'), 
  J: new Pipe('north', 'west'),
  F: new Pipe('south', 'east'),
  '7': new Pipe('south', 'west')
}

class PipeMatrix extends Matrix {
  entry: Coordinates | null = null
  constructor(filename: string) {
    super(filename)
    this.traverse((p, c) => {
      if (p === 'S') this.entry = c
    })
  }

  findFurthestPoint() {
    if (this.entry === null) return 'No entry'
    const loopQueue: { pipe: string, from: string, position: Coordinates, steps: number }[] = []

    for (const dir in cardinalDirs) {
      const coord = cardinalDirs[dir]
      const pipe = pipeDict[this.matrix[this.entry[0] + coord[0]][this.entry[1] + coord[1]]]
      if (pipe.connections.has(connectDict[dir])) loopQueue.push({
        pipe: this.matrix[this.entry[0] + coord[0]][this.entry[1] + coord[1]],
        from: connectDict[dir],
        position: [this.entry[0] + coord[0], this.entry[1] + coord[1]],
        steps: 1
      })
    }

    const followPath = (node: typeof loopQueue[number]) => {
      this.matrix[node.position[0]][node.position[1]] = '*'

      for (const dir of pipeDict[node.pipe].connections) {
        const coord = cardinalDirs[dir]
        const pipe = pipeDict[this.matrix[node.position[0] + coord[0]][node.position[1] + coord[1]]]
        if (pipe !== undefined) {
          loopQueue.push({
            pipe: this.matrix[node.position[0] + coord[0]][node.position[1] + coord[1]],
            from: connectDict[dir],
            position: [node.position[0] + coord[0], node.position[1] + coord[1]],
            steps: node.steps + 1
          })
        }
      }
    }

    while (loopQueue.length > 1) {
      followPath(loopQueue.shift()!)
    }

    return loopQueue[0].steps
  }
}

const pipes = new PipeMatrix('pipes.txt')
console.log(pipes.findFurthestPoint())
