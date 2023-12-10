// import { parseFile } from "../utils/fileLoader"
// const matrix = parseFile('schematic.txt', '\n').map(e => e.split(''))

// console.log(matrix)

import fs from 'node:fs'
import path from 'node:path'

// type Matrix<T> = T[][] //Array<Array<T>>
type Matrix = string[][]

function generateMatrix(filename: string) {
  const contents = fs.readFileSync(path.resolve(__dirname, filename), 'utf-8')

  const matrix: Matrix = [];
  let row: string[] = [];
  for (let i = 0; i < contents.length; i++) {
    if (contents[i] === '\n') {
      matrix.push(row)
      row = []
    } else {
      row.push(contents[i])
    }
  }

  return matrix
}

interface PartNumber {
  value: string,
  isValid: boolean
}

type Coordinates = [x: number, y: number]

type dfsHelper = (y: number, x: number, m: Matrix) => PartNumber | number

const searchDirections: Coordinates[] = [
  [1, 0], //immediate right first, to capture whole number
  [-1, 0], //left
  [0, -1], // top
  [0, 1], // bottom
  [-1, -1], // top left
  [1, -1], // top right
  [-1, 1], // bottom left
  [1, 1], // bottom right
];

function dfNumSearch(y: number, x: number, m: Matrix): PartNumber {
  if (Number.isNaN(parseInt(m[y][x]))) return { value: '', isValid: m[y][x] !== '.' }
  
  const partNum: PartNumber = {
    value: m[y][x],
    isValid: false,
  }
  m[y][x] = '.'
  
  for (let i = 0; i < searchDirections.length; i++) {
    const yOffset = y + searchDirections[i][1], xOffset = x + searchDirections[i][0]

    if (yOffset >= 0 && yOffset < m.length &&
        xOffset >= 0 && xOffset < m[y].length) {
          const adjacent = dfNumSearch(yOffset, xOffset, m)
          if (i === 0) partNum.value += adjacent.value
          if (i === 1) partNum.value = adjacent.value + partNum.value
          partNum.isValid = adjacent.isValid || partNum.isValid
    }
  }

  return partNum
}

function dfGearSearch(y: number, x: number, m: Matrix): number {
  if (m[y][x] !== '*') return 0
  // console.log(m.map(e => e.join('')).join('\n'))

  const gearNums: number[] = []

  for (let i = 0; i < searchDirections.length; i++) {
    const yOffset = y + searchDirections[i][1], xOffset = x + searchDirections[i][0]

    if (yOffset >= 0 && yOffset < m.length &&
        xOffset >= 0 && xOffset < m[y].length) {
          const partNum = dfNumSearch(yOffset, xOffset, m)
          if (partNum.isValid) gearNums.push(parseInt(partNum.value))
    }
  }

  m[y][x] = '.'

  return gearNums.length === 2 ? gearNums[0] * gearNums[1] : 0
}

function traverseMatrix(m: Matrix, cb: (col: number, row: number) => void): void {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      cb(i, j)
    }
  }
}

function reduceMatrix(m: Matrix, fn: dfsHelper): number {
  let partSum = 0

  traverseMatrix(m, (i, j) => {
    const partNum = fn(i, j, m)
    if (typeof partNum === 'number') partSum += partNum
    else if (partNum.isValid && partNum.value.length > 0) partSum += parseInt(partNum.value)
  })

  return partSum
}

console.log('sum of numbers touching symbols:', reduceMatrix(generateMatrix('schematic.txt'), dfNumSearch))
console.log('sum of powers touching *:', reduceMatrix(generateMatrix('schematic.txt'), dfGearSearch))
