import yaml from 'yaml'
import { readFileSync, writeFileSync } from 'fs'

const pkg = readFileSync('package.json', 'utf-8')
let changelog = readFileSync('changelog.md', 'utf-8')
const { version } = JSON.parse(pkg)
const downloadUrl = `https://github.com/chunkburst/sparkle/releases/download/${version}`
const latest = {
  version,
  changelog
}

if (process.env.SKIP_CHANGELOG !== '1') {
  changelog += '\n### 下载地址：\n\n#### Windows10/11：\n\n'
  changelog += `- 便携版：[64位](${downloadUrl}/xuanlian-vpn-windows-${version}-x64-portable.7z)\n\n`
}
writeFileSync('latest.yml', yaml.stringify(latest))
writeFileSync('changelog.md', changelog)
