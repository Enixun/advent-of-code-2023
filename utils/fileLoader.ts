import fs from 'node:fs'
import path from 'node:path'

const calledDir = process.argv[1].slice(0, process.argv[1].lastIndexOf('/'))

export function parseFile(filePath: string, separator?: string | RegExp): string | string[] {
  const fileContents = fs.readFileSync(path.resolve(calledDir, filePath), 'utf-8').trim()
  return separator ? fileContents.split(separator) : fileContents
}
