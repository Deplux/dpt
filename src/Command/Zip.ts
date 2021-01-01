import archiver from 'archiver'
import fs from 'fs-extra'
import path from 'path'

export function Zip(CurrentPath:string){
  const Filename = path.join(CurrentPath, `deplux_${Date.now()}.zip`)
  const Filename_Tmp = path.join(CurrentPath, "../", `deplux_${Date.now()}.zip`)
  fs.createFileSync(Filename_Tmp)

  const TargetFile = fs.createWriteStream(Filename_Tmp)
  const Archive = archiver("zip", {
    zlib:{level:9}
  })

  TargetFile.on("close", () => {
    fs.moveSync(Filename_Tmp, Filename)
    console.log(`Zip file has created at "${Filename}", Enjoy!`)
  })

  TargetFile.on("end", () => {

  })
  
  Archive.pipe(TargetFile)

  Archive.directory(CurrentPath, false)
  Archive.finalize()
}