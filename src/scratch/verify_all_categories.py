import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def check_category_alignment(ts_file, md_file, var_name):
    with open(ts_file, 'r', encoding='utf-8') as f:
        ts_code = f.read()
    with open(md_file, 'r', encoding='utf-8') as f:
        md_code = f.read()

    blocks = re.findall(r'\{\s*name:\s*[\'"](.*?)[\'"].*?image:\s*(\d+)', ts_code, re.DOTALL)
    md_dishes = re.findall(r'#(\d+):\s*(.*?)(?=\s*\(|\s*\||\n)', md_code)

    diffs = 0
    for idx_str, name_str in md_dishes:
        idx = int(idx_str)
        if idx < len(blocks):
            ts_name = blocks[idx][0].split('(')[0].strip()
            md_name = name_str.strip().split('(')[0].strip()
            if ts_name != md_name:
                diffs += 1
                print(f"[{var_name} #{idx:2d}] TS: '{ts_name}' != MD: '{md_name}'")
    print(f"[{var_name}] Total items: {len(blocks)}, Total diffs: {diffs}")

check_category_alignment('src/data/foods.ts', 'src/data/prompts_foods_japan.md', 'FOODS')
check_category_alignment('src/data/drinks.ts', 'src/data/prompts_drinks_japan.md', 'DRINKS')
check_category_alignment('src/data/snacks.ts', 'src/data/prompts_snacks_japan.md', 'SNACKS')
check_category_alignment('src/data/pub.ts', 'src/data/prompts_pub_japan.md', 'PUB')
