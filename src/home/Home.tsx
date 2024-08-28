import React from "react"
import { gameContext } from "../context/context"
import { GirlList } from "../girl/GirlList"
import { GirlInfo } from "../type"
import { Button } from "../ui/button/Button"
import { Section } from "../ui/section/Section"

export interface HomeProp {
  handleSave: () => void
  handleNewDay: () => void
  girlArray: GirlInfo[]
}

export function Home(prop: HomeProp) {
  let { handleSave, handleNewDay, girlArray } = prop
  let { changePath } = React.useContext(gameContext)
  return (
    <div className="grid grid-cols-[85%_15%] gap-2">
      <div>
        <GirlList
          girlArray={girlArray.filter((g) => g.owned)}
          onClick={(name) => {
            changePath({ pathAddition: [`girl:${name}`] })
          }}
          act={{ kind: "home" }}
        />
      </div>
      <div>
        <div>
          <Button
            className="mx-auto block"
            onClick={() => {
              changePath({ pathAddition: ["market"] })
            }}
          >
            Girl market
          </Button>
          <Button
            className="mx-auto block"
            onClick={() => {
              changePath({ pathAddition: ["buyplace"] })
            }}
          >
            Buy building
          </Button>
        </div>
        <Section className="text-xl">
          <ul className="p-0">
            {[
              { callback: handleSave, text: "Save" },
              { callback: handleNewDay, text: "New Day" },
            ].map(({ callback, text }) => (
              <li key={text} className="m-1 text-center">
                <Button
                  onClick={callback}
                  className="g-amber-200 border-amber-400"
                >
                  {text}
                </Button>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  )
}
