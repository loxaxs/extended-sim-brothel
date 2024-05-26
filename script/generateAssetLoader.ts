/**
 * /!\ This script is meant to be called from the root of the project.
 *
 * This script generates the asset loader file.
 * It reads the "esbpic" folder and generates a file which exports an object with all the assets.
 */

import { default as fsp } from "fs/promises"

/**
 * Walk the `esbpic` folder to find all the images ending in `.pic.*` and
 * `.*.pic` and generate an entry which contains the original name and the
 * source path for each image. All the entries are written to a single file:
 * "src/asset/girlAsset.ts"
 */
async function generateGirlAssetLoader() {
  // Check for the presence of the esbpic folder
  let found = false
  try {
    let stat = await fsp.stat("esbpic")
    found = stat.isDirectory()
  } catch {}
  if (!found) {
    throw new Error(
      "Cannot find the esbpic directory. The script should be run from the root of the project.",
    )
  }

  // Populate the image path array for local images
  let localImagePathArray: string[] = []
  await walkPath("esbpic", async ({ file, fullPath }) => {
    let [extA, extB] = file.split(".").slice(-2)
    if (extA === "pic" || extB === "pic") {
      localImagePathArray.push(fullPath)
    }
  })
  localImagePathArray.sort()

  // Populate the girl file array for remote images
  let girlFileArray: {
    girlName: string
    data: {
      media: string
      tags: string
    }[]
  }[] = []
  let callbackPromiseList: Promise<unknown>[] = []
  await walkPath(
    "esbpic",
    async ({ file, fullPath }) => {
      let fileNameParts = file.split(".")
      if (file.endsWith(".girl.pictureUrl.json")) {
        let girlName = fileNameParts
          .slice(0, -3)
          .join(".")
          .split("_")
          .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
          .join(" ")

        let content = await fsp.readFile(fullPath, "utf-8")
        let data = JSON.parse(content)

        girlFileArray.push({ girlName, data })
      }
    },
    callbackPromiseList,
  )
  await Promise.all(callbackPromiseList)

  // Compile the local image list into code
  let localImageListCode = localImagePathArray
    .map((imagePath) => {
      let { assetRelativePath, girlName, tagList } = parseImagePath(imagePath)

      return `
  {
    girlName: "${girlName}",
    tagList: ${JSON.stringify(tagList)},
    src: new URL(
      "${assetRelativePath}?width=720",
      import.meta.url,
    ),
  },`
    })
    .join("")

  // Compile the remote image list into code
  let remoteImageListCode = girlFileArray
    .map(({ girlName, data }) => {
      return Object.values(data)
        .map(
          (piece) => `
  {
    girlName: "${girlName}",
    tagList: ${JSON.stringify(piece.tags.split(' '))},
    src: "${piece.media}",
  },`,
        )
        .join("")
    })
    .join("")

  fsp.writeFile(
    __dirname + "/../src/asset/girlAsset.ts",
    `export const girlImageList = [${localImageListCode}${remoteImageListCode}\n]\n`,
    "utf-8",
  )
}

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

function parseImagePath(imagePath: string) {
  let filename = imagePath.split("/").slice(-1)[0]
  let [snakeCaseGirlName, tagString] = filename.split("--")
  let girlName = snakeCaseGirlName
    .split("_")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ")
  let tagList = tagString.split(",")
  return { assetRelativePath: `../../${imagePath}`, girlName, tagList }
}

function main() {
  generateGirlAssetLoader()
}

main()
