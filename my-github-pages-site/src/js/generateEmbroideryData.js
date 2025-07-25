#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to the markdown files
const markdownDir = path.join(__dirname, '..', '..', 'content', 'embroideries', 'text');
const outputFile = path.join(__dirname, 'embroideryData.js');

// List of all image files
const imageFiles = [
    '1.JPEG', '2.JPEG', '3.JPEG', '4.JPEG', '5.JPEG', '6.JPEG', '7.JPEG',
    '10.JPEG', '11.JPEG', '12.JPEG', '13.JPEG', '14.JPEG', '15.JPEG',
    '19.JPEG', '21.JPEG', '22.JPEG', '23.JPEG', '23 b.JPEG', '25.JPEG',
    '26.JPEG', '27.JPEG', '28.JPEG', '29.JPEG', '30.JPEG', '31.JPEG',
    '32.JPEG', '33.JPEG', '34.JPEG', '35.JPEG', '36.JPEG', '37.JPEG',
    '38.JPEG', '38 b.JPEG', '39.JPEG', '40.JPEG', '41.JPEG', '42.JPEG',
    '43.JPEG', '44.JPEG', '45.JPEG'
];

function getMarkdownFileName(imageFile) {
    return imageFile.replace('.JPEG', '').replace(' ', '').toLowerCase() + '.md';
}

function parseFrontmatter(frontmatterString) {
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

function parseMarkdownFile(content, imageFile) {
    try {
        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            throw new Error('No frontmatter found');
        }

        const frontmatter = parseFrontmatter(frontmatterMatch[1]);
        
        // Extract content sections
        const contentAfterFrontmatter = content.substring(frontmatterMatch[0].length);
        const sections = contentAfterFrontmatter.split(/^# /m).filter(s => s.trim());
        
        let descriptionNL = '';
        let descriptionEN = '';

        // Parse Dutch and English content sections
        sections.forEach((section, index) => {
            const lines = section.trim().split('\n');
            const title = lines[0];
            const content = lines.slice(1).join('\n').trim();

            // The first content section is Dutch, the second is English
            if (index === 0) {
                descriptionNL = content;
            } else if (index === 1) {
                descriptionEN = content;
            }
        });

        return {
            image: imageFile,
            category: frontmatter.category || 'traditioneel',
            titleNL: frontmatter.title_nl || `Borduurwerk ${imageFile}`,
            titleEN: frontmatter.title_en || `Embroidery ${imageFile}`,
            descriptionNL: descriptionNL || frontmatter.description_nl || 'Beschrijving komt binnenkort...',
            descriptionEN: descriptionEN || frontmatter.description_en || 'Description coming soon...',
            dimensions: frontmatter.dimensions || '25x30 cm',
            price: frontmatter.price || '',
            technique: frontmatter.technique || 'Kruissteek',
            year: frontmatter.year || '2024',
            tags: frontmatter.tags || []
        };
    } catch (error) {
        console.warn(`Error parsing ${imageFile}:`, error);
        return createFallbackData(imageFile);
    }
}

function createFallbackData(imageFile) {
    const imageNumber = imageFile.replace(/[^\d]/g, '');
    return {
        image: imageFile,
        category: 'traditioneel',
        titleNL: `Borduurwerk ${imageNumber}`,
        titleEN: `Embroidery ${imageNumber}`,
        descriptionNL: 'Beschrijving wordt binnenkort toegevoegd...',
        descriptionEN: 'Description will be added soon...',
        dimensions: '25x30 cm',
        price: '',
        technique: 'Kruissteek',
        year: '2024',
        tags: []
    };
}

// Generate the data
const embroideryData = [];

imageFiles.forEach(imageFile => {
    const markdownFile = getMarkdownFileName(imageFile);
    const markdownPath = path.join(markdownDir, markdownFile);
    
    try {
        if (fs.existsSync(markdownPath)) {
            const content = fs.readFileSync(markdownPath, 'utf8');
            const parsedData = parseMarkdownFile(content, imageFile);
            embroideryData.push(parsedData);
        } else {
            console.warn(`Markdown file not found: ${markdownFile}`);
            embroideryData.push(createFallbackData(imageFile));
        }
    } catch (error) {
        console.error(`Error reading ${markdownFile}:`, error);
        embroideryData.push(createFallbackData(imageFile));
    }
});

// Generate the JavaScript file
const jsContent = `// Auto-generated embroidery data from markdown files
// Generated on ${new Date().toISOString()}

window.EMBROIDERY_DATA = ${JSON.stringify(embroideryData, null, 2)};
`;

fs.writeFileSync(outputFile, jsContent, 'utf8');
console.log(`Generated ${outputFile} with ${embroideryData.length} embroidery items`);
console.log('To regenerate this file, run: node generateEmbroideryData.js');
