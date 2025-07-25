# Content Management for Embroideries

This folder contains individual markdown files for each embroidery piece in your collection.

## ✅ Successfully Implemented

Your image gallery now **automatically pulls all information from the markdown files**! 

The system works as follows:
1. **Markdown Files** → `content/embroideries/text/*.md`
2. **Data Generation** → `src/js/generateEmbroideryData.js` 
3. **Website Display** → Gallery shows live data from your markdown content

## Structure

```
content/
├── embroideries/
│   └── text/        # Combined Dutch/English content files
│       ├── 1.md     ✅ Amstelredam 1650 (COMPLETE)
│       ├── 2.md     ✅ Waterlooplein (COMPLETE) 
│       ├── 3.md     ✅ Zicht op Amsterdam (COMPLETE)
│       ├── 4.md     📝 (needs content)
│       ├── ...
│       └── 45.md    📝 (needs content)
```

## How to Update Content

### Step 1: Edit Markdown Files
- Open any `.md` file (e.g., `text/4.md`)
- Update the frontmatter fields with your information
- Replace placeholder text with actual descriptions
- Save the file

### Step 2: Regenerate Website Data
```bash
cd src/js
node generateEmbroideryData.js
```

### Step 3: View Changes
- Refresh your website to see the updated gallery

## File Format

Each markdown file contains both Dutch and English content:

```markdown
---
title_nl: "Hollandse Tulpen"
title_en: "Dutch Tulips"
description_nl: "Een prachtig borduurwerk met tulpenmotief..."
description_en: "A beautiful embroidery with tulip motifs..."
image: "4.JPEG"
category: "traditioneel"
technique: "Kruissteek"
dimensions: "25x30 cm"
year: "2024"
tags: ["tulpen", "bloemen"]
---

# Hollandse Tulpen

Uitgebreide Nederlandse beschrijving...

---

# Dutch Tulips

Detailed English description...
```

## Categories Available

- `traditioneel` (Traditional) - for classic Dutch embroidery
- `modern` (Modern) - for contemporary pieces
- Plus categories for filtering: `zaanse`, `stadsgezichten`, `molens`, `klederdracht`, `delfts`, `koninklijk`, `flora`

## Current Progress

✅ **System Working:** Gallery loads from markdown files  
✅ **Completed Content:** 3 embroideries with full descriptions  
📝 **Remaining:** 37 embroideries need content added

## Benefits

- **Dynamic Content:** Gallery automatically updates when you edit markdown
- **Bilingual Support:** Both Dutch and English in same file
- **Rich Metadata:** Categories, tags, dimensions, techniques
- **Easy Management:** Simple text files, no database needed
- **Version Control:** Track changes with Git
