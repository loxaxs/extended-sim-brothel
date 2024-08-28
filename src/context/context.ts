import { createContext } from "react"
import { GameContext } from "../type"

export let gameContext = createContext<GameContext>({
  changePath: () => {
    throw new Error("Missing game context")
  },
})
