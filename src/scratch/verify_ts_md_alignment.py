import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read foods.ts
with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

# Extract items in foods.ts
match = re.search(r'export const foods: Food\[\] = \[(.*?)\]\.map', foods_code, re.DOTALL)
if not match:
    print("Could not find foods array block")
    sys.exit(1)

block = match.group(1)
items_raw = re.findall(r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)', block, re.DOTALL)

# Read prompts_foods_japan.md
with open('src/data/prompts_foods_japan.md', 'r', encoding='utf-8') as f:
    md_code = f.read()

# Extract all prompt table items: e.g., #0: Cơm heo chiên xù...
md_dishes = re.findall(r'#(\d+):\s*(.*?)(?=\s*\(|\s*\||\n)', md_code)

print(f"TS count: {len(items_raw)}, MD table count: {len(md_dishes)}")

diff_count = 0
for i in range(min(len(items_raw), 120)):
    ts_name = items_raw[i][0]
    ts_img = int(items_raw[i][1])
    
    # Find matching md item with index == ts_img
    md_match = None
    for idx_str, name_str in md_dishes:
        if int(idx_str) == ts_img:
            md_match = name_str.strip()
            break
            
    # Check similarity
    ts_base = ts_name.split('(')[0].strip()
    md_base = md_match.split('(')[0].strip() if md_match else "NOT FOUND"
    
    if ts_base != md_base:
        diff_count += 1
        print(f"MISMATCH at index [{ts_img:3d}] | TS in foods.ts: '{ts_name}' | MD in prompt: '{md_match}'")

print(f"\nTotal differences between foods.ts and prompts_foods_japan.md: {diff_count}")
