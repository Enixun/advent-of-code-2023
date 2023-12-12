import { parseFile } from "../utils/fileLoader"

// interface Mapping {
//   dest: number,
//   src: number,
//   range: number
// }

class Mapping {
  dest: number = -1
  src: number = -1
  range: number = -1
  constructor(obj: { [key: string]: string } | undefined) {
    for (const key in obj) {
      if (key === 'dest' || key === 'src' || key === 'range') this[key] = parseInt(obj[key])
    }
  }
}

class AlmanacMap {
  maps: Mapping[]

  constructor(mapStr: string) {
    this.maps = mapStr.split(/\n/).map((s: string) => {
      const res = /(?<dest>\d+) (?<src>\d+) (?<range>\d+)/.exec(s)
      return new Mapping(res?.groups)
    }).sort((a: Mapping, b: Mapping) => a.src - b.src)
  }

  map(lookup: number) {
    // could use binary search here
    for (let i = 0; i < this.maps.length && lookup >= this.maps[i].src; i++) {
      const { src, dest, range } = this.maps[i]
      if (lookup <= src + range) {
        return dest + (lookup - src)
      }
    }
    return lookup
  }
}

class Almanac {
  seeds: number[] | undefined
  [k: string]: any

  constructor(file: string) {
    const almanac = parseFile(file, '\n\n')
    this.seeds = almanac[0].match(/\d+/g)?.map(num => parseInt(num))

    for (let i = 0; i < almanac.length; i++) {
      const res = /^(?<name>\w+-to-\w+) map:\n(?<maps>(\d+ \d+ \d+\n?)+)/g.exec(almanac[i])
      if (res !== null && res.groups) {
        const mapperName = res.groups.name.replace(/-([a-z])/g, (_m, g1) => g1.toUpperCase())
        const mapObj = new AlmanacMap(res.groups.maps)
        this[mapperName] = mapObj.map.bind(mapObj)
      }
    }
  }

  get soils() {
    return this.seeds?.map(el => this.seedToSoil(el))
  }

  get fertilizers() {
    return this.soils?.map(el => this.soilToFertilizer(el))
  }

  get waters() {
    return this.fertilizers?.map(el => this.fertilizerToWater(el))
  }

  get lights() {
    return this.waters?.map(el => this.waterToLight(el))
  }

  get temperatures() {
    return this.lights?.map(el => this.lightToTemperature(el))
  }

  get humidities() {
    return this.temperatures?.map(el => this.temperatureToHumidity(el))
  }

  get locations() {
    return this.humidities?.map(el => this.humidityToLocation(el))
  }
}

const test = new Almanac('source.txt')
console.log(test.locations?.sort((a, b) => a - b))
