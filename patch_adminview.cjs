const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const formatDateRegex = /  const formatDate = \(ts: number\) => \{\n    if \(!ts\) return 'Never';\n    return new Date\(ts\)\.toLocaleString\(\);\n  \};/;

const newFormat = `  const formatDate = (ts: number) => {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleString();
  };

  const formatRelativeTime = (ts: number) => {
    if (!ts) return 'Never';
    const diff = Date.now() - ts;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return mins <= 1 ? 'Just now' : \`\${mins} mins ago\`;
      }
      return \`\${hours} hours ago\`;
    }
    if (days === 1) return 'Yesterday';
    if (days > 30) return new Date(ts).toLocaleDateString();
    return \`\${days} days ago\`;
  };`;

code = code.replace(formatDateRegex, newFormat);
code = code.replace("Last Login: {formatDate(u.lastLogin)}", "Last Login: {formatRelativeTime(u.lastLogin)}");

fs.writeFileSync('src/components/AdminView.tsx', code);
