const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `import { Image as ImageIcon, Brush, Eraser, Undo, Trash2, Upload, Download, Settings2, Sparkles, Grid3X3, LayoutGrid, List, Printer, BookOpen, BarChart2, Wand2, ChevronDown, ChevronLeft, ChevronRight, Layers, ZoomIn, ZoomOut, Maximize, Plus } from 'lucide-react';

type ImageSettings = {
  gridCols: number;
  cellSize: number;
  brightness: number;
  contrast: number;
  gamma: number;
  inkColor: string;
  inkThickness: number;
  showBgGrid: boolean;
  showCoordinates: boolean;
  viewMode: 'workbook' | 'solution';
  renderStyle: 'shapes' | 'pixels';
  pixelShape: 'square' | 'circle' | 'triangle' | 'hexagon' | 'diamond';
  useDithering: boolean;
  useSmoothing: boolean;
  pageMargin: number;
  trimSize: "8.5x11" | "6x9" | "8.5x8.5";
  gutterMargin: number;
  densityCodes: string[];
  overrides?: Record<string, number>;
  overridesHistory?: Record<string, number>[];
};`;

const replacement1 = `import { Image as ImageIcon, Brush, Eraser, Undo, Trash2, Upload, Download, Settings2, Sparkles, Grid3X3, LayoutGrid, List, Printer, BookOpen, BarChart2, Wand2, ChevronDown, ChevronLeft, ChevronRight, Layers, ZoomIn, ZoomOut, Maximize, Plus, FolderOpen } from 'lucide-react';
import { ImageSettings } from './types';
import { saveProject, listProjects, deleteProject as dbDeleteProject, Project } from './db';
import { v4 as uuidv4 } from 'uuid';
`;

code = code.replace(target1, replacement1);
fs.writeFileSync('src/App.tsx', code);
console.log('Patched imports');
