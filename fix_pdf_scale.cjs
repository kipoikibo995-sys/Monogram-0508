const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace styles object with a dynamic function
code = code.replace(/const styles = StyleSheet\.create\(\{([\s\S]*?)\}\);/, `const getStyles = (sf: number) => StyleSheet.create({$1});`);

// In PdfDocument, initialize styles
code = code.replace(/const PAGE_SIZE = trimSize === '8\.5x11' \? \[612, 792\] : trimSize === '6x9' \? \[432, 648\] : \[612, 612\];/, 
  `const PAGE_SIZE = trimSize === '8.5x11' ? [612, 792] : trimSize === '6x9' ? [432, 648] : [612, 612];
  const sf = PAGE_SIZE[0] / 612;
  const styles = getStyles(sf);
`);

// Now modify all font sizes and spacings in the styles string to use sf
code = code.replace(/fontSize: (\d+)/g, 'fontSize: $1 * sf');
code = code.replace(/marginBottom: (\d+)/g, 'marginBottom: $1 * sf');
code = code.replace(/marginTop: (\d+)/g, 'marginTop: $1 * sf');
code = code.replace(/padding: (\d+)/g, 'padding: $1 * sf');
code = code.replace(/paddingTop: (\d+)/g, 'paddingTop: $1 * sf');
code = code.replace(/paddingVertical: (\d+)/g, 'paddingVertical: $1 * sf');
code = code.replace(/lineHeight: ([\d\.]+)/g, 'lineHeight: $1'); // no need to scale line-height ratio

// Wait, the regex for fontSize etc. might replace occurrences inside PdfDocument's inline styles!
// But inline styles won't be using sf if we just replace the ones that are raw numbers. 
// Let's see inline styles in PdfDocument.
fs.writeFileSync('src/PdfExport.tsx', code);
