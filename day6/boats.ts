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

function calcBoatResults(raceTime: number) {
  const results: BoatRaceRecord[] = []
  for (let buttonHoldTime = 0; buttonHoldTime <= raceTime; buttonHoldTime++) {
    results.push({
      time: raceTime,
      buttonHoldTime,
      distance: buttonHoldTime * (raceTime - buttonHoldTime)
    })
  }
  return results
}

const boatRaceRecords = new TimeTable('times.txt')
const waysToWin = boatRaceRecords.records?.map((r: Record) => {
  return calcBoatResults(r.time).filter(brr => brr.distance > r.distance)
})

console.log(waysToWin?.reduce((acc: number, cur: BoatRaceRecord[]) => {
  return acc * cur.length
}, 1))