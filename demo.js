/**
 * Given an image, shrinks it, converts to PXON, then writes it to a file.
 * Usage: `node demo.js hello.png`
 */

const sharp = require('sharp')
const fs = require('fs')

const filePath = process.argv[2]

if (!filePath) {
  throw new Error('Please supply a file path.')
}


sharp(filePath)
  .resize({ width: 20, fit: 'inside' })
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(result => {
    const { width, height } = result.info
    const length = width * height
    const { data } = result
    const pixels = []
    for (i = 0; i < length; i++) {
      const r = data[i * 4] || 0
      const g = data[i * 4 + 1] || 0
      const b = data[i * 4 + 2] || 0
      const a = data[i * 4 + 3] || 0
      const y = parseInt(i / width)
      const x = i - y * width
      const pixel = { x, y, color: { r, g, b, a } }
      pixels.push(pixel)
    }
    const pxon = {
      exif: {
        "software": "",
        "artist": "",
        "imageDescription": "",
        "userComment": "",
        "copyright": "",
        "dateTime": "",
      },
      pxif: { pixels },
    }
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(pxon))
  })
