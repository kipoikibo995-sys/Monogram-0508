const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const currentStats: Record<number, number> = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };

    // Second pass: Dithering and Drawing
    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        const idx = y * gridCols + x;
        let oldPixel = grays[idx];
        
        let shapeInfo = getShapeForGrayscale(oldPixel);
        let newPixel = getLevelValueForShapeIndex(shapeInfo.index);

        // Floyd-Steinberg Dithering error diffusion
        let quantError = oldPixel - newPixel;

        const overrideShapeIndex = settings.overrides?.[x + ',' + y];
        if (overrideShapeIndex !== undefined) {
          shapeInfo = overrideShapeIndex === 0 ? { name: 'Empty', code: '', index: 0 } : SHAPES.find(s => s.index === overrideShapeIndex) || SHAPES[0];
          newPixel = getLevelValueForShapeIndex(shapeInfo.index);
          quantError = 0;
        }

        if (useDithering) {
            if (x + 1 < gridCols) grays[idx + 1] += quantError * 7 / 16;
            if (y + 1 < gridRows) {
                if (x - 1 >= 0) grays[idx + gridCols - 1] += quantError * 3 / 16;
                grays[idx + gridCols] += quantError * 5 / 16;
                if (x + 1 < gridCols) grays[idx + gridCols + 1] += quantError * 1 / 16;
            }
        }

        currentStats[shapeInfo.index] = (currentStats[shapeInfo.index] || 0) + 1;
        drawCell(
          ctx, 
          x * actualCellSize, y * actualCellSize, actualCellSize, 
          newPixel, x, y, 
          inkColor, actualThickness, currentViewMode, renderStyle, settings.densityCodes, undefined, settings.pixelShape
        );
      }
    }`;

const replacement = `    const currentStats: Record<number, number> = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
    const finalGrays = new Float32Array(gridCols * gridRows);

    // Second pass: Dithering
    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        const idx = y * gridCols + x;
        let oldPixel = grays[idx];
        
        let shapeInfo = getShapeForGrayscale(oldPixel);
        let newPixel = getLevelValueForShapeIndex(shapeInfo.index);

        // Floyd-Steinberg Dithering error diffusion
        let quantError = oldPixel - newPixel;

        const overrideShapeIndex = settings.overrides?.[x + ',' + y];
        if (overrideShapeIndex !== undefined) {
          shapeInfo = overrideShapeIndex === 0 ? { name: 'Empty', code: '', index: 0 } : SHAPES.find(s => s.index === overrideShapeIndex) || SHAPES[0];
          newPixel = getLevelValueForShapeIndex(shapeInfo.index);
          quantError = 0;
        }

        finalGrays[idx] = newPixel;
        currentStats[shapeInfo.index] = (currentStats[shapeInfo.index] || 0) + 1;

        if (useDithering) {
            if (x + 1 < gridCols) grays[idx + 1] += quantError * 7 / 16;
            if (y + 1 < gridRows) {
                if (x - 1 >= 0) grays[idx + gridCols - 1] += quantError * 3 / 16;
                grays[idx + gridCols] += quantError * 5 / 16;
                if (x + 1 < gridCols) grays[idx + gridCols + 1] += quantError * 1 / 16;
            }
        }
      }
    }

    // Drawing passes to prevent overlapping borders and texts
    const passes: Array<'fill' | 'stroke' | 'text'> = currentViewMode === 'solution' 
      ? ['fill'] 
      : ['stroke', 'text'];

    for (const pass of passes) {
      for (let y = 0; y < gridRows; y++) {
        for (let x = 0; x < gridCols; x++) {
          const idx = y * gridCols + x;
          const grayscale = finalGrays[idx];
          if (grayscale === undefined) continue;

          drawCell(
            ctx, 
            x * actualCellSize, y * actualCellSize, actualCellSize, 
            grayscale, x, y, 
            inkColor, actualThickness, currentViewMode, renderStyle, settings.densityCodes, undefined, settings.pixelShape, pass
          );
        }
      }
    }`;

const regex = new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));
if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Patched');
} else {
  console.log('Regex not found');
}
