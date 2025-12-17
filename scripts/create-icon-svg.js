const fs = require('fs')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const publicDir = path.join(repoRoot, 'public')
const logoPath = path.join(publicDir, 'compssa-logo.png')
const outPath = path.join(publicDir, 'icon.svg')

if (!fs.existsSync(logoPath)) {
  console.error('Source PNG not found:', logoPath)
  process.exit(1)
}

const png = fs.readFileSync(logoPath)
const logoB64 = png.toString('base64')

const svg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="50" fill="#ffffff"/>
  <image href="data:image/png;base64,${logoB64}" x="0" y="0" width="256" height="256" preserveAspectRatio="xMidYMid slice"/>
</svg>`

fs.writeFileSync(outPath, svg, 'utf8')
console.log('Created icon.svg at', outPath)
