const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `  const [isDragging, setIsDragging] = useState(false);`;

const statesAndRefs = `  const [isDragging, setIsDragging] = useState(false);
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
`;

code = code.replace(anchor, statesAndRefs);

const sectionOld = `        <section 
          className="flex-1 bg-[#e5e5e5] overflow-auto relative shadow-inner"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files) as File[];
            const validFiles = files.filter(f => f.type.startsWith('image/'));
            if (validFiles.length > 0) processFiles(validFiles);
          }}
        >`;

const sectionNew = `        <section 
          ref={scrollContainerRef}
          className={\`flex-1 bg-[#e5e5e5] overflow-auto relative shadow-inner \${isSpaceDown ? (isPanningRef.current ? 'cursor-grabbing' : 'cursor-grab') : ''}\`}
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
        >`;

code = code.replace(sectionOld, sectionNew);

fs.writeFileSync('src/App.tsx', code);
