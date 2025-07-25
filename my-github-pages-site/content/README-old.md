# Content Management for Embroideries

This folder contains individual markdown files for each embroidery piece in your collection.

## Structure

```
content/
├── embroideries/
│   └── text/        # Combined Dutch/English content files
│       ├── 1.md
│       ├── 2.md
│       ├── ...
│       └── 45.md
```

## How to Edit

1. Open any `.md` file (e.g., `text/1.md`)
2. Update the frontmatter fields with your information
3. Replace placeholder text with actual descriptions in both Dutch and English sections
4. Save the file

## File Format

Each markdown file contains both Dutch and English content in a single file:

## Categories Available

Based on your website menu:
- `traditioneel` (Traditional)
- `modern` (Modern)
- `kinderborduurwerk` (Children's Embroidery)
- `kerstborduurwerk` (Christmas Embroidery)
- `applicatie` (Appliqué)
- `kruissteek` (Cross Stitch)
- `hardanger` (Hardanger)
- `blackwork` (Blackwork)
- `richelieu` (Richelieu)
- `platsteek` (Satin Stitch)

## Example

```markdown
---
title_nl: "Hollandse Tulpen Tafelkleed"
title_en: "Dutch Tulips Tablecloth"
description_nl: "Een prachtig traditioneel tafelkleed met tulpenmotief..."
description_en: "A beautiful traditional tablecloth with tulip motifs..."
image: "1.JPEG"
category: "traditioneel"
technique: "Platsteek"
dimensions: "120 x 80 cm"
year: "2023"
tags: ["tulpen", "tafelkleed", "traditioneel"]
---

# Hollandse Tulpen Tafelkleed

Dit prachtige tafelkleed toont de klassieke Nederlandse tulpenmotieven...

---

# Dutch Tulips Tablecloth

This beautiful tablecloth showcases classic Dutch tulip motifs...
```
