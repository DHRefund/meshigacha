import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read i18n.ts
with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    i18n_content = f.read()

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

main_ja = parse_ja_dict('mainJaData', i18n_content)
drinks_ja = parse_ja_dict('drinksJaData', i18n_content)
snacks_ja = parse_ja_dict('snacksJaData', i18n_content)
pub_ja = parse_ja_dict('pubJaData', i18n_content)

# Parse foods.ts
def parse_ts_array(filepath, varname):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()
    pattern = rf'export const {varname}.*?=\s*\[(.*?)\];'
    match = re.search(pattern, code, re.DOTALL)
    if not match:
        return []
    raw_block = match.group(1)
    items = []
    # Find objects { name: '...', ... }
    for m in re.finditer(r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)', raw_block, re.DOTALL):
        name = m.group(1)
        image = int(m.group(2))
        items.append((image, name))
    return items

main_ts = parse_ts_array('src/data/foods.ts', 'foods')
drinks_ts = parse_ts_array('src/data/drinks.ts', 'drinks')
snacks_ts = parse_ts_array('src/data/snacks.ts', 'snacks')
pub_ts = parse_ts_array('src/data/pub.ts', 'pub')

print("=== CHECKING MAIN DISHES (0..119) ===")
mismatches = 0
for img, vi_name in main_ts:
    ja_item = main_ja.get(img)
    if not ja_item:
        print(f"MISSING IN i18n: main {img} - {vi_name}")
        mismatches += 1
    else:
        # print first 20 for review
        if img < 20 or "(Tonkatsu)" in ja_item['name'] or "(" in ja_item['name']:
            print(f"[{img:3d}] VI: {vi_name:<45} | JA: {ja_item['name']}")

print(f"\nTotal main dishes checked: {len(main_ts)}, i18n main count: {len(main_ja)}")
