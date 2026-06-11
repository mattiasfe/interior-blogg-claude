"""
Run this script from the ROOT of your blog project:
  python update_images.py

It will replace all Unsplash coverImage URLs in content/posts/*.md
with your local images from public/images/.
"""

import os
import re

# ── Your images ──────────────────────────────────────────────────────────────
SCANDINAVIAN = [
    "/images/scandinavianLivingroom.jpg",
    "/images/scandinavianLivingroom2.jpg",
    "/images/cosyLivingroom.jpg",
    "/images/cosyLivingroom2.jpg",
    "/images/cosyLivingroom3.jpg",
]

SMALL_APARTMENT = [
    "/images/smallApartment.jpg",
    "/images/smallApartment2.jpg",
    "/images/smallApartment3.jpg",
    "/images/smallApartment4.jpg",
    "/images/smallApartment5.jpg",
    "/images/smallApartment6.jpg",
    "/images/smallApartment7.jpg",
]

FURNITURE = [
    "/images/furnitureSolutions.jpg",
    "/images/furnitureSolutions2.jpg",
    "/images/furnitureSolutions3.jpg",
    "/images/furnitureSolutions4.jpg",
    "/images/furnitureSolutions5.jpg",
    "/images/furnitureSolutions6.jpg",
]

INSPIRATION = [
    "/images/inspiration.jpg",
    "/images/inspiration2.jpg",
    "/images/inspiration3.jpg",
    "/images/inspiration4.jpg",
    "/images/inspiration5.jpg",
    "/images/inspiration6.jpg",
    "/images/inspiration7.jpg",
    "/images/inspiration8.jpg",
    "/images/inspiration9.jpg",
]

# ── Category keyword → image pool ────────────────────────────────────────────
def pick_pool(content: str) -> list:
    cat_match = re.search(r"category:\s*['\"]?(.+?)['\"]?\s*\n", content, re.IGNORECASE)
    if not cat_match:
        return SCANDINAVIAN
    cat = cat_match.group(1).lower()
    if "small" in cat or "apartment" in cat:
        return SMALL_APARTMENT
    if "furniture" in cat or "solution" in cat:
        return FURNITURE
    if "inspiration" in cat:
        return INSPIRATION
    return SCANDINAVIAN  # default: scandinavian style

# ── Process files ─────────────────────────────────────────────────────────────
posts_dir = os.path.join("content", "posts")

if not os.path.isdir(posts_dir):
    print(f"ERROR: Could not find '{posts_dir}'. Make sure you run this from the blog root folder.")
    exit(1)

md_files = sorted([f for f in os.listdir(posts_dir) if f.endswith(".md")])
counters = {"scandinavian": 0, "small": 0, "furniture": 0, "inspiration": 0}

updated = 0
skipped = 0

for i, filename in enumerate(md_files):
    path = os.path.join(posts_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    pool = pick_pool(content)

    # Pick image round-robin within the pool
    cat_match = re.search(r"category:\s*['\"]?(.+?)['\"]?\s*\n", content, re.IGNORECASE)
    cat = cat_match.group(1).lower() if cat_match else ""
    if "small" in cat or "apartment" in cat:
        key = "small"
    elif "furniture" in cat or "solution" in cat:
        key = "furniture"
    elif "inspiration" in cat:
        key = "inspiration"
    else:
        key = "scandinavian"

    image = pool[counters[key] % len(pool)]
    counters[key] += 1

    # Replace coverImage line (handles both quoted and unquoted, Unsplash or local)
    new_content, n = re.subn(
        r"(coverImage:\s*)['\"]?.*?['\"]?(\s*\n)",
        lambda m: f"coverImage: '{image}'\n",
        content,
        count=1
    )

    if n == 0:
        print(f"  SKIPPED (no coverImage field): {filename}")
        skipped += 1
        continue

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"  OK {filename}  ->  {image}")
    updated += 1

print(f"\nDone. {updated} posts updated, {skipped} skipped.")
print("Now run:  git add . && git commit -m 'Use local images' && git push")
