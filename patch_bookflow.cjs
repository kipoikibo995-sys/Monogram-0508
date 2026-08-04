const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

if (!code.includes('from "framer-motion"') && !code.includes('from "motion/react"')) {
  code = code.replace(
    "import React, { useState, useEffect, useRef } from 'react';",
    "import React, { useState, useEffect, useRef } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';"
  );
}

code = code.replace(
  `            }}>
              {renderContent()}
            </div>`,
  `            }}>
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
            </div>`
);

fs.writeFileSync('src/BookFlow.tsx', code);
console.log("BookFlow patched");
