/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookFlow, CoverPage, CopyrightPage, WelcomePage, MysteryPage, TemplatePage, ThankYouPage } from './BookFlow';
import { pdf } from '@react-pdf/renderer';
import { PdfDocument, processImageForPdf } from './PdfExport';
import { saveProject, listProjects, deleteProject, Project } from './db';
import { BookText, Settings, Shield, Image as ImageIcon, FileText, Brush, Eraser, Undo, Trash2, Upload, Download, Settings2, Sparkles, Grid3X3, LayoutGrid, List, Printer, BookOpen, BarChart2, Wand2, ChevronDown, ChevronLeft, ChevronRight, Layers, ZoomIn, ZoomOut, Maximize, Plus, FolderOpen, LayoutDashboard, Calendar, Clock, HelpCircle, Save, LogOut, LogIn, User, Lock, Crown, ArrowUpCircle } from 'lucide-react';
import { ImageSettings } from './types';
import { AuthPage } from './components/AuthPage';
import { SalesPage } from './components/SalesPage';
import { TutorialView } from './components/TutorialView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';


const defaultSettings: ImageSettings = {
  gridCols: 60,
  cellSize: 12,
  brightness: 0,
  contrast: 0,
  gamma: 1,
  inkColor: '#000000',
  inkThickness: 1,
  showBgGrid: true,
  showCoordinates: true,
  viewMode: 'workbook',
  pageMargin: 0,
  trimSize: "8.5x11",
  gutterMargin: 0,
  renderStyle: 'shapes',
  pixelShape: 'square',
  useDithering: false,
  useSmoothing: true,
  densityCodes: ['.', '1', '2', '3', '4', '5']
};



