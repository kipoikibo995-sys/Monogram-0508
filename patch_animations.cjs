const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

if (!appCode.includes('from "framer-motion"') && !appCode.includes('from "motion/react"')) {
  appCode = appCode.replace(
    "import React, { useState, useRef, useEffect, ChangeEvent } from 'react';",
    "import React, { useState, useRef, useEffect, ChangeEvent } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';"
  );
}

// Replace the view rendering logic with AnimatePresence
appCode = appCode.replace(
  `        {view === 'dashboard' ? (`,
  `        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden"
            >`
);

appCode = appCode.replace(
  `        ) : view === 'bookflow' && currentProject ? (
          <BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} onExport={handleBulkExportPDF} />
        ) : (
        <section `,
  `            </motion.div>
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
              <BookFlow project={currentProject} onUpdateProject={(p) => { setCurrentProject(p); setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)); }} activePage={activeBookFlowPage} onExport={handleBulkExportPDF} />
            </motion.div>
          )}
          {view === 'editor' && (
            <motion.section
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}`
);

appCode = appCode.replace(
  `          {renderSidebar()}
        </section>
      )}`,
  `          {renderSidebar()}
            </motion.section>
          )}
        </AnimatePresence>`
);

appCode = appCode.replace(
  `          {renderSidebar()}
        </section>
      )}
      
      {/* Hidden export pages container */}`,
  `          {renderSidebar()}
            </motion.section>
          )}
        </AnimatePresence>
      
      {/* Hidden export pages container */}`
);


fs.writeFileSync('src/App.tsx', appCode);
console.log("App.tsx updated");
