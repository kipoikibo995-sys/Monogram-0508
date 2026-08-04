const fs = require('fs');
let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

code = code.replace(
  "import React, { useState, useRef, useEffect } from 'react';",
  "import React, { useState, useRef, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';"
);

fs.writeFileSync('src/BookFlow.tsx', code);
console.log("BookFlow import patched");
