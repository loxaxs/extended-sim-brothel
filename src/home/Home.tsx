import React from "react"
import { ChangePathAction } from "../Game"
import { GirlList } from "../girl/GirlList"
import { GirlInfo } from "../type"
import { Button } from "../ui/button/Button"
import { Section } from "../ui/section/Section"

export interface HomeProp {
  handleSave: () => void
  handleNewDay: () => void
  changePath: (action: ChangePathAction) => void
  girlArray: GirlInfo[]
}

export function Home(prop: HomeProp) {
  let { handleSave, handleNewDay, changePath, girlArray } = prop
  return (
    <>
      <div className="inline-block">
        <GirlList
          girlArray={girlArray.filter((g) => g.owned)}
          onClick={(name) => {
            changePath({ pathAddition: [`girl:${name}`] })
          }}
        />
      </div>
      <div className="inline-block">
        <div>
          <Button
            className="block"
            onClick={() => {
              changePath({ pathAddition: ["market"] })
            }}
          >
            Girl market
          </Button>
          <Button
            className="block"
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
    </>
  )
}
