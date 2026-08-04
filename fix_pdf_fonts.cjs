const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Copyright
code = code.replace(/fontSize: 32 \* sf/g, 'fontSize: 30 * sf');
code = code.replace(/fontSize: 22 \* sf/g, 'fontSize: 20 * sf');
code = code.replace(/marginBottom: 100 \* sf/g, 'marginBottom: 64 * sf');
code = code.replace(/marginBottom: 40 \* sf/g, 'marginBottom: 32 * sf');

// Welcome
code = code.replace(/fontSize: 26 \* sf/g, 'fontSize: 30 * sf');
code = code.replace(/fontSize: 16 \* sf, fontFamily: 'Helvetica', marginBottom: 20 \* sf/g, "fontSize: 18 * sf, fontFamily: 'Helvetica', marginBottom: 20 * sf");
code = code.replace(/fontSize: 16 \* sf, fontFamily: 'Helvetica', marginBottom: 10 \* sf/g, "fontSize: 18 * sf, fontFamily: 'Helvetica', marginBottom: 10 * sf");
code = code.replace(/fontSize: 16 \* sf, fontFamily: 'Helvetica-Bold', marginRight/g, "fontSize: 18 * sf, fontFamily: 'Helvetica-Bold', marginRight");
code = code.replace(/fontSize: 16 \* sf, fontFamily: 'Helvetica' \}>\{item\}/g, "fontSize: 18 * sf, fontFamily: 'Helvetica' }>{item}");
code = code.replace(/fontSize: 16 \* sf, fontFamily: 'Helvetica', lineHeight: 1.4 \}>\{welcome.penOutro\}/g, "fontSize: 18 * sf, fontFamily: 'Helvetica', lineHeight: 1.4 }>{welcome.penOutro}");

// Warmup
code = code.replace(/fontSize: 16 \* sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30 \* sf, lineHeight: 1.5 \}>\{warmup.subtitle\}/g, "fontSize: 20 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30 * sf, lineHeight: 1.5 }>{warmup.subtitle}");
code = code.replace(/fontSize: 12 \* sf, fontFamily: 'Helvetica', marginBottom: 15 \* sf \}>\{lvl.desc\}/g, "fontSize: 14 * sf, fontFamily: 'Helvetica', marginBottom: 15 * sf }>{lvl.desc}");
code = code.replace(/fontSize: 16 \* sf, color: '#CCC'/g, "fontSize: 20 * sf, color: '#CCC'");

// Pentesting
code = code.replace(/fontSize: 16 \* sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 40 \* sf, lineHeight: 1.5 \}>\{pentesting.subtitle\}/g, "fontSize: 20 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 40 * sf, lineHeight: 1.5 }>{pentesting.subtitle}");

// Thankyou
code = code.replace(/fontSize: 20 \* sf, fontFamily: 'Helvetica-BoldOblique'/g, "fontSize: 18 * sf, fontFamily: 'Helvetica-BoldOblique'");

fs.writeFileSync('src/PdfExport.tsx', code);
