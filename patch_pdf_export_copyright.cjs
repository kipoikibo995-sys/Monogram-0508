const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace the Copyright Page section
code = code.replace(
  /const copyright = getParsed\('copyrightPage', \{[\s\S]*?\}\);/,
  `const copyright = getParsed('copyrightPage', {
    title: 'COPYRIGHT PAGE',
    year: '2026',
    author: 'Alan Parker',
    rights: 'All Rights Reserved.',
    description: 'No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission from the author.',
    isbn: '9798188106522',
    imprint: 'Independently published'
  });`
);

code = code.replace(
  /<Page size=\{PAGE_SIZE as any\} style=\{styles\.centerPage\}>\s*<Text style=\{styles\.copyrightText\}>\{copyright\.title.*?\}<\/Text>\s*<Text style=\{styles\.copyrightText\}>\{copyright\.text1\}<\/Text>\s*<Text style=\{styles\.copyrightText\}>\{copyright\.text2\}<\/Text>\s*<Text style=\{styles\.copyrightText\}>\{copyright\.text3\}<\/Text>\s*<\/Page>/g,
  `          <Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, justifyContent: 'flex-start', paddingTop: 150 }}>
            <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 100, textTransform: 'uppercase' }}>{copyright.title}</Text>
            
            <View style={{ width: '80%', alignSelf: 'center', flexDirection: 'column' }}>
              <View style={{ marginBottom: 40 }}>
                <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>Copyright © {copyright.year} {copyright.author}</Text>
                <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold' }}>{copyright.rights}</Text>
              </View>
              
              <Text style={{ fontSize: 22, fontFamily: 'Helvetica', lineHeight: 1.6, marginBottom: 40 }}>{copyright.description}</Text>
              
              <View>
                <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>ISBN: <Text style={{ fontFamily: 'Helvetica' }}>{copyright.isbn}</Text></Text>
                <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold' }}>Imprint: <Text style={{ fontFamily: 'Helvetica' }}>{copyright.imprint}</Text></Text>
              </View>
            </View>
          </Page>`
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("PdfExport Copyright page updated");
