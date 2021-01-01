export interface ProjectInfo {
  name: string,
  validateFunc: ProjectValidateFunction,
  processFunc: ProjectProcessFunction
}

interface ProjectValidateFunction {
  (folderPath: string): ProjectValidateResult
}

interface ProjectProcessFunction {
  (folderPath: string, files: ProjectProcessFiles): ProjectProcessFiles
}

export interface ProjectValidateResult {
  result: boolean,
  additionalInfo: any
}

export interface ProjectProcessFiles {
  templateFile: string,
  ignoreFile: string
}
