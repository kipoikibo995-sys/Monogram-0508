const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

const warmupStart = code.indexOf('<Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>');
// Let's replace the block containing Mystery, Warmup, Pentesting

code = code.replace(
  `          {/* 3. Welcome Page */}
          <Page size={PAGE_SIZE as any} style={{...styles.centerPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 30 * sf, textTransform: 'uppercase' }}>{welcome.title}</Text>
            <Text style={styles.bodyText}>{welcome.intro}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 * sf, gap: 40 * sf }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 15 * sf }}>{welcome.howToTitle}</Text>
                <Text style={styles.bodyText}>{welcome.howToSteps}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 15 * sf }}>{welcome.tipsTitle}</Text>
                <Text style={styles.bodyText}>{welcome.tipsSteps}</Text>
              </View>
            </View>
          </Page>

          {/* 4. Mystery Instructions */}
          <Page size={PAGE_SIZE as any} style={{...styles.centerPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 36 * sf, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', marginBottom: 50 * sf }}>{mystery.title}</Text>
            
            <View style={{ width: '100%', flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', width: '100%', marginBottom: 10 * sf, borderBottom: '1pt solid #E5E5E5', paddingBottom: 5 * sf }}>
                <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf, textAlign: 'center' }}>Mark</Text>
                <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf, textAlign: 'center' }}>Code</Text>
                <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', flex: 1 }}>Name</Text>
                <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf, textAlign: 'right' }}>Density %</Text>
              </View>
              
              <View style={{ flexDirection: 'column' }}>
                {mystery.marks.map((row: any, i: number) => (
                  <View key={i} style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingVertical: 10 * sf, borderBottom: '1pt solid #E5E5E5' }}>
                    <View style={{ width: 100 * sf, alignItems: 'center' }}>
                       <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica' }}>{row.symbol}</Text>
                    </View>
                    <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica', width: 100 * sf, textAlign: 'center' }}>{row.code}</Text>
                    <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica', flex: 1 }}>{row.name}</Text>
                    <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica', width: 100 * sf, textAlign: 'right' }}>{row.density}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Page>

          {/* 5. Warm Up Practice */}
          <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{warmup.title}</Text>
            <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30 * sf, lineHeight: 1.5 }}>{warmup.subtitle}</Text>
            
            <View style={{ width: '100%', height: 1 * sf, backgroundColor: '#E5E5E5', marginBottom: 30 * sf }}></View>

            <View style={{ flex: 1, flexDirection: 'column', gap: 20 * sf }}>
              {warmup.levels?.map((lvl: any, i: number) => (
                <View key={i} style={{ flexDirection: 'column', marginBottom: 20 * sf }}>
                  <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 5 * sf }}>{lvl.label}</Text>
                  <Text style={{ fontSize: 12 * sf, fontFamily: 'Helvetica', marginBottom: 15 * sf }}>{lvl.desc}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 * sf }}>
                    {Array.from({ length: 10 }).map((_, col) => (
                      <View key={col} style={{ width: 40 * sf, height: 40 * sf, border: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                         <Text style={{ fontSize: 20 * sf, color: '#CCC', fontFamily: 'Helvetica' }}>{lvl.hint}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Page>

          {/* 6. Pen Testing Lab */}
          <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 28 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{pentesting.title}</Text>
            <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 32 * sf, lineHeight: 1.5 }}>{pentesting.subtitle}</Text>
            
            <View style={{ flexDirection: 'column', gap: 30 * sf, marginBottom: 50 * sf, paddingLeft: 20 * sf }}>
              {pentesting.pens?.map((pen: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 * sf, maxWidth: 500 * sf }}>
                  <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf }}>{pen}</Text>
                  <View style={{ flex: 1, borderBottom: '1pt solid black' }}></View>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 20 * sf, textTransform: 'uppercase' }}>{pentesting.gridsTitle}</Text>
            
            <View style={{ flexDirection: 'row', gap: 20 * sf, flexWrap: 'wrap' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={{ flexDirection: 'column', width: '45%', marginBottom: 20 * sf }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', aspectRatio: 1, borderLeft: '1pt solid #999', borderTop: '1pt solid #999' }}>
                    {Array.from({ length: 25 }).map((_, cellIdx) => (
                      <View key={cellIdx} style={{ width: '20%', height: '20%', borderRight: '1pt solid #999', borderBottom: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                         <Text style={{ fontSize: 10 * sf, color: '#CCC', fontFamily: 'Helvetica' }}>{(cellIdx % 5) + 1}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Page>`,
  `          {/* 3. Welcome Page */}
          <Page size={PAGE_SIZE as any} style={{...styles.centerPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 30 * sf, textTransform: 'uppercase' }}>{welcome.title}</Text>
            <Text style={styles.bodyText}>{welcome.intro}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 * sf, gap: 40 * sf }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 15 * sf }}>{welcome.howToTitle}</Text>
                <Text style={styles.bodyText}>{welcome.howToSteps}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 15 * sf }}>{welcome.tipsTitle}</Text>
                <Text style={styles.bodyText}>{welcome.tipsSteps}</Text>
              </View>
            </View>
          </Page>

          {/* 4. Mystery Instructions */}
          {userTier !== 'free' && (
            <Page size={PAGE_SIZE as any} style={{...styles.centerPage, paddingHorizontal: pagePadding * sf}}>
              <Text style={{ fontSize: 36 * sf, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', marginBottom: 50 * sf }}>{mystery.title}</Text>
              
              <View style={{ width: '100%', flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 10 * sf, borderBottom: '1pt solid #E5E5E5', paddingBottom: 5 * sf }}>
                  <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf, textAlign: 'center' }}>Mark</Text>
                  <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf, textAlign: 'center' }}>Code</Text>
                  <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', flex: 1 }}>Name</Text>
                  <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf, textAlign: 'right' }}>Density %</Text>
                </View>
                
                <View style={{ flexDirection: 'column' }}>
                  {mystery.marks.map((row: any, i: number) => (
                    <View key={i} style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingVertical: 10 * sf, borderBottom: '1pt solid #E5E5E5' }}>
                      <View style={{ width: 100 * sf, alignItems: 'center' }}>
                         <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica' }}>{row.symbol}</Text>
                      </View>
                      <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica', width: 100 * sf, textAlign: 'center' }}>{row.code}</Text>
                      <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica', flex: 1 }}>{row.name}</Text>
                      <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica', width: 100 * sf, textAlign: 'right' }}>{row.density}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Page>
          )}

          {/* 5. Warm Up Practice */}
          {userTier !== 'free' && (
            <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>
              <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{warmup.title}</Text>
              <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30 * sf, lineHeight: 1.5 }}>{warmup.subtitle}</Text>
              
              <View style={{ width: '100%', height: 1 * sf, backgroundColor: '#E5E5E5', marginBottom: 30 * sf }}></View>

              <View style={{ flex: 1, flexDirection: 'column', gap: 20 * sf }}>
                {warmup.levels?.map((lvl: any, i: number) => (
                  <View key={i} style={{ flexDirection: 'column', marginBottom: 20 * sf }}>
                    <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 5 * sf }}>{lvl.label}</Text>
                    <Text style={{ fontSize: 12 * sf, fontFamily: 'Helvetica', marginBottom: 15 * sf }}>{lvl.desc}</Text>
                    <View style={{ flexDirection: 'row', gap: 10 * sf }}>
                      {Array.from({ length: 10 }).map((_, col) => (
                        <View key={col} style={{ width: 40 * sf, height: 40 * sf, border: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                           <Text style={{ fontSize: 20 * sf, color: '#CCC', fontFamily: 'Helvetica' }}>{lvl.hint}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </Page>
          )}

          {/* 6. Pen Testing Lab */}
          {userTier !== 'free' && (
            <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>
              <Text style={{ fontSize: 28 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{pentesting.title}</Text>
              <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 32 * sf, lineHeight: 1.5 }}>{pentesting.subtitle}</Text>
              
              <View style={{ flexDirection: 'column', gap: 30 * sf, marginBottom: 50 * sf, paddingLeft: 20 * sf }}>
                {pentesting.pens?.map((pen: string, i: number) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 * sf, maxWidth: 500 * sf }}>
                    <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf }}>{pen}</Text>
                    <View style={{ flex: 1, borderBottom: '1pt solid black' }}></View>
                  </View>
                ))}
              </View>

              <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 20 * sf, textTransform: 'uppercase' }}>{pentesting.gridsTitle}</Text>
              
              <View style={{ flexDirection: 'row', gap: 20 * sf, flexWrap: 'wrap' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <View key={i} style={{ flexDirection: 'column', width: '45%', marginBottom: 20 * sf }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', aspectRatio: 1, borderLeft: '1pt solid #999', borderTop: '1pt solid #999' }}>
                      {Array.from({ length: 25 }).map((_, cellIdx) => (
                        <View key={cellIdx} style={{ width: '20%', height: '20%', borderRight: '1pt solid #999', borderBottom: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                           <Text style={{ fontSize: 10 * sf, color: '#CCC', fontFamily: 'Helvetica' }}>{(cellIdx % 5) + 1}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </Page>
          )}`
);

fs.writeFileSync('src/PdfExport.tsx', code);
