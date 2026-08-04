const fs = require('fs');

const code = `import React, { useState, useRef } from 'react';
import { Project, saveProject } from './db';
import { Image as ImageIcon, FileText, Download, Upload, Type, Grid3X3, Trash2 } from 'lucide-react';

type PageType = 'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery';

interface BookFlowProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  activePage: PageType;
}

export const BookFlow: React.FC<BookFlowProps> = ({ project, onUpdateProject, activePage }) => {
  const data = project.bookFlowData || {};

  const handleUpdateData = async (key: keyof typeof data, value: string) => {
    const updatedData = { ...data, [key]: value };
    const updatedProject = { ...project, bookFlowData: updatedData, updatedAt: Date.now() };
    await saveProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  const pages = [
    { id: 'cover', title: 'Cover Book', icon: <ImageIcon size={18} /> },
    { id: 'copyright', title: 'Copyright Page', icon: <FileText size={18} /> },
    { id: 'welcome', title: 'Welcome Page', icon: <FileText size={18} /> },
    { id: 'warmup', title: 'Warm up practice', icon: <Grid3X3 size={18} /> },
    { id: 'pentesting', title: 'Pen Testing lab', icon: <Grid3X3 size={18} /> },
    { id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={18} /> },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'cover':
        return <CoverPage value={data.coverBook} onChange={(v) => handleUpdateData('coverBook', v)} />;
      case 'copyright':
        return <TextPage value={data.copyrightPage} onChange={(v) => handleUpdateData('copyrightPage', v)} placeholder="Type copyright information here..." />;
      case 'welcome':
        return <TextPage value={data.welcomePage} onChange={(v) => handleUpdateData('welcomePage', v)} placeholder="Welcome, How to use this book, Pen recommendations..." />;
      case 'mystery':
        return <TextPage value={data.mystery} onChange={(v) => handleUpdateData('mystery', v)} placeholder="Instructions for marks, pattern mode, and pixel mode..." />;
      case 'warmup':
        return <TemplatePage title="Warm up practice" value={data.warmUpPractice} onChange={(v) => handleUpdateData('warmUpPractice', v)} type="warmup" />;
      case 'pentesting':
        return <TemplatePage title="Pen Testing lab" value={data.penTestingLab} onChange={(v) => handleUpdateData('penTestingLab', v)} type="pentesting" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#e5e5e5]">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <h3 className="font-bold text-neutral-800">{pages.find(p => p.id === activePage)?.title}</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        
        {/* Paper Canvas Area */}
        <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
          {/* 8.5x11 paper simulation */}
          <div className="bg-white shadow-lg transition-all relative flex flex-col print:shadow-none print:m-0 print:p-0" style={{
            width: '850px',
            minHeight: '1100px',
            padding: '40px'
          }}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- CoverPage Component ---
const CoverPage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
      className={\`flex-1 flex flex-col relative group \${!value ? 'border-2 border-dashed rounded-lg p-8' : ''} \${isDragging ? 'border-purple-500 bg-purple-50' : 'border-neutral-300'}\`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      {value ? (
        <div className="relative w-full h-full flex flex-col">
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <button 
            onClick={() => onChange('')}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
            title="Remove Image"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-6">
            <Upload size={32} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Upload Cover Image</h2>
          <p className="text-sm text-neutral-500 mb-8 max-w-sm">
            Drag and drop your book cover design here, or click to browse. Recommended size: 8.5x11 inches.
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors"
          >
            <ImageIcon size={18} />
            Browse Files
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}
    </div>
  );
};

// --- TextPage Component ---
const TextPage = ({ value, onChange, placeholder }: { value?: string; onChange: (v: string) => void; placeholder: string }) => {
  return (
    <div className="flex-1 flex flex-col">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 w-full resize-none outline-none text-neutral-800 text-base leading-relaxed bg-transparent"
        style={{ fontFamily: 'Georgia, serif' }}
      />
    </div>
  );
};

// --- TemplatePage Component ---
const TemplatePage = ({ title, value, onChange, type }: { title: string; value?: string; onChange: (v: string) => void; type: 'warmup' | 'pentesting' }) => {
  // We can interpret 'value' as simple JSON config if we want to customize it later.
  // For now, we'll just render a static grid/template based on the type.
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-4xl font-bold text-center mb-12 text-neutral-900" style={{ fontFamily: 'Georgia, serif' }}>{title}</h1>
      
      {type === 'warmup' && (
        <div className="flex flex-col gap-12 flex-1">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-700">1. Straight Lines</h3>
            <div className="w-full h-32 border-2 border-neutral-300 rounded-lg flex flex-col justify-between p-4 bg-neutral-50/50">
              <div className="w-full border-t-2 border-dashed border-neutral-300"></div>
              <div className="w-full border-t-2 border-dashed border-neutral-300"></div>
              <div className="w-full border-t-2 border-dashed border-neutral-300"></div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-700">2. Curves & Swirls</h3>
            <div className="w-full h-32 border-2 border-neutral-300 rounded-lg flex items-center justify-around p-4 bg-neutral-50/50 overflow-hidden">
               {/* Just decorative placeholders */}
               <div className="w-16 h-16 border-4 border-dashed border-neutral-300 rounded-full"></div>
               <div className="w-20 h-20 border-4 border-dashed border-neutral-300 rounded-full"></div>
               <div className="w-16 h-16 border-4 border-dashed border-neutral-300 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <h3 className="text-lg font-bold text-neutral-700">3. Pressure Control</h3>
            <div className="w-full h-full min-h-[128px] border-2 border-neutral-300 rounded-lg bg-neutral-50/50 p-4 flex flex-col gap-4">
               <div className="flex-1 bg-gradient-to-r from-neutral-200 to-neutral-500 opacity-20 rounded"></div>
            </div>
          </div>
        </div>
      )}

      {type === 'pentesting' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-2 border-neutral-300 rounded-lg flex flex-col h-32 bg-neutral-50/50">
              <div className="border-b-2 border-neutral-300 p-2 text-center text-xs font-semibold text-neutral-500 uppercase tracking-widest bg-neutral-100/50 rounded-t-lg">
                Pen #{i + 1}
              </div>
              <div className="flex-1 p-2">
                {/* Empty area for swatching */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
`
fs.writeFileSync('src/BookFlow.tsx', code);
