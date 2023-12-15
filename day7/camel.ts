import { parseFile } from '../utils/fileLoader'

const cardDict: { [k: string]: number } = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 1,
  Q: 12,
  K: 13,
  A: 14
}

enum HandTypes {
  High = 0,
  One,
  Two,
  Three,
  Full = 3.5,
  Four = 4,
  Five
}

function getHandType(cards: string): HandTypes {
  const cardCount: { [k: keyof typeof cardDict]: number } = {}
  Object.defineProperty(cardCount, 'jCount', {
    enumerable: false,
    writable: true,
    value: 0
  })
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    if (cardDict[card] === undefined) throw new Error(`Invalid card: ${cards} is not a valid Hand`)
    if (card !== 'J') cardCount[card] =  cardCount[card] + 1 || 1
    else cardCount.jCount += 1
  }

  const values = Object.values(cardCount).sort((a, b) => b - a)
  values[0] += cardCount.jCount
  // console.log(cards, cardCount, 'jCount', cardCount.jCount)
  switch (values.length){
    case 1:
      return HandTypes.Five
    case 2:
      return values.includes(4) 
        ? HandTypes.Four 
        : HandTypes.Full
    case 3: 
      return values.includes(3)
        ? HandTypes.Three
        : HandTypes.Two
    case 4:
      return HandTypes.One
    default:
      return HandTypes.High
  }
}

class Hand {
  bid: number
  cards: string
  type: HandTypes

  constructor(s: string) {
    const vals = s.split(' ')
    if (Number.isNaN(Number(vals[1]))) throw new Error(`Invalid bid: ${vals[1]} is not a valid bid`)
    this.cards = vals[0]
    if (this.cards.length !== 5) throw new Error(`Invalid hand: ${this.cards} does not have enough cards`)
    this.bid = parseInt(vals[1])

    this.type = getHandType(this.cards)
  }
}

class Game {
  hands: Hand[]
  constructor(file: string) {
    this.hands = (parseFile(file, /\r?\n/) as string[]).map(s => new Hand(s))
  }
}

console.log(new Game('hands.txt').hands.sort((a, b) => {
  if (a.type === b.type) {
    let i = 0
    while (i < a.cards.length && a.cards[i] === b.cards[i]) i++

    return cardDict[a.cards[i]] - cardDict[b.cards[i]]
  }
  return a.type - b.type
}).reduce((acc, cur, i) => {
  const val = (i + 1) * cur.bid
  // console.log('Type:', cur.type, 'Rank:', i + 1, cur.cards, acc, '+', i + 1, '*', cur.bid, '=', acc, '+',  val, '=', acc + val)
  return acc + val
}, 0))
