import {
  getParaActivityMessage,
  getParaActivityStatChange,
} from "src/activity/activity"
import { createGirl } from "src/girl/girl"
import { Building, Girl, GirlInfo, Report } from "src/type"

export interface NextDayReportParam {
  girlArray: GirlInfo[]
  buildingByName: Record<string, Building>
}

export function nextDayReport(param: NextDayReportParam): Report {
  let { girlArray, buildingByName } = param
  let report: Report = []

  let girlListInBuilding: Record<string, Girl[]> = {}
  girlArray.forEach((girl) => {
    if (girl.activity.kind === "building") {
      let { buildingName } = girl.activity
      girlListInBuilding[buildingName] ??= []
      girlListInBuilding[buildingName].push(createGirl(girl))
    }
  })

  Object.entries(girlListInBuilding).forEach(([buildingName, girlList]) => {
    girlList.sort((a, b) => a.getBargain() - b.getBargain())

    let building = buildingByName[buildingName]
    let attractivity =
      (building.visibility + building.fame) *
      Math.sqrt(building.visibility / 50)
    let dedicatedCustomerCount = 0
    let maxDedicatedCustomerCountByGirl: Record<string, number> = {}
    let dedicatedCustomerCountByGirl: Record<string, number> = {}
    girlList.forEach((girl) => {
      attractivity += girl.fame
      let count = Math.round(girl.fame / 60)
      dedicatedCustomerCount += count
      maxDedicatedCustomerCountByGirl[girl.name] = count
      dedicatedCustomerCountByGirl[girl.name] = 0
    })
    let buildingCustomerCount = Math.ceil(attractivity / 30)
    let distributedCustomerCount = 0
    let index = 0
    while (distributedCustomerCount < buildingCustomerCount) {
      let { name } = girlList[index % girlList.length]
      if (
        dedicatedCustomerCountByGirl[name] <
        maxDedicatedCustomerCountByGirl[name]
      ) {
        dedicatedCustomerCountByGirl[name]++
        distributedCustomerCount++
      }
      index++
      if (index > buildingCustomerCount ** 2) {
        throw new Error("Infinite loop while distributing dediecated customers")
      }
    }

    girlList.forEach((girl) => {})
  })

  girlArray.forEach((girl) => {
    if (girl.activity.kind !== "building") {
      let statChange = getParaActivityStatChange(girl)
      let message = getParaActivityMessage(girl, statChange)
      report.push({
        kind: "girl",
        girlName: girl.name,
        statChange,
        message,
        imageCount: 0,
        tagList: [],
      })
    }
  })

  return []
}

export interface ReportDisplayProp {
  report: Report
}

export function ReportDisplay(prop: ReportDisplayProp) {
  let { report } = prop
}
