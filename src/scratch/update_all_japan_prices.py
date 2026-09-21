import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Update prices in foods.ts (120 items)
main_prices = [
    950, 850, 500, 750, 850, 1800, 900, 750, 880, 780, 980, 750, # Sheet 0
    880, 650, 750, 950, 1450, 980, 850, 780, 1500, 950, 850, 950, # Sheet 1
    1800, 780, 980, 450, 750, 880, 880, 1600, 900, 850, 950, 580, # Sheet 2
    950, 1450, 900, 880, 780, 680, 900, 550, 650, 2400, 1100, 850, # Sheet 3
    850, 950, 800, 1100, 980, 1050, 1800, 550, 750, 950, 780, 980, # Sheet 4
    850, 800, 750, 950, 850, 780, 1200, 950, 880, 880, 980, 980, # Sheet 5
    880, 950, 1100, 1050, 950, 750, 580, 880, 980, 1200, 900, 850, # Sheet 6
    1350, 850, 950, 780, 880, 980, 980, 750, 980, 850, 1100, 1200, # Sheet 7
    950, 1100, 750, 2200, 750, 850, 1100, 1100, 880, 980, 1350, 1100, # Sheet 8
    2500, 1450, 1350, 2200, 2400, 2200, 1100, 1250, 1600, 1100, 2400, 1500 # Sheet 9
]

with open('src/data/foods.ts', 'r', encoding='utf-8') as f:
    foods_code = f.read()

def replace_prices(code, new_prices):
    idx = 0
    def replacer(match):
        nonlocal idx
        p = new_prices[idx] if idx < len(new_prices) else match.group(1)
        idx += 1
        return f"price: {p}"
    return re.sub(r'price:\s*\d+', replacer, code)

new_foods_code = replace_prices(foods_code, main_prices)
with open('src/data/foods.ts', 'w', encoding='utf-8') as f:
    f.write(new_foods_code)
print(f"Updated foods.ts with {len(main_prices)} JPY prices!")

# 2. Update drinks.ts (36 items)
drinks_prices = [
    450, 300, 450, 400, 250, 450, 600, 300, 350, 350, 500, 500,
    450, 450, 500, 450, 450, 450, 300, 250, 350, 450, 300, 450,
    300, 450, 550, 450, 450, 450, 350, 450, 400, 450, 400, 450
]

with open('src/data/drinks.ts', 'r', encoding='utf-8') as f:
    drinks_code = f.read()

new_drinks_code = replace_prices(drinks_code, drinks_prices)
with open('src/data/drinks.ts', 'w', encoding='utf-8') as f:
    f.write(new_drinks_code)
print(f"Updated drinks.ts with {len(drinks_prices)} JPY prices!")

# 3. Update snacks.ts (36 items)
snacks_prices = [
    350, 300, 250, 250, 350, 450, 500, 250, 650, 350, 850, 380,
    350, 300, 250, 280, 350, 300, 980, 350, 450, 350, 220, 350,
    650, 350, 450, 350, 300, 250, 550, 350, 300, 300, 650, 350
]

with open('src/data/snacks.ts', 'r', encoding='utf-8') as f:
    snacks_code = f.read()

new_snacks_code = replace_prices(snacks_code, snacks_prices)
with open('src/data/snacks.ts', 'w', encoding='utf-8') as f:
    f.write(new_snacks_code)
print(f"Updated snacks.ts with {len(snacks_prices)} JPY prices!")

# 4. Update pub.ts (36 items)
pub_prices = [
    850, 980, 650, 1800, 650, 450, 580, 750, 850, 650, 450, 450,
    750, 480, 400, 580, 550, 580, 350, 480, 580, 450, 450, 650,
    380, 980, 780, 450, 650, 550, 450, 400, 450, 450, 750, 980
]

with open('src/data/pub.ts', 'r', encoding='utf-8') as f:
    pub_code = f.read()

new_pub_code = replace_prices(pub_code, pub_prices)
with open('src/data/pub.ts', 'w', encoding='utf-8') as f:
    f.write(new_pub_code)
print(f"Updated pub.ts with {len(pub_prices)} JPY prices!")
