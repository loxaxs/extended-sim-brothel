/**
 * This script finds `.girl.yaml` files in the `esbpic` folder and resolves the image URL corresponding to each page url found in the girl file.
 */

import { default as fs } from "fs"
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

function getFetcher({ waitDurationMs }: { waitDurationMs: number }) {
  let lastPromise = Promise.resolve(null as unknown as Response)
  let queue: [(value: Response) => void, string][] = []
  async function addUrl(url: string): Promise<Response> {
    let resolver: (value: Response) => void
    let promise = new Promise<Response>((resolve) => (resolver = resolve))
    queue.push([resolver!, url])
    run()
    return promise
  }
  let running = false
  async function run() {
    if (running) {
      return
    }
    running = true
    while (queue.length) {
      let [resolver, url] = queue.shift()!
      console.log("Fetching", Date.now(), url)
      await new Promise((resolve) => setTimeout(resolve, waitDurationMs))
      let response = await fetch(url)
      resolver(response)
    }
    running = false
  }
  return { addUrl }
}

function main() {
  let fetcher = getFetcher({ waitDurationMs: 0 })

  walkPath(__dirname + "/../esbpic", async ({ file, fullPath }) => {
    let fileNameParts = file.split(".")
    let [extA, extB] = fileNameParts.slice(-2)
    if (extA === "girl" && ["yaml", "yml"].includes(extB)) {
      let girlName = fileNameParts.slice(0, -2).join(".")
      let destinationPath = fullPath.slice(0, -file.length) + girlName + ".girl.pictureUrl.json"
      console.log("Processing", fullPath)
      let content = await fsp.readFile(fullPath, "utf-8")
      let existingImageFileNameSet: Record<string, true> = {}
      let existingResultContent: Record<string, { media: string; tags: string }>
      try {
        existingResultContent = JSON.parse(await fsp.readFile(destinationPath, "utf-8"))
        console.log(
          "Found",
          Object.keys(existingResultContent).length,
          "existing entries in",
          destinationPath,
        )
      } catch {
        existingResultContent = {}
      }
      let directory = fullPath.slice(0, -file.length) + girlName

      if (process.argv.includes("--download")) {
        await fsp.mkdir(directory, { recursive: true })
      }

      let directoryContent: string[] = []
      try {
        directoryContent = await fsp.readdir(directory)
      } catch {}
      directoryContent.filter((name) => {
        let m = name.match(/^([^-]*--[^-]*)(--([^.]*))?\.picture\.pic\.([^.]+)$/)
        if (!m) {
          return null
        }
        existingImageFileNameSet[m[1]] = true
      })

      let skipDownloadCount = 0
      let namePool: Record<string, true> = {}
      let entryListPromise = Promise.all(
        content
          .split("\n")
          .filter((x) => x)
          .map(async (line): Promise<[string, { media: string; tags: string }] | null> => {
            let artist = ""
            let media = ""
            let [_dash, pageUrl, ...tagList] = line.split(" ")
            let [pageUrlLeft, pageUrlResolved] = pageUrl.split("::")
            if (pageUrlResolved) {
              pageUrl = pageUrlLeft
              media = pageUrlResolved
            } else {
              if (existingImageFileNameSet[`${girlName}--${tagList.join(",")}`]) {
                skipDownloadCount++
                return null
              }
              let existing = existingResultContent[pageUrl]
              if (existing) {
                existing.tags = tagList.join(" ")
                if (!process.argv.includes("--download")) {
                  return [pageUrl, existing]
                }
              }
              let response = await fetcher.addUrl(pageUrl + ".json")
              let textdata = ""
              try {
                textdata = await response.text()
              } catch (e) {
                console.error(`Failed to get text data for page "${pageUrl}" (${e})`)
                process.exit(1)
              }
              let data: any
              try {
                data = JSON.parse(textdata)
              } catch (e) {
                console.log(
                  `ERROR: Failed to parse data as json for page "${pageUrl}" (${e}):`,
                  textdata,
                )
                process.exit(1)
              }
              artist = data.tag_string_artist?.replace(/ /g, ",") ?? ""
              if (artist) {
                artist = `--${artist}`
              }
              if (!data.media_asset?.variants) {
                console.error(`Failed to get image variants for page "${pageUrl}", data:`, data)
                process.exit(1)
              }
              data.media_asset.variants.forEach((variant: any) => {
                if (variant.type === "720x720") {
                  media = variant.url
                }
              })
              if (!media) {
                console.error(`Failed to get image url for page "${pageUrl}"`)
                process.exit(1)
              }
            }
            if (process.argv.includes("--download")) {
              let extension = media.split(".").slice(-1)[0]
              let suffix = ""
              let mediaPath = () =>
                `${directory}/${girlName}--${tagList.join(",")}${artist}${suffix}.picture.pic.${extension}`

              let infiniteLoop = 0
              while ((await fsp.stat(mediaPath()).catch(() => false)) || namePool[mediaPath()]) {
                suffix = `--${Number(suffix.slice(2) || 0) + 1}`
                if (infiniteLoop++ > 100) {
                  console.error("Infinite loop detected")
                  process.exit(255)
                }
              }
              namePool[mediaPath()] = true

              let response = await fetch(media)
              let blob = await response.blob()
              let arrayBuffer = await blob.arrayBuffer()
              await fsp.writeFile(mediaPath(), Buffer.from(arrayBuffer) as any)
              console.log("Downloaded", media, "to", mediaPath())
              return null
            }
            return [pageUrl, { media, tags: tagList.join(" ") }]
          }),
      )
      let entryList = await entryListPromise
      let filteredEntryList: [string, { media: string; tags: string }][] = entryList.filter(
        (x) => x,
      ) as any
      if (filteredEntryList.length === 0) {
        if (fs.existsSync(destinationPath)) {
          fsp.unlink(destinationPath)
          console.log("Deleted now empty", destinationPath)
        } else {
          console.log("Skipped creating empty file", destinationPath)
        }
      } else {
        let dataContent = Object.fromEntries(filteredEntryList)

        fsp.writeFile(destinationPath, JSON.stringify(dataContent, null, 2), "utf-8")
        console.log("Wrote", filteredEntryList.length, "entries to", destinationPath)
      }
      console.log(
        "Found",
        Object.keys(existingImageFileNameSet).length,
        "existing images, skipping the download of",
        skipDownloadCount,
        "images.",
      )
    }
  })
}

main()
