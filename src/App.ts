import yargs from 'yargs'
import { Init } from './Command/Init'

// 옵션 받기
export const Args = yargs
  .option('zip', {
    alias: 'z',
    description: '명령어를 실행한 루트 디렉터리를 Deplux용 호스팅 파일로 압축합니다',
    type: 'boolean'
  })
  .option('init', {
    alias: 'i',
    description: '배포를 위한 Dockerfile을 생성합니다',
    type: 'boolean'
  })
  .argv

//현 폴더 구하기
const CurrentPath = process.cwd()

if(Args.init){
  console.log("Initializing this project for Deplux, Wait a moment..")
  Init(CurrentPath)
  console.log("Dockerfile has created")
}

if(Args.zip){
  //console.log("Zipping this project to Deploy at Deplux, Wait a moment..")
  console.log("This Function doesn't support yet.")
}