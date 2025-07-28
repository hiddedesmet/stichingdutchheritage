#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to the markdown files
const markdownDir = path.join(__dirname, '..', 'my-github-pages-site', 'content', 'embroideries', 'text');
const outputFile = path.join(__dirname, 'embroideryData.js');

// List of all image files
const imageFiles = [
    '1.JPEG', '2.JPEG', '3.JPEG', '4.JPEG', '5.JPEG', '6.JPEG', '7.JPEG',
    '10.JPEG', '11.JPEG', '12.JPEG', '13.JPEG', '14.JPEG', '15.JPEG',
    '19.JPEG', '21.JPEG', '22.JPEG', '23.JPEG', '23 b.JPEG', '25.JPEG',
    '26.JPEG', '27.JPEG', '28.JPEG', '29.JPEG', '30.JPEG', '31.JPEG',
    '32.JPEG', '33.JPEG', '34.JPEG', '35.JPEG', '36.JPEG', '37.JPEG',
    '38.JPEG', '38 b.JPEG', '39.JPEG', '40.JPEG', '41.JPEG', '42.JPEG',
    '43.JPEG', '44.JPEG', '45.JPEG', '46a.JPEG', '46b.JPEG', '46c.JPEG',
    '46d.JPEG', '46e.JPEG', '46f.JPEG', '47.JPEG', '48.JPEG', '49.JPEG',
    '50.JPEG', '51.JPEG', '52.JPEG', '56.JPEG', '57.JPEG', '58.JPEG', '59.JPEG'
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

        const mappedCategory = mapCategoryToFilter(frontmatter.category || 'traditioneel');
        
        return {
            image: imageFile,
            category: mappedCategory,
            subcategory: determineSubcategory(mappedCategory, frontmatter.title_nl || `Borduurwerk ${imageFile}`, descriptionNL || frontmatter.description_nl || ''),
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
        subcategory: 'onbekend',
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
let embroideryData = [];

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

// Function to determine subcategory based on category and content
function determineSubcategory(category, title, description) {
    const content = `${title} ${description}`.toLowerCase();
    
    switch (category) {
        case 'zaanse':
            if (content.includes('schans') || content.includes('molens')) return 'zaanse-schans';
            if (content.includes('sampler') || content.includes('merklap') || content.includes('houten huisjes')) return 'zaan-sampler';
            return 'zaanse-schans';
            
        case 'stadsgezichten':
            if (content.includes('1650') || content.includes('17de eeuw') || content.includes('amstelredam')) return '17de-eeuws';
            if (content.includes('waterlooplein') || content.includes('markt') || content.includes('plein')) return 'markt-plein';
            if (content.includes('paleis') || content.includes('dam') || content.includes('grachtenpand')) return 'iconische-panden';
            return 'algemeen-stadsgezicht';
            
        case 'molens':
            if (content.includes('stellingmolen') || content.includes('grondzeiler') || content.includes('tower mill') || content.includes('diverse molen')) return 'molentypen';
            if (content.includes('watermolen') || content.includes('polder') || content.includes('hollow post')) return 'watermolens';
            if (content.includes('zeilschip') || content.includes('sailing ship')) return 'molen-zeilschip';
            return 'molentypen';
            
        case 'klederdracht':
            if (content.includes('echtparen') || content.includes('kostuum') || content.includes('traditionele')) return 'traditionele-kostuums';
            if (content.includes('merklap') || content.includes('friesland') || content.includes('heraldiek') || content.includes('wapen')) return 'regio-merklappen';
            return 'traditionele-kostuums';
            
        case 'delfts':
            if (content.includes('tegel') || content.includes('molen') || content.includes('stokpaard')) return 'tegelmotieven';
            if (content.includes('postzegel') || content.includes('wilhelmina') || content.includes('juliana')) return 'postzegel-borduurwerken';
            return 'tegelmotieven';
            
        case 'koninklijk':
            if (content.includes('maintiendrai') || content.includes('wapen') || content.includes('devies') || content.includes('heraldiek')) return 'wapens-deviezen';
            if (content.includes('geboorte') || content.includes('inhuldiging') || content.includes('beatrix') || content.includes('amalia')) return 'inhuldigingen-geboorte';
            if (content.includes('huwelijk') || content.includes('claus') || content.includes('máxima') || content.includes('willem')) return 'huwelijks-jubileum';
            return 'wapens-deviezen';
            
        case 'flora':
            if (content.includes('viooltje') || content.includes('korenbloem') || content.includes('kaaps') || content.includes('wilde bloemen')) return 'kamer-wilde-bloemen';
            if (content.includes('bollenstreek') || content.includes('bollen') || content.includes('bulb')) return 'bloembollenlandschap';
            return 'kamer-wilde-bloemen';
            
        default:
            return 'algemeen';
    }
}

// Function to normalize categories to match website filters
function mapCategoryToFilter(category) {
    const categoryMap = {
        'traditioneel': 'stadsgezichten', // Map any remaining traditioneel to cityscapes
        'modern': 'stadsgezichten', // Map modern to cityscapes
        'zaanse': 'zaanse',
        'stadsgezichten': 'stadsgezichten',
        'landschap': 'stadsgezichten', // Map landscape to cityscapes
        'architectuur': 'stadsgezichten', // Map architecture to cityscapes
        'molens': 'molens',
        'waterbeheer': 'molens', // Map water management to windmills
        'industrie': 'molens', // Map industry to windmills (when it's mill-related)
        'klederdracht': 'klederdracht',
        'merklap': 'klederdracht', // Map samplers to traditional dress
        'delfts': 'delfts',
        'filatelie': 'delfts', // Map philately to delftware
        'koninklijk': 'koninklijk',
        'heraldiek': 'koninklijk', // Map heraldry to royal house
        'flora': 'flora',
        'transport': 'stadsgezichten' // Map transport to cityscapes
    };
    
    return categoryMap[category] || 'stadsgezichten';
}

// Function to add filter-related tags to ensure proper categorization
function addFilterTags(item) {
    const filterTags = {
        'zaanse': ['zaanse schans', 'zaan', 'zaanse'],
        'stadsgezichten': ['amsterdam', 'stadslandschap', 'grachten', 'architectuur'],
        'molens': ['molen', 'windmolen', 'watermolen'],
        'klederdracht': ['traditioneel', 'kostuum', 'dracht', 'merklap', 'sampler'],
        'delfts': ['delft', 'blauw', 'tegel', 'postzegel', 'filatelie'],
        'koninklijk': ['koning', 'koningin', 'prins', 'prinses', 'oranje', 'beatrix', 'wilhelmina', 'juliana'],
        'flora': ['bloem', 'plant', 'natuur', 'korenbloem']
    };

    const categoryTags = filterTags[item.category] || [];
    
    // Add category-specific tags if they're not already present
    categoryTags.forEach(tag => {
        const lowerTags = item.tags.map(t => t.toLowerCase());
        if (!lowerTags.includes(tag.toLowerCase()) && 
            (item.titleNL.toLowerCase().includes(tag.toLowerCase()) || 
             item.titleEN.toLowerCase().includes(tag.toLowerCase()) ||
             item.descriptionNL.toLowerCase().includes(tag.toLowerCase()) ||
             item.descriptionEN.toLowerCase().includes(tag.toLowerCase()))) {
            item.tags.push(tag);
        }
    });

    return item;
}

// Process and normalize the data
embroideryData = embroideryData.map(item => {
    // First check for Zaanse content and override category if needed
    const titleAndDesc = `${item.titleNL} ${item.titleEN} ${item.descriptionNL} ${item.descriptionEN}`.toLowerCase();
    
    if (titleAndDesc.includes('zaanse') || titleAndDesc.includes('zaan')) {
        item.category = 'zaanse';
        item.subcategory = determineSubcategory('zaanse', item.titleNL, item.descriptionNL);
    } else {
        // Use the mapping for other categories
        item.category = mapCategoryToFilter(item.category);
        item.subcategory = determineSubcategory(item.category, item.titleNL, item.descriptionNL);
    }
    
    // Add filter-related tags
    item = addFilterTags(item);
    
    // Ensure tags are unique and sorted
    item.tags = [...new Set(item.tags)].sort();
    
    return item;
});

// Generate the JavaScript file
const jsContent = `// Auto-generated embroidery data from markdown files
// Generated on ${new Date().toISOString()}

window.EMBROIDERY_DATA = ${JSON.stringify(embroideryData, null, 2)};
`;

fs.writeFileSync(outputFile, jsContent, 'utf8');
console.log(`Generated ${outputFile} with ${embroideryData.length} embroidery items`);
console.log('Categories mapped and tags normalized to match website filters');
console.log('To regenerate this file, run: node generateEmbroideryData.js');
