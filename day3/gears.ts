// import { parseFile } from "../utils/fileLoader"
// const matrix = parseFile('schematic.txt', '\n').map(e => e.split(''))

// console.log(matrix)

import fs from 'node:fs'
import path from 'node:path'

function generateMatrix(filename: string): string[][] {
  const contents = fs.readFileSync(path.resolve(__dirname, filename), 'utf-8')

  const matrix: string[][] = [];
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
  char: string,
  isValid: boolean
}

function dfsMatrix(m: string[][]): number {
  const searchDirections = [
    [1, 0], //immediate right first, to capture whole number
    [0, -1], // top
    [0, 1], // bottom
    [-1, 0], //left
    [-1, -1], // top left
    [1, -1], // top right
    [-1, 1], // bottom left
    [1, 1], // bottom right
  ];

  let partSum = 0

  function dfsHelper(y: number, x: number): PartNumber {
    if (Number.isNaN(parseInt(m[y][x]))) return { char: '', isValid: m[y][x] !== '.' }
    
    const partNum: PartNumber = {
      char: m[y][x],
      isValid: false,
    }
    m[y][x] = '.'
    
    for (let i = 0; i < searchDirections.length; i++) {
      if (y + searchDirections[i][1] >= 0 && 
          y + searchDirections[i][1] < m.length &&
          x + searchDirections[i][0] >= 0 &&
          x + searchDirections[i][0] < m[y].length) {
            const adjacent = dfsHelper(y + searchDirections[i][1], x + searchDirections[i][0])
            if (i === 0) partNum.char += adjacent.char
            partNum.isValid = adjacent.isValid || partNum.isValid
      }
  }

    return partNum
  }

  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      const partNum = dfsHelper(i, j)
      if (partNum.isValid && partNum.char.length > 0) partSum += parseInt(partNum.char)
    }
  }

  return partSum
}

console.log(dfsMatrix(generateMatrix('schematic.txt')))
