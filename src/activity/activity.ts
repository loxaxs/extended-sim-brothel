import { GirlInfo, GirlStatChange, OtherActivity } from "src/type"
import { randomInt } from "../lib/random"

export let otherActivityArray: OtherActivity["kind"][] = [
  "rest",
  "ceremony",
  "poetrySchool",
  "danceSchool",
  "sexSchool",
  "bondageSchool",
]

export let otherActivityNameMapping: Record<OtherActivity["kind"], string> = {
  rest: "Rest",
  ceremony: "Ceremony",
  poetrySchool: "Poetry School",
  danceSchool: "Dance School",
  sexSchool: "Sex School",
  bondageSchool: "Bondage School",
}

export function getParaActivityStatChange(girl: GirlInfo): GirlStatChange {
  let stat: GirlStatChange = {
    prominence: 0,
    libido: 0,
    constitution: 0,
    health: 0,
    commitment: 0,
    sex: 0,
    esteem: 0,
    fame: 0,
  }

  switch (girl.activity.kind) {
    case "rest":
      stat.health += Math.min(20, 100 - girl.health)
      break
    case "bondageSchool":
      stat.constitution += 1 + randomInt(5)
      stat.libido += 1 + randomInt(2)
      break
    case "danceSchool":
      stat.constitution += 1 + randomInt(5)
      break
    case "poetrySchool":
      stat.prominence += 1 + randomInt(5)
      break
    case "sexSchool":
      stat.sex += 1 + randomInt(5)
      stat.libido += 1 + randomInt(2)
      break
    case "ceremony":
      stat.fame += 1 + randomInt(5)
      stat.prominence += 1 + randomInt(3)
      stat.commitment += 1 + randomInt(3)
      break
  }

  return stat
}

export function getParaActivityMessage(
  girl: GirlInfo,
  statChange: GirlStatChange,
) {
  let statChangeMessage = Object.entries(statChange)
    .filter(([k, v]) => v !== 0)
    .map(([name, diff]) => `${name} (${diff})`)
    .join(", ")
  let activityName = otherActivityNameMapping[girl.activity.kind]
  return `Girl ${girl.name} went to ${activityName} and gained or loss ${statChangeMessage}`
}
