const fs = require('fs');

let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace the Warmup Page section
code = code.replace(
  /<Page size=\{PAGE_SIZE as any\} style=\{styles\.paddedPage\}>\s*<Text style=\{styles\.h1\}>\{warmup\.title\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{warmup\.subtitle\}<\/Text>\s*<View style=\{\{ marginTop: 50, alignItems: 'center' \}\}>\s*<Svg width="400" height="100">\s*<Rect x="0" y="0" width="100" height="100" fill="none" stroke="black" \/>\s*<Rect x="150" y="0" width="100" height="100" fill="none" stroke="black" \/>\s*<Rect x="300" y="0" width="100" height="100" fill="none" stroke="black" \/>\s*<\/Svg>\s*<\/View>\s*<\/Page>/g,
  `          <Page size={PAGE_SIZE as any} style={styles.paddedPage}>
            <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, textTransform: 'uppercase' }}>{warmup.title}</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30, lineHeight: 1.5 }}>{warmup.subtitle}</Text>
            
            <View style={{ width: '100%', height: 1, backgroundColor: '#E5E5E5', marginBottom: 30 }}></View>

            <View style={{ flex: 1, flexDirection: 'column', gap: 20 }}>
              {warmup.levels?.map((lvl: any, i: number) => (
                <View key={i} style={{ flexDirection: 'column', marginBottom: 20 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 5 }}>{lvl.label}</Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Helvetica', marginBottom: 15 }}>{lvl.desc}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {Array.from({ length: 10 }).map((_, col) => (
                      <View key={col} style={{ width: 40, height: 40, border: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                         <Text style={{ fontSize: 16, color: '#CCC', fontFamily: 'Helvetica' }}>{lvl.hint}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Page>`
);

// Replace the Pentesting Page section
code = code.replace(
  /<Page size=\{PAGE_SIZE as any\} style=\{styles\.paddedPage\}>\s*<Text style=\{styles\.h1\}>\{pentesting\.title\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{pentesting\.subtitle\}<\/Text>\s*\{pentesting\.pens\.map\(\(pen: string, i: number\) => \(\s*<Text key=\{i\} style=\{\{ fontSize: 16, marginBottom: 20 \}\}>\{pen \|\| '____________________'\}<\/Text>\s*\)\)\}\s*<\/Page>/g,
  `          <Page size={PAGE_SIZE as any} style={styles.paddedPage}>
            <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, textTransform: 'uppercase' }}>{pentesting.title}</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 40, lineHeight: 1.5 }}>{pentesting.subtitle}</Text>
            
            <View style={{ flexDirection: 'column', gap: 30, marginBottom: 50, paddingLeft: 20 }}>
              {pentesting.pens?.map((pen: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, maxWidth: 500 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', width: 100 }}>{pen}</Text>
                  <View style={{ flex: 1, borderBottom: '1pt solid black' }}></View>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 20, textTransform: 'uppercase' }}>{pentesting.gridsTitle}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={i} style={{ flexDirection: 'column', alignItems: 'center', width: '18%' }}>
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#666', marginBottom: 10 }}>GRID #{i + 1}</Text>
                  <View style={{ width: '100%', aspectRatio: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', borderTop: '1pt solid #999', borderLeft: '1pt solid #999' }}>
                    {Array.from({ length: 25 }).map((_, cellIdx) => {
                      const symbols = ['•', '1', '2', '3', '4', '5'];
                      const symbol = symbols[(i * 25 + cellIdx) % symbols.length];
                      return (
                        <View key={cellIdx} style={{ width: '20%', height: '20%', borderRight: '1pt solid #999', borderBottom: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 8, color: '#CCC', fontFamily: 'Helvetica' }}>{symbol}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </Page>`
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("PdfExport static pages updated");
