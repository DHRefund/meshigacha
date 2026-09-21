import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read foods.ts, drinks.ts, snacks.ts, pub.ts
def parse_ts_file(filepath, varname):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()
    pattern = rf'export const {varname}.*?=\s*\[(.*?)\];'
    match = re.search(pattern, code, re.DOTALL)
    if not match:
        return []
    raw_block = match.group(1)
    items = []
    # parse object blocks
    blocks = re.findall(r'\{[^{}]*\}', raw_block)
    for b in blocks:
        name_m = re.search(r'name:\s*[\'"](.*?)[\'"]', b)
        sub_m = re.search(r'sub:\s*[\'"](.*?)[\'"]', b)
        img_m = re.search(r'image:\s*(\d+)', b)
        quip_m = re.search(r'quip:\s*[\'"](.*?)[\'"]', b)
        if name_m and img_m:
            items.append({
                'image': int(img_m.group(1)),
                'name': name_m.group(1),
                'sub': sub_m.group(1) if sub_m else '',
                'quip': quip_m.group(1) if quip_m else ''
            })
    return items

main_items = parse_ts_file('src/data/foods.ts', 'foods')
drinks_items = parse_ts_file('src/data/drinks.ts', 'drinks')
snacks_items = parse_ts_file('src/data/snacks.ts', 'snacks')
pub_items = parse_ts_file('src/data/pub.ts', 'pub')

print(f"Main items: {len(main_items)}")
print(f"Drinks items: {len(drinks_items)}")
print(f"Snacks items: {len(snacks_items)}")
print(f"Pub items: {len(pub_items)}")

# Let's inspect some names from main_items
for i in range(10):
    print(main_items[i])
