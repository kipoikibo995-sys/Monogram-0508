const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace mystery page
const mysteryStart = `<Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, padding: 50 * sf, paddingHorizontal: pagePadding * sf }}>`;
const mysteryTitle = `<Text style={{ fontSize: 48 * sf, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', marginBottom: 60 * sf }}>{mystery.title}</Text>`;
code = code.replace(mysteryStart + '\n            ' + mysteryTitle, `{userTier === 'pro' && (\n          ` + mysteryStart + '\n            ' + mysteryTitle);

// Replace warmup page
const warmupStart = `<Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>`;
const warmupTitle = `<Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{warmup.title}</Text>`;
code = code.replace(warmupStart + '\n            ' + warmupTitle, `{userTier === 'pro' && (\n          ` + warmupStart + '\n            ' + warmupTitle);

// Replace pentesting page
const pentestingStart = `<Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>`;
const pentestingTitle = `<Text style={{ fontSize: 28 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{pentesting.title}</Text>`;
code = code.replace(pentestingStart + '\n            ' + pentestingTitle, `{userTier === 'pro' && (\n          ` + pentestingStart + '\n            ' + pentestingTitle);

// Add closing tags
// Mystery ends at line 302 with </Page>
const mysteryEnd = `            </View>\n          </Page>`;
code = code.replace(mysteryEnd + `\n\n          {userTier === 'pro' && (\n          ` + warmupStart, mysteryEnd + `\n          )}\n\n          {userTier === 'pro' && (\n          ` + warmupStart);

// Warmup ends at line 325 with </Page>
const warmupEnd = `            </View>\n          </Page>`;
code = code.replace(warmupEnd + `\n\n          {userTier === 'pro' && (\n          ` + pentestingStart, warmupEnd + `\n          )}\n\n          {userTier === 'pro' && (\n          ` + pentestingStart);

// Pentesting ends at line 360 with </Page>
const pentestingEnd = `                  </View>\n                </View>\n              ))}\n            </View>\n          </Page>`;
code = code.replace(pentestingEnd + `\n        </>\n      )}`, pentestingEnd + `\n          )}\n        </>\n      )}`);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("Patched PdfExport");
