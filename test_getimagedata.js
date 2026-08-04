const offscreen = document.createElement('canvas');
const oCtx = offscreen.getContext('2d');
try {
  oCtx.getImageData(0, 0, 10, NaN);
} catch (e) {
  console.log(e.message);
}
