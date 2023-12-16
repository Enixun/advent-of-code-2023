import { parseFile } from "../utils/fileLoader"

const readings = (parseFile('readings.txt', /\r?\n/) as string[]).map(r => r.split(' ').map(n => Number(n)))

function getRates(seq: number[]) {
  let noChange = false
  const steps: number[][] = [ seq ]
  
  while (!noChange) {
    noChange = true
    const ratesOfChange: number[] = [], curArr = steps[steps.length - 1]
    for (let i = 1; i < curArr.length; i++) {
      const diff = curArr[i] - curArr[i - 1]
      ratesOfChange.push(diff)
      noChange = diff === 0 ? noChange : false
    }
    steps.push(ratesOfChange)
  }

  return steps
}

function predict(seq: number[], dir: 'next' | 'previous') {
  const steps = getRates(seq)

  for (let i = steps.length - 2; i >= 0; i--) {
    if (dir === 'next') steps[i].push(steps[i][steps[i].length - 1] + steps[i + 1][steps[i + 1].length - 1])
    else steps[i].unshift(steps[i][0] - steps[i + 1][0])
  }

  return steps[0][dir === 'next' ? steps[0].length - 1 : 0]
}

console.log(readings.reduce((acc, cur) => acc + predict(cur, 'next'), 0))
console.log(readings.reduce((acc, cur) => acc + predict(cur, 'previous'), 0))
