import { SetStateAction } from "react"

export type TFunction = (key: string, interpolation?: Record<string, string | number>) => string
export type NTFunction = (
  key: string,
  pluralKey: string,
  count: number,
  interpolation?: Record<string, string | number>,
) => string

export interface Config {
  devMode: boolean
  gold: number
  safeMode: boolean
  save: number
  allGirlMode: boolean
  achieve: Achievable[]
  language: "en" | "fr"
}

export type Achievable = "allGirl" | "allBuilding"

export interface SaveExtraData {
  index: number
  title: string
  name: string
  hasData: boolean
}

export interface GirlImage {
  src: string
  girlName: string
  tagList: string[]
}

export interface GirlImageSetInfo {
  tagMapping: Record<string, GirlImage[]>
}

export interface GirlImageSet extends GirlImageSetInfo {
  getByTag(...tags: string[]): GirlImage
  getSeveralByTag(count: number, ...tags: string[]): GirlImage[]
}

/**
 * Beauty+Prominence->Charisma
 * Libido,Constitution,Health~>Maximum customer count
 * Commitment-Character->Willingness to work
 * Sex~>Customer satisfaction, likelyhood of tipping
 * Esteem~>Customer evaluation of the quality of service
 * Fame~>Number of customers to come to the building
 */
export interface GirlInfo {
  name: string
  /** fixed stat */
  beauty: number
  /** influencable stat */
  prominence: number
  /** changing stat */
  libido: number
  /** influencable stat */
  constitution: number
  /** changing stat */
  health: number
  /** fixed stat */
  character: number
  /** influencable stat */
  commitment: number
  /** changing stat */
  sex: number
  /** changing stat */
  esteem: number
  /** changing stat */
  fame: number
  /** acquisition of ownership */
  acquisitionPrice: number
  owned: boolean
  /** user-set value */
  sessionPrice: number
  activity: Activity
  /** all the images for a girl */
  imageSet: GirlImageSetInfo
}

export type GirlVaryingStatKey =
  | "prominence"
  | "libido"
  | "constitution"
  | "health"
  | "commitment"
  | "sex"
  | "esteem"
  | "fame"

export type GirlStatChange = Record<GirlVaryingStatKey, number>

export interface Girl extends GirlInfo {
  /** bargain is a ratio */
  getBargain(): number
  /** charisma in [0, 200] */
  getCharisma(): number
  /** willinness in [-100; 100]  */
  getWillingness(): number
  /** max customer count in [1, 4] */
  getMaxiumumCustomerCount(): number
  imageSet: GirlImageSet
}

export interface Building {
  id: string
  /** Number of rooms girls can work in */
  capacity: number
  price: number
  visibility: number
  fame: number
  owned: boolean
}

export type Activity = BuildingActivity | OtherActivity

export interface BuildingActivity {
  kind: "building"
  buildingId: string
}

export interface OtherActivity {
  kind: "rest" | "ceremony" | "poetrySchool" | "danceSchool" | "sexSchool" | "bondageSchool"
}

export interface GameState {
  day: number
  gold: number
  girlArray: GirlInfo[]
  buildingArray: Building[]
}

export type Size = { width: number; height: number }
export type SizeArray = Size[]

export interface ChangePathAction {
  pathLevelRemovalCount?: number
  pathAddition?: string[]
}

export interface GameContext {
  changePath: (action: ChangePathAction) => void
  devMode: boolean
  safeMode: boolean
  setFooterContent: (a: SetStateAction<string>) => void
}

export type Report = ReportLine[]
export type ReportLine = GirlReportLine | OtherReportLine
export interface GirlReportLine {
  kind: "girl"
  girlName: string
  imageCount: number
  tagList: string[]
  statChange: GirlStatChange
  goldChange: number
  message: string
}
export interface OtherReportLine {
  kind: "other"
  goldChange: number
  message: string
}
