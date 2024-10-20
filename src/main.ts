import { createElement } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./App"
import { resolveSearch } from "./lib/urlParameter"
import { Config } from "./type"

import { ProvideT } from "./i18n/useT"
import "./reset.css"
import "./style.css"

function getConfig() {
  return resolveSearch<Config>(location, {
    devMode: [() => false],
    gold: [() => 250],
    safeMode: [() => false],
    save: [() => 0],
    allGirlMode: [() => false],
    achieve: [() => "", (value) => value.split(",")],
    language: [() => "en"],
  })
}

function main() {
  let config = getConfig()
  console.log("config", config)

  let root = createRoot(document.getElementById("root")!)
  const render = () => {
    root.render(
      createElement(
        ProvideT,
        null,
        createElement(App, {
          baseHeight: window.innerHeight,
          baseWidth: window.innerWidth,
          config,
        }),
      ),
    )
  }
  render()
  window.addEventListener("resize", render)
}

main()
