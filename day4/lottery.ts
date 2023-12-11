import fs from 'node:fs'
import path from 'node:path'

const cardsStr = fs.readFileSync(path.resolve(__dirname, 'cards.txt'), 'utf-8')

class Game {
  id: string | null = null
  winNums: Set<string> | null = null
  playNums: Set<string> | null = null
  matches: Set<string> | null = null
  count = 1

  constructor(str: string) {
    const theBits = /^(?:Card +)(?<id>\d+)(?:: +)(?<winNums>(\d+\s*?)*)(?: \| +)(?<playNums>[0-9 ]*)$/.exec(str)
    // console.log(theBits)
    
    if (theBits?.groups) {
      this.id = theBits.groups.id
      this.winNums = new Set(theBits.groups.winNums.split(/\s+/))
      this.playNums = new Set()
      this.matches = new Set()
      theBits.groups.playNums.split(/\s+/).forEach(num => {
        this.playNums?.add(num)
        if (this.winNums?.has(num)) this.matches?.add(num)
      })
    }
  }
}

function getWinnings(fileContents: string): number {
  let amount = 0
  for (let i = 0; i < fileContents.length; i++) {
    let gameWin = 0
    let cardId = ''
    const matches: string[] = []
    while (fileContents.charAt(i) !== ':') {
      cardId += fileContents.charAt(i)
      i += 1
    }
    i += 2
    const winnings: Set<string> = new Set()
    while (fileContents.charAt(i) !== '|') {
      if (fileContents.charAt(i) !== ' ') {
        if (fileContents.charAt(i + 1) !== ' ') {
          winnings.add(fileContents.charAt(i) + fileContents.charAt(i + 1))
          i += 1
        }
        else winnings.add(fileContents.charAt(i))
      }
      i += 1
    }
    i += 1

    let numAcc = ''
    while (fileContents.charAt(i) !== '\n') {
      if (fileContents.charAt(i) !== ' ') {
        numAcc += fileContents.charAt(i)
      } else if (numAcc.length > 0) {
        if (winnings.has(numAcc)) {
          gameWin += 1
          matches.push(numAcc)
        }
        numAcc = ''
      }
      i += 1
    }
    if (numAcc.length > 0) {
      if (winnings.has(numAcc)) {
        gameWin += 1
        matches.push(numAcc)
      }
      numAcc = ''
    }

    if (gameWin > 0) {
      amount += 2 ** (gameWin - 1)
    }
  }
  return amount
}

const cardsArr = cardsStr.trim().split(/\n/)

console.log('part 1 winnings', getWinnings(cardsStr))
console.log('part 2 number of cards', cardsArr.map(gameStr => new Game(gameStr)).reduce((acc, cur, ind, arr) => {
  for (let c = 1; c <= cur.count; c++) {
    for (let i = 1; i <= Math.min(arr.length - 1 - ind, cur.matches?.size ?? 0); i++) {
      arr[ind + i].count++
    }
  }

  return acc += cur.count
}, 0))
