const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const utils = `
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
`;

content = content.replace('const openProject = async (p: Project) => {', utils + '\n  const openProject = async (p: Project) => {');

const newOpenProject = `
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
`;

content = content.replace(/const openProject = async \(p: Project\) => \{[\s\S]*?setView\('editor'\);\n  \};/, newOpenProject);

const newSaveBtn = `
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
`;

content = content.replace(/onClick=\{async \(\) => \{[\s\S]*?setSaveStatus\('saved'\);\n                  setTimeout\(\(\) => setSaveStatus\('idle'\), 2000\);\n                \}\}/, newSaveBtn);

fs.writeFileSync('src/App.tsx', content);
