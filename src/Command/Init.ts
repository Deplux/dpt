import path from 'path'
import fs from 'fs-extra'

import ProjectTypes from '../ProjectTypes/index'

export function Init (CurrentPath: string) {
  for (const projectName in ProjectTypes) {
    const project = ProjectTypes[projectName]
    if (project.validateFunc(CurrentPath)) {
      console.log(`${project.name} project detected. Processing...`)
      CopyTemplate(project.name, CurrentPath)
      return
    }
  }

  // NOTE: no match
  console.error(`Error: Cannot determine the project type. Either you didn't setup the project correctly, or this type of project is not supported.`)
}

function CopyTemplate (TemplateName: string, Target: string) {
  const TemplatePath = path.join(__dirname, "../../Template", TemplateName)
  const DockerfileToProcess = fs.readFileSync(path.join(TemplatePath, "Template"), { encoding:"utf-8" })
  const DockerIgnoreToProcess = fs.readFileSync(path.join(TemplatePath, 'Ignore'), { encoding: 'utf-8' })

  const ProcessedFiles = ProjectTypes[TemplateName].processFunc(Target, {
    templateFile: DockerfileToProcess,
    ignoreFile: DockerIgnoreToProcess
  })
  
  fs.createFileSync(path.join(Target, "Dockerfile"))
  fs.writeFileSync(path.join(Target, "Dockerfile"), ProcessedFiles.templateFile, { encoding: "utf-8" })

  fs.createFileSync(path.join(Target, ".dockerignore"))
  fs.writeFileSync(path.join(Target, ".dockerignore"), ProcessedFiles.ignoreFile, { encoding: 'utf-8' })

  console.log("Created Dockerfile.")
}
