import { get, set, del, keys } from 'idb-keyval';
import { doc, getDocs, setDoc, deleteDoc, collection, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';

export interface BookFlowData {
  coverBook?: string; // image data URL or text
  copyrightPage?: string;
  welcomePage?: string;
  warmUpPractice?: string;
  penTestingLab?: string;
  mystery?: string;
  thankyou?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  imageCount: number;
  bookFlowData?: BookFlowData;
  userId?: string;
}

export const saveProject = async (project: Project, imagesData?: any[]) => {
  // Add current user ID if available
  const currentUser = auth.currentUser;
  if (currentUser) {
    project.userId = currentUser.uid;
  }

  // Save to local indexedDB first
  await set(`proj_${project.id}`, project);
  if (imagesData) {
    await set(`proj_data_${project.id}`, imagesData);
  }
  
  if (!currentUser) {
    return;
  }
  
  // Create a copy for Firebase and strip out extremely large base64 strings to avoid 1MB limit
  const firebaseProject = JSON.parse(JSON.stringify(project));
  if (firebaseProject.bookFlowData) {
    for (const key of Object.keys(firebaseProject.bookFlowData)) {
      const val = firebaseProject.bookFlowData[key as keyof BookFlowData];
      if (typeof val === 'string' && val.startsWith('{')) {
        try {
          const parsed = JSON.parse(val);
          let modified = false;
          const MAX_LEN = 300000; // ~300KB
          
          if (parsed.images && Array.isArray(parsed.images)) {
            parsed.images = parsed.images.map((img: string) => {
              if (img && img.length > MAX_LEN) { modified = true; return ''; }
              return img;
            });
          }
          if (parsed.templateImage && parsed.templateImage.length > MAX_LEN) {
            parsed.templateImage = '';
            modified = true;
          }
          if (parsed.illustrationImage && parsed.illustrationImage.length > MAX_LEN) {
            parsed.illustrationImage = '';
            modified = true;
          }
          
          if (modified) {
            firebaseProject.bookFlowData[key as keyof BookFlowData] = JSON.stringify(parsed);
          }
        } catch (e) {}
      }
    }
  }

  // Sync to Firestore (non-blocking)
  setDoc(doc(db, 'projects', firebaseProject.id), firebaseProject).catch(err => {
    console.error("Firebase sync error:", err);
  });
};

export const getProjectImages = async (id: string) => {
  return await get(`proj_data_${id}`);
};

export const listProjects = async (): Promise<Project[]> => {
  try {
    const colRef = collection(db, 'projects');
    const currentUser = auth.currentUser;
    
    // If not authenticated, we only fetch local projects
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const q = query(colRef, where('userId', '==', currentUser.uid));
    
    // Use Promise.race to timeout getDocs if offline or rules are hanging
    const snap = await Promise.race([
      getDocs(q),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
    ]);
    
    const projects = snap.docs.map(d => d.data() as Project);
    
    // Also save fetched projects to local idb for offline access
    for (let i = 0; i < projects.length; i++) {
      let p = projects[i];
      const localP = await get(`proj_${p.id}`) as Project;
      // If local data exists and is not older than the remote data, keep local.
      // This prevents overwriting large un-stripped images with stripped Firebase versions
      if (localP && localP.updatedAt >= p.updatedAt) {
        projects[i] = localP;
      } else {
        await set(`proj_${p.id}`, p);
      }
    }
    
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (err: any) {
    if (err.message !== 'Timeout' && err.message !== 'Not authenticated') {
      console.warn("Firebase load error, falling back to local:", err);
    }
    const allKeys = await keys();
    const projKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('proj_') && !k.startsWith('proj_data_'));
    const projects: Project[] = [];
    for (const k of projKeys) {
      const p = await get(k);
      if (p) projects.push(p as Project);
    }
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
  }
};

export const deleteProject = async (id: string) => {
  await del(`proj_${id}`);
  await del(`proj_data_${id}`);
  
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  
  // Sync to Firestore (non-blocking)
  deleteDoc(doc(db, 'projects', id)).catch(err => {
    console.error("Firebase delete error:", err);
  });
};
