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

function filterFirstAndLastDigits(str: string): string {
  let first = '', last = ''

  for (let i = 0; !(first && last) && i < str.length; i++) {
    if (!first && str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) first = str[i]
    if (!last && str.charCodeAt(str.length - 1 - i) >= 48 && str.charCodeAt(str.length - 1 - i) <= 57) last = str[str.length - 1 - i]
  }

  return first + last
}

console.log(getCalibrations().reduce(sumCalibration, 0))
