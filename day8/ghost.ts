import { parseFile } from '../utils/fileLoader'

type SearchNode = {
  L: string,
  R: string
}

const [ directions, nodesArr ] = parseFile('nodes.txt', /(?:\r?\n){2}/) as string[]

const nodes: { [k: string]: SearchNode } = {}

nodesArr.split(/\r?\n/).forEach(n => {
  const node = n.match(/^(?<name>\w{3}) = \((?<left>\w{3}), (?<right>\w{3})\)$/)
  if (node === null || !node.groups) throw new Error(`Pattern not met: invalid node ` + n)
  const { name, left, right } = node.groups
  nodes[ name ] = { L: left, R: right }
})

let curNode = 'AAA', i = 0, counter = 0
if (directions.match(/[^LR]/) !== null) throw new Error('Invalid search directions: Must be sequence of Ls and/or Rs')

while (curNode !== 'ZZZ' && i < directions.length) {
  curNode = nodes[curNode][directions[i] as 'L' | 'R']
  if (++i >= directions.length) i = 0
  counter += 1
}

console.log('Number of steps:', counter)
