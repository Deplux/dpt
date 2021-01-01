import fs from 'fs-extra'
import path from 'path'
import { ProjectValidateResult, ProjectProcessFiles } from '../ProjectInfo'

const validateFunc = (folderPath: string) => {
  const resultObj: ProjectValidateResult = {
    result: false,
    additionalInfo: null
  }

  // NOTE: check requirements.txt
  if (!fs.existsSync(path.join(folderPath, 'requirements.txt'))) return resultObj

  resultObj.result = true
  return resultObj
}

const processFunc = (folderPath: string, files: ProjectProcessFiles) => {
  
}

const willExportObj = {
  name: 'Node',
  validateFunc,
  processFunc
}

export default willExportObj
