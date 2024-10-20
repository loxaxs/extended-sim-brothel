import { getMaxGirlStat } from "src/girl/girl"
import { signed } from "src/lib/number"
import { randomInt } from "../lib/random"
import { Activity, GirlInfo, GirlStatChange, OtherActivity, TFunction } from "../type"

export let otherActivityArray: OtherActivity["kind"][] = [
  "rest",
  "ceremony",
  "poetrySchool",
  "danceSchool",
  "sexSchool",
  "bondageSchool",
]

export let getOtherActivityName = (activityName: Activity["kind"], t: TFunction) =>
  ({
    rest: t("Rest"),
    ceremony: t("Ceremony"),
    poetrySchool: t("Poetry School"),
    danceSchool: t("Dance School"),
    sexSchool: t("Sex School"),
    bondageSchool: t("Bondage School"),
  })[activityName]

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
      stat.prominence += 1 + randomInt(3)
      break
    case "poetrySchool":
      stat.prominence += 1 + randomInt(5)
      stat.esteem += 1 + randomInt(3)
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

export function getParaActivityMessage(girl: GirlInfo, statChange: GirlStatChange, t: TFunction) {
  let maxGirlStat = getMaxGirlStat(t)
  let statChangeMessage = Object.entries(statChange)
    .filter(([k, v]) => v !== 0)
    .map(([name, diff]) =>
      t(`{statName} ({delta})`, { statName: maxGirlStat[name].name, delta: signed(diff) }),
    )
    .join(", ")
  let activityName = getOtherActivityName(girl.activity.kind, t)
  if (statChangeMessage) {
    return t(`{name} went to {activityName} and gained/lost {statChangeMessage}.`, {
      name: girl.name,
      activityName,
      statChangeMessage,
    })
  }
  return t(`{name} went to {activityName} and nothing happened.`, {
    name: girl.name,
    activityName,
  })
}
