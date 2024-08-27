import React from "react"
import { Button } from "./button/Button"
import { ChangePathAction } from "./Game"
import { GirlList } from "./girlList/GirlList"
import { GirlInfo } from "./type"

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
        <Button
          onClick={() => {
            changePath({ pathAddition: ["market"] })
          }}
        >
          Market
        </Button>
        <div className="rounded-2xl border border-black text-xl">
          <ul className="p-0">
            {[
              { callback: handleSave, text: "Save" },
              { callback: handleNewDay, text: "New Day" },
            ].map(({ callback, text }) => (
              <li key={text} className="m-1 text-center">
                <button
                  onClick={callback}
                  className="g-amber-200 rounded-xl border border-amber-400 p-1 hover:bg-yellow-200"
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
