const fs = require('fs')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const publicDir = path.join(repoRoot, 'public')
const candidates = [
  'addresslogo.png',
  'icon-light-32x32.png',
  'icon-dark-32x32.png',
  'apple-icon.png',
]

const files = candidates
  .map((n) => ({ name: n, path: path.join(publicDir, n) }))
  .filter((f) => fs.existsSync(f.path))

if (files.length === 0) {
  console.error('No source PNGs found in public/. Expected one of:', candidates.join(', '))
  process.exit(1)
}

const images = files.map((f) => {
  const buf = fs.readFileSync(f.path)
  let width = 0
  let height = 0
  try {
    if (buf.length >= 24 && buf.toString('ascii', 12, 16) === 'IHDR') {
      width = buf.readUInt32BE(16)
      height = buf.readUInt32BE(20)
    }
  } catch (e) {
    // ignore
  }
  return { name: f.name, buf, width, height }
})

const outPath = path.join(publicDir, 'favicon.ico')

// ICONDIR header (6 bytes)
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type = 1 (icon)
header.writeUInt16LE(images.length, 4) // count

const entries = []
let offset = 6 + images.length * 16
for (const img of images) {
  const widthByte = img.width >= 256 || img.width === 0 ? 0 : img.width
  const heightByte = img.height >= 256 || img.height === 0 ? 0 : img.height
  const entry = Buffer.alloc(16)
  entry.writeUInt8(widthByte, 0)
  entry.writeUInt8(heightByte, 1)
  entry.writeUInt8(0, 2) // color count
  entry.writeUInt8(0, 3) // reserved
  entry.writeUInt16LE(1, 4) // color planes
  entry.writeUInt16LE(32, 6) // bit count
  entry.writeUInt32LE(img.buf.length, 8) // bytes in resource
  entry.writeUInt32LE(offset, 12) // offset
  entries.push(entry)
  offset += img.buf.length
}

const out = Buffer.concat([header, ...entries, ...images.map((i) => i.buf)])
fs.writeFileSync(outPath, out)
console.log('Wrote', outPath, 'with images:', images.map((i) => `${i.name} (${i.width}x${i.height})`).join(', '))
