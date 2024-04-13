/**
 * This script finds `.girl.yaml` files in the `esbpic` folder and resolves the image URL corresponding to each page url found in the girl file.
 */

import { default as fsp } from "fs/promises"

const excludeList = [".git", "node_modules"]

async function walkPath(
  path: string,
  callback: (arg: { file: string; fullPath: string }) => Promise<void>,
  callbackPromiseList: Promise<unknown>[] = [],
): Promise<void> {
  let fileArray = await fsp.readdir(path)
  let directoryArray: string[] = []
  for (let file of fileArray) {
    let fullPath = path + "/" + file
    let stat = await fsp.stat(fullPath)
    if (stat.isFile()) {
      callbackPromiseList.push(callback({ file, fullPath }))
    } else if (!excludeList.includes(file)) {
      directoryArray.push(fullPath)
    }
  }
  await Promise.all(
    directoryArray.map((directory) =>
      walkPath(directory, callback, callbackPromiseList),
    ),
  )
}

function main() {
  walkPath(__dirname + "/../esbpic", async ({ file, fullPath }) => {
    let fileNameParts = file.split(".")
    let [extA, extB] = fileNameParts.slice(-2)
    if (extA === "girl" && ["yaml", "yml"].includes(extB)) {
      let fileStem = fileNameParts.slice(0, -2).join(".")
      let content = await fsp.readFile(fullPath, "utf-8")
      let dataContent = await Promise.all(
        content.split("\n").map(async (line) => {
          let [_dash, pageUrl, ...tagList] = line.split(" ")
          let response = await fetch(pageUrl + ".json")
          let data: any = await response.json()
          let media: Record<string, string> = {}
          data.media_asset.variants.forEach((variant: any) => {
            media[variant.type] = variant.url
          })
          return { media, tagList }
        }),
      )
      let destinationPath =
        fullPath.slice(0, -file.length) + fileStem + ".girl.pictureUrl.json"

      fsp.writeFile(
        destinationPath,
        JSON.stringify(dataContent, null, 2),
        "utf-8",
      )
    }
  })
}

main()
