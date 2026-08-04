const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace the ThankYou Page section
code = code.replace(
  /<Page size=\{PAGE_SIZE as any\} style=\{styles\.paddedPage\}>\s*<Text style=\{styles\.h1\}>\{thankyou\.title\}<\/Text>\s*<Text style=\{styles\.h2\}>\{thankyou\.heading1\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{thankyou\.body1\}<\/Text>\s*<Text style=\{styles\.h2\}>\{thankyou\.heading2\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{thankyou\.body2\}<\/Text>\s*<Text style=\{styles\.h2\}>\{thankyou\.heading3\}<\/Text>\s*<Text style=\{styles\.bodyText\}>\{thankyou\.body3\}<\/Text>\s*<\/Page>/g,
  `          <Page size={PAGE_SIZE as any} style={{ ...styles.paddedPage, paddingTop: 100 }}>
            <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 60 }}>{thankyou.title}</Text>
            
            <View style={{ width: '80%', alignSelf: 'center', flexDirection: 'column' }}>
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', fontStyle: 'italic', marginBottom: 10 }}>{thankyou.heading1}</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica', lineHeight: 1.6 }}>{thankyou.body1}</Text>
              </View>

              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', fontStyle: 'italic', marginBottom: 10 }}>{thankyou.heading2}</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica', lineHeight: 1.6 }}>{thankyou.body2}</Text>
              </View>

              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', fontStyle: 'italic', marginBottom: 10 }}>{thankyou.heading3}</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica', lineHeight: 1.6 }}>{thankyou.body3}</Text>
              </View>
            </View>
          </Page>`
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("PdfExport ThankYou page updated");
