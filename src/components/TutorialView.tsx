import React from 'react';
import { BookOpen, CheckCircle, Upload, Settings2, Grid3X3, Download, Brush, Layers } from 'lucide-react';

export function TutorialView() {
  return (
    <div className="flex-1 overflow-auto bg-neutral-50 p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">How to Use Monogram Art Generator</h2>
          <p className="text-neutral-500 text-lg">A quick guide to creating beautiful typographic art books for Amazon KDP.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">1. Projects & Dashboard</h3>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Start by creating a new book project from the Dashboard. Each project contains its own set of images and configurations. Your projects are automatically saved and synced to your account so you can work across devices.
            </p>
          </section>

          <hr className="border-neutral-100" />

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Upload size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">2. Adding Images</h3>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-4">
              In the Editor view, click the "+" button in the filmstrip (bottom) or drag and drop images onto the canvas. You can upload multiple images at once. These will form the pages of your coloring/activity book.
            </p>
          </section>

          <hr className="border-neutral-100" />

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Settings2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">3. Adjusting Settings</h3>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Use the sidebar to adjust how your image is processed:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex gap-3">
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-600 text-sm"><strong className="text-neutral-900">Grid & Sizing:</strong> Change the resolution (Grid Cols) and cell size.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-600 text-sm"><strong className="text-neutral-900">Style:</strong> Choose between "Shapes" (patterns), "Pixels", or purely aesthetic views.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-600 text-sm"><strong className="text-neutral-900">Image Adjustments:</strong> Tweak brightness, contrast, and gamma to get perfect contours.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-neutral-600 text-sm"><strong className="text-neutral-900">Density Codes:</strong> Customize the characters used for different brightness levels.</span>
              </li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Brush size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">4. Manual Painting (Override)</h3>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Switch the tool at the bottom to "Brush" to manually override cells. You can select different shapes or empty cells to clean up artifacts or enhance details manually. Use the Eraser to clear your overrides.
            </p>
          </section>

          <hr className="border-neutral-100" />

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Layers size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">5. BookFlow Pages</h3>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Navigate to "BookFlow" to configure additional pages for your KDP manuscript:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>• <strong>Cover Book:</strong> An internal title page for your book.</li>
              <li>• <strong>Copyright Page:</strong> Legal disclaimer and copyright information.</li>
              <li>• <strong>Welcome / Warm-up / Mystery:</strong> Instructional pages for your readers.</li>
              <li>• <strong>Thank You:</strong> Call-to-action for reviews at the end of the book.</li>
            </ul>
          </section>

          <hr className="border-neutral-100" />

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Download size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">6. Exporting PDF</h3>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Once you're satisfied with your images and BookFlow pages, click "Export PDF" from the top right corner. The generator will compile a high-quality PDF containing:
            </p>
            <ul className="space-y-2 text-sm text-neutral-600 list-disc pl-5">
              <li>All configured BookFlow introductory pages.</li>
              <li>Your monogram art puzzles (each on a right-hand page, blank on the back to prevent bleed-through).</li>
              <li>The solutions section at the back of the book (scaled down).</li>
              <li>The concluding pages.</li>
            </ul>
            <p className="text-neutral-600 leading-relaxed mt-4">
              The resulting PDF is ready to be uploaded directly to Amazon KDP!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
