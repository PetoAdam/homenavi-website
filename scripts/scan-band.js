// Decode a PNG and report pixels matching a target RGB inside a row band.
import zlib from "node:zlib";
import fs from "node:fs";

const file = process.argv[2];
const y0 = Number(process.argv[3]);
const y1 = Number(process.argv[4]);
const target = process.argv[5] ? process.argv[5].split(",").map(Number) : [87, 195, 148];
const tol = Number(process.argv[6] || 25);

const b = fs.readFileSync(file);
let p = 8;
let raw = Buffer.alloc(0);
let W = 0, H = 0, colorType = 0;

while (p < b.length) {
  const ln = b.readUInt32BE(p);
  const typ = b.toString("ascii", p + 4, p + 8);
  const data = b.slice(p + 8, p + 8 + ln);
  if (typ === "IHDR") { W = data.readUInt32BE(0); H = data.readUInt32BE(4); colorType = data[9]; }
  if (typ === "IDAT") raw = Buffer.concat([raw, data]);
  p += 12 + ln;
}

const z = zlib.inflateSync(raw);
const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
const stride = W * bpp;
const out = Buffer.alloc(H * stride);
let prev = Buffer.alloc(stride);

for (let y = 0; y < H; y++) {
  const base = y * (stride + 1);
  const f = z[base];
  const row = z.slice(base + 1, base + 1 + stride);
  for (let x = 0; x < stride; x++) {
    const a = x >= bpp ? out[y * stride + x - bpp] : 0;
    const bb = prev[x];
    const c = x >= bpp ? prev[x - bpp] : 0;
    let v;
    if (f === 0) v = row[x];
    else if (f === 1) v = (row[x] + a) & 255;
    else if (f === 2) v = (row[x] + bb) & 255;
    else if (f === 3) v = (row[x] + ((a + c) >> 1)) & 255;
    else {
      const pa = Math.abs(bb - a), pb = Math.abs(bb - c), pc = Math.abs(a - c);
      v = (pa <= pb && pa <= pc) ? (row[x] + a) & 255 : (pb <= pc) ? (row[x] + bb) & 255 : (row[x] + c) & 255;
    }
    out[y * stride + x] = v;
  }
  prev = out.slice(y * stride, (y + 1) * stride);
}

let hit = 0, firstX = null, lastX = null, firstRow = null, lastRow = null;
for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) {
  for (let x = 0; x < W; x++) {
    const o = y * stride + x * bpp;
    const r = out[o], g = out[o + 1], bl = out[o + 2];
    if (Math.abs(r - target[0]) <= tol && Math.abs(g - target[1]) <= tol && Math.abs(bl - target[2]) <= tol) {
      hit++;
      if (firstX === null) firstX = x;
      lastX = x;
      if (firstRow === null) firstRow = y;
      lastRow = y;
    }
  }
}

console.log(`${file} ${W}x${H} rows ${y0}-${y1}: ${hit} pixels matching ${target.join(",")} (tol ${tol}) x=${firstX}..${lastX} rows=${firstRow}..${lastRow}`);
