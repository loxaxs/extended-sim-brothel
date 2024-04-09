import { createElement } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./App"

function main() {
  let root = createRoot(document.getElementById("root")!)
  root.render(createElement(App))
}

main()
