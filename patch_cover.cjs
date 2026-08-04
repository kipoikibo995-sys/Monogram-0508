const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

code = code.replace(
  /const cover = getParsed\('coverBook', \{/,
  `const cover = getParsed('coverBook', {\n    images: [],`
);

const templateCover = `
            {(!cover.images || cover.images.length === 0) ? (
              <>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={styles.topSubtitle}>{cover.topSubtitle}</Text>
                  <Text style={styles.subtitle2}>{cover.subtitle2}</Text>
                  <Text style={styles.coverTitle}>{cover.mainTitle}</Text>
                  <Text style={styles.coverTheme}>{cover.themeTitle}</Text>
                </View>
                {cover.templateImage && (
                   <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 20 * sf }}>
                     <PdfImage src={cover.templateImage} style={{ width: '90%', height: 450 * sf, objectFit: 'contain' }} />
                   </View>
                )}
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={styles.coverAuthor}>{cover.author}</Text>
                </View>
              </>
            ) : (
              <View style={{ flex: 1, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', alignContent: 'center', padding: 20 * sf, gap: 20 * sf }}>
                {cover.images.map((img, i) => (
                   <View key={i} style={{ width: cover.images.length === 1 ? '100%' : (cover.images.length === 2 ? '100%' : '48%'), height: cover.images.length === 1 ? '100%' : (cover.images.length === 2 ? '48%' : '48%') }}>
                     <PdfImage src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                   </View>
                ))}
              </View>
            )}
`;

code = code.replace(
  /<View style=\{\{ alignItems: 'center', width: '100%' \}\}>\n\s*<Text style=\{styles\.topSubtitle\}>\{cover\.topSubtitle\}<\/Text>[\s\S]*?<View style=\{\{ alignItems: 'center', width: '100%' \}\}>\n\s*<Text style=\{styles\.coverAuthor\}>\{cover\.author\}<\/Text>\n\s*<\/View>/,
  templateCover.trim()
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("Patched PdfExport.tsx for custom cover images");
