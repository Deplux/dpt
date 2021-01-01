import fs from 'fs-extra'
import path from 'path'
import { ProjectValidateResult, ProjectProcessFiles } from '../ProjectInfo'

const validateFunc = (folderPath: string) => {
  const resultObj: ProjectValidateResult = {
    result: false,
    additionalInfo: null
  }

  // NOTE: check package.json
  if (!fs.existsSync(path.join(folderPath, 'package.json'))) return resultObj

  // NOTE: yarn
  const isYarn = fs.existsSync(path.join(folderPath, 'yarn.lock'))

  resultObj.result = true
  resultObj.additionalInfo = { package: isYarn ? 'yarn' : 'npm' }
  return resultObj
}

const processFunc = (folderPath: string, files: ProjectProcessFiles) => {
  // TODO: Split npm and yarn procesing

  return files
}

const willExportObj = {
  name: 'Node',
  validateFunc,
  processFunc
}

export default willExportObj
