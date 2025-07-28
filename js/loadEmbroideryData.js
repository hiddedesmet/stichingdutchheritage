// Load embroidery data from markdown files
class EmbroideryDataLoader {
    constructor() {
        this.embroideryData = [];
        this.loadData();
    }

    async loadData() {
        // List of all markdown files (corresponding to your images)
        const imageFiles = [
            '1.JPEG', '2.JPEG', '3.JPEG', '4.JPEG', '5.JPEG', '6.JPEG', '7.JPEG',
            '10.JPEG', '11.JPEG', '12.JPEG', '13.JPEG', '14.JPEG', '15.JPEG',
            '19.JPEG', '21.JPEG', '22.JPEG', '23 b.JPEG', '25.JPEG',
            '26.JPEG', '27.JPEG', '28.JPEG', '29.JPEG', '30.JPEG', '31.JPEG',
            '32.JPEG', '33.JPEG', '34.JPEG', '35.JPEG', '36.JPEG', '37.JPEG',
            '38 b.JPEG', '39.JPEG', '40.JPEG', '41.JPEG', '42.JPEG',
            '43.JPEG', '44.JPEG', '45.JPEG', '46a.JPEG', '46b.JPEG', '46c.JPEG',
            '46d.JPEG', '46e.JPEG', '46f.JPEG', '47.JPEG', '48.JPEG', '49.JPEG',
            '50.JPEG', '51.JPEG', '52.JPEG', '56.JPEG', '57.JPEG', '58.JPEG', '59.JPEG'
        ];

        for (const imageFile of imageFiles) {
            const markdownFile = this.getMarkdownFileName(imageFile);
            try {
                const response = await fetch(`../content/embroideries/text/${markdownFile}`);
                if (response.ok) {
                    const markdownContent = await response.text();
                    const parsedData = this.parseMarkdownFile(markdownContent, imageFile);
                    if (parsedData) {
                        this.embroideryData.push(parsedData);
                    }
                }
            } catch (error) {
                console.warn(`Could not load ${markdownFile}:`, error);
                // Fallback to default data for this image
                this.embroideryData.push(this.createFallbackData(imageFile));
            }
        }

        return this.embroideryData;
    }

    getMarkdownFileName(imageFile) {
        // Convert image filename to markdown filename
        // e.g., "1.JPEG" -> "1.md", "23 b.JPEG" -> "23b.md"
        return imageFile.replace('.JPEG', '').replace(' ', '').toLowerCase() + '.md';
    }

    parseMarkdownFile(content, imageFile) {
        try {
            // Extract frontmatter
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) {
                throw new Error('No frontmatter found');
            }

            const frontmatter = this.parseFrontmatter(frontmatterMatch[1]);
            
            // Extract content sections
            const contentAfterFrontmatter = content.substring(frontmatterMatch[0].length);
            const sections = contentAfterFrontmatter.split(/^# /m).filter(s => s.trim());
            
            let descriptionNL = '';
            let descriptionEN = '';

            // Parse Dutch and English content sections
            sections.forEach(section => {
                const lines = section.trim().split('\n');
                const title = lines[0];
                const content = lines.slice(1).join('\n').trim();

                if (frontmatter.title_nl && title.includes(frontmatter.title_nl.split(' ')[0])) {
                    descriptionNL = content;
                } else if (frontmatter.title_en && title.includes(frontmatter.title_en.split(' ')[0])) {
                    descriptionEN = content;
                }
            });

            return {
                image: imageFile,
                category: this.mapCategoryToFilter(frontmatter.category || 'traditioneel'),
                titleNL: frontmatter.title_nl || `Borduurwerk ${imageFile}`,
                titleEN: frontmatter.title_en || `Embroidery ${imageFile}`,
                descriptionNL: descriptionNL || frontmatter.description_nl || 'Beschrijving komt binnenkort...',
                descriptionEN: descriptionEN || frontmatter.description_en || 'Description coming soon...',
                dimensions: frontmatter.dimensions || '25x30 cm',
                technique: frontmatter.technique || 'Kruissteek',
                year: frontmatter.year || '2024',
                tags: frontmatter.tags || []
            };
        } catch (error) {
            console.warn(`Error parsing ${imageFile}:`, error);
            return this.createFallbackData(imageFile);
        }
    }

    parseFrontmatter(frontmatterString) {
        const result = {};
        const lines = frontmatterString.split('\n');
        
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                // Handle arrays (tags)
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
                }
                
                result[key] = value;
            }
        });
        
        return result;
    }

    mapCategoryToFilter(category) {
        // Map markdown categories to gallery filter categories
        const categoryMap = {
            'traditioneel': 'traditioneel',
            'modern': 'modern',
            'zaanse': 'zaanse',
            'stadsgezichten': 'stadsgezichten',
            'molens': 'molens',
            'klederdracht': 'klederdracht',
            'delfts': 'delfts',
            'koninklijk': 'koninklijk',
            'flora': 'flora'
        };
        
        return categoryMap[category] || 'traditioneel';
    }

    createFallbackData(imageFile) {
        // Create fallback data when markdown file cannot be loaded
        const imageNumber = imageFile.replace(/[^\d]/g, '');
        return {
            image: imageFile,
            category: 'traditioneel',
            titleNL: `Borduurwerk ${imageNumber}`,
            titleEN: `Embroidery ${imageNumber}`,
            descriptionNL: 'Beschrijving wordt binnenkort toegevoegd...',
            descriptionEN: 'Description will be added soon...',
            dimensions: '25x30 cm',
            technique: 'Kruissteek',
            year: '2024',
            tags: []
        };
    }
}

// Export for use in main.js
window.EmbroideryDataLoader = EmbroideryDataLoader;
