import { parseFile } from "../utils/fileLoader"

interface Record {
  [k: string]: number
}

interface BoatRaceRecord extends Record {
  time: number,
  distance: number
}

class TimeTable {
  records: Record[] | null = null

  constructor(file: string) {
    const parsed = (parseFile(file, /\r?\n/) as string[]).map((s: string) => s.split(/:?\s+/))
    if (parsed && parsed.every(a => a.length === parsed[0].length)) {
      this.records = []
      for (let i = 1; i < parsed[0].length; i++) {
        const recordObj: Record = {}
        parsed.forEach(arr => {
          recordObj[arr[0].toLowerCase()] = parseInt(arr[i])
        })
        this.records.push(recordObj)
      }
    }
  }
}

function calcBoatResults(raceTime: number, r?: BoatRaceRecord) {
  const results: BoatRaceRecord[] = []
  const mid = (raceTime - 1) / 2 // to count in event of odd, will round up mid and only include this number once, all others will be doubled
  for (let buttonHoldTime = Math.ceil(mid); buttonHoldTime >= 0; buttonHoldTime--) {
    const race = {
      time: raceTime,
      buttonHoldTime,
      distance: buttonHoldTime * (raceTime - buttonHoldTime)
    }
    if (r && r.distance >= race.distance) break
    results.push(race)
    if (buttonHoldTime <= mid) {
      results.unshift({ ...race, buttonHoldTime: raceTime - buttonHoldTime })
    }
  }
  return results
}

function findMarginOfErr(rec: BoatRaceRecord) {
  const halfway = (rec.time - 1) / 2
  let l = 0, r = Math.ceil(halfway)
  const offset = r > halfway ? 1 : 0

  while (l < r) {
    const mid = l + Math.floor((r - l) / 2)
    // console.log('l mid r', l, mid, r)
    const distance = mid * (rec.time - mid)
    // console.log('distance', distance, rec.distance)
    if (distance <= rec.distance) {
      l = mid + 1
    } else {
      r = mid
    }
  }

  return 2 * (Math.ceil(halfway) - l) + offset

}

const boatRaceRecords = new TimeTable('times_fixed.txt')
// const waysToWin = boatRaceRecords.records?.map((r: Record) => {
//   return calcBoatResults(r.time, r as BoatRaceRecord)
// })

// console.log(waysToWin?.reduce((acc: number, cur: BoatRaceRecord[]) => {
//   return acc * cur.length
// }, 1))

const numWaysToWin = boatRaceRecords.records?.map((r: Record) => {
  return findMarginOfErr(r as BoatRaceRecord)
})
console.log(numWaysToWin?.reduce((acc, cur) => acc * cur))
