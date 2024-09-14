import { createElement } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./App"
import { resolveSearch } from "./lib/urlParameter"
import { Config } from "./type"

import "./reset.css"
import "./style.css"

function getConfig() {
  return resolveSearch<Config>(location, {
    devMode: [() => false],
    gold: [() => 250],
    save: [() => 0],
  })
}

function main() {
  let config = getConfig()

  let root = createRoot(document.getElementById("root")!)
  const render = () => {
    root.render(
      createElement(App, {
        baseHeight: window.innerHeight,
        baseWidth: window.innerWidth,
        config,
      }),
    )
  }
  render()
  window.addEventListener("resize", render)
}

main()
