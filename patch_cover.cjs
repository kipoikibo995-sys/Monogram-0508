const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(
  "coverTitle: { fontSize: 50, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 20 },",
  "coverTitle: { fontSize: 72, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 10, letterSpacing: -1 },"
);
code = code.replace(
  "coverTheme: { fontSize: 24, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 40, letterSpacing: 2 },",
  "coverTheme: { fontSize: 36, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 20, letterSpacing: 2 },"
);
code = code.replace(
  "coverAuthor: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 40 },",
  "coverAuthor: { fontSize: 24, fontFamily: 'Helvetica-Bold', textAlign: 'center' },"
);
code = code.replace(
  "topSubtitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 10, letterSpacing: 1 },",
  "topSubtitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, letterSpacing: 1 },"
);
code = code.replace(
  "subtitle2: { fontSize: 18, fontFamily: 'Helvetica-Oblique', textAlign: 'center', marginBottom: 40 },",
  "subtitle2: { fontSize: 36, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', marginBottom: 40, letterSpacing: -1 },"
);

code = code.replace(
  /<Page size=\{PAGE_SIZE as any\} style=\{styles\.centerPage\}>[\s\S]*?<\/Page>/,
  `<Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, justifyContent: 'space-between', paddingVertical: 80 }}>
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={styles.topSubtitle}>{cover.topSubtitle}</Text>
              <Text style={styles.subtitle2}>{cover.subtitle2}</Text>
              <Text style={styles.coverTitle}>{cover.mainTitle}</Text>
              <Text style={styles.coverTheme}>{cover.themeTitle}</Text>
            </View>
            {cover.templateImage && (
               <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
                 <PdfImage src={cover.templateImage} style={{ width: '85%', height: '100%', objectFit: 'contain' }} />
               </View>
            )}
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={styles.coverAuthor}>{cover.author}</Text>
            </View>
          </Page>`
);

fs.writeFileSync('src/PdfExport.tsx', code);
