import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_content = f.read()

with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    i18n_content = f.read()

def parse_ja_dict(var_name, content):
    pattern = rf'export const {var_name}: Record<number, {{ name: string; sub: string; quip: string }}> = \{{(.*?)\}};'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print(f"Could not find {var_name}")
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

print(f"mainJaData count: {len(main_ja)}")
print(f"drinksJaData count: {len(drinks_ja)}")
print(f"snacksJaData count: {len(snacks_ja)}")
print(f"pubJaData count: {len(pub_ja)}")

# Now let's compare foods.ts with i18n.ts items!
# Let's parse foods in foods.ts
# There are 4 arrays: foods (120), drinks (36), snacks (36), pub (36)
print("\n--- SAMPLE MAIN DISHES COMPARISON (foods.ts vs i18n.ts vs prompt md) ---")

with open('src/data/prompts_foods_japan.md', 'r', encoding='utf-8') as f:
    prompt_foods_md = f.read()

# Let's extract items from prompt_foods_md
prompt_items = re.findall(r'(\d+)\.\s*\*\*(.*?)\*\*', prompt_foods_md)
print(f"Found {len(prompt_items)} items in prompts_foods_japan.md")

for i in range(15):
    ja_item = main_ja.get(i, {})
    md_item = prompt_items[i] if i < len(prompt_items) else ('?', '?')
    print(f"Index {i:2d} | i18n: {ja_item.get('name', 'N/A'):<35} | MD: {md_item[1]}")

print("\n--- Checking foodName function in i18n.ts ---")
food_name_fn = re.search(r'export function foodName.*?\n\}', i18n_content, re.DOTALL)
if food_name_fn:
    print(food_name_fn.group(0))
