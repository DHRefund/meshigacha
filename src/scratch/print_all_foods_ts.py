import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read foods.ts
with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

match = re.search(r'export const foods: Food\[\] = \[(.*?)\]\.map', foods_code, re.DOTALL)
if not match:
    print("Could not find foods block")
    sys.exit(1)

block = match.group(1)
items = re.findall(r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)', block, re.DOTALL)

print(f"Total items in foods.ts: {len(items)}")

for name, img_str in items:
    img = int(img_str)
    print(f"Index [{img:3d}]: {name}")
