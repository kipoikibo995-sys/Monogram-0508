const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const gammaReplace = `<Slider label="Midtones (Gamma)" value={gamma} min={0.1} max={3.0} step={0.1} onChange={setGamma} />`;
const gammaTooltip = `<Slider label="Midtones (Gamma)" value={gamma} min={0.1} max={3.0} step={0.1} onChange={setGamma} tooltip="Adjust the midtones of the image. Lower values make midtones darker, higher values make them lighter." />
                    <Toggle label="Dithering" checked={useDithering} onChange={setUseDithering} tooltip="Applies Floyd-Steinberg dithering for smoother gradients and details." />`;

code = code.replace(gammaReplace, gammaTooltip);

const gridDensityReplace = `<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Grid Density</span>`;
const layoutSection = `<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Page Layout</span>
                    </div>
                    <div className="flex flex-col gap-1.5 pb-2">
                      <Slider label="Gutter Margin" value={gutterMargin || 0} min={0} max={200} step={5} onChange={setGutterMargin} tooltip="Extra margin on the inner edge of the page (gutter) for book binding." />
                    </div>
                    <div className="h-px bg-neutral-200/60 mb-2" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Grid Density</span>`;

code = code.replace(gridDensityReplace, layoutSection);

fs.writeFileSync('src/App.tsx', code);
