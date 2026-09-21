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

def parse_ts_array(filepath, varname):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()
    pattern = rf'export const {varname}.*?=\s*\[(.*?)\];'
    match = re.search(pattern, code, re.DOTALL)
    if not match:
        return []
    raw_block = match.group(1)
    items = []
    for m in re.finditer(r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)', raw_block, re.DOTALL):
        name = m.group(1)
        image = int(m.group(2))
        items.append((image, name))
    return items

drinks_ts = parse_ts_array('src/data/drinks.ts', 'drinks')
snacks_ts = parse_ts_array('src/data/snacks.ts', 'snacks')
pub_ts = parse_ts_array('src/data/pub.ts', 'pub')

def check_cat(cat_name, ts_items, ja_dict):
    print(f"\n=== CHECKING CATEGORY: {cat_name} ===")
    for img, vi_name in ts_items:
        ja_item = ja_dict.get(img, {})
        ja_name = ja_item.get('name', 'MISSING')
        print(f"[{img:2d}] VI: {vi_name:<45} | JA: {ja_name}")

check_cat('DRINKS', drinks_ts, drinks_ja)
check_cat('SNACKS', snacks_ts, snacks_ja)
check_cat('PUB', pub_ts, pub_ja)
