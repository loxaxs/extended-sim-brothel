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
  /** changing boolean */
  owned: boolean
  price: number
  activity: Activity
  /** all the images for a girl */
  imageSet: GirlImageSetInfo
}

export interface Girl extends GirlInfo {
  getCharisma(): number
  imageSet: GirlImageSet
}

export interface Building {
  name: string
  /** Number of rooms girls can work in */
  capacity: number
  price: number
  fame: number
  owned: boolean
}

export type Activity = BuildingActivity | OtherActivity

export interface BuildingActivity {
  kind: "building"
  building: Building
}

export interface OtherActivity {
  kind:
    | "rest"
    | "ceremony"
    | "poetrySchool"
    | "danceSchool"
    | "sexSchool"
    | "bondageSchool"
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
}
