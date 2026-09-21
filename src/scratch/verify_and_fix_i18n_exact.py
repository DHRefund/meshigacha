import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read prompts_foods_japan.md
with open('src/data/prompts_foods_japan.md', 'r', encoding='utf-8') as f:
    md_code = f.read()

# Read foods.ts
with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

# Extract items in foods.ts
match = re.search(r'export const foods: Food\[\] = \[(.*?)\]\.map', foods_code, re.DOTALL)
block = match.group(1)
foods_items = re.findall(r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)', block, re.DOTALL)

# Read i18n.ts
with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    i18n_code = f.read()

def parse_ja_dict(var_name, content):
    pattern = rf'export const {var_name}: Record<number, {{ name: string; sub: string; quip: string }}> = \{{(.*?)\}};'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return {}
    block = match.group(1)
    items = {}
    for line in block.strip().split('\n'):
        line = line.strip()
        m = re.match(r'(\d+):\s*\{\s*name:\s*"(.*?)",\s*sub:\s*"(.*?)",\s*quip:\s*"(.*?)"\s*\},?', line)
        if m:
            idx = int(m.group(1))
            items[idx] = {'name': m.group(2), 'sub': m.group(3), 'quip': m.group(4)}
    return items

main_ja = parse_ja_dict('mainJaData', i18n_code)

print("=== CHECKING ALL 120 MAIN DISHES BETWEEN foods.ts AND mainJaData IN i18n.ts ===")
errors = 0
for name, img_str in foods_items:
    img = int(img_str)
    ja = main_ja.get(img, {})
    ja_name = ja.get('name', 'MISSING')
    print(f"[{img:3d}] VI: {name:<50} | JA in i18n: {ja_name}")

