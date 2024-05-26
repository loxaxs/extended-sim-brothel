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
  /** all the images for a girl */
  imageSet: GirlImageSetInfo
}

export interface Girl extends GirlInfo {
  getCharisma(): number
  imageSet: GirlImageSet
}
