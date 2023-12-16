import { parseFile } from "../utils/fileLoader"

const readings = (parseFile('readings.txt', /\r?\n/) as string[]).map(r => r.split(' ').map(n => Number(n)))

function predictNext(seq: number[]) {
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

  for (let i = steps.length - 2; i >= 0; i--) {
    steps[i].push(steps[i][steps[i].length - 1] + steps[i + 1][steps[i + 1].length - 1])
  }

  return steps[0][steps[0].length - 1]
}

console.log(readings.reduce((acc, cur) => acc + predictNext(cur), 0))
