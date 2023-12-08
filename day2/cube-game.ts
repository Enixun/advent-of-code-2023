import fs from 'node:fs'
import path from 'node:path'

// interface Round {
//   red: number,
//   green: number,
//   blue: number
// }

// interface Game {
//   id: number,
//   rounds: Array<Round>
// }

// class Game {
//   id: number
//   rounds: Array<Round>
//   constructor(str: string) {
//     this.id = parseInt(str.replace(/Game (\d+):/g, '$1'))
//   }
// }

function sumIds(sum: number, game: string) {
  if (game.length) {
    const id = game.replace(/Game (\d+):.*/, '$1')
    if (checkGame(game.replace(/Game \d+: (.*)/, '$1'), true)) sum += parseInt(id)
  }
  return sum
}

function sumPowers(sumOfProducts: number, game: string) {
  if (game.length) {
    const gameObj = checkGame(game.replace(/Game \d+: (.*)/, '$1'), false)
    sumOfProducts += Object.values(gameObj).reduce((acc, cur) => acc * cur)
  }
  return sumOfProducts
}

const validValues: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14
}

function checkGame(game:string, validate: boolean = false): boolean | typeof minValidNumber {
  let val = '', prop = ''
  const minValidNumber: Record<string, number> = {}

  for (let i = 0; i < game.length; i += 2) {
    while (game[i] !== ' ') {
      val += game[i++]
    }
    i += 1
    while (game[i] !== ',' && game[i] !== ';' && i < game.length) {
      prop += game[i++]
    }
    if (validate && (!validValues.hasOwnProperty(prop) || parseInt(val) > validValues[prop])) return false
    else minValidNumber[prop] = minValidNumber.hasOwnProperty(prop) ? Math.max(minValidNumber[prop], parseInt(val)) : parseInt(val)
    val = ''
    prop = ''
  }
  return validate || minValidNumber
}

function getGames(): string[] {
  return fs.readFileSync(path.resolve(__dirname, 'games.txt'), 'utf-8')
    .split('\n')
}

console.log('sum of ids', getGames().reduce(sumIds, 0))
console.log('sum of products',getGames().reduce(sumPowers, 0))