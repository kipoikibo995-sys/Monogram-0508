const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

code = code.replace(
  /default:\n\s*return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';/,
  `default:
        console.error("Auth Error:", err);
        return err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';`
);

fs.writeFileSync('src/components/AuthPage.tsx', code);
console.log("Patched default err");
