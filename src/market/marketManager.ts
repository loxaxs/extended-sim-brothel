import { randomExtract, randomInt } from "../lib/random"
import { GirlInfo } from "../type"

export function createMarketManager(initialGirlArray: GirlInfo[]) {
  // GirlArray lists the girls which can be bought now or later
  let girlArray = [...initialGirlArray]
  // AvailableGirlArray lists the girls which are in the market today
  let girlInMarketArray = randomExtract(Math.ceil(girlArray.length / 2) * 2, girlArray)
  return {
    getGirlArray() {
      return girlInMarketArray
    },
    handleNewDay() {
      return
      // One girl leaves the market, some enter it
      // If there's only one girl remaining, make sure she stays in the market
      if (girlArray.length === girlInMarketArray.length) {
        return
      }
      const girlLeavingMarketCount = 1
      let girlEnteringMarketCount =
        Math.ceil(girlArray.length / 2) + girlLeavingMarketCount - girlInMarketArray.length
      // The girl which can enter the market are the girls which are not already
      // in it.
      let girlEnteringOptionArray = girlArray.filter((g) => !girlInMarketArray.includes(g))
      let girlEnteringMarketArray = randomExtract(girlEnteringMarketCount, girlEnteringOptionArray)
      girlInMarketArray.splice(randomInt(girlInMarketArray.length), girlLeavingMarketCount)
      girlInMarketArray.push(...girlEnteringMarketArray)
    },
    handleBuy(girlName: string) {
      girlInMarketArray = girlInMarketArray.filter((g) => g.name !== girlName)
      girlArray = girlArray.filter((g) => g.name !== girlName)
    },
  }
}

export type MarketManager = ReturnType<typeof createMarketManager>
