const fs = require('fs');
let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Find the start of the solutions section
const solIndex = code.indexOf('{/* Solutions section */}');
if (solIndex !== -1) {
  // We need to restore the end of the puzzle loop BEFORE this point.
  // The puzzle loop should end with:
  const puzzleEnd = `                </G>
              </Svg>
            </View>
          </Page>
        );
      })}
`;
  
  // Replace the corrupted end of the puzzle loop with the correct one.
  code = code.replace(/                  \}\)\}\s*\{\/\* Solutions section \*\/\}/, `                  })}\n${puzzleEnd}\n      {/* Solutions section */}`);

  // Now, what about the end of the solutions section?
  // Let's check if the solutions section has its end.
}

fs.writeFileSync('src/PdfExport.tsx', code);
