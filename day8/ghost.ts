import { parseFile } from '../utils/fileLoader'

type SearchNode = {
  L: string,
  R: string
}

class SearchNodeCollection {
  nodes: { [k: string]: SearchNode } = {}
  startNodes: SearchNode[] = []
  directions: string
  constructor(file: string) {
    const [ directions, nodesArr ] = parseFile(file, /(?:\r?\n){2}/) as string[]

    nodesArr.split(/\r?\n/).forEach(n => {
      const node = n.match(/^(?<name>\w{3}) = \((?<left>\w{3}), (?<right>\w{3})\)$/)
      if (node === null || !node.groups) throw new Error(`Pattern not met: invalid node ` + n)
      const { name, left, right } = node.groups
      this.nodes[name] = { L: left, R: right }
    })

    if (directions.match(/[^LR]/) !== null) throw new Error('Invalid search directions: Must be sequence of Ls and/or Rs')
    this.directions = directions
  }

  traverse() {
    let curNode = 'AAA', i = 0, counter = 0
    
    while (curNode !== 'ZZZ' && i < this.directions.length) {
      curNode = this.nodes[curNode][this.directions[i] as 'L' | 'R']
      if (++i >= this.directions.length) i = 0
      counter += 1
    }

    return counter
  }
}

const test = new SearchNodeCollection('nodes.txt')
console.log('Number of steps:', test.traverse())
