import path from 'path'
import fs from 'fs-extra'

export function Init(CurrentPath:string){
  const IdentFilter:Array<string> = [
    "package.json",
    "Requirements.txt"
  ]

  const LanguageIdentifier = fs.readdirSync(CurrentPath).find(File => IdentFilter.includes(File)) //첫번째로 일치하는 언어
  switch(LanguageIdentifier){
    case "package.json" : //Node
      CopyTemplate("Node", CurrentPath)
      break
    case "Requirements.txt" : //Python
    
      break
  }

}

function CopyTemplate(TemplateName:string, Target:string){
  const TemplatePath = path.join(__dirname, "./../../Template/", TemplateName)
  const ProcessedDockerfile = fs.readFileSync(path.join(TemplatePath, "Template"), {encoding:"utf-8"})
  
  fs.copyFileSync(path.join(TemplatePath, "Ignore"), path.join(Target, ".dockerignore"))
  fs.createFileSync(path.join(Target, "Dockerfile"))
  fs.writeFileSync(path.join(Target, "Dockerfile"), ProcessedDockerfile, {encoding: "utf-8"})
}