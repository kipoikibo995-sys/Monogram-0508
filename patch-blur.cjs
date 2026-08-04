const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setIsSpaceDown(false);\n        isPanningRef.current = false;\n      }\n    };\n    window.addEventListener('keydown', handleKeyDown);",
  "setIsSpaceDown(false);\n        isPanningRef.current = false;\n      }\n    };\n    const handleBlur = () => {\n      setIsSpaceDown(false);\n      isPanningRef.current = false;\n    };\n    window.addEventListener('keydown', handleKeyDown);\n    window.addEventListener('blur', handleBlur);"
);

code = code.replace(
  "window.removeEventListener('keydown', handleKeyDown);\n      window.removeEventListener('keyup', handleKeyUp);\n    };\n  }, []);",
  "window.removeEventListener('keydown', handleKeyDown);\n      window.removeEventListener('keyup', handleKeyUp);\n      window.removeEventListener('blur', handleBlur);\n    };\n  }, []);"
);

fs.writeFileSync('src/App.tsx', code);
