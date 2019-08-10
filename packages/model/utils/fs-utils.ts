import * as path from 'path'
import * as fs from 'fs'

export function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

export const writeFileSync = (filePath: string, content: any) => {
  ensureDirectoryExistence(filePath)
  fs.writeFileSync(filePath, content)
}
