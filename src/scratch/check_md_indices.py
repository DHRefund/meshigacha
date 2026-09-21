import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Check main foods in foods.ts
with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

# Extract items in foods.ts
pattern = r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+).*?category:\s*[\'"](.*?)[\'"]'
items_in_ts = re.findall(pattern, foods_code, re.DOTALL)

print(f"Total main items in foods.ts: {len(items_in_ts)}")

# Check prompts_foods_japan.md
with open('src/data/prompts_foods_japan.md', 'r', encoding='utf-8') as f:
    md_code = f.read()

# Let's find all numbered dishes in prompts_foods_japan.md
# e.g., #85: Cơm chan nước trà Ochazuke... or 1. Deep-fried...
md_dishes = re.findall(r'#(\d+):\s*(.*?)(?=\n|\||\))', md_code)
print(f"Found {len(md_dishes)} #index items in prompts_foods_japan.md")

for idx, text in md_dishes[:30]:
    print(f"MD #{idx:3s}: {text}")
