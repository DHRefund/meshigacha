import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read foods.ts
with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

# Find all occurrences of Abura Soba or 油そば in foods.ts
print("=== OCCURRENCES OF Abura / 油そば IN foods.ts ===")
pattern = r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)'
for m in re.finditer(pattern, foods_code):
    name = m.group(1)
    img = int(m.group(2))
    if 'Abura' in name or '油' in name or 'béo' in name or 'xào' in name or 'soba' in name.lower():
        print(f"Index [{img:3d}]: {name}")

print("\n=== OCCURRENCES OF Abura / 油そば / Takoyaki IN prompts_foods_japan.md ===")
with open('src/data/prompts_foods_japan.md', 'r', encoding='utf-8') as f:
    md_code = f.read()

for m in re.finditer(r'#(\d+):\s*(.*)', md_code):
    idx = int(m.group(1))
    line = m.group(2)
    if 'Abura' in line or 'Takoyaki' in line or 'たこ焼き' in line or '油' in line:
        print(f"MD #{idx:3d}: {line}")