function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative inline-flex items-center ml-1.5 group cursor-help z-50">
      <HelpCircle size={12} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-max max-w-[200px] bg-neutral-900 text-white text-[10px] px-2 py-1.5 rounded shadow-lg z-50 whitespace-normal leading-relaxed text-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[4px] border-transparent border-t-neutral-900"></div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange, step = 1, tooltip }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void, step?: number, tooltip?: string }) {
  const [localVal, setLocalVal] = useState(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalVal(val);
    
    if (rafRef.current === null) {
      rafRef.current = window.setTimeout(() => {
        onChange(val);
        rafRef.current = null;
      }, 50); // 50ms throttle for silky smooth UI
    }
  };

  const handlePointerUp = () => {
    if (rafRef.current !== null) {
      clearTimeout(rafRef.current);
      rafRef.current = null;
    }
    onChange(localVal);
  };

  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-neutral-700 flex items-center">{label}{tooltip && <InfoTooltip text={tooltip} />}</label>
        <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200/60">{localVal}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={localVal} 
        onChange={handleChange}
        onPointerUp={handlePointerUp}
        onTouchEnd={handlePointerUp}
        className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-800"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, description, tooltip }: { label: string, checked: boolean, onChange: (c: boolean) => void, description?: string, tooltip?: string }) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <label className="flex items-center justify-between cursor-pointer group">
        <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors flex items-center">{label}{tooltip && <InfoTooltip text={tooltip} />}</span>
        <div className="relative flex items-center">
          <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
          <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${checked ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${checked ? 'translate-x-3.5' : 'translate-x-0'}`} />
          </div>
        </div>
      </label>
      {description && <p className="text-[10px] text-neutral-400 leading-snug pr-10">{description}</p>}
    </div>
  );
}

function Accordion({ title, defaultOpen = true, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col py-1">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full group py-2"
      >
        <div className="flex items-center gap-2.5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900 transition-colors">{title}</h2>
        </div>
        <ChevronDown size={14} className={`text-neutral-400 group-hover:text-neutral-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pt-2 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const SHAPES = [
  { index: 1, code: '.', name: 'Dot' },
  { index: 2, code: '1', name: 'Slash' },
  { index: 3, code: '2', name: 'Backslash' },
  { index: 4, code: '3', name: 'Cross' },
  { index: 5, code: '4', name: 'Asterisk' },
  { index: 6, code: '5', name: 'Filled Square' },
];

const getColumnLetter = (colIndex: number) => {
  let letter = '';
  let temp = colIndex;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
};

const getShapeForGrayscale = (g: number) => {
  if (g > 230) return { name: 'Empty', code: '', index: 0 };
  if (g > 190) return { name: 'Dot', code: '.', index: 1 };
  if (g > 150) return { name: 'Slash', code: '1', index: 2 };
  if (g > 110) return { name: 'Backslash', code: '2', index: 3 };
  if (g > 70)  return { name: 'Cross', code: '3', index: 4 };
  if (g > 30)  return { name: 'Asterisk', code: '4', index: 5 };
  return { name: 'Filled Square', code: '5', index: 6 };
};

const getLevelValueForShapeIndex = (index: number) => {
  const levels = [255, 210, 170, 130, 90, 50, 0];
  return levels[index];
};

const LegendIcon = ({ index, color = "currentColor", renderStyle = 'shapes', pixelShape = 'square' }: { index: number, color?: string, renderStyle?: 'shapes'|'pixels', pixelShape?: 'square' | 'circle' | 'triangle' | 'hexagon' | 'diamond' }) => {
  if (renderStyle === 'pixels') {
    const shades = ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
    const fill = shades[index];
    
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {pixelShape === 'square' && <rect x="2" y="2" width="20" height="20" stroke="#e5e5e5" strokeWidth="1" fill={fill} />}
        {pixelShape === 'circle' && <circle cx="12" cy="12" r="10" stroke="#e5e5e5" strokeWidth="1" fill={fill} />}
        {pixelShape === 'triangle' && <polygon points="12,4 22,20 2,20" stroke="#e5e5e5" strokeWidth="1" fill={fill} />}
        {pixelShape === 'diamond' && <polygon points="12,2 22,12 12,22 2,12" stroke="#e5e5e5" strokeWidth="1" fill={fill} />}
        {pixelShape === 'hexagon' && <polygon points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7" stroke="#e5e5e5" strokeWidth="1" fill={fill} />}
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" stroke="#e5e5e5" strokeWidth="1" fill="white" />
      {index === 1 && <circle cx="12" cy="12" r="2.5" fill={color} />}
      {index === 2 && <line x1="6" y1="18" x2="18" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />}
      {index === 3 && <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />}
      {index === 4 && (
        <>
          <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="18" x2="18" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {index === 5 && (
        <>
          <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="18" x2="18" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {index === 6 && <rect x="6" y="6" width="12" height="12" fill={color} />}
    </svg>
  );
};

const drawCell = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  grayscale: number, col: number, row: number,
  color: string, thickness: number,
  viewMode: 'workbook' | 'solution',
  renderStyle: 'shapes' | 'pixels' = 'shapes',
  densityCodes: string[] = ['.', '1', '2', '3', '4', '5'],
  overrideShapeIndex?: number,
  pixelShape: 'square' | 'circle' | 'triangle' | 'hexagon' | 'diamond' = 'square',
  pass: 'all' | 'fill' | 'stroke' | 'text' = 'all'
) => {
  const cx = x + size / 2;
  const cy = y + size / 2;

  let textX = cx;
  let textY = cy + size * 0.05;

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const shape = overrideShapeIndex !== undefined ? (overrideShapeIndex === 0 ? { name: 'Empty', code: '', index: 0 } : SHAPES.find(s => s.index === overrideShapeIndex) || SHAPES[0]) : getShapeForGrayscale(grayscale);
  
  const drawPixelPath = () => {
    if (pixelShape === 'square') {
      ctx.rect(x, y, size, size);
    } else if (pixelShape === 'circle') {
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    } else if (pixelShape === 'triangle') {
      if ((col + row) % 2 === 0) {
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size * 1.5 + 0.5, y + size + 0.5);
        ctx.lineTo(x - size * 0.5 - 0.5, y + size + 0.5);
      } else {
        ctx.moveTo(x - size * 0.5 - 0.5, y);
        ctx.lineTo(x + size * 1.5 + 0.5, y);
        ctx.lineTo(x + size / 2, y + size + 0.5);
      }
    } else if (pixelShape === 'diamond') {
      ctx.moveTo(cx, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(x, cy);
    } else if (pixelShape === 'hexagon') {
      ctx.moveTo(x + size * 0.25, y);
      ctx.lineTo(x + size * 0.75, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(x + size * 0.75, y + size);
      ctx.lineTo(x + size * 0.25, y + size);
      ctx.lineTo(x, cy);
    }
  };

  if (viewMode === 'workbook') {
    if (pass === 'all' || pass === 'stroke') {
      ctx.strokeStyle = '#999999'; 
      ctx.lineWidth = Math.max(1, size * 0.04);
      
      if (renderStyle === 'pixels') {
        ctx.beginPath();
        drawPixelPath();
        if (pixelShape === 'square') {
          ctx.stroke();
        } else {
          ctx.closePath();
          ctx.stroke();
        }
      } else {
        ctx.strokeRect(x, y, size, size);
      }
    }
    
    if (pass === 'all' || pass === 'text') {
      if (shape.index > 0) {
        ctx.fillStyle = '#000000'; 
        ctx.font = `bold ${size * 0.55}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(densityCodes[shape.index - 1] || shape.code, textX, textY);
      }
    }
  } else {
    // solution mode
    if (pass === 'all' || pass === 'fill') {
      if (renderStyle === 'pixels') {
        const shades = ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
        ctx.fillStyle = shades[shape.index];
        ctx.beginPath();
        drawPixelPath();
        if (pixelShape !== 'square' && pixelShape !== 'circle') ctx.closePath();
        ctx.fill();
        return;
      }

      switch (shape.index) {
        case 1: 
          ctx.beginPath(); ctx.arc(cx, cy, Math.max(1, thickness * 1.5), 0, Math.PI * 2); ctx.fill();
          break;
        case 2: 
          ctx.beginPath(); ctx.moveTo(x, y + size); ctx.lineTo(x + size, y); ctx.stroke();
          break;
        case 3: 
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + size, y + size); ctx.stroke();
          break;
        case 4: 
          ctx.beginPath(); 
          ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
          ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
          ctx.stroke();
          break;
        case 5: 
          ctx.beginPath(); 
          ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
          ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
          ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
          ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);
          ctx.stroke();
          break;
        case 6: 
          ctx.fillRect(x, y, size + 0.5, size + 0.5); 
          break;
      }
    }
  }
};


const generateSVG = (img: HTMLImageElement, settings: ImageSettings): string => {
  const { gridCols, cellSize, brightness, contrast, gamma, inkColor, inkThickness, showBgGrid, showCoordinates, viewMode, renderStyle, useDithering, useSmoothing, pageMargin = 0 } = settings;
  const aspectRatio = img.height / img.width;
  const gridRows = Math.floor(gridCols * aspectRatio);
  
  if (!gridCols || !gridRows || isNaN(gridCols) || isNaN(gridRows) || !img.width || !img.height) return '';
  
  const offscreen = document.createElement('canvas');
  offscreen.width = gridCols;
  offscreen.height = gridRows;
  const oCtx = offscreen.getContext('2d');
  if (!oCtx) return '';
  
  oCtx.imageSmoothingEnabled = useSmoothing;
  oCtx.imageSmoothingQuality = 'high';
  oCtx.drawImage(img, 0, 0, gridCols, gridRows);
  
  const data = oCtx.getImageData(0, 0, gridCols, gridRows).data;
  
  const coordOffset = showCoordinates ? cellSize : 0;
  const width = gridCols * cellSize + coordOffset + (pageMargin * 2);
  const height = gridRows * cellSize + coordOffset + (pageMargin * 2);
  
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const grays = new Float32Array(gridCols * gridRows);
  
  for (let i = 0; i < gridCols * gridRows; i++) {
      let r = data[i*4];
      let g = data[i*4+1];
      let b = data[i*4+2];
      let luminance = r * 0.299 + g * 0.587 + b * 0.114;
      if (gamma !== 1.0) luminance = 255 * Math.pow(luminance / 255, 1 / gamma);
      luminance = contrastFactor * (luminance - 128) + 128 + brightness;
      grays[i] = Math.max(0, Math.min(255, luminance));
  }

  const finalGrays = new Float32Array(gridCols * gridRows);

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const idx = y * gridCols + x;
      let oldPixel = grays[idx];
      let shapeInfo = getShapeForGrayscale(oldPixel);
      let newPixel = getLevelValueForShapeIndex(shapeInfo.index);
      let quantError = oldPixel - newPixel;

      const overrideShapeIndex = settings.overrides?.[x + ',' + y];
      if (overrideShapeIndex !== undefined) {
        shapeInfo = overrideShapeIndex === 0 ? { name: 'Empty', code: '', index: 0 } : SHAPES.find(s => s.index === overrideShapeIndex) || SHAPES[0];
        newPixel = getLevelValueForShapeIndex(shapeInfo.index);
        quantError = 0;
      }

      finalGrays[idx] = newPixel;
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

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  let svgGridString = '';
  if (showBgGrid && viewMode === 'solution') {
    svgGridString += `<g stroke="#cccccc" stroke-width="${Math.max(1, cellSize * 0.04)}">`;
    for (let y = 0; y <= gridRows; y++) {
      svgGridString += `<line x1="0" y1="${y * cellSize}" x2="${gridCols * cellSize}" y2="${y * cellSize}" />`;
    }
    for (let x = 0; x <= gridCols; x++) {
      svgGridString += `<line x1="${x * cellSize}" y1="0" x2="${x * cellSize}" y2="${gridRows * cellSize}" />`;
    }
    svgGridString += `</g>`;
  }
  
  if (renderStyle === 'shapes') {
    svg += svgGridString;
  }


  if (showCoordinates) {
    svg += `<g fill="black" font-family="sans-serif" font-weight="bold" font-size="${cellSize * 0.4}px" text-anchor="middle" dominant-baseline="central">`;
    for (let x = 0; x < gridCols; x++) {
      svg += `<text x="${pageMargin + coordOffset + x * cellSize + cellSize / 2}" y="${pageMargin + coordOffset / 2}">${getColumnLetter(x)}</text>`;
    }
    for (let y = 0; y < gridRows; y++) {
      svg += `<text x="${pageMargin + coordOffset / 2}" y="${pageMargin + coordOffset + y * cellSize + cellSize / 2}">${y + 1}</text>`;
    }
    svg += `</g>`;
  }

  svg += `<g transform="translate(${pageMargin + coordOffset}, ${pageMargin + coordOffset})">`;

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const idx = y * gridCols + x;
      const grayscale = finalGrays[idx];
      if (grayscale === undefined) continue;

      const px = x * cellSize;
      const py = y * cellSize;
      const cx = px + cellSize / 2;
      const cy = py + cellSize / 2;
      const shape = getShapeForGrayscale(grayscale);
      let currentShape = shape;

      const overrideShapeIndex = settings.overrides?.[x + ',' + y];
      if (overrideShapeIndex !== undefined) {
        currentShape = overrideShapeIndex === 0 ? { name: 'Empty', code: '', index: 0 } : SHAPES.find(s => s.index === overrideShapeIndex) || SHAPES[0];
      }

      if (viewMode === 'workbook') {
        svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="none" stroke="#999999" stroke-width="${Math.max(1, cellSize * 0.04)}"/>`;
        if (currentShape.index > 0) {
          const code = settings.densityCodes ? settings.densityCodes[currentShape.index - 1] : currentShape.code;
          svg += `<text x="${cx}" y="${cy + cellSize * 0.05}" fill="black" font-family="sans-serif" font-weight="bold" font-size="${cellSize * 0.55}px" text-anchor="middle" dominant-baseline="central">${code || currentShape.code}</text>`;
        }
      } else {
        if (renderStyle === 'pixels') {
          const shades = ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
          svg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${shades[currentShape.index]}" stroke="none"/>`;
        } else {
          switch (currentShape.index) {
            case 1:
              svg += `<circle cx="${cx}" cy="${cy}" r="${Math.max(1, inkThickness * 1.5)}" fill="${inkColor}"/>`;
              break;
            case 2:
              svg += `<line x1="${px}" y1="${py + cellSize}" x2="${px + cellSize}" y2="${py}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              break;
            case 3:
              svg += `<line x1="${px}" y1="${py}" x2="${px + cellSize}" y2="${py + cellSize}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              break;
            case 4:
              svg += `<line x1="${px}" y1="${py}" x2="${px + cellSize}" y2="${py + cellSize}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              svg += `<line x1="${px + cellSize}" y1="${py}" x2="${px}" y2="${py + cellSize}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              break;
            case 5:
              svg += `<line x1="${px}" y1="${py}" x2="${px + cellSize}" y2="${py + cellSize}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              svg += `<line x1="${px + cellSize}" y1="${py}" x2="${px}" y2="${py + cellSize}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              svg += `<line x1="${cx}" y1="${py}" x2="${cx}" y2="${py + cellSize}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              svg += `<line x1="${px}" y1="${cy}" x2="${px + cellSize}" y2="${cy}" stroke="${inkColor}" stroke-width="${inkThickness}" stroke-linecap="round"/>`;
              break;
            case 6:
              svg += `<rect x="${px}" y="${py}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="${inkColor}"/>`;
              break;
          }
        }
      }
    }
  }



  if (renderStyle === 'pixels') {
    svg += svgGridString;
  }
  svg += `</g></svg>`;
  return svg;
};

export default function App() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [view, setView] = useState<'dashboard' | 'editor' | 'bookflow' | 'settings' | 'tutorial' | 'admin'>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'account' | 'kdp' | 'editor'>('account');

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeBookFlowPage, setActiveBookFlowPage] = useState<'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery' | 'thankyou'>('cover');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showSalesPage, setShowSalesPage] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userTierState, setUserTier] = useState<'free' | 'regular' | 'pro'>('free');
  const userTier = userTierState;

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !currentUser.emailVerified) {
        setUser(null);
        setLoadingAuth(false);
        return;
      }
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
             setShowWelcomeModal(true);
             await setDoc(userRef, {
               uid: currentUser.uid,
               email: currentUser.email,
               displayName: currentUser.displayName,
               createdAt: Date.now(),
               lastLogin: Date.now(),
               status: 'active',
               tier: currentUser.email?.toLowerCase() === 'kojiacademy2026@gmail.com' ? 'pro' : 'free',
               purchases: []
             });
             setUserTier('free');
             
             // Check for pending upgrades
             try {
                await fetch('/api/user/sync-upgrades', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ email: currentUser.email })
                });
             } catch(e) { console.error("Sync upgrades failed", e); }
          } else {
             await setDoc(userRef, {
               lastLogin: Date.now(),
               email: currentUser.email,
               displayName: currentUser.displayName
             }, { merge: true });
             
             // Check for pending upgrades
             try {
                await fetch('/api/user/sync-upgrades', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ email: currentUser.email })
                });
             } catch(e) { console.error("Sync upgrades failed", e); }
          }

          if (auth.currentUser?.uid !== currentUser.uid) return;
          unsubDoc = onSnapshot(userRef, (snap) => {
             if (snap.exists()) {
                setUserTier(snap.data().tier || 'free');
             }
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        setUserTier('free');
        if (unsubDoc) unsubDoc();
      }
      setLoadingAuth(false);
    });
    return () => {
      unsubscribeAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  useEffect(() => {
    loadAllProjects();
  }, []);

  const loadAllProjects = async () => {
    const list = await listProjects();
    setProjects(list);
    if (list.length === 0) setView('dashboard');
  };

  const createNewProject = async () => {
    if (userTier === 'free' && projects.length >= 5) {
      alert("Free tier is limited to 5 projects. Please upgrade to Pro to create more.");
      return;
    }
    try {
      const newProject: Project = {
        id: Date.now().toString(),
        name: `Project ${projects.length + 1}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        imageCount: 0
      };
      await saveProject(newProject);
      setProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
      setImages([]);
      setSelectedIndex(0);
      setView('editor');
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const dataURLtoFile = (dataurl: string, filename: string, type: string) => {
    let arr = dataurl.split(',');
    let mimeMatch = arr[0].match(/:(.*?);/);
    let mime = mimeMatch ? mimeMatch[1] : type;
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  };

  
  const openProject = async (p: Project) => {
    setCurrentProject(p);
    try {
      const imagesData = await import('./db').then(m => m.getProjectImages(p.id));
      if (imagesData && imagesData.length > 0) {
        const loadedImages = await Promise.all(imagesData.map(async (data: any) => {
          return new Promise<{file: File, img: HTMLImageElement, settings: ImageSettings}>((resolve) => {
            const file = dataURLtoFile(data.dataUrl, data.name, data.type);
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => resolve({ file, img, settings: data.settings });
            img.src = url;
          });
        }));
        setImages(loadedImages);
      } else {
        setImages([]);
      }
    } catch (e) {
      console.error(e);
      setImages([]);
    }
    setSelectedIndex(0);
    setView('editor');
  };


  const deleteProjectAction = async (id: string) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
      setImages([]);
      setView('dashboard');
    }
  };

  const [images, setImages] = useState<{file: File, img: HTMLImageElement, settings: ImageSettings}[]>([]);

  // Auto-save project image count when images change
  useEffect(() => {
    if (currentProject && view === 'editor') {
      // Only auto-save if we actually have images or if we explicitly cleared them
      if (images.length !== currentProject.imageCount) {
        const updated = { ...currentProject, imageCount: images.length, updatedAt: Date.now() };
        saveProject(updated).then(() => {
          setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
          setCurrentProject(updated);
        });
      }
    }
  }, [images.length, view]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [applyToAll, setApplyToAll] = useState(true);
  const [activePaint, setActivePaint] = useState<{ imageIndex: number, shapeIndex: number } | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const paintOverridesRef = useRef<Record<string, number>>({});




  const paintCell = (e: React.PointerEvent<HTMLCanvasElement>, i: number, isDown: boolean = false) => {
    if (!activePaint || activePaint.imageIndex !== i) return;
    if (!isDown && !isPainting) return;
    
    const canvas = canvasRefs.current[i];
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = canvas.width / (window.devicePixelRatio || 1) / rect.width;
    const scaleY = canvas.height / (window.devicePixelRatio || 1) / rect.height;
    
    const px = x * scaleX;
    const py = y * scaleY;
    
    const settings = images[i].settings;
    const actualCellSize = settings.cellSize;
    const marginPx = settings.pageMargin;
    const coordOffset = settings.showCoordinates ? actualCellSize : 0;
    
    const col = Math.floor((px - marginPx - coordOffset) / actualCellSize);
    const row = Math.floor((py - marginPx - coordOffset) / actualCellSize);
    
    const img = images[i].img;
    const aspectRatio = img.height / img.width;
    const gridRows = Math.floor(settings.gridCols * aspectRatio);
    
    if (col >= 0 && col < settings.gridCols && row >= 0 && row < gridRows) {
      const key = `${col},${row}`;
      if (paintOverridesRef.current[key] !== activePaint.shapeIndex) {
        paintOverridesRef.current[key] = activePaint.shapeIndex;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.fillStyle = 'white';
          ctx.fillRect(
            marginPx + coordOffset + col * actualCellSize,
            marginPx + coordOffset + row * actualCellSize,
            actualCellSize,
            actualCellSize
          );
          
          const shapeInfo = activePaint.shapeIndex === 0 ? { name: 'Empty', code: '', index: 0 } : SHAPES.find(s => s.index === activePaint.shapeIndex) || SHAPES[0];
          const newPixel = getLevelValueForShapeIndex(shapeInfo.index);
          
          drawCell(
            ctx,
            col * actualCellSize + marginPx + coordOffset,
            row * actualCellSize + marginPx + coordOffset,
            actualCellSize,
            newPixel, col, row,
            settings.inkColor, settings.inkThickness, settings.viewMode, settings.renderStyle, settings.densityCodes, activePaint.shapeIndex, settings.pixelShape
          );
          
          ctx.restore();
        }
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>, i: number) => {
    if (isSpaceDown) return;
    if (activePaint?.imageIndex === i) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsPainting(true);
      paintCell(e, i, true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>, i: number) => {
    if (isPainting && activePaint?.imageIndex === i) {
      paintCell(e, i, false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>, i: number) => {
    if (isPainting && activePaint?.imageIndex === i) {
      setIsPainting(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      if (Object.keys(paintOverridesRef.current).length > 0) {
        const overridesToSave = { ...paintOverridesRef.current };
        paintOverridesRef.current = {};
        setImages(prev => {
          const next = [...prev];
          const prevSettings = next[i].settings;
          const prevOverrides = prevSettings.overrides || {};
          next[i] = {
            ...next[i],
            settings: {
              ...prevSettings,
              overrides: { ...prevOverrides, ...overridesToSave },
              overridesHistory: [...(prevSettings.overridesHistory || []), prevOverrides].slice(-20)
            }
          };
          return next;
        });
      }
    }
  };

  const handleUndo = (i: number) => {
    setImages(prev => {
      const next = [...prev];
      const imgObj = next[i];
      const history = imgObj.settings.overridesHistory || [];
      if (history.length > 0) {
        const previousOverrides = history[history.length - 1];
        next[i] = {
          ...imgObj,
          settings: {
            ...imgObj.settings,
            overrides: previousOverrides,
            overridesHistory: history.slice(0, -1)
          }
        };
      }
      return next;
    });
  };

  const downloadSinglePage = async (i: number) => {
    const imgObj = images[i];
    if (!imgObj) return;
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    const exportCanvas = document.createElement('canvas');
    renderArt(exportCanvas, imgObj.img, imgObj.settings, exportScale);
    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `kdp-${imgObj.settings.viewMode}-page${i+1}-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      const exportContainer = document.getElementById('pdf-export-container');
      if (exportContainer) {
         exportContainer.style.position = 'absolute';
         exportContainer.style.left = '-9999px';
         exportContainer.style.top = '0px';
      }
    }, 'image/png');
  };

  const handleDeletePage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    if (selectedIndex === i) {
      setSelectedIndex(Math.max(0, i - 1));
    } else if (selectedIndex > i) {
      setSelectedIndex(selectedIndex - 1);
    }
  };


  const activeSettings = images[selectedIndex]?.settings || defaultSettings;
  const {
    gridCols, cellSize, brightness, contrast, gamma, inkColor, inkThickness, 
    showBgGrid, showCoordinates, viewMode, renderStyle, useDithering, useSmoothing, pageMargin, trimSize, gutterMargin
  } = activeSettings;

  const updateSetting = <K extends keyof ImageSettings>(key: K, value: ImageSettings[K], targetIndex: number = selectedIndex) => {
    if (images.length === 0) return;
    setImages(prev => {
      if (applyToAll) {
        return prev.map(img => ({
          ...img,
          settings: { ...img.settings, [key]: value }
        }));
      }
      const next = [...prev];
      next[targetIndex] = {
        ...next[targetIndex],
        settings: {
          ...next[targetIndex].settings,
          [key]: value
        }
      };
      return next;
    });
  };

  const setGridCols = (v: number) => updateSetting('gridCols', v);
  const setCellSize = (v: number) => updateSetting('cellSize', v);
  const setBrightness = (v: number) => updateSetting('brightness', v);
  const setContrast = (v: number) => updateSetting('contrast', v);
  const setGamma = (v: number) => updateSetting('gamma', v);
  const setInkColor = (v: string) => updateSetting('inkColor', v);
  const setPageMargin = (v: number) => updateSetting('pageMargin', v);
  const setTrimSize = (v: "8.5x11" | "6x9" | "8.5x8.5") => updateSetting('trimSize', v);
  const setGutterMargin = (v: number) => updateSetting('gutterMargin', v);
  const setInkThickness = (v: number) => updateSetting('inkThickness', v);
  const setShowBgGrid = (v: boolean) => updateSetting('showBgGrid', v);
  const setShowCoordinates = (v: boolean) => updateSetting('showCoordinates', v);
  const setViewMode = (v: 'workbook'|'solution') => updateSetting('viewMode', v);
  const setRenderStyle = (v: 'shapes'|'pixels') => updateSetting('renderStyle', v);
  const setPixelShape = (v: 'square' | 'circle' | 'triangle' | 'hexagon' | 'diamond') => updateSetting('pixelShape', v);
  const setUseDithering = (v: boolean) => updateSetting('useDithering', v);
  const setUseSmoothing = (v: boolean) => updateSetting('useSmoothing', v);

    const image = images[0]?.img || null;
  
  // KDP / Print settings
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exportScale, setExportScale] = useState(3);
  
  // Optimization settings
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'grid'>('vertical');
    const [zoom, setZoom] = useState(100);

  const fitToScreen = () => {
    const availableWidth = window.innerWidth - 288;
    const availableHeight = window.innerHeight - 128;
    // Calculate best scale based on first canvas
    let bestScale = 1;
    const firstCanvas = canvasRefs.current[0];
    if (firstCanvas) {
      const canvasW = firstCanvas.width / (window.devicePixelRatio || 1);
      const canvasH = firstCanvas.height / (window.devicePixelRatio || 1);
      const scaleW = availableWidth / canvasW;
      const scaleH = availableHeight / canvasH;
      bestScale = Math.max(0.1, Math.min(scaleW, scaleH));
    } else {
      bestScale = Math.max(0.1, Math.min(availableWidth / 850, availableHeight / 1100));
    }
    setZoom(Math.floor(bestScale * 100));
  };


  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSpaceDown(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
        isPanningRef.current = false;
      }
    };
    const handleBlur = () => {
      setIsSpaceDown(false);
      isPanningRef.current = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        setZoom(prev => Math.max(25, Math.min(400, prev + delta)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleContainerPointerDown = (e: React.PointerEvent) => {
    if (isSpaceDown) {
      isPanningRef.current = true;
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollContainerRef.current?.scrollLeft || 0,
        scrollTop: scrollContainerRef.current?.scrollTop || 0
      };
    }
  };

  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (isPanningRef.current && scrollContainerRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      scrollContainerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      scrollContainerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
    }
  };

  const handleContainerPointerUp = () => {
    isPanningRef.current = false;
  };


  const [stats, setStats] = useState<Record<number, number>>({});
  const [totalCells, setTotalCells] = useState(0);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderArt = (targetCanvas: HTMLCanvasElement, img: HTMLImageElement, settings: ImageSettings, scaleMultiplier: number = 1, forceViewMode?: 'workbook'|'solution', isFirst: boolean = false, applyDpr: boolean = false) => {
    const { gridCols, cellSize, brightness, contrast, gamma, inkColor, inkThickness, showBgGrid, showCoordinates, viewMode, renderStyle, useDithering, useSmoothing, pageMargin = 0 } = settings;
    const currentViewMode = forceViewMode || viewMode;
    const marginPx = pageMargin * scaleMultiplier;
    const actualCellSize = cellSize * scaleMultiplier;
    const actualThickness = inkThickness * scaleMultiplier;
    const aspectRatio = img.height / img.width;
    const gridRows = Math.floor(gridCols * aspectRatio);
    
    if (!gridCols || !gridRows || isNaN(gridCols) || isNaN(gridRows) || !img.width || !img.height) return;
    
    const offscreen = document.createElement('canvas');
    offscreen.width = gridCols;
    offscreen.height = gridRows;
    const oCtx = offscreen.getContext('2d');
    if (!oCtx) return;
    
    // SMOOTHING: Bilinear sampling to get average luminance for the block
    oCtx.imageSmoothingEnabled = useSmoothing;
    oCtx.imageSmoothingQuality = 'high';
    oCtx.drawImage(img, 0, 0, gridCols, gridRows);
    
    const imgData = oCtx.getImageData(0, 0, gridCols, gridRows);
    const data = imgData.data;
    
    const coordOffset = showCoordinates ? actualCellSize : 0;
    
    const canvasLogicalWidth = gridCols * actualCellSize + coordOffset + (marginPx * 2);
    const canvasLogicalHeight = gridRows * actualCellSize + coordOffset + (marginPx * 2);
    const dpr = applyDpr ? (window.devicePixelRatio || 1) : 1;
    
    targetCanvas.width = canvasLogicalWidth * dpr;
    targetCanvas.height = canvasLogicalHeight * dpr;
    if (applyDpr) {
      targetCanvas.style.width = (canvasLogicalWidth * (zoomRef.current / 100)) + 'px';
      targetCanvas.style.height = (canvasLogicalHeight * (zoomRef.current / 100)) + 'px';
    } else {
      targetCanvas.style.width = canvasLogicalWidth + 'px';
      targetCanvas.style.height = canvasLogicalHeight + 'px';
    }
    
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(dpr, dpr);
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasLogicalWidth, canvasLogicalHeight);
    
    if (showCoordinates) {
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${actualCellSize * 0.4}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      for (let x = 0; x < gridCols; x++) {
        ctx.fillText(getColumnLetter(x), marginPx + coordOffset + x * actualCellSize + actualCellSize / 2, marginPx + coordOffset / 2);
      }
      for (let y = 0; y < gridRows; y++) {
        ctx.fillText((y + 1).toString(), marginPx + coordOffset / 2, marginPx + coordOffset + y * actualCellSize + actualCellSize / 2);
      }
    }

    ctx.save();
    ctx.translate(marginPx + coordOffset, marginPx + coordOffset);
    
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const grays = new Float32Array(gridCols * gridRows);

    // Initial pass: Convert to grayscale and apply contrast/brightness/gamma
    for (let i = 0; i < gridCols * gridRows; i++) {
        let r = data[i*4];
        let g = data[i*4+1];
        let b = data[i*4+2];
        
        let luminance = r * 0.299 + g * 0.587 + b * 0.114;
        
        // Apply Gamma (Midtones)
        if (gamma !== 1.0) {
          luminance = 255 * Math.pow(luminance / 255, 1 / gamma);
        }

        // Apply Brightness & Contrast
        luminance = contrastFactor * (luminance - 128) + 128 + brightness;
        
        grays[i] = Math.max(0, Math.min(255, luminance));
    }    const currentStats: Record<number, number> = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
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

    const drawGridLines = () => {
      if (showBgGrid && currentViewMode === 'solution') {
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = Math.max(1, actualCellSize * 0.04);
        ctx.beginPath();
        for (let y = 0; y <= gridRows; y++) {
          ctx.moveTo(0, y * actualCellSize);
          ctx.lineTo(gridCols * actualCellSize, y * actualCellSize);
        }
        for (let x = 0; x <= gridCols; x++) {
          ctx.moveTo(x * actualCellSize, 0);
          ctx.lineTo(x * actualCellSize, gridRows * actualCellSize);
        }
        ctx.stroke();
      }
    };
    
    if (renderStyle === 'shapes') {
      drawGridLines();
    }
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
    }


    if (renderStyle === 'pixels') {
      drawGridLines();
    }
    if (scaleMultiplier === 1) {
      setStats(currentStats);
      setTotalCells(gridCols * gridRows);
    }
    
    ctx.restore();
  };

  const prevSettingsRef = useRef<ImageSettings[]>([]);
  const visibleIndicesRef = useRef<Set<number>>(new Set());
  const rAFRef = useRef<number | null>(null);

  // Set up intersection observer for lazy rendering
  useEffect(() => {
    if (images.length <= 100) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let needsRender = false;
        entries.forEach(entry => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) {
            visibleIndicesRef.current.add(idx);
            needsRender = true;
          } else {
            visibleIndicesRef.current.delete(idx);
          }
        });

        // Trigger a render check if new items became visible
        if (needsRender) {
          scheduleRender();
        }
      },
      { rootMargin: '800px' } // Load a bit ahead of scrolling
    );

    // Observe all container wrappers
    const containers = document.querySelectorAll('.canvas-item-wrapper');
    containers.forEach(c => observer.observe(c));

    return () => observer.disconnect();
  }, [images.length]); // Re-attach when images list length changes

  const scheduleRender = () => {
    if (rAFRef.current !== null) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }

    rAFRef.current = requestAnimationFrame(() => {
      const changedIndices: number[] = [];
      const isLazyMode = images.length > 100;
      images.forEach((imgObj, i) => {
        // Only consider rendering if it's visible or it's the currently selected one
        if (!isLazyMode || visibleIndicesRef.current.has(i) || i === selectedIndex) {
          const prev = prevSettingsRef.current[i];
          const curr = imgObj.settings;
          if (!prev || prev !== curr) {
            changedIndices.push(i);
          }
        }
      });

      // Prioritize selected index
      const sortedIndices = changedIndices.sort((a, b) => {
        if (a === selectedIndex) return -1;
        if (b === selectedIndex) return 1;
        return 0;
      });

      let currentIndex = 0;
      const renderNext = () => {
        const batchSize = 1;
        for (let i = 0; i < batchSize && currentIndex < sortedIndices.length; i++) {
          const idx = sortedIndices[currentIndex++];
          const targetCanvas = canvasRefs.current[idx];
          if (targetCanvas) {
            renderArt(targetCanvas, images[idx].img, images[idx].settings, 1, undefined, false, true);
            targetCanvas.style.width = `${(targetCanvas.width / (window.devicePixelRatio || 1)) * (zoomRef.current / 100)}px`;
            targetCanvas.style.height = `${(targetCanvas.height / (window.devicePixelRatio || 1)) * (zoomRef.current / 100)}px`;
            prevSettingsRef.current[idx] = images[idx].settings;
          }
        }

        if (currentIndex < sortedIndices.length) {
          rAFRef.current = requestAnimationFrame(renderNext);
        } else {
          rAFRef.current = null;
        }
      };

      if (sortedIndices.length > 0) {
        renderNext();
      }
    });
  };

  useEffect(() => {
    if (view === 'editor') {
      prevSettingsRef.current = [];
    }
  }, [view]);

  useEffect(() => {
    if (images.length === 0 || view !== 'editor') return;
    
    let tries = 0;
    let timeoutId = null;
    const checkAndRender = () => {
      const hasCanvas = canvasRefs.current.some(c => c !== null && c !== undefined);
      if (hasCanvas) {
        scheduleRender();
        setTimeout(fitToScreen, 100); // Auto fit when canvases are ready
      } else if (tries < 20) {
        tries++;
        timeoutId = setTimeout(checkAndRender, 50);
      }
    };
    
    timeoutId = setTimeout(checkAndRender, 50);
    return () => clearTimeout(timeoutId);
  }, [images, selectedIndex, view]);
  
  // Also auto-fit on window resize
  useEffect(() => {
    if (view === 'editor' && images.length > 0) {
      const handleResize = () => fitToScreen();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [view, images.length]);

  const processFiles = async (files: File[]) => {
    let allowedFiles = files;
    const maxPages = userTier === 'free' ? 20 : 100;
    
    if (images.length + allowedFiles.length > maxPages) {
      alert(`Your tier (${userTier}) is limited to ${maxPages} pages per book. Please upgrade to add more.`);
      allowedFiles = allowedFiles.slice(0, maxPages - images.length);
      if (allowedFiles.length === 0) return;
    }

    if (images.length === 0) setSelectedIndex(0);
    const loadedImages = await Promise.all(allowedFiles.map(file => {
      return new Promise<{file: File, img: HTMLImageElement, settings: ImageSettings}>((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => resolve({ file, img, settings: { ...defaultSettings } });
        img.src = url;
      });
    }));
    setImages(prev => [...prev, ...loadedImages as any]);
      };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processFiles(Array.from(e.target.files));
    e.target.value = ''; // clear the input so the same file can be selected again
  };

  const handleDownload = async () => {
    if (!image) return;
    setIsExporting(true);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const exportCanvas = document.createElement('canvas');
    renderArt(exportCanvas, image, activeSettings, exportScale);
    
    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `kdp-${viewMode}-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 'image/png');
  };


  const handleDownloadSVG = async () => {
    if (!image) return;
    setIsExporting(true);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const svgStr = generateSVG(image, activeSettings);
    if (!svgStr) {
      setIsExporting(false);
      return;
    }
    
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `kdp-${viewMode}-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };


  const handleBulkExportSVG = async () => {
    if (!images.length) return;
    setIsExporting(true);
    setExportStatus('Generating SVGs...');
    setExportProgress(0);
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      for (let i = 0; i < images.length; i++) {
        setExportProgress(Math.round(((i) / images.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 10)); // Yield
        const imgObj = images[i];
        
        // Workbook SVG
        const workbookSvg = generateSVG(imgObj.img, { ...imgObj.settings, viewMode: 'workbook' });
        if (workbookSvg) {
           zip.file(`page-${i+1}-workbook.svg`, workbookSvg);
        }
        
        // Solution SVG
        const solutionSvg = generateSVG(imgObj.img, { ...imgObj.settings, viewMode: 'solution' });
        if (solutionSvg) {
           zip.file(`page-${i+1}-solution.svg`, solutionSvg);
        }
      }
      
      setExportStatus('Zipping files...');
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.download = `kdp-svg-export-${Date.now()}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
      setExportStatus('');
      setExportProgress(0);
    }
  };

  const handleBulkExportPNG = async () => {
    if (!images.length) return;
    setIsExporting(true);
    setExportStatus('Generating PNGs...');
    setExportProgress(0);
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      for (let i = 0; i < images.length; i++) {
        setExportProgress(Math.round(((i) / images.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 50));
        const imgObj = images[i];
        
        // Workbook PNG
        const workbookCanvas = document.createElement('canvas');
        renderArt(workbookCanvas, imgObj.img, { ...imgObj.settings, viewMode: 'workbook' }, exportScale);
        const workbookBlob = await new Promise<Blob | null>(resolve => workbookCanvas.toBlob(resolve, 'image/png'));
        if (workbookBlob) {
           zip.file(`page-${i+1}-workbook.png`, workbookBlob);
        }
        
        // Solution PNG
        const solutionCanvas = document.createElement('canvas');
        renderArt(solutionCanvas, imgObj.img, { ...imgObj.settings, viewMode: 'solution' }, exportScale);
        const solutionBlob = await new Promise<Blob | null>(resolve => solutionCanvas.toBlob(resolve, 'image/png'));
        if (solutionBlob) {
           zip.file(`page-${i+1}-solution.png`, solutionBlob);
        }
      }
      
      setExportStatus('Zipping files...');
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.download = `kdp-png-export-${Date.now()}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
      setExportStatus('');
      setExportProgress(0);
    }
  };

  const handleBulkExportPDF = async (exportType: boolean) => {
    if (!images.length && !currentProject) return;
    
    setIsExporting(true);
    setIsExportMenuOpen(false);
    setExportProgress(0);
    setExportStatus('Processing images...');
    
    try {
      const processedImages = [];
      for (let i = 0; i < images.length; i++) {
        setExportProgress(Math.round(((i) / images.length) * 50));
        await new Promise(r => setTimeout(r, 10)); // Yield
        processedImages.push(processImageForPdf(images[i].img, images[i].settings));
      }
      
      setExportStatus('Generating PDF layout (this may take a minute)...');
      setExportProgress(50);
      
      await new Promise(r => setTimeout(r, 50));
      
      const doc = <PdfDocument project={currentProject!} processedImages={processedImages} isExportingSolutions={exportType} userTier={userTier} />;
      
      const blob = await pdf(doc).toBlob();
      
      setExportProgress(100);
      setExportStatus('Download starting...');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentProject?.name || 'export'}-${exportType ? 'solutions' : 'workbook'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error exporting vector PDF');
    } finally {
      setIsExporting(false);
      setExportStatus('');
      setExportProgress(0);
    }
  };

  if (loadingAuth) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-neutral-50 text-neutral-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {showSalesPage ? (
          <motion.div
            key="sales"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full min-h-screen"
          >
            <SalesPage onLoginClick={() => setShowSalesPage(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full min-h-screen"
          >
            <AuthPage />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div 
      className="h-[100dvh] w-full overflow-hidden bg-neutral-50 flex flex-col font-sans text-neutral-900"
    >

      

      <header className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-lg text-neutral-900">KDP MonoCrafter</h1>
        </div>
              
        <div className="flex items-center justify-end gap-3">
          <div className="flex gap-2 items-center">
            
            {currentProject && (view === 'editor' || view === 'bookflow') && (
              <button 
                
                onClick={async () => {
                  setSaveStatus('saving');
                  const updated = { ...currentProject, imageCount: images.length, updatedAt: Date.now() };
                  
                  // Serialize images
                  let imagesDataToSave = null;
                  if (images.length > 0) {
                    imagesDataToSave = await Promise.all(images.map(async (im) => {
                      const dataUrl = await getBase64(im.file);
                      return {
                        name: im.file.name,
                        type: im.file.type,
                        dataUrl,
                        settings: im.settings
                      };
                    }));
                  }
                  
                  await saveProject(updated, imagesDataToSave);
                  setCurrentProject(updated);
                  setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
                  setSaveStatus('saved');
                  setTimeout(() => setSaveStatus('idle'), 2000);
                }}

                disabled={saveStatus === 'saving'}
                className="flex items-center justify-center min-w-[110px] gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md text-xs font-semibold transition-colors shadow-sm border border-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' && <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving...</span>}
                {saveStatus === 'saved' && <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Saved!</span>}
                {saveStatus === 'idle' && <span className="flex items-center gap-1.5"><Save size={14} /> Save Book</span>}
              </button>
            )}

            {isExporting && exportStatus && (
              <div className="flex items-center gap-2 mr-2 text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-md">
                <span>{exportStatus}</span>
                {exportProgress > 0 && <span className="text-black">{exportProgress}%</span>}
              </div>
            )}
            
            <select
              value={exportScale}
              onChange={(e) => setExportScale(Number(e.target.value))}
              className="text-xs font-medium bg-white border border-neutral-200 rounded-md pl-2 pr-6 py-2 outline-none hover:bg-neutral-50 focus:border-neutral-400 transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a3a3a3%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '8px auto' }}
            >
              <option value={2}>Print 2x</option>
              <option value={4}>Print 4x (300 DPI)</option>
              <option value={8}>Print 8x (Max)</option>
            </select>
            
            <div className="relative">
              <button 
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                disabled={isExporting || (view !== 'bookflow' && !image && !images.length)}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
              >
                <Download size={14} />
                Export
                <ChevronDown size={14} />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-md shadow-lg py-1 z-50 overflow-hidden">
                  <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50 border-b border-neutral-100">
                    Image
                  </div>
                  <button onClick={() => { setIsExportMenuOpen(false); handleDownloadSVG(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export SVG
                  </button>
                  <button onClick={() => { setIsExportMenuOpen(false); handleDownload(); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                    <Download size={14} /> Export PNG
                  </button>
                  {(images.length > 1 || view === 'bookflow') && (
                    <>
                      <button onClick={() => { 
                        setIsExportMenuOpen(false); 
                        if (userTier === 'free') { alert("Export SVG (Full photo) is a Pro feature. Please upgrade."); return; }
                        handleBulkExportSVG(); 
                      }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors border-t border-neutral-100 mt-1 hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                        <div className="flex items-center gap-2"><Download size={14} /> Export SVG (Full photo)</div>
                        {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                      </button>
                      <button onClick={() => { 
                        setIsExportMenuOpen(false); 
                        if (userTier === 'free') { alert("Export PNG (Full photo) is a Pro feature. Please upgrade."); return; }
                        handleBulkExportPNG(); 
                      }} className="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors mt-1 hover:bg-neutral-50 hover:text-neutral-900 text-neutral-700">
                        <div className="flex items-center gap-2"><Download size={14} /> Export PNG (Full photo)</div>
                        {userTier === 'free' && <Lock size={12} className="text-neutral-400" />}
                      </button>

                      <div className="px-3 py-2 mt-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-50 border-b border-t border-neutral-100">
                        Entire Book
                      </div>
                      <button onClick={() => { setIsExportMenuOpen(false); handleBulkExportPDF(false); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                        <BookOpen size={14} /> Export Workbook PDF
                      </button>
                      <button onClick={() => { setIsExportMenuOpen(false); handleBulkExportPDF(true); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                        <BookOpen size={14} /> Export Solutions PDF
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            multiple
            className="hidden" 
          />
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
<aside className="w-64 bg-white border-r border-neutral-200 p-3.5 flex flex-col gap-1.5 overflow-y-auto shrink-0 custom-scrollbar">
            <div className="flex flex-col gap-2 pb-2 border-b border-neutral-100">
              <button 
                onClick={() => setView('dashboard')}
                className={`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${view === 'dashboard' ? 'text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}`}
              >
                {view === 'dashboard' && (
                  <motion.div
                    layoutId="activeView"
                    className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              {(view === 'editor' || view === 'bookflow') && currentProject && (
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => setView('bookflow')}
                    className={`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${view === 'bookflow' ? 'text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}`}
                  >
                    {view === 'bookflow' && (
                      <motion.div
                        layoutId="activeView"
                        className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <BookText size={16} />
                    BookFlow
                  </button>
                  {view === 'bookflow' && (
                    <div className="flex flex-col gap-1 pl-7 pr-2 py-1">
                      {[
                        { id: 'cover', title: 'Cover Book', icon: <ImageIcon size={14} />, isLocked: false },
                        { id: 'copyright', title: 'Copyright Page', icon: <FileText size={14} />, isLocked: false },
                        { id: 'welcome', title: 'Welcome Page', icon: <FileText size={14} />, isLocked: false },
                        { id: 'warmup', title: 'Warm up practice', icon: <FileText size={14} />, isLocked: true },
                        { id: 'pentesting', title: 'Pen Testing lab', icon: <FileText size={14} />, isLocked: true },
                        { id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={14} />, isLocked: true },
                        { id: 'thankyou', title: 'Thank You Page', icon: <FileText size={14} />, isLocked: false },
                      ].map(page => {
                        const isLockedForUser = page.isLocked && userTier === 'free';
                        return (
                        <button
                          key={page.id}
                          onClick={() => setActiveBookFlowPage(page.id as any)}
                          className={`relative z-0 flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-xs font-semibold ${
                            activeBookFlowPage === page.id 
                              ? 'text-black' 
                              : isLockedForUser
                                ? 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700'
                                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                          }`}
                        >
                          {activeBookFlowPage === page.id && !isLockedForUser && (
                            <motion.div
                              layoutId="activeBookFlowPage"
                              className="absolute inset-0 bg-neutral-300 rounded-md -z-10 shadow-sm"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          {isLockedForUser ? <Lock size={14} className="text-neutral-400" /> : page.icon}
                          <span className="truncate">{page.title}</span>
                        </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            {view === 'editor' && (
            <div className="flex flex-col gap-1.5">

    
              {images.length > 1 && (
                <div className="flex bg-neutral-100/80 p-1 rounded-lg border border-neutral-200 mb-2">
                  <button 
                    onClick={() => setApplyToAll(true)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${applyToAll ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    Apply to All
                  </button>
                  <button 
                    onClick={() => setApplyToAll(false)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${!applyToAll ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    Current Page
                  </button>
                </div>
              )}
              
    
                        <Accordion title="Display Mode" defaultOpen={true}>
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex bg-neutral-100/80 p-1 rounded-lg border border-neutral-200">
                    <button 
                      onClick={() => setRenderStyle('shapes')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${renderStyle === 'shapes' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                      Pattern
                    </button>
                    <button 
                      onClick={() => setRenderStyle('pixels')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${renderStyle === 'pixels' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                      Pixel
                    </button>
                  </div>
    
                  {renderStyle === 'pixels' && (
                    <div className="flex bg-neutral-100/80 p-1 rounded-lg border border-neutral-200">
                      {['square', 'circle', 'triangle', 'hexagon', 'diamond'].map(shape => {
                        const isLockedShape = shape !== 'square' && userTier === 'free';
                        return (
                        <button
                          key={shape}
                          onClick={() => {
                            if (isLockedShape) {
                              alert(`The ${shape} pixel shape is only available in the Pro version. Please upgrade.`);
                              return;
                            }
                            setPixelShape(shape as any);
                          }}
                          className={`flex-1 py-1 px-0.5 flex items-center justify-center gap-0.5 text-[10px] font-semibold rounded-md transition-all capitalize ${
                            activeSettings.pixelShape === shape 
                              ? 'bg-white shadow-sm text-neutral-900' 
                              : isLockedShape
                                ? 'text-neutral-400 cursor-not-allowed'
                                : 'text-neutral-500 hover:text-neutral-700'
                          }`}
                          title={shape}
                        >
                          {isLockedShape && <Lock size={8} className="text-neutral-400" />}
                          <span>{shape.substring(0, 3)}</span>
                        </button>
                        );
                      })}
                    </div>
                  )}
    
                  <div className="flex bg-neutral-100/80 p-1 rounded-lg border border-neutral-200">
                    <button 
                      onClick={() => setViewMode('workbook')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'workbook' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                      Workbook
                    </button>
                    <button 
                      onClick={() => setViewMode('solution')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'solution' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                      Solution
                    </button>
                  </div>
                </div>
              </Accordion>
              
              <Accordion title="Layout & Image" defaultOpen={true}>
                <div className="flex flex-col gap-4 pt-1 pb-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Page Layout</span>
                    </div>
                    <div className="flex flex-col gap-1.5 pb-2">
                      <Slider label="Gutter Margin" value={gutterMargin || 0} min={0} max={200} step={5} onChange={setGutterMargin} tooltip="Extra margin on the inner edge of the page (gutter) for book binding." />
                    </div>
                    <div className="h-px bg-neutral-200/60 mb-2" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Grid Density</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-neutral-700">Resolution (Columns)</span>
                      </div>
                      <select
                        value={gridCols}
                        onChange={(e) => setGridCols(Number(e.target.value))}
                        className="w-full text-sm rounded-md border-neutral-300 shadow-sm focus:border-black focus:ring-black bg-white text-neutral-900 px-3 py-1.5 outline-none border"
                      >
                        <option value={30}>30 (Very Low)</option>
                        <option value={40}>40 (Low)</option>
                        <option value={60}>60 (Medium)</option>
                        <option value={80}>80 (High)</option>
                        <option value={100}>100 (Very High)</option>
                        <option value={120}>120 (Detailed)</option>
                        <option value={150}>150 (Very Detailed)</option>
                      </select>
                    </div>
                  </div>
    
                  <div className="h-px bg-neutral-200/60" />
    
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Image Adjustments</span>
                      <button 
                        onClick={() => {
                          setBrightness(0);
                          setContrast(0);
                          setGamma(1.0);
                        }}
                        className="text-[10px] font-semibold text-black hover:text-black transition-colors bg-neutral-200 hover:bg-black px-2 py-0.5 rounded active:scale-95"
                      >
                        Reset
                      </button>
                    </div>
                    <Slider label="Midtones (Gamma)" value={gamma} min={0.1} max={3.0} step={0.1} onChange={setGamma} tooltip="Adjust the midtones of the image. Lower values make midtones darker, higher values make them lighter." />
                    <Toggle label="Dithering" checked={useDithering} onChange={setUseDithering} tooltip="Applies Floyd-Steinberg dithering for smoother gradients and details." />
                    <Slider label="Brightness" value={brightness} min={-100} max={100} onChange={setBrightness} />
                    <Slider label="Contrast" value={contrast} min={-100} max={100} onChange={setContrast} />
                  </div>
                </div>
              </Accordion>
    
              
    
            
                                    </div>
            )}
            
            <button 
              onClick={() => setView("tutorial")}
              className={`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${view === "tutorial" ? "text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"}`}
            >
              {view === "tutorial" && (
                <motion.div
                  layoutId="activeView"
                  className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <HelpCircle size={16} />
              Tutorial
            </button>

            {user?.email === 'kojiacademy2026@gmail.com' && (
            <button 
              onClick={() => setView("admin")}
              className={`relative z-0 flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-semibold ${view === "admin" ? "text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"}`}
            >
              {view === "admin" && (
                <motion.div
                  layoutId="activeView"
                  className="absolute inset-0 bg-neutral-100 rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Shield size={16} />
              Admin
            </button>
            )}

            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`relative z-0 flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-semibold ${view === 'settings' || isSettingsOpen ? 'text-neutral-900 bg-neutral-50' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </div>
                <ChevronDown size={14} className={`transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 pl-7 pr-2 py-1">
                      <button 
                        onClick={() => { setView('settings'); setSettingsTab('account'); }}
                        className={`text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'settings' && settingsTab === 'account' ? 'text-black bg-neutral-200/50' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`}
                      >
                        Account & Profile
                      </button>
                      <button 
                        onClick={() => { setView('settings'); setSettingsTab('kdp'); }}
                        className={`text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'settings' && settingsTab === 'kdp' ? 'text-black bg-neutral-200/50' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`}
                      >
                        KDP Defaults
                      </button>
                      <button 
                        onClick={() => { setView('settings'); setSettingsTab('editor'); }}
                        className={`text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'settings' && settingsTab === 'editor' ? 'text-black bg-neutral-200/50' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`}
                      >
                        Editor Preferences
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-auto pt-4 pb-1">
              <div className="flex flex-col gap-2 p-3 bg-neutral-100/80 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-neutral-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 border border-neutral-300">
                      <User size={16} />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-neutral-900 truncate">{user.displayName || user.email}</span>
                    <div className="flex items-center gap-1">
                      {user.email === 'kojiacademy2026@gmail.com' ? (
                        <span className="text-[10px] font-bold text-blue-600 uppercase">Admin</span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">{userTier === 'free' ? 'Free Plan' : userTier === 'regular' ? 'Regular Plan' : 'Pro Plan'}</span>
                      )}
                      {userTier !== 'free' && <Crown size={12} className="text-amber-500" />}
                    </div>
                  </div>
                </div>
                
                {userTier !== 'pro' && (
                  <button 
                    onClick={() => window.open('https://warriorplus.com', '_blank')}
                    className="w-full mt-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 shadow-sm transition-all"
                  >
                    <ArrowUpCircle size={14} /> Upgrade Now
                  </button>
                )}
                
                <button 
                  onClick={() => signOut(auth)}
                  className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>
          </aside>
        <AnimatePresence mode="wait">
          {view === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >
              <SettingsView user={user} onLogout={() => signOut(auth)} activeTab={settingsTab} />
            </motion.div>
          )}

          {view === "tutorial" && (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >
              <TutorialView />
            </motion.div>
          )}
          {view === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >
              <AdminView />
            </motion.div>
          )}
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >
          <div className="flex-1 overflow-auto bg-neutral-50 p-8 custom-scrollbar">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Dashboard</h2>
                  <p className="text-sm text-neutral-500 mt-1">Manage your books and track progress.</p>
                </div>
                {userTier === 'free' ? (
                  <button disabled className="flex items-center gap-2 px-4 py-2 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm">
                    <Plus size={16}/> Create New Book
                  </button>
                ) : (
                  <button onClick={createNewProject} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
                    <Plus size={16}/> Create New Book
                  </button>
                )}
              </div>

              {userTier === 'free' ? (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-neutral-200 shadow-sm mt-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-100 flex flex-col items-center">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                        <Lock size={32} className="text-neutral-900" />
                      </div>
                      <h3 className="text-xl font-black text-neutral-900 mb-2">Account Pending Verification</h3>
                      <p className="text-neutral-600 mb-6 text-sm">Your account is currently locked. If you recently purchased the software via WarriorPlus, please wait a few moments for the system to process your transaction and upgrade your account.</p>
                      
                      <div className="flex flex-col w-full gap-3">
                        <button 
                          onClick={() => window.location.reload()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-bold transition-colors"
                        >
                          Refresh Status
                        </button>
                        <a 
                          href="https://warriorplus.com"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-neutral-200 hover:border-neutral-900 text-neutral-900 rounded-lg text-sm font-bold transition-colors"
                        >
                          Purchase Access
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fake background to show what they are missing */}
                  <div className="opacity-30 blur-sm pointer-events-none w-full">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                       <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm h-24"></div>
                       <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm h-24"></div>
                       <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm h-24"></div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm h-64"></div>
                       <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm h-64"></div>
                       <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm h-64"></div>
                     </div>
                  </div>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-neutral-200 shadow-sm mt-8">
                  <FolderOpen size={48} className="mb-4 text-neutral-300" />
                  <h3 className="text-lg font-bold text-neutral-900">No books yet</h3>
                  <p className="text-sm text-neutral-500 max-w-sm mt-2 mb-6">Create your first book project to start crafting your low-content KDP interiors.</p>
                  {userTier === 'free' ? (
                    <button disabled className="flex items-center gap-2 px-6 py-2.5 bg-neutral-300 text-neutral-500 rounded-md text-sm font-semibold cursor-not-allowed shadow-sm">
                      <Plus size={18}/> Create New Book
                    </button>
                  ) : (
                    <button onClick={createNewProject} className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
                      <Plus size={18}/> Create New Book
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-1">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><Calendar size={14}/> Today</span>
                      <span className="text-3xl font-bold text-neutral-900">
                        {projects.filter(p => Date.now() - p.createdAt < 24 * 60 * 60 * 1000).length}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">Books Created</span>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-1">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><Calendar size={14}/> This Week</span>
                      <span className="text-3xl font-bold text-neutral-900">
                        {projects.filter(p => Date.now() - p.createdAt < 7 * 24 * 60 * 60 * 1000).length}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">Books Created</span>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-1">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><Calendar size={14}/> This Month</span>
                      <span className="text-3xl font-bold text-neutral-900">
                        {projects.filter(p => Date.now() - p.createdAt < 30 * 24 * 60 * 60 * 1000).length}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">Books Created</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-neutral-900">Your Books</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      <button 
                        onClick={createNewProject}
                        className="bg-white border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center gap-4 transition-all hover:bg-neutral-50 hover:border-neutral-300 group aspect-[2/3] min-h-[200px]"
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform">
                          <Plus size={24} className="text-neutral-400" />
                        </div>
                        <span className="text-[11px] font-bold tracking-widest text-neutral-500">NEW BOOK</span>
                      </button>
                      
                      {projects.map(p => (
                        <div 
                          key={p.id} 
                          className="relative bg-[#111111] rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col aspect-[2/3] min-h-[200px] overflow-hidden"
                        >
                          {/* Book Spine highlight */}
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/10 to-transparent z-10 pointer-events-none"></div>
                          <div className="absolute left-2 top-0 bottom-0 w-px bg-white/5 z-10 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none"></div>
                          
                          {/* Delete button (on hover) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProjectAction(p.id); }}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-40"
                            title="Delete book"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Book Cover Content */}
                          <div onClick={() => openProject(p)} className="cursor-pointer flex flex-col h-full items-center justify-center text-center p-6 flex-1 relative z-20">
                            <h4 className="font-serif text-xl text-white/90 leading-snug line-clamp-3 mb-4" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>{p.name}</h4>
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">{(user?.displayName || 'AUTHOR').split(' ')[0]}</span>
                          </div>
                          
                          {/* Hover Overlay for Actions */}
                          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-30 pointer-events-none group-hover:pointer-events-auto p-4">
                             <button 
                                onClick={(e) => { e.stopPropagation(); setView('bookflow'); setCurrentProject(p); }}
                                className="w-2/3 max-w-[120px] py-2 bg-white text-black font-bold text-[10px] uppercase tracking-wider rounded hover:scale-105 transition-transform"
                             >
                               BookFlow
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); openProject(p); }}
                                className="w-2/3 max-w-[120px] py-2 border border-white/50 text-white font-bold text-[10px] uppercase tracking-wider rounded hover:bg-white hover:text-black hover:border-white transition-all"
                             >
                               Open Editor
                             </button>
                          </div>

                          {/* Progress Footer */}
                          <div className="px-5 pb-5 pt-3 border-t border-white/5 relative z-20 bg-[#111111]">
                            <div className="flex justify-center items-center text-[9px] font-bold tracking-widest text-white/40">
                              <span>{p.imageCount} {p.imageCount === 1 ? 'PAGE' : 'PAGES'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
                                  </div>
          </div>
            </motion.div>
          )}
          {view === 'bookflow' && currentProject && (
            <motion.div
              key="bookflow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >
              <BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} onExport={handleBulkExportPDF} userTier={userTier} />
            </motion.div>
          )}
          {view === 'editor' && (
            <motion.section
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
          ref={scrollContainerRef}
          className={`flex-1 bg-[#e5e5e5] overflow-auto relative shadow-inner ${isSpaceDown ? (isPanningRef.current ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files) as File[];
            const validFiles = files.filter(f => f.type.startsWith('image/'));
            if (validFiles.length > 0) processFiles(validFiles);
          }}
          onPointerDown={handleContainerPointerDown}
          onPointerMove={handleContainerPointerMove}
          onPointerUp={handleContainerPointerUp}
          onPointerLeave={handleContainerPointerUp}
        >

          {isDragging && (
            <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-sm border-4 border-black border-dashed m-4 rounded-xl flex items-center justify-center pointer-events-none">
              <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-3">
                <Upload size={32} className="text-black animate-bounce" />
                <h3 className="text-lg font-bold text-neutral-900">Drop Images Here</h3>
              </div>
            </div>
          )}

          {!image ? (
            <div className="w-full h-full flex flex-col items-center justify-center"><div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full relative z-10">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ImageIcon size={32} />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Workspace Empty</h2>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                Drag and drop your images here or click to browse files to start generating KDP trace & shading patterns.
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-md w-full active:scale-[0.98]"
              >
                <Upload size={16} />
                Browse Images
              </button>
            </div></div>
          ) : (
            <div className={`relative min-w-full p-4 gap-6 print:p-0 print:gap-0 mx-auto ${
              layoutMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 place-items-center justify-center w-full' 
                : 'w-max flex flex-col items-center justify-start'
            }`}>
              {images.map((imgObj, i) => (
                <div key={i} data-index={i} className="canvas-item-wrapper flex flex-col items-center gap-4 my-8">
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center max-w-full bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-200 shadow-sm z-30 print:hidden" onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}>
                    <div className="flex items-center gap-2">
                      <img src={imgObj.img.src} alt="" className="w-8 h-8 object-cover rounded shadow-sm border border-neutral-300" />
                      <div className="text-sm font-bold text-neutral-600">Page {i + 1}</div>
                      <div className="w-px h-6 bg-neutral-300 mx-1"></div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUndo(i); }}
                        disabled={!(imgObj.settings.overridesHistory?.length)}
                        className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                        title="Undo paint"
                      >
                        <Undo size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadSinglePage(i); }}
                        className="p-1.5 rounded text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
                        title="Download this page"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePage(i); }}
                        className="p-1.5 rounded text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
                        title="Delete this page"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center pr-1">
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Density Keys</div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActivePaint(activePaint?.imageIndex === i && activePaint?.shapeIndex === 0 ? null : { imageIndex: i, shapeIndex: 0 }); }}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 ${activePaint?.imageIndex === i && activePaint?.shapeIndex === 0 ? 'bg-black text-white' : 'text-neutral-500 hover:bg-neutral-200'}`}
                        >
                          <Eraser size={10} />
                          Erase
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 bg-neutral-100/80 p-1 rounded-md border border-neutral-200">
                        {imgObj.settings.densityCodes.map((code, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActivePaint(activePaint?.imageIndex === i && activePaint?.shapeIndex === idx + 1 ? null : { imageIndex: i, shapeIndex: idx + 1 }); 
                            }}
                            className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                              activePaint?.imageIndex === i && activePaint?.shapeIndex === idx + 1 
                                ? 'ring-2 ring-black shadow-sm scale-110' 
                                : 'hover:bg-neutral-200 hover:scale-105'
                            }`}
                            title={`Paint with ${code}`}
                          >
                            <div className="scale-[1.1] origin-center flex items-center justify-center pointer-events-none">
                              <LegendIcon index={idx + 1} color={imgObj.settings.inkColor} renderStyle={imgObj.settings.renderStyle} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setSelectedIndex(i)}
                    className="relative shrink-0 transition-all duration-200 cursor-pointer flex items-center justify-center"
                  >
                    <canvas 
                      ref={(el) => canvasRefs.current[i] = el} 
                      className={`block relative z-10 shadow-2xl bg-white transition-all duration-200 ${activePaint?.imageIndex === i ? 'cursor-crosshair' : ''}`}
                      style={{
                        width: canvasRefs.current[i] ? `${(canvasRefs.current[i].width / (window.devicePixelRatio || 1)) * (zoom / 100)}px` : 'auto',
                        height: canvasRefs.current[i] ? `${(canvasRefs.current[i].height / (window.devicePixelRatio || 1)) * (zoom / 100)}px` : 'auto',
                      }}
                      onPointerDown={(e) => handlePointerDown(e, i)}
                      onPointerMove={(e) => handlePointerMove(e, i)}
                      onPointerUp={(e) => handlePointerUp(e, i)}
                      onPointerLeave={(e) => handlePointerUp(e, i)}
                    />
                  </div>
              </div>
            ))}
            
            {/* Floating Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200/50 px-3 py-2 flex items-center gap-2 z-50 print:hidden">
              <button 
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-xs font-mono font-bold text-neutral-700 w-12 text-center select-none">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(400, zoom + 25))}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <div className="w-px h-5 bg-neutral-300 mx-1"></div>
              <div className="flex bg-neutral-100 rounded-full p-0.5">
                <button
                  onClick={() => setLayoutMode('vertical')}
                  className={`p-1.5 rounded-full transition-colors ${layoutMode === 'vertical' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-neutral-700'}`}
                  title="List View"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-full transition-colors ${layoutMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-neutral-700'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
              <div className="w-px h-5 bg-neutral-300 mx-1"></div>
              <button 
                onClick={fitToScreen}
                className="p-2 px-3 flex items-center gap-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
                title="Fit to Screen"
              >
                <Maximize size={16} />
                <span className="text-xs font-semibold">Fit</span>
              </button>
              <div className="w-px h-5 bg-neutral-300 mx-1"></div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors text-sm font-semibold whitespace-nowrap"
                title="Add Image"
              >
                <Plus size={16} />
                Add Image
              </button>
            </div>
          </div>
        )}
        </motion.section>
        )}
        </AnimatePresence>
      </main>
      </div>
  );
}
