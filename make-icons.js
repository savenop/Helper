import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height) {
  // Create a minimal black PNG with a white timetable grid icon in the center
  const buffer = Buffer.alloc(width * height * 4);

  // Background: Solid Black (#000000)
  for (let i = 0; i < width * height; i++) {
    buffer[i * 4] = 0;     // R
    buffer[i * 4 + 1] = 0; // G
    buffer[i * 4 + 2] = 0; // B
    buffer[i * 4 + 3] = 255; // A
  }

  // Draw white rounded border & grid lines
  const margin = Math.floor(width * 0.15);
  const stroke = Math.max(2, Math.floor(width * 0.03));
  const innerW = width - margin * 2;
  const innerH = height - margin * 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isOuterBorder = 
        (x >= margin && x < margin + innerW && y >= margin && y < margin + stroke) ||
        (x >= margin && x < margin + innerW && y >= margin + innerH - stroke && y < margin + innerH) ||
        (x >= margin && x < margin + stroke && y >= margin && y < margin + innerH) ||
        (x >= margin + innerW - stroke && x < margin + innerW && y >= margin && y < margin + innerH);

      const isHeaderLine = (y >= margin + Math.floor(innerH * 0.3) && y < margin + Math.floor(innerH * 0.3) + stroke && x >= margin && x < margin + innerW);
      const isColLine = (x >= margin + Math.floor(innerW * 0.35) && x < margin + Math.floor(innerW * 0.35) + stroke && y >= margin && y < margin + innerH);

      if (isOuterBorder || isHeaderLine || isColLine) {
        const idx = (y * width + x) * 4;
        buffer[idx] = 255;
        buffer[idx + 1] = 255;
        buffer[idx + 2] = 255;
        buffer[idx + 3] = 255;
      }
    }
  }

  // Encode as PNG
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // Filter type 0 (None)
    buffer.copy(rawData, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(rawData);

  // Calculate CRC32
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
      }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync('./public/icon-192.png', createPNG(192, 192));
fs.writeFileSync('./public/icon-512.png', createPNG(512, 512));
console.log('PNG icons created successfully!');
