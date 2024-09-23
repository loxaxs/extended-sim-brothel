import React from "react"
import { createGirl } from "../girl/girl"
import { GirlDisplay } from "../girl/GirlDisplay"
import { GirlStat } from "../girl/GirlStat"
import { Girl, GirlInfo, GirlReportLine, Report } from "../type"
import { Button } from "../ui/button/Button"

export interface ReportDisplayProp {
  report: Report
  girlByName: Record<string, GirlInfo>
  handleExitReport: () => void
  setGold: (goldAction: React.SetStateAction<number>) => void
}

export function ReportDisplay(prop: ReportDisplayProp) {
  let { report, girlByName, handleExitReport, setGold } = prop
  let [page, setPage] = React.useState(0)
  let line = report[page]

  let applyEffect = () => {
    let goldTotalChange = 0
    report.forEach((line) => {
      goldTotalChange += line.goldChange
      if (line.kind !== "girl") {
        return
      }
      let girlInfo = girlByName[line.girlName]
      Object.entries(line.statChange).forEach(([statName, change]) => {
        girlInfo[statName] += change
      })
    })

    setGold((gold) => gold + goldTotalChange)
  }

  return (
    <>
      {line.kind === "girl" && (
        <ReportGirlDisplay line={line} girl={createGirl(girlByName[line.girlName])} />
      )}
      {line.message}
      <Button
        disabled={page <= 0}
        onClick={() => {
          setPage((p) => p - 1)
        }}
      >
        Previous
      </Button>
      <Button
        onClick={() => {
          if (page + 1 >= report.length) {
            applyEffect()
            handleExitReport()
            return
          }
          setPage((p) => p + 1)
        }}
      >
        {page + 1 >= report.length ? "Exit report" : "Next"}
      </Button>
    </>
  )
}

export function ReportGirlDisplay(prop: { line: GirlReportLine; girl: Girl }) {
  let { line, girl } = prop

  return (
    <div className="flex">
      <GirlDisplay girl={girl} maxSize={300} tagList={line.tagList} count={line.imageCount} />
      <GirlStat girl={girl} statChange={line.statChange} />
    </div>
  )
}
