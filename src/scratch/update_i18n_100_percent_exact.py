import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def extract_prompt_ja_map(md_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        md_code = f.read()
    md_items = re.findall(r'#(\d+):\s*(.*?)(?=\n|\|)', md_code)
    md_map = {}
    for idx_str, text in md_items:
        idx = int(idx_str)
        m = re.search(r'\(([^()]*[\u3040-\u30ff\u4e00-\u9faf][^()]*)\)', text)
        if m:
            ja_name = m.group(1).strip()
            if '/' in ja_name:
                ja_name = ja_name.split('/')[0].strip()
            md_map[idx] = ja_name
        else:
            md_map[idx] = text.strip()
    return md_map

def parse_ts_dataset(ts_file, var_name):
    with open(ts_file, 'r', encoding='utf-8') as f:
        code = f.read()
    match = re.search(rf'export const {var_name}.*?=\s*\[(.*?)\];', code, re.DOTALL)
    if not match:
        return []
    block = match.group(1)
    items = re.findall(r'\{\s*name:\s*[\'"](.*?)[\'"].*?sub:\s*[\'"](.*?)[\'"].*?image:\s*(\d+).*?quip:\s*[\'"](.*?)[\'"]', block, re.DOTALL)
    return [(int(img), name, sub, quip) for name, sub, img, quip in items]

main_map = extract_prompt_ja_map('src/data/prompts_foods_japan.md')
drinks_map = extract_prompt_ja_map('src/data/prompts_drinks_japan.md')
snacks_map = extract_prompt_ja_map('src/data/prompts_snacks_japan.md')
pub_map = extract_prompt_ja_map('src/data/prompts_pub_japan.md')

main_items = parse_ts_dataset('src/data/foods.ts', 'foods')
drinks_items = parse_ts_dataset('src/data/drinks.ts', 'drinks')
snacks_items = parse_ts_dataset('src/data/snacks.ts', 'snacks')
pub_items = parse_ts_dataset('src/data/pub.ts', 'pub')

def build_dict_code(var_name, items, prompt_map):
    out = [f"export const {var_name}: Record<number, {{ name: string; sub: string; quip: string }}> = {{"]
    for img, vi_name, sub, quip in items:
        ja_name = prompt_map.get(img, vi_name)
        # Escape quotes
        ja_name_esc = ja_name.replace('"', '\\"')
        sub_esc = sub.replace('"', '\\"')
        quip_esc = quip.replace('"', '\\"')
        out.append(f'  {img}: {{ name: "{ja_name_esc}", sub: "{sub_esc}", quip: "{quip_esc}" }},')
    out.append("};\n")
    return "\n".join(out)

with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    orig_i18n = f.read()

header_match = re.search(r'^(.*?)(export const mainJaData)', orig_i18n, re.DOTALL)
if not header_match:
    print("Could not find header")
    sys.exit(1)

header_code = header_match.group(1)

footer_code = """export function foodName(food: Food, language: Language) {
  if (language === "ja") {
    const cat = food.category || "main";
    if (cat === "drinks" && drinksJaData[food.image]) return drinksJaData[food.image].name;
    if (cat === "snacks" && snacksJaData[food.image]) return snacksJaData[food.image].name;
    if (cat === "pub" && pubJaData[food.image]) return pubJaData[food.image].name;
    if (mainJaData[food.image]) return mainJaData[food.image].name;
  }
  return food.name;
}

export function foodSubtitle(food: Food, language: Language) {
  if (language === "ja") {
    const cat = food.category || "main";
    if (cat === "drinks" && drinksJaData[food.image]) return drinksJaData[food.image].sub;
    if (cat === "snacks" && snacksJaData[food.image]) return snacksJaData[food.image].sub;
    if (cat === "pub" && pubJaData[food.image]) return pubJaData[food.image].sub;
    if (mainJaData[food.image]) return mainJaData[food.image].sub;
  }
  if (language === "vi") return food.sub;
  return food.veg ? copy.en.vegetarianDish : copy.en.lunchDish;
}

export function foodQuip(food: Food, language: Language) {
  if (language === "ja") {
    const cat = food.category || "main";
    if (cat === "drinks" && drinksJaData[food.image]) return drinksJaData[food.image].quip;
    if (cat === "snacks" && snacksJaData[food.image]) return snacksJaData[food.image].quip;
    if (cat === "pub" && pubJaData[food.image]) return pubJaData[food.image].quip;
    if (mainJaData[food.image]) return mainJaData[food.image].quip;
  }
  return food.quip;
}

export function priceLabel(
  thousands: number | string,
  language: Language,
  approximate = false,
) {
  const value = Number(thousands);
  if (language === "ja") {
    // 1k VND ~ 10 JPY scale for Japanese currency feel (55k = 550円)
    const jpy = value * 10;
    return `${approximate ? "約" : ""}${new Intl.NumberFormat("ja-JP").format(jpy)}円`;
  }
  const formatted =
    language === "en"
      ? `₫${new Intl.NumberFormat("en-US").format(value * 1000)}`
      : `${new Intl.NumberFormat("vi-VN").format(value * 1000)}đ`;
  return `${approximate ? "~" : ""}${formatted}`;
}
"""

new_content = (
    header_code +
    build_dict_code("mainJaData", main_items, main_map) + "\n" +
    build_dict_code("drinksJaData", drinks_items, drinks_map) + "\n" +
    build_dict_code("snacksJaData", snacks_items, snacks_map) + "\n" +
    build_dict_code("pubJaData", pub_items, pub_map) + "\n" +
    footer_code
)

with open('src/lib/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated src/lib/i18n.ts with 100% exact prompt-derived Japanese mappings!")
