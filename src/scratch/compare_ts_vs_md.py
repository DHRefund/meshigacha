import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read foods.ts
with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

# Extract items block
match = re.search(r'export const foods: Food\[\] = \[(.*?)\]\.map', foods_code, re.DOTALL)
if not match:
    print("Could not find foods array block")
    sys.exit(1)

block = match.group(1)
items_raw = re.findall(r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)', block, re.DOTALL)

# Read prompts_foods_japan.md
with open('src/data/prompts_foods_japan.md', 'r', encoding='utf-8') as f:
    md_code = f.read()

md_items_raw = re.findall(r'#(\d+):\s*(.*?)(?=\n|\||\))', md_code)

print(f"TS items count: {len(items_raw)}, MD items count: {len(md_items_raw)}")

print("\n--- DETAILED COMPARISON BETWEEN foods.ts AND prompts_foods_japan.md ---")
mismatches = 0
for i in range(min(len(items_raw), len(md_items_raw))):
    ts_name = items_raw[i][0]
    ts_img = int(items_raw[i][1])
    md_idx = int(md_items_raw[i][0])
    md_name = md_items_raw[i][1]
    
    # Check if they describe the same dish
    print(f"Index [{ts_img:3d}] | TS (foods.ts): {ts_name:<50} | MD (prompts): {md_name}")

