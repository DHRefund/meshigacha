import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read foods.ts
with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

# Extract items in foods.ts
match = re.search(r'export const foods: Food\[\] = \[(.*?)\]\.map', foods_code, re.DOTALL)
block = match.group(1)
foods_items = re.findall(r'\{\s*name:\s*[\'"](.*?)[\'"].*?sub:\s*[\'"](.*?)[\'"].*?image:\s*(\d+).*?quip:\s*[\'"](.*?)[\'"]', block, re.DOTALL)

# Read prompts_foods_japan.md
with open('src/data/prompts_foods_japan.md', 'r', encoding='utf-8') as f:
    md_code = f.read()

# Extract Japanese names from prompts_foods_japan.md
# e.g., #27: Bánh bạch tuộc Takoyaki (Takoyaki Plate (たこ焼き))
md_items = re.findall(r'#(\d+):\s*(.*?)(?=\n|\|)', md_code)
md_map = {}
for idx_str, text in md_items:
    idx = int(idx_str)
    # Extract kanji/japanese inside ((...)) or (...)
    m = re.search(r'\(([^()]*[\u3040-\u30ff\u4e00-\u9faf][^()]*)\)', text)
    if m:
        ja_name = m.group(1).strip()
        # if slash e.g. 鰻重 / うな丼 -> take first
        if '/' in ja_name:
            ja_name = ja_name.split('/')[0].strip()
        md_map[idx] = ja_name
    else:
        md_map[idx] = text.strip()

print(f"Parsed {len(foods_items)} foods and {len(md_map)} prompt items.")

# Print all 120 pairs to verify correctness!
correct_main_ja = []
for name, sub, img_str, quip in foods_items:
    img = int(img_str)
    ja_name = md_map.get(img, name)
    print(f"[{img:3d}] VI: {name:<45} -> JA: {ja_name:<30} (sub: {sub})")
    correct_main_ja.append((img, ja_name, sub, quip))
