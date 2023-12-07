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
    if (isValidGame(game.replace(/Game \d+: (.*)/, '$1'))) sum += parseInt(id)
  }
  return sum
}

const validValues: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14
};

function isValidGame(game:string ): boolean {
  let val = '', prop = ''

  for (let i = 0; i < game.length; i += 2) {
    while (game[i] !== ' ') {
      val += game[i++]
    }
    i += 1
    while (game[i] !== ',' && game[i] !== ';' && i < game.length) {
      prop += game[i++]
    }
    if (!validValues.hasOwnProperty(prop) || parseInt(val) > validValues[prop]) return false
    val = ''
    prop = ''
  }
  return true
}

function getGames(): string[] {
  return fs.readFileSync(path.resolve(__dirname, 'games.txt'), 'utf-8')
    .split('\n')
}

console.log(getGames().reduce(sumIds, 0))