#!/bin/sh
if [ "$(id -un)" != "root" ]; then
  echo "Deplux tools를 설치하려면 \"root\" 권한이 필요합니다. (sudo를 사용해 주세요)"
  exit 1
fi

if command -v dpt > /dev/null; then
  rm "$(which dpt)"
fi

case $(uname -sm) in
  "Darwin x86_64") target="darwin_amd64" ;;
  "Linux x86_64") target="linux_amd64" ;;
esac

install_uri="https://raw.github.com/Deplux/dpt/migrate-go/build/${target}"
install_path="/usr/local/bin/dpt"

curl --progress-bar --output "${install_path}" "${install_uri}"
chmod a+x "${install_path}"

echo "Deplux tools가 성공적으로 설치되었습니다"
echo "'dpt'를 입력해 서용해 보세요"
