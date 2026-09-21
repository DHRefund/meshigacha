from PIL import Image
import os

# Open public/new/foods/food-48-59.webp
img_path = 'public/new/foods/food-48-59.webp'
if not os.path.exists(img_path):
    print("File does not exist:", img_path)
    exit()

img = Image.open(img_path)
w, h = img.size
print(f"Image size of food-48-59.webp: {w}x{h}")

tile_w = w // 4
tile_h = h // 3

# Crop Row 0, Col 0 (#48)
crop_48 = img.crop((0, 0, tile_w, tile_h))
crop_48.save('src/scratch/crop_48.png')
print("Saved crop_48.png (Row 0, Col 0 of food-48-59.webp)")

# Crop Row 0, Col 1 (#49)
crop_49 = img.crop((tile_w, 0, tile_w * 2, tile_h))
crop_49.save('src/scratch/crop_49.png')
print("Saved crop_49.png (Row 0, Col 1 of food-48-59.webp)")

# Let's also check public/new/foods/food-24-35.webp at Row 0, Col 3 (#27)
img_24 = Image.open('public/new/foods/food-24-35.webp')
w24, h24 = img_24.size
tile_w24 = w24 // 4
tile_h24 = h24 // 3
crop_27 = img_24.crop((tile_w24 * 3, 0, tile_w24 * 4, tile_h24))
crop_27.save('src/scratch/crop_27.png')
print("Saved crop_27.png (Row 0, Col 3 of food-24-35.webp)")
