import fs from 'node:fs'
import path from 'node:path'

const cardsStr = fs.readFileSync(path.resolve(__dirname, 'cards.txt'), 'utf-8')

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

console.log(getWinnings(cardsStr))