// Extract internationalized messages into a `.pot` file
import fs from "fs"
import { extractMessagesFromGlob } from "react-gettext-parser"

let messages = extractMessagesFromGlob(["src/**/*.ts{,x}"], {
  funcArgumentsMap: {
    t: ["msgid"],
    nt: ["msgid", "msgid_plural"],
    pt: ["msgctxt", "msgid"],
    pnt: ["msgctxt", "msgid", "msgid_plural"],
  },
})

interface Unit {
  reference: string[]
  msgstr: string
}

function mergeAndFormat(messages: any, existing: Record<string, Unit>): Record<string, Unit> {
  let content = {}
  messages.forEach(({ msgid, msgstr, comments }) => {
    content[msgid] = {
      reference: comments.reference.map(
        ({ filename, line, column }) => `${filename.replace(/\\/g, "/")}:${line}:${column + 1}`,
      ),
      msgstr: msgstr[0] || existing[msgid]?.msgstr || "",
    }
  })
  return content
}

let path = "locale/fr.json"
let existingText = "{}"
try {
  existingText = fs.readFileSync(path, "utf-8")
} catch {}
let content = mergeAndFormat(messages, JSON.parse(existingText))
fs.writeFileSync(path, JSON.stringify(content, null, 2), "utf-8")
