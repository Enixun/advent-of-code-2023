import { parseFile } from "../utils/fileLoader"

export type Coordinates = [row: number, col: number]

// type dfsHelper = (y: number, x: number, m: Matrix) => void

type TraverseFunction = (val: string) => void
  | ((val: string, position: Coordinates) => void)

export class Matrix {
  matrix: string[][]

  constructor(filename: string) {
    const contents = parseFile(filename)

    this.matrix = [];
    let row: string[] = [];
    for (let i = 0; i < contents.length; i++) {
      if (contents[i] === '\n') {
        this.matrix.push(row)
        row = []
      } else {
        row.push(contents[i])
      }
    }
  }

  traverse(cb: (val: string, position: Coordinates, mat: typeof this) => void | TraverseFunction): void {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        cb(this.matrix[i][j], [i, j], this)
      }
    }
  }

  print() {
    console.log(this.matrix.reduce((acc, cur) => acc + cur.join('') + '\n', ''))
  }
}
