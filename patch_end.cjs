const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  `        )}
        </section>
        )}
      </main>`,
  `        )}
        </motion.section>
        )}
        </AnimatePresence>
      </main>`
);

fs.writeFileSync('src/App.tsx', appCode);
console.log("App.tsx updated");
