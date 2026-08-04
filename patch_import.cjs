const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { BookFlow, CoverPage, CopyrightPage, WelcomePage, MysteryPage, TemplatePage } from './BookFlow';",
  "import { BookFlow, CoverPage, CopyrightPage, WelcomePage, MysteryPage, TemplatePage, ThankYouPage } from './BookFlow';"
);

fs.writeFileSync('src/App.tsx', code);
