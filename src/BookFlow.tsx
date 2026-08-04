import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, saveProject } from './db';
import { Image as ImageIcon, FileText, Download, Upload, Type, Grid3X3, Trash2, ArrowLeft, Lock } from 'lucide-react';

type PageType = 'cover' | 'copyright' | 'welcome' | 'warmup' | 'pentesting' | 'mystery' | 'thankyou';

interface BookFlowProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  activePage: PageType;
  onExport: () => void;
  userTier?: 'free' | 'pro' | 'enterprise';
}

export const BookFlow: React.FC<BookFlowProps> = ({ project, onUpdateProject, activePage, onExport, userTier = 'free' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const availableWidth = clientWidth - 32;
        const availableHeight = clientHeight - 32;
        const scaleX = availableWidth / 850;
        const scaleY = availableHeight / 1100;
        const newScale = Math.min(scaleX, scaleY, 1);
        setScale(Math.max(newScale, 0.1));
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    const timeout = setTimeout(updateScale, 50);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timeout);
    };
  }, [activePage]);
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
    { id: 'thankyou', title: 'Thank You Page', icon: <FileText size={18} /> },
  ];

    const renderContent = () => {
    let content = null;
    switch (activePage) {
      case 'cover':
        content = <CoverPage value={data.coverBook} onChange={(v) => handleUpdateData('coverBook', v)} />;
        break;
      case 'copyright':
        content = <CopyrightPage value={data.copyrightPage} onChange={(v) => handleUpdateData('copyrightPage', v)} />;
        break;
      case 'welcome':
        content = <WelcomePage value={data.welcomePage} onChange={(v) => handleUpdateData('welcomePage', v)} />;
        break;
      case 'mystery':
        content = <MysteryPage value={data.mystery} onChange={(v) => handleUpdateData('mystery', v)} />;
        break;
      case 'warmup':
        content = <TemplatePage title="Warm up practice" value={data.warmUpPractice} onChange={(v) => handleUpdateData('warmUpPractice', v)} type="warmup" />;
        break;
      case 'pentesting':
        content = <TemplatePage title="Pen Testing lab" value={data.penTestingLab} onChange={(v) => handleUpdateData('penTestingLab', v)} type="pentesting" />;
        break;
      case 'thankyou':
        content = <ThankYouPage value={data.thankyou} onChange={(v) => handleUpdateData('thankyou', v)} />;
        break;
      default:
        content = null;
    }

    const isLockedPage = activePage === 'warmup' || activePage === 'pentesting' || activePage === 'mystery';
    const showLock = isLockedPage && userTier === 'free';

    if (showLock) {
      return (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 z-0 opacity-40 blur-md pointer-events-none">
            {content}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-auto">
            <div className="bg-white/80 p-8 rounded-2xl shadow-2xl backdrop-blur-sm flex flex-col items-center max-w-sm text-center">
              <Lock size={64} className="text-neutral-400 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Pro Feature</h3>
              <p className="text-neutral-600 mb-6 font-medium">This page is only available in the Pro version. Upgrade to edit and export this template.</p>
              <button 
                onClick={() => alert('Upgrade to Pro to unlock this feature!')}
                className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-neutral-800 transition-colors w-full"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      );
    }

    return content;
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#e5e5e5]">
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Paper Canvas Area */}
        <div ref={containerRef} className="flex-1 overflow-hidden p-4 flex justify-center items-center bg-[#e5e5e5]">
          <div 
            className="origin-center transition-transform duration-200 flex justify-center items-center"
            style={{ transform: `scale(${scale})` }}
          >
            {/* 8.5x11 paper simulation */}
            <div className="bg-white shadow-2xl relative flex flex-col print:shadow-none print:m-0 print:p-0 shrink-0" style={{
              width: '850px',
              height: '1100px',
              padding: '40px'
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex flex-col"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- CoverPage Component ---
export const CoverPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {
  const [mode, setMode] = useState<'' | 'custom' | 'template'>(() => {
    try {
      if (value && value.startsWith('{')) {
         const parsed = JSON.parse(value);
         if (parsed.templateImage) return 'template';
         if (parsed.images && parsed.images.length > 0) return 'custom';
      } else if (value) {
         return 'custom';
      }
    } catch(e) {}
    return isExport ? 'custom' : ''; // Default to custom only if exporting
  });
  
  let parsedValue = {
    topSubtitle: 'ONE COLOR COLORING BOOK',
    subtitle2: 'Color by Number',
    mainTitle: 'MONOCHROME',
    themeTitle: 'SPOOKY MYSTERIES',
    author: 'ALAN PARKER',
    images: [] as string[],
    templateImage: ''
  };

  try {
    if (value && value.startsWith('{')) {
      const parsed = JSON.parse(value);
      parsedValue = { ...parsedValue, ...parsed };
    } else if (value) {
      parsedValue.images = [value];
    }
  } catch (e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | File[], isTemplateMode: boolean) => {
    if (isTemplateMode) {
      const file = Array.from(files).find(f => f.type.startsWith('image/'));
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('templateImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      const newImages = [...parsedValue.images];
      let added = 0;
      const remainingSlots = 4 - newImages.length;
      if (remainingSlots <= 0) return;

      const filesArray = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remainingSlots);
      if (filesArray.length === 0) return;
      
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target?.result as string);
          added++;
          if (added === filesArray.length) {
            handleChange('images', newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...parsedValue.images];
    newImages.splice(index, 1);
    handleChange('images', newImages);
  };

  if (!mode) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-white p-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-12">Choose Cover Style</h2>
        <div className="flex gap-8 w-full max-w-3xl">
           <button onClick={() => setMode('custom')} className="flex-1 p-10 border-2 border-neutral-200 rounded-3xl hover:border-neutral-900 hover:shadow-xl transition-all flex flex-col items-center text-center group cursor-pointer bg-neutral-50 hover:bg-white">
              <div className="w-20 h-20 bg-white shadow-sm border border-neutral-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-neutral-900 group-hover:text-white transition-colors text-neutral-600">
                 <ImageIcon size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Your Cover Image</h3>
              <p className="text-neutral-500 text-base leading-relaxed">Upload your own cover images directly (up to 4 images).</p>
           </button>
           <button onClick={() => setMode('template')} className="flex-1 p-10 border-2 border-neutral-200 rounded-3xl hover:border-neutral-900 hover:shadow-xl transition-all flex flex-col items-center text-center group cursor-pointer bg-neutral-50 hover:bg-white">
              <div className="w-20 h-20 bg-white shadow-sm border border-neutral-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-neutral-900 group-hover:text-white transition-colors text-neutral-600">
                 <FileText size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Demo Page Cover</h3>
              <p className="text-neutral-500 text-base leading-relaxed">Use a template where you can input text and a center graphic.</p>
           </button>
        </div>
      </div>
    );
  }

  if (mode === 'custom') {
    const imgCount = parsedValue.images.length;
    return (
      <div 
        className={`flex-1 w-full h-full flex flex-col relative group bg-white ${isDragging ? 'opacity-80' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files, false);
        }}
      >
        {!isExport && (
          <button 
             onClick={() => setMode('')}
             className="absolute top-4 left-4 z-50 px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-600 rounded-full shadow-md transition-all flex items-center gap-2 print:hidden font-medium text-sm"
             title="Change Cover Style"
          >
             <ArrowLeft size={16} /> Back
          </button>
        )}

        {imgCount > 0 ? (
          <div className="flex-1 w-full h-full relative mt-16">
            <div className={`w-full h-full grid gap-4 p-8 ${
              imgCount === 1 ? 'grid-cols-1 grid-rows-1' :
              imgCount === 2 ? 'grid-cols-1 grid-rows-2' :
              imgCount === 3 ? 'grid-cols-2 grid-rows-2' :
              'grid-cols-2 grid-rows-2'
            }`}>
              {parsedValue.images.map((src, idx) => (
                <div key={idx} className={`relative w-full h-full flex items-center justify-center bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 shadow-sm ${imgCount === 3 && idx === 0 ? 'col-span-2' : ''}`}>
                  <img src={src} alt={`Cover ${idx}`} className="w-full h-full object-cover" />
                  {!isExport && (
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {imgCount < 4 && !isExport && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity print:hidden z-50">
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-xl font-medium"
                 >
                    <Upload size={18} /> Add Image ({imgCount}/4)
                 </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 mt-16">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-full border-4 border-dashed ${isDragging ? 'border-black bg-neutral-100' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'} cursor-pointer flex flex-col items-center justify-center transition-colors rounded-2xl p-8 text-center`}
            >
              <Upload size={48} className={`${isDragging ? 'text-black' : 'text-neutral-400'} mb-4`} />
              <p className={`${isDragging ? 'text-black' : 'text-neutral-700'} font-bold text-2xl mb-2`}>
                {isDragging ? 'Drop images here' : 'Upload Custom Cover Images'}
              </p>
              <p className="text-neutral-500 text-base max-w-sm">
                Upload up to 4 images for your book cover.
              </p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files, false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between h-full bg-white relative font-sans w-full p-2 overflow-hidden">
       {!isExport && (
         <button 
             onClick={() => setMode('')}
             className="absolute top-4 left-4 z-50 px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-600 rounded-full shadow-md transition-all flex items-center gap-2 print:hidden font-medium text-sm"
             title="Change Cover Style"
          >
             <ArrowLeft size={16} /> Back
         </button>
       )}

       {/* Top Section */}
       <div className="w-full flex flex-col items-center mt-12 relative z-10 px-4">
          <input 
            value={parsedValue.topSubtitle} 
            onChange={e => handleChange('topSubtitle', e.target.value)}
            className="text-center text-[24px] tracking-[0.05em] text-neutral-800 outline-none w-full min-w-0 bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 uppercase rounded-md transition-colors"
            placeholder="Top Subtitle"
          />
          
          <div className="flex items-center justify-center w-full mt-2">
            <input 
              value={parsedValue.subtitle2} 
              onChange={e => handleChange('subtitle2', e.target.value)}
              className="text-center font-black text-[56px] text-neutral-900 outline-none w-full min-w-0 bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 tracking-tighter rounded-md transition-colors"
              placeholder="Color by Number"
            />
          </div>

          <input 
            value={parsedValue.mainTitle} 
            onChange={e => handleChange('mainTitle', e.target.value)}
            className="text-center font-black text-[96px] text-neutral-900 outline-none w-full min-w-0 bg-transparent tracking-tighter leading-[0.9] hover:bg-neutral-100 focus:bg-neutral-50 -mt-2 rounded-md transition-colors"
            placeholder="MONOCHROME"
          />
          
          <input 
            value={parsedValue.themeTitle} 
            onChange={e => handleChange('themeTitle', e.target.value)}
            className="text-center font-bold text-[48px] text-neutral-900 outline-none w-full min-w-0 bg-transparent leading-none hover:bg-neutral-100 focus:bg-neutral-50 mt-1 rounded-md transition-colors"
            placeholder="SPOOKY MYSTERIES"
          />
       </div>

       {/* Image Section */}
       <div 
          className={`flex-1 w-full flex items-center justify-center my-4 relative group z-0 min-h-[300px] ${isDragging ? 'opacity-80' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files, true);
          }}
       >
          {parsedValue.templateImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={parsedValue.templateImage} alt="Cover graphic" className="max-w-full max-h-full object-contain mix-blend-multiply" />
              <button 
                onClick={() => handleChange('templateImage', '')}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-3/4 h-full border-4 border-dashed ${isDragging ? 'border-black bg-neutral-100' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'} cursor-pointer flex flex-col items-center justify-center transition-colors rounded-2xl`}
            >
              <Upload size={48} className={`${isDragging ? 'text-black' : 'text-neutral-400'} mb-4`} />
              <p className={`${isDragging ? 'text-black' : 'text-neutral-500'} font-medium text-xl`}>
                {isDragging ? 'Drop image here' : 'Click to upload center graphic'}
              </p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files, true);
            }}
          />
       </div>

       {/* Bottom Section */}
       <div className="w-full mb-8 relative z-10 px-4">
          <input 
            value={parsedValue.author} 
            onChange={e => handleChange('author', e.target.value)}
            className="text-center text-[28px] tracking-[0.1em] text-neutral-800 outline-none w-full min-w-0 bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 uppercase rounded-md transition-colors"
            placeholder="AUTHOR NAME"
          />
       </div>
    </div>
  )
};


