#!/usr/bin/env pwsh
$ErrorActionPreference = 'Stop'
$install_path = "$Home\.dpt\bin"
$install_uri = 'https://raw.github.com/Deplux/dpt/migrate-go/build/windows_amd64.exe'

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

if (!(Test-Path $BinDir)) {
  New-Item $install_path -ItemType Directory | Out-Null
}

Invoke-WebRequest $install_uri -OutFile "$install_path\dpt.exe" -UseBasicParsing

$User = [EnvironmentVariableTarget]::User
$Path = [Environment]::GetEnvironmentVariable('Path', $User)

[Environment]::SetEnvironmentVariable('Path', "$Path;$install_path", $User)
$Env:Path += ";$install_path"

Write-Output "Deplux tools가 성공적으로 설치되었습니다"
Write-Output "'dpt'를 입력해 사용해 보세요"
