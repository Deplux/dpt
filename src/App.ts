import yargs from 'yargs'
import { Init } from './Command/Init'
import { Zip } from './Command/Zip'

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

if (Args.init) {
  console.log("Initializing this project for Deplux...")
  Init(CurrentPath)
} else if (Args.zip) {
  console.log("Zipping this project for Deploying at Deplux, Wait a moment..")
  Zip(CurrentPath)
} else {
  console.error(`Error: Cannot determine action. Run 'dpt --help' to show help message.`)
}