// --- CopyrightPage Component ---
export const CopyrightPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {
  let parsedValue = {
    title: 'COPYRIGHT PAGE',
    year: '2026',
    author: 'Alan Parker',
    rights: 'All Rights Reserved.',
    description: 'No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission from the author.',
    isbn: '9798188106522',
    imprint: 'Independently published'
  };

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      } else {
         // Migration from plain text
         parsedValue.description = value;
      }
    }
  } catch (e) {}

  const handleChange = (key: string, val: string) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center font-sans p-12">
      <div className="w-full h-full flex flex-col items-center pt-20">
        <input
          value={parsedValue.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="text-center font-bold text-[32px] text-black outline-none w-full bg-transparent uppercase hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors"
        />

        <div className="w-full max-w-3xl flex flex-col gap-8 mt-24 text-[22px] text-black">
          <div>
            <div className="flex items-center font-bold">
              <span>Copyright ©</span>
              <input
                value={parsedValue.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="w-16 ml-2 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
              />
              <input
                value={parsedValue.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="flex-1 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
              />
            </div>
            <input
              value={parsedValue.rights}
              onChange={(e) => handleChange('rights', e.target.value)}
              className="font-bold outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded mt-1 transition-colors text-black"
            />
          </div>

          <textarea 
            value={parsedValue.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="overflow-hidden w-full resize-none outline-none bg-transparent text-[22px] leading-[1.6] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
            rows={5}
          />

          <div>
            <div className="flex items-center font-bold">
              <span>ISBN:</span>
              <input
                value={parsedValue.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                className="flex-1 ml-2 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded font-normal transition-colors text-black"
              />
            </div>
            <div className="flex items-center font-bold mt-1">
              <span>Imprint:</span>
              <input
                value={parsedValue.imprint}
                onChange={(e) => handleChange('imprint', e.target.value)}
                className="flex-1 ml-2 outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded font-normal transition-colors text-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- WelcomePage Component ---
export const WelcomePage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {
  let parsedValue = {
    title: 'WELCOME TO MONOCHROME COLOR QUEST',
    intro: 'Discover the relaxing joy of revealing beautiful monochrome artwork—\none mark at a time.\nInside this book you\'ll uncover 101 hidden illustrations, including\nmajestic wildlife, adorable pets, colorful birds and more',
    howToTitle: 'HOW TO USE THIS BOOK',
    howToSteps: 'Each square contains a number.\n\nMatch the number with the symbol\nshown in the legend below the\npuzzle.\n\nUsing a black pen, fill every square\nwith the correct symbol.',
    penTitle: 'PEN RECOMMENDATIONS',
    penIntro: 'For the best results, we\nrecommend:',
    penList: ['Fine liner (0.4–0.6 mm)', 'Black gel pen', 'Black ballpoint pen'],
    penOutro: 'Avoid permanent markers or\nalcohol-based markers, as they\nmay bleed through the paper.\n\nIf you\'re using a very wet pen,\nplace a blank sheet behind the\npage to protect the next puzzle.',
    legend: [
      { num: '0', title: 'DOT', desc: 'Center Dot only', symbol: '•' },
      { num: '1', title: 'SLASH', desc: 'Single slash (/)', symbol: '/' },
      { num: '2', title: 'BACKSLASH', desc: 'Single backslash (\\)', symbol: '\\' },
      { num: '3', title: 'X', desc: 'Cross mark (X)', symbol: '✕' },
      { num: '4', title: 'ASTERISK', desc: 'Asterisk (*)', symbol: '✱' },
      { num: '5', title: 'FILLED SQUARE', desc: 'Solid black square', symbol: '■' }
    ],
    illustrationImage: ''
  };

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      } else {
        parsedValue.intro = value;
      }
    }
  } catch(e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };
  
  const handleListChange = (index: number, val: string) => {
    const newList = [...parsedValue.penList];
    newList[index] = val;
    handleChange('penList', newList);
  };
  
  const addListItem = () => {
    handleChange('penList', [...parsedValue.penList, 'New item']);
  };

  const removeListItem = (index: number) => {
    const newList = [...parsedValue.penList];
    newList.splice(index, 1);
    handleChange('penList', newList);
  };

  const handleLegendChange = (index: number, field: string, val: string) => {
    const newLegend = [...parsedValue.legend];
    newLegend[index] = { ...newLegend[index], [field]: val };
    handleChange('legend', newLegend);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('illustrationImage', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-white flex flex-col font-sans relative overflow-hidden">
      <input
        value={parsedValue.title}
        onChange={(e) => handleChange('title', e.target.value)}
        className="text-[26px] font-bold text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-3 shrink-0"
      />
      
      <textarea 
        value={parsedValue.intro}
        onChange={(e) => handleChange('intro', e.target.value)}
        className="overflow-hidden w-full resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black mb-6 shrink-0"
        rows={4}
      />
      
      <div className="flex w-full gap-8 flex-1 min-h-0">
        {/* Left Column */}
        <div className="w-[45%] flex flex-col min-h-0">
          <input
            value={parsedValue.howToTitle}
            onChange={(e) => handleChange('howToTitle', e.target.value)}
            className="text-[20px] font-bold text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-2 shrink-0"
          />
          
          <textarea 
            value={parsedValue.howToSteps}
            onChange={(e) => handleChange('howToSteps', e.target.value)}
            className="overflow-hidden w-full resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black mb-4 shrink-0"
            rows={7}
          />
          
          <input
            value={parsedValue.penTitle}
            onChange={(e) => handleChange('penTitle', e.target.value)}
            className="text-[20px] font-bold text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-1 shrink-0"
          />
          
          <textarea 
            value={parsedValue.penIntro}
            onChange={(e) => handleChange('penIntro', e.target.value)}
            className="overflow-hidden w-full resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black mb-1 shrink-0"
            rows={2}
          />
          
          <div className="flex flex-col gap-0.5 mb-2 shrink-0">
            {parsedValue.penList.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 group relative">
                <span className="text-[18px] text-slate-500 font-bold leading-none mt-1">✓</span>
                <input
                   value={item}
                   onChange={(e) => handleListChange(idx, e.target.value)}
                   className="flex-1 outline-none bg-transparent text-[18px] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
                />
                {!isExport && (
                  <button onClick={() => removeListItem(idx)} className="absolute -right-6 top-1 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {!isExport && (
              <button onClick={addListItem} className="text-neutral-600 hover:text-black text-sm text-left hover:underline print:hidden mt-0.5">
                + Add Item
              </button>
            )}
          </div>
          
          <textarea 
            value={parsedValue.penOutro}
            onChange={(e) => handleChange('penOutro', e.target.value)}
            className="overflow-hidden w-full flex-1 resize-none outline-none bg-transparent text-[18px] leading-[1.4] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black min-h-0"
          />
        </div>
        
        {/* Right Column */}
        <div className="w-[55%] flex flex-col pl-2 min-h-0">
          {/* Legend Table */}
          <div className="flex flex-col border border-neutral-100 rounded overflow-hidden mb-4 shadow-sm shrink-0">
            {parsedValue.legend.map((row, i) => (
              <div key={i} className={`flex items-center p-2 border-b border-neutral-100 last:border-b-0 ${i % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}>
                <div className="w-10 text-center font-bold text-base text-black">{row.num}</div>
                <div className="flex-1 flex flex-col justify-center px-2">
                  <input 
                    value={row.title}
                    onChange={(e) => handleLegendChange(i, 'title', e.target.value)}
                    className="font-bold text-sm tracking-widest outline-none bg-transparent hover:bg-neutral-200 focus:bg-neutral-200 rounded px-1 -ml-1 text-black"
                  />
                  <input 
                    value={row.desc}
                    onChange={(e) => handleLegendChange(i, 'desc', e.target.value)}
                    className="text-[11px] text-black outline-none bg-transparent hover:bg-neutral-200 focus:bg-neutral-200 rounded px-1 -ml-1 mt-0.5"
                  />
                </div>
                <div className="w-14 h-10 flex items-center justify-center border border-neutral-300 bg-white shadow-sm mr-1 text-lg font-bold">
                   {row.symbol === '■' ? <div className="w-5 h-5 bg-black"></div> : (
                     <input 
                       value={row.symbol}
                       onChange={(e) => handleLegendChange(i, 'symbol', e.target.value)}
                       className="w-full text-center outline-none bg-transparent"
                     />
                   )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Illustration Area */}
          <div className="flex-1 flex items-end justify-center w-full min-h-0 relative group">
             {parsedValue.illustrationImage ? (
               <div className="relative w-full h-full flex items-center justify-center p-2">
                 <img src={parsedValue.illustrationImage} alt="Illustration" className="max-w-[90%] max-h-full object-contain mix-blend-multiply" />
                 {!isExport && (
                   <button 
                       onClick={() => handleChange('illustrationImage', '')}
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 print:hidden"
                   >
                      <Trash2 size={20} />
                   </button>
                 )}
               </div>
             ) : (
               !isExport ? (
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer flex flex-col items-center justify-center transition-colors rounded-xl print:hidden text-neutral-400"
                 >
                    <Upload size={32} className="mb-2" />
                    <p className="text-sm font-medium text-center">Click to upload illustration<br/>(Book/Pen graphic)</p>
                 </div>
               ) : null
             )}
             <input 
                type="file" 
                ref={fileInputRef}
               className="hidden" 
                accept="image/*"
               onChange={handleImageUpload}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MysteryPage Component ---
export const MysteryPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {
  let parsedValue = {
    title: 'Mystery #01',
    marks: [
      { mark: '•', code: '.', name: 'Dot', density: '75.4%' },
      { mark: '/', code: '1', name: 'Slash', density: '6.7%' },
      { mark: '\\', code: '2', name: 'Backslash', density: '2.3%' },
      { mark: '✕', code: '3', name: 'Cross', density: '1.3%' },
      { mark: '✱', code: '4', name: 'Asterisk', density: '8.5%' },
      { mark: '■', code: '5', name: 'Filled Square', density: '5.9%' }
    ]
  };

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      }
    }
  } catch(e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  const handleMarkChange = (index: number, field: string, val: string) => {
    const newMarks = [...parsedValue.marks];
    newMarks[index] = { ...newMarks[index], [field]: val };
    handleChange('marks', newMarks);
  };

  return (
    <div className="flex-1 w-full h-full bg-white flex flex-col items-center justify-center font-sans p-10 relative">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <input
          value={parsedValue.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="text-[48px] font-bold italic text-black outline-none w-full text-center bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors mb-16"
        />
        
        <div className="w-full flex flex-col">
          <div className="flex w-full items-center mb-4 font-bold text-black border-b border-neutral-100 pb-2">
            <div className="w-24 text-center">Mark</div>
            <div className="w-24 text-center">Code</div>
            <div className="flex-1">Name</div>
            <div className="w-32 text-right">Density %</div>
          </div>
          
          <div className="flex flex-col">
            {parsedValue.marks.map((row, i) => (
              <div key={i} className="flex w-full items-center py-3 border-b border-neutral-100 last:border-b-0">
                <div className="w-24 flex justify-center">
                  <div className="w-12 h-12 border border-black flex items-center justify-center text-3xl font-bold bg-white">
                    {row.mark === '■' ? <div className="w-6 h-6 bg-black"></div> : (
                      <input 
                        value={row.mark}
                        onChange={(e) => handleMarkChange(i, 'mark', e.target.value)}
                        className="w-full text-center outline-none bg-transparent"
                      />
                    )}
                  </div>
                </div>
                
                <div className="w-24 flex justify-center">
                  <input
                    value={row.code}
                    onChange={(e) => handleMarkChange(i, 'code', e.target.value)}
                    className="font-bold text-center text-[18px] text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded"
                  />
                </div>
                
                <div className="flex-1">
                  <input
                    value={row.name}
                    onChange={(e) => handleMarkChange(i, 'name', e.target.value)}
                    className="font-bold text-[18px] text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded"
                  />
                </div>
                
                <div className="w-32 flex justify-end">
                  <input
                    value={row.density}
                    onChange={(e) => handleMarkChange(i, 'density', e.target.value)}
                    className="font-bold text-[18px] text-black outline-none w-full text-right bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
        className="overflow-hidden flex-1 w-full resize-none outline-none text-neutral-800 text-base leading-relaxed bg-transparent"
        style={{ fontFamily: 'Georgia, serif' }}
      />
    </div>
  );
};

// --- TemplatePage Component ---
export const TemplatePage = ({ title, value, onChange, type, isExport }: { title: string; value?: string; onChange: (v: string) => void; type: 'warmup' | 'pentesting'; isExport?: boolean }) => {
  let parsedValue: any = {};
  if (type === 'warmup') {
    parsedValue = {
      title: 'WARM UP PRACTICE',
      subtitle: 'Hone your pen strokes by practicing each code in the cells below\nbefore starting the puzzle.',
      levels: [
        { label: 'LEVEL 0: DOT', desc: 'Practice drawing "Center Dot only" in these cells:', hint: '•' },
        { label: 'LEVEL 1: SLASH', desc: 'Practice drawing "Single slash (/)" in these cells:', hint: '1' },
        { label: 'LEVEL 2: BACKSLASH', desc: 'Practice drawing "Single backslash (\\)" in these cells:', hint: '2' },
        { label: 'LEVEL 3: X', desc: 'Practice drawing "Cross mark (X)" in these cells:', hint: '3' },
        { label: 'LEVEL 4: ASTERISK', desc: 'Practice drawing "Asterisk(*)" in these cells:', hint: '4' },
        { label: 'LEVEL 5: FILLED SQUARE', desc: 'Practice drawing "Solid black square" in these cells:', hint: '5' }
      ]
    };
  } else {
    parsedValue = { 
      title: 'PEN TESTING LAB',
      subtitle: 'Try out your fine-liners, black gel, or black ballpoint pen below.\nCompare ink bleed-through and opacity.',
      pens: ['PEN #1:', 'PEN #2:', 'PEN #3:', 'PEN #4:'],
      gridsTitle: 'MINI PRACTICE GRIDS'
    };
  }

  try {
    if (value) {
      if (value.startsWith('{')) {
        parsedValue = { ...parsedValue, ...JSON.parse(value) };
      }
    }
  } catch (e) {}

  const handleChange = (key: string, val: any) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  const handleLevelChange = (index: number, field: string, val: string) => {
    if (!parsedValue.levels) return;
    const newLevels = [...parsedValue.levels];
    newLevels[index] = { ...newLevels[index], [field]: val };
    handleChange('levels', newLevels);
  };
  
  const handlePenChange = (index: number, val: string) => {
    if (!parsedValue.pens) return;
    const newPens = [...parsedValue.pens];
    newPens[index] = val;
    handleChange('pens', newPens);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col font-sans p-10 bg-white relative">
      {type === 'warmup' && (
        <div className="flex flex-col flex-1">
          <input
            value={parsedValue.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="text-[32px] font-bold text-center text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-4"
          />
          
          <textarea 
            value={parsedValue.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="overflow-hidden w-full resize-none text-center outline-none bg-transparent text-[20px] leading-[1.5] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black"
            rows={2}
          />
          
          <div className="w-full h-[1px] bg-neutral-300 my-6"></div>
          
          <div className="flex flex-col flex-1 gap-6">
            {parsedValue.levels?.map((lvl: any, i: number) => (
              <div key={i} className="flex flex-col">
                <input
                  value={lvl.label}
                  onChange={(e) => handleLevelChange(i, 'label', e.target.value)}
                  className="font-bold text-[16px] uppercase text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors mb-0.5"
                />
                <input
                  value={lvl.desc}
                  onChange={(e) => handleLevelChange(i, 'desc', e.target.value)}
                  className="text-[15px] text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors mb-3"
                />
                <div className="flex gap-4">
                  {Array.from({ length: 10 }).map((_, col) => (
                    <div key={col} className="w-12 h-12 border border-neutral-400 flex items-center justify-center text-neutral-300 text-xl">
                      {lvl.hint}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'pentesting' && (
        <div className="flex flex-col flex-1">
          <input
            value={parsedValue.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="text-[36px] font-bold text-center text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-6"
          />
          
          <textarea 
            value={parsedValue.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="overflow-hidden w-full resize-none outline-none bg-transparent text-[20px] leading-[1.5] hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors text-black mb-12"
            rows={2}
          />
          
          <div className="flex flex-col gap-12 mb-16 pl-4">
            {parsedValue.pens?.map((pen: string, i: number) => (
              <div key={i} className="flex items-end gap-2 max-w-2xl">
                <input
                  value={pen}
                  onChange={(e) => handlePenChange(i, e.target.value)}
                  className="font-bold text-[22px] text-black outline-none bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors w-32"
                />
                <div className="flex-1 border-b border-black"></div>
              </div>
            ))}
          </div>
          
          <input
            value={parsedValue.gridsTitle}
            onChange={(e) => handleChange('gridsTitle', e.target.value)}
            className="text-[24px] font-bold text-black outline-none w-full bg-transparent hover:bg-neutral-100 focus:bg-neutral-50 rounded transition-colors uppercase mb-8"
          />
          
          <div className="flex justify-between items-start w-full gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-[18%]">
                <div className="font-bold text-sm text-neutral-500">GRID #{i + 1}</div>
                <div className="grid grid-cols-5 border-l border-t border-neutral-400 w-full aspect-square">
                  {Array.from({ length: 25 }).map((_, cellIdx) => {
                    const symbols = ['•', '1', '2', '3', '4', '5'];
                    // Deterministic random-like selection for visual variety
                    const symbol = symbols[(i * 25 + cellIdx) % symbols.length];
                    return (
                      <div key={cellIdx} className="border-r border-b border-neutral-400 flex items-center justify-center text-neutral-300 text-[10px] sm:text-[12px]">
                        {symbol}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- ThankYouPage Component ---
export const ThankYouPage = ({ value, onChange, isExport }: { value?: string; onChange: (v: string) => void; isExport?: boolean }) => {
  let parsedValue = {
    title: 'Thank You for Coloring With Us',
    heading1: 'You Revealed the Mystery — Well Done!',
    body1: 'You made it through every hidden creature, every shadowy secret, every spooky surprise.\nThat takes patience, focus, and a seriously steady hand.',
    heading2: 'Did something make you smile? Surprise you? Creep you out (in the best way)?',
    body2: 'An honest review on Amazon, even just one sentence — helps other puzzle lovers find this book and keeps this series growing.\nSearch "101 Spooky Monochrome Color By Number Mysteries Alan Parker" on Amazon to leave your review.\nIt takes 60 seconds and means everything to an independent creator. Thank you.',
    heading3: 'Love One-Pen Puzzles? Explore the Full Series:',
    body3: 'Search "Monochrome Color by Number Alan Parker" on Amazon to find all volumes.',
  };
  try {
    if (value) {
      parsedValue = { ...parsedValue, ...JSON.parse(value) };
    }
  } catch (e) {}

  const handleChange = (key: string, val: string) => {
    onChange(JSON.stringify({ ...parsedValue, [key]: val }));
  };

  return (
    <div className={isExport ? "w-full h-full flex flex-col bg-white overflow-hidden p-16 pt-[70px]" : "w-full h-full bg-white flex flex-col p-16 pt-[70px] shrink-0"}>
        <textarea 
           value={parsedValue.title}
           onChange={(e) => handleChange('title', e.target.value)}
           className="overflow-hidden w-full text-center text-3xl font-bold text-black outline-none bg-transparent resize-none leading-normal font-sans mb-12"
           rows={2}
        />

        <div className="flex flex-col gap-8 max-w-[80%] mx-auto w-full font-sans text-black">
           <div>
             <textarea 
                value={parsedValue.heading1}
                onChange={(e) => handleChange('heading1', e.target.value)}
                className="overflow-hidden w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal"
                rows={2}
             />
             <textarea 
                value={parsedValue.body1}
                onChange={(e) => handleChange('body1', e.target.value)}
                className="overflow-hidden w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1"
                rows={3}
             />
           </div>

           <div>
             <textarea 
                value={parsedValue.heading2}
                onChange={(e) => handleChange('heading2', e.target.value)}
                className="overflow-hidden w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal"
                rows={2}
             />
             <textarea 
                value={parsedValue.body2}
                onChange={(e) => handleChange('body2', e.target.value)}
                className="overflow-hidden w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1"
                rows={5}
             />
           </div>

           <div>
             <textarea 
                value={parsedValue.heading3}
                onChange={(e) => handleChange('heading3', e.target.value)}
                className="overflow-hidden w-full text-lg font-bold italic outline-none bg-transparent resize-none leading-normal"
                rows={2}
             />
             <textarea 
                value={parsedValue.body3}
                onChange={(e) => handleChange('body3', e.target.value)}
                className="overflow-hidden w-full text-base outline-none bg-transparent resize-none leading-relaxed mt-1"
                rows={3}
             />
           </div>
        </div>
    </div>
  );
};

