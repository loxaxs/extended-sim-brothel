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
    directoryArray.map((directory) => walkPath(directory, callback, callbackPromiseList)),
  )
}

function rename(from: string, to: string): Promise<void> {
  return fsp.rename(from, to)
}

function main() {
  let command = process.argv[2]
  if (!["show", "hide"].includes(command)) {
    console.log(process.argv)
    console.log("This script must be called with a command argument of 'show' or 'hide'")
  }
  walkPath(__dirname + "/../esbpic", async ({ file, fullPath }) => {
    let destination = ""
    if (command === "show") {
      let m = file.match(/^(.*)\.([^.]+)\.pic$/)
      if (!m) {
        return
      }
      destination = `${m[1]}.pic.${m[2]}`
    } else if (command === "hide") {
      let m = file.match(/^(.*)\.pic\.([^.]+)$/)
      if (!m) {
        return
      }
      destination = `${m[1]}.${m[2]}.pic`
    }
    let fullDestinationPath = fullPath.replace(file, destination)
    await rename(fullPath, fullDestinationPath)
  })
}

main()
