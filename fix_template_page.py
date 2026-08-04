import re
with open('src/BookFlow.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "export const TemplatePage = ({ title, value, onChange, type }: { title: string; value?: string; onChange: (v: string) => void; type: 'warmup' | 'pentesting' }) => {",
    "export const TemplatePage = ({ title, value, onChange, type, isExport }: { title: string; value?: string; onChange: (v: string) => void; type: 'warmup' | 'pentesting'; isExport?: boolean }) => {"
)

with open('src/BookFlow.tsx', 'w') as f:
    f.write(code)
