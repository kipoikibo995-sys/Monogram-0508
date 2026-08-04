const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

const replace = `import React from 'react';
import { Project } from './db';
import { Image as ImageIcon, FileText, Download } from 'lucide-react';

type PageType = 'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery';

interface BookFlowProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  activePage: PageType;
}

export const BookFlow: React.FC<BookFlowProps> = ({ project, onUpdateProject, activePage }) => {

  const pages = [
    { id: 'cover', title: 'Cover Book', icon: <ImageIcon size={18} /> },
    { id: 'copyright', title: 'Copyright Page', icon: <FileText size={18} /> },
    { id: 'welcome', title: 'Welcome Page', icon: <FileText size={18} /> },
    { id: 'warmup', title: 'Warm up practice', icon: <FileText size={18} /> },
    { id: 'pentesting', title: 'Pen Testing lab', icon: <FileText size={18} /> },
    { id: 'mystery', title: 'Mystery Instructions', icon: <FileText size={18} /> },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-[#e5e5e5]">
      {/* Main Live View */}
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
          <div className="bg-white shadow-2xl transition-all relative flex flex-col" style={{
            width: '850px',
            minHeight: '1100px',
            padding: '40px'
          }}>
            <div className="flex-1 border border-dashed border-neutral-300 rounded-sm p-8 flex flex-col relative group">
              <h1 className="text-3xl font-bold text-neutral-300 text-center mt-20">
                {pages.find(p => p.id === activePage)?.title} Content
              </h1>
              <p className="text-center text-neutral-400 mt-4">
                Drag and drop components here, or click to edit text directly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
`;

fs.writeFileSync('src/BookFlow.tsx', replace);
