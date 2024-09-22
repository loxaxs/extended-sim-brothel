import { getParaActivityMessage, getParaActivityStatChange } from "../activity/activity"
import { createGirl, healthTag } from "../girl/girl"
import { Building, Girl, GirlInfo, Report } from "../type"

export interface NextDayReportParam {
  girlArray: GirlInfo[]
  buildingByName: Record<string, Building>
}

export function nextDayReport(param: NextDayReportParam): Report {
  let { girlArray, buildingByName } = param
  let report: Report = []

  //
  // Deal with the girls working in bulidings
  //
  let girlListInBuilding: Record<string, Girl[]> = {}
  Object.values(buildingByName).forEach(({ name }) => {
    girlListInBuilding[name] = []
  })
  girlArray.forEach((girl) => {
    if (girl.activity.kind === "building") {
      let { buildingName } = girl.activity
      girlListInBuilding[buildingName].push(createGirl(girl))
    }
  })

  // redirectedCustomerCount is the number of customers that will accept
  // to be redirected to another (more prestigious) building
  let redirectedCustomerCount = 0
  Object.entries(girlListInBuilding).forEach(([buildingName, girlList]) => {
    if (girlList.length === 0) {
      // There will be no message for empty buildings
      return
    }

    // Sort by decreasing bargain
    girlList.sort((a, b) => b.getBargain() - a.getBargain())

    // Compute building attractivity and girl count by building
    let building = buildingByName[buildingName]
    let buildingAttractivity =
      (building.visibility + building.fame) * Math.sqrt(building.visibility / 50)
    let maxDedicatedCustomerAttemptTotal = 0
    let maxDedicatedCustomerAttemptCountByGirl: Record<string, number> = {}
    let dedicatedCustomerAttemptCountByGirl: Record<string, number> = {}
    let customerCountByGirl: Record<string, number> = {}
    girlList.forEach((girl) => {
      buildingAttractivity += girl.fame
      let count = Math.min(Math.round(girl.fame / 60), girl.getMaxiumumCustomerCount())
      maxDedicatedCustomerAttemptTotal += count
      maxDedicatedCustomerAttemptCountByGirl[girl.name] = count
      dedicatedCustomerAttemptCountByGirl[girl.name] = 0
      customerCountByGirl[girl.name] = 0
    })
    // Determine the number of customers who went to the building
    let buildingCustomerCount = Math.ceil(buildingAttractivity / 30) + redirectedCustomerCount

    // Distribute the customers as dedicated customers first
    // N.B: remember the girls have been sorted by bargain
    // If the building runs out of dedicated customers, the ones with the
    // best bargain will be the ones with more customers
    // If a dedicated customer finds his girl too expensive, he will ignore his
    // dedication and be treated as a non-dedicated customer
    // If a non-dedicated customer finds the girl too expensive, he will leave
    let dedicatedCustomerAttemptCount = 0
    let distributedCustomerCount = 0
    let index = 0
    while (true) {
      if (distributedCustomerCount >= buildingCustomerCount) {
        // No more customers to distribute
        break
      }
      if (dedicatedCustomerAttemptCount >= maxDedicatedCustomerAttemptTotal) {
        // All dedicated customers have been distributed
        break
      }
      let girl = girlList[index % girlList.length]
      let { name } = girl
      if (
        dedicatedCustomerAttemptCountByGirl[name] < maxDedicatedCustomerAttemptCountByGirl[name]
      ) {
        dedicatedCustomerAttemptCountByGirl[name]++
        dedicatedCustomerAttemptCount++
        let bargain = girl.getBargain()
        let accepts = bargain + Math.random() > 1
        if (accepts) {
          customerCountByGirl[name]++
          distributedCustomerCount++
        }
      }
      index++
      if (index > buildingCustomerCount ** 2) {
        throw new Error("Infinite loop while distributing dediecated customers")
      }
    }

    // Distribute the remaining, non-dedicated customers
    // Non-dedicated customers all just pick the girl with the best bargain
    let leavingCustomerCount = 0
    girlList.forEach((girl) => {
      let { name } = girl
      let max = girl.getMaxiumumCustomerCount()
      let bargain = girl.getBargain()
      Array.from({
        length: buildingCustomerCount - distributedCustomerCount - leavingCustomerCount,
      }).every(() => {
        if (bargain + Math.random() > 1) {
          customerCountByGirl[name]++
          distributedCustomerCount++
        } else {
          leavingCustomerCount++
        }
        return customerCountByGirl[name] < max
      })
    })

    let girlIndex: number
    let name: string
    let max: number
    let bargain: number
    let setGirlIndex = (index: number) => {
      girlIndex = index
      name = girlList[girlIndex].name
      max = girlList[girlIndex].getMaxiumumCustomerCount()
      bargain = girlList[girlIndex].getBargain()
    }
    setGirlIndex(0)
    Array.from({ length: buildingCustomerCount - distributedCustomerCount }).some(() => {
      if (customerCountByGirl[name] >= max) {
        setGirlIndex(girlIndex + 1)
        if (girlIndex >= girlList.length) {
          return true
        }
      }
      if (bargain + Math.random() > 1) {
        customerCountByGirl[name]++
        distributedCustomerCount++
      } else {
        leavingCustomerCount++
      }
    })

    let extraCustomerCount = Math.max(0, buildingCustomerCount - distributedCustomerCount)
    redirectedCustomerCount = Array.from({ length: extraCustomerCount }).filter(
      () => Math.random() < 0.5,
    ).length

    let message = `${buildingCustomerCount} customers came to ${buildingName}.`
    if (leavingCustomerCount) {
      message += ` ${leavingCustomerCount} left because of the prices.`
    }
    if (extraCustomerCount) {
      message += ` ${extraCustomerCount} could not be serviced.`
      if (redirectedCustomerCount) {
        message += `. ${redirectedCustomerCount} of them were redirected to the next building.`
      }
    }

    report.push({
      kind: "other",
      message,
      goldChange: 0,
    })

    girlList.forEach((girl) => {
      let { name } = girl
      let count = customerCountByGirl[name]
      let goldChange = girl.sessionPrice * count
      report.push({
        kind: "girl",
        girlName: name,
        message: `${name} can work with ${girl.getMaxiumumCustomerCount()} customers. She received ${count} customers today, earning ${goldChange} gold.`,
        statChange: {
          prominence: 0,
          libido: 0,
          constitution: 0,
          health: -count,
          commitment: 0,
          sex: +count,
          esteem: 0,
          fame: 0,
        },
        goldChange,
        imageCount: count,
        tagList: Array.from({ length: count }, () => "vaginal"),
      })
    })
  })

  //
  // Deal with girls working outside of buildings
  //
  girlArray.forEach((girl) => {
    if (girl.activity.kind !== "building") {
      let statChange = getParaActivityStatChange(girl)
      let message = getParaActivityMessage(girl, statChange)
      report.push({
        kind: "girl",
        girlName: girl.name,
        statChange,
        message,
        goldChange: -20,
        imageCount: 1,
        tagList: [healthTag(girl.health + statChange.health)],
      })
    }
  })

  let totalGoldChange = report.reduce((acc, { goldChange }) => acc + goldChange, 0)
  report.push({
    kind: "other",
    message: `In total you ${totalGoldChange >= 0 ? "earned" : "lost"} ${Math.abs(totalGoldChange)} gold today.`,
    goldChange: 0,
  })

  return report
}
