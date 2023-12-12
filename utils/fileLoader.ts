import fs from 'node:fs'
import path from 'node:path'

const calledDir = process.argv[1].slice(0, process.argv[1].lastIndexOf('/'))

// export function parseFile(filePath: string): string {
//   const fileContents = fs.readFileSync(path.resolve(calledDir, filePath), 'utf-8')
//   return fileContents
// }
export function parseFile(filePath: string, separator: string | RegExp): string[] {
  const fileContents = fs.readFileSync(path.resolve(calledDir, filePath), 'utf-8')
  return fileContents.trim().split(separator)
}
