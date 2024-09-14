import { AutonomousSmartEntry } from "src/ui/smartEntry/smartEntry"
import { capitalize } from "../lib/text"
import { GirlInfo, GirlStatChange } from "../type"
import { MAX_GIRL_STAT } from "./girl"

export interface GirlStatProp {
  girl: GirlInfo
  statChange?: GirlStatChange
}

export function GirlStat(prop: GirlStatProp) {
  let { girl, statChange } = prop
  return (
    <table className="m-auto text-xl">
      <tbody>
        {Object.keys(MAX_GIRL_STAT).map((statName) =>
          statName === "acquisitionPrice" ? null : (
            <tr key={statName}>
              <td className="px-3 py-1">{capitalize(statName)}</td>
              <td className="border-l-2 border-black px-3 text-right">
                <AutonomousSmartEntry
                  className="w-full text-right"
                  container={girl}
                  keyName={statName}
                />
              </td>
              {statChange && (
                <td>{statChange[statName] && formatStatChange(statChange[statName])}</td>
              )}
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}

function formatStatChange(change: number) {
  return (
    <span className={change > 0 ? "text-green-600" : "text-red-500"}>
      {change > 0 && "+"}
      {change}
    </span>
  )
}
