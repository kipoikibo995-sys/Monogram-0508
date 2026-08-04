import { createCanvas, Image } from 'canvas';
const offscreen = createCanvas(100, 100);
const oCtx = offscreen.getContext('2d');
try {
  oCtx.getImageData(0, 0, 10, NaN);
} catch (e) {
  console.log("NaN test:", e.message);
}
try {
  oCtx.getImageData(0, 0, 0, 10);
} catch (e) {
  console.log("Zero width test:", e.message);
}
try {
  oCtx.getImageData(0, 0, 10.5, 10.5);
  console.log("Float ok");
} catch (e) {
  console.log("Float test:", e.message);
}
