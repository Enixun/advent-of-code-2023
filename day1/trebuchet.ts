import fs from 'fs'
import path from 'path'

// console.log(process.argv)

function getCalibrations(filename?:string): string[] {
  // read in values from file and convert to array (break at newlines)
  return fs.readFileSync(path.resolve(__dirname, 'calibrations.txt'), 'utf-8').split('\n');
}

function sumCalibration(sum: number, cal: string): number {
  return sum + parseInt(filterFirstAndLastDigits(cal))
}

const digitDict = Object.freeze({
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9'
})
const digitList = Object.freeze(Object.keys(digitDict) as Array<keyof typeof digitDict>)

function filterFirstAndLastDigits(str: string): string {
  let first = '', last = ''
  let frontAcc = '', backAcc = ''

  for (let i = 0; !(first && last) && i < str.length; i++) {
    if (!first) {
      if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
        first = str[i]
      } else {
        frontAcc += str.charAt(i)
        for (let j = 0; j < digitList.length; j++) {
          if (frontAcc.endsWith(digitList[j])) {
            first = digitDict[digitList[j]]
            break
          }
        }
      }
    }
    if (!last) {
      if (str.charCodeAt(str.length - 1 - i) >= 48 && str.charCodeAt(str.length - 1 - i) <= 57) {
        last = str[str.length - 1 - i]
      } else {
        backAcc = str.charAt(str.length - 1 - i) + backAcc
        for (let j = 0; j < digitList.length; j++) {
          if (backAcc.startsWith(digitList[j])) {
            last = digitDict[digitList[j]]
            break
          }
        }
      }
    }
  }

  return first + last
}

console.log(getCalibrations().reduce(sumCalibration, 0))
