const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace the Welcome Page section
code = code.replace(
  /<Page size=\{PAGE_SIZE as any\} style=\{styles\.paddedPage\}>\s*<Text style=\{styles\.h1\}>\{welcome\.title\}<\/Text>\s*<Text style=\{styles\.h2\}>\{welcome\.heading1\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{welcome\.body1\}<\/Text>\s*<Text style=\{styles\.h2\}>\{welcome\.heading2\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{welcome\.body2\}<\/Text>\s*<\/Page>/g,
  `          <Page size={PAGE_SIZE as any} style={styles.paddedPage}>
            <Text style={{ fontSize: 26, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, textTransform: 'uppercase' }}>{welcome.title}</Text>
            <Text style={{ fontSize: 18, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30, lineHeight: 1.4 }}>{welcome.intro}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              {/* Left Column */}
              <View style={{ width: '45%', flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 10, textTransform: 'uppercase' }}>{welcome.howToTitle}</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica', marginBottom: 20, lineHeight: 1.4 }}>{welcome.howToSteps}</Text>
                
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 5, textTransform: 'uppercase' }}>{welcome.penTitle}</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica', marginBottom: 10, lineHeight: 1.4 }}>{welcome.penIntro}</Text>
                
                <View style={{ marginBottom: 15 }}>
                  {welcome.penList?.map((item: string, idx: number) => (
                    <View key={idx} style={{ flexDirection: 'row', marginBottom: 5 }}>
                      <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', marginRight: 10, color: '#666' }}>✓</Text>
                      <Text style={{ fontSize: 16, fontFamily: 'Helvetica' }}>{item}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica', lineHeight: 1.4 }}>{welcome.penOutro}</Text>
              </View>

              {/* Right Column */}
              <View style={{ width: '50%', flexDirection: 'column' }}>
                <View style={{ border: '1pt solid #E5E5E5', borderRadius: 4, marginBottom: 20 }}>
                  {welcome.legend?.map((row: any, i: number) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottom: i < welcome.legend.length - 1 ? '1pt solid #E5E5E5' : 'none', backgroundColor: i % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }}>
                      <Text style={{ width: 40, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 }}>{row.num}</Text>
                      <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14, letterSpacing: 1 }}>{row.title}</Text>
                        <Text style={{ fontFamily: 'Helvetica', fontSize: 11, marginTop: 2 }}>{row.desc}</Text>
                      </View>
                      <View style={{ width: 50, height: 40, border: '1pt solid #CCCCCC', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                        {row.symbol === '■' ? (
                          <View style={{ width: 20, height: 20, backgroundColor: '#000000' }}></View>
                        ) : (
                          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 20 }}>{row.symbol}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
                
                {welcome.illustrationImage && (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}>
                    <PdfImage src={welcome.illustrationImage} style={{ width: '100%', height: 250, objectFit: 'contain' }} />
                  </View>
                )}
              </View>
            </View>
          </Page>`
);

// Replace the Mystery Page section
code = code.replace(
  /<Page size=\{PAGE_SIZE as any\} style=\{styles\.paddedPage\}>\s*<Text style=\{styles\.h1\}>\{mystery\.title\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{mystery\.body1\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{mystery\.body2\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{mystery\.body3\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{mystery\.body4\}<\/Text>\s*<\/Page>/g,
  `          <Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, padding: 50 }}>
            <Text style={{ fontSize: 48, fontFamily: 'Helvetica-Bold', fontStyle: 'italic', textAlign: 'center', marginBottom: 60 }}>{mystery.title}</Text>
            
            <View style={{ width: '80%', alignSelf: 'center' }}>
              <View style={{ flexDirection: 'row', borderBottom: '1pt solid #E5E5E5', paddingBottom: 10, marginBottom: 10 }}>
                <Text style={{ width: 80, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Mark</Text>
                <Text style={{ width: 80, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Code</Text>
                <Text style={{ flex: 1, fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Name</Text>
                <Text style={{ width: 100, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 16 }}>Density %</Text>
              </View>
              
              {mystery.marks?.map((row: any, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottom: i < mystery.marks.length - 1 ? '1pt solid #E5E5E5' : 'none' }}>
                  <View style={{ width: 80, alignItems: 'center' }}>
                    <View style={{ width: 50, height: 50, border: '1pt solid #000000', alignItems: 'center', justifyContent: 'center' }}>
                      {row.mark === '■' ? (
                        <View style={{ width: 25, height: 25, backgroundColor: '#000000' }}></View>
                      ) : (
                        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 24 }}>{row.mark}</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={{ width: 80, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 18 }}>{row.code}</Text>
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 18 }}>{row.name}</Text>
                  </View>
                  
                  <View style={{ width: 100, alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'Helvetica', fontSize: 18 }}>{row.density}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Page>`
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("PdfExport Welcome/Mystery pages updated");
