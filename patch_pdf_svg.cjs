const fs = require('fs');

let content = fs.readFileSync('src/PdfExport.tsx', 'utf8');

const target = `        return (
          <Page key={i} size={[pageW, pageH]} style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: finalW, height: finalH }}>
              <Svg width={finalW} height={finalH} viewBox={\`0 0 \${contentW} \${contentH}\`}>`;

const replace1 = `        return (
          <Page key={i} size={[pageW, pageH]} style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: finalW, height: finalH }}>
              {(isExportingSolutions ? img.solutionDataUrl : img.workbookDataUrl) ? (
                <PdfImage src={(isExportingSolutions ? img.solutionDataUrl : img.workbookDataUrl)!} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
              <Svg width={finalW} height={finalH} viewBox={\`0 0 \${contentW} \${contentH}\`}>`;

const replace2 = `        return (
          <Page key={i} size={[pageW, pageH]} style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: finalW, height: finalH }}>
              {img.solutionDataUrl ? (
                <PdfImage src={img.solutionDataUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
              <Svg width={finalW} height={finalH} viewBox={\`0 0 \${contentW} \${contentH}\`}>`;

const firstIndex = content.indexOf(target);
const secondIndex = content.indexOf(target, firstIndex + 1);

let newContent = content.substring(0, firstIndex) + replace1 + content.substring(firstIndex + target.length, secondIndex) + replace2 + content.substring(secondIndex + target.length);

fs.writeFileSync('src/PdfExport.tsx', newContent);
