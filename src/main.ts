import { createElement } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./App"

import "./style.css"
import "./reset.css"

function main() {
  let root = createRoot(document.getElementById("root")!)
  const render = () => {
    root.render(createElement(App, {
      baseHeight: window.innerHeight,
      baseWidth: window.innerWidth,
    }))
  }
  render()
  window.addEventListener("resize", render)
}

main()
