// Language switching and site functionality

class StitchingDutchHeritage {
    constructor() {
        this.currentLanguage = 'nl';
        this.embroideryData = [];
        this.currentImageIndex = 0;
        this.filteredData = [];
        this.init();
    }

    init() {
        this.setupLanguageSwitching();
        this.setupHamburgerMenu();
        this.setupModal();
        this.setupGalleryFilters();
        this.setInitialLanguage();
        this.loadEmbroideryData();
    }

    setupLanguageSwitching() {
        const langButtons = document.querySelectorAll('.lang-btn');
        const logo = document.getElementById('logo-image');

        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedLang = btn.dataset.lang;
                this.switchLanguage(selectedLang);
                
                // Update active language button
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Switch logo based on language
                if (selectedLang === 'en') {
                    logo.src = 'images/dutch-heritage-logo-en.svg';
                    logo.alt = 'Stitching Dutch Heritage Logo (English)';
                } else {
                    logo.src = 'images/dutch-heritage-logo-nl.svg';
                    logo.alt = 'Stitching Dutch Heritage Logo (Nederlands)';
                }
            });
        });
    }

    switchLanguage(language) {
        this.currentLanguage = language;
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Update all elements with data-nl and data-en attributes
        const elements = document.querySelectorAll('[data-nl][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${language}`);
            if (text) {
                element.textContent = text;
            }
        });

        // Show/hide language-specific content blocks
        this.toggleLanguageBlocks(language);
        
        // Update page title
        const title = document.querySelector('title');
        if (title) {
            const titleText = title.getAttribute(`data-${language}`);
            if (titleText) {
                title.textContent = titleText;
            }
        }

        // Re-render gallery with updated language
        this.populateGallery(this.filteredData);
        
        // Save language preference
        this.saveLanguagePreference(language);
    }

    toggleLanguageBlocks(language) {
        const nlBlocks = document.querySelectorAll('.nl-text');
        const enBlocks = document.querySelectorAll('.en-text');
        
        if (language === 'nl') {
            nlBlocks.forEach(block => {
                block.style.display = 'block';
                block.classList.add('fade-transition', 'active');
            });
            enBlocks.forEach(block => {
                block.style.display = 'none';
                block.classList.remove('active');
            });
        } else {
            enBlocks.forEach(block => {
                block.style.display = 'block';
                block.classList.add('fade-transition', 'active');
            });
            nlBlocks.forEach(block => {
                block.style.display = 'none';
                block.classList.remove('active');
            });
        }
    }

    setupHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (!hamburger || !navMenu) return;

        // Toggle menu function
        const toggleMenu = () => {
            const isActive = hamburger.classList.contains('active');
            
            if (isActive) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        };

        // Open menu
        this.openMenu = () => {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            document.body.classList.add('menu-open');
        };

        // Close menu
        this.closeMenu = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        };

        // Hamburger click event
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Prevent menu from closing when clicking inside it
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close menu when clicking on menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMenu();
                
                // Add a small delay before handling the menu item click
                setTimeout(() => {
                    this.handleMenuItemClick(item);
                }, 150);
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    handleMenuItemClick(item) {
        const fullText = item.textContent.trim().toLowerCase();
        console.log('Clicked menu item:', fullText); // Debug log
        
        // More robust mapping that handles the actual menu text and subcategories
        const subcategoryMap = {
            // Zaanse Taferelen subcategories
            'zaanse schans (molens, houten huisjes)': { category: 'zaanse', subcategory: 'zaanse-schans' },
            'zaan sampler en regionale merklappen': { category: 'zaanse', subcategory: 'zaan-sampler' },
            
            // Stadsgezichten subcategories
            '17de eeuwse impressies (amstelredam 1650, zicht op amsterdam)': { category: 'stadsgezichten', subcategory: '17de-eeuws' },
            '17de eeuwse impressies': { category: 'stadsgezichten', subcategory: '17de-eeuws' },
            'markt- en pleintaferelen (waterlooplein)': { category: 'stadsgezichten', subcategory: 'markt-plein' },
            'markt- en pleintaferelen': { category: 'stadsgezichten', subcategory: 'markt-plein' },
            'iconische panden en paleizen (paleis op de dam, grachtenpanden samplers)': { category: 'stadsgezichten', subcategory: 'iconische-panden' },
            'iconische panden en paleizen': { category: 'stadsgezichten', subcategory: 'iconische-panden' },
            
            // Molens subcategories
            'diverse molentypen (stellingmolen, grondzeiler, tower mill)': { category: 'molens', subcategory: 'molentypen' },
            'diverse molentypen': { category: 'molens', subcategory: 'molentypen' },
            'watermolens en polders (watermolen in holland, hollow post mill)': { category: 'molens', subcategory: 'watermolens' },
            'watermolens en polders': { category: 'molens', subcategory: 'watermolens' },
            'combinaties molen + zeilschip (dutch windmill and sailing ship)': { category: 'molens', subcategory: 'molen-zeilschip' },
            'combinaties molen + zeilschip': { category: 'molens', subcategory: 'molen-zeilschip' },
            
            // Klederdracht subcategories
            'traditionele kostuums (twaalf echtparen in klederdracht)': { category: 'klederdracht', subcategory: 'traditionele-kostuums' },
            'traditionele kostuums': { category: 'klederdracht', subcategory: 'traditionele-kostuums' },
            'regio merklappen (oud west friesland, nederlandse heraldiek met regionale wapenschilden)': { category: 'klederdracht', subcategory: 'regio-merklappen' },
            'regio merklappen': { category: 'klederdracht', subcategory: 'regio-merklappen' },
            
            // Delfts Blauw subcategories
            'tegelmotieven (tegel met molen, tegel met stokpaardjes)': { category: 'delfts', subcategory: 'tegelmotieven' },
            'tegelmotieven': { category: 'delfts', subcategory: 'tegelmotieven' },
            'postzegel borduurwerken (koningin wilhelmina 10 cent, koningin juliana 45 cent)': { category: 'delfts', subcategory: 'postzegel-borduurwerken' },
            'postzegel borduurwerken': { category: 'delfts', subcategory: 'postzegel-borduurwerken' },
            
            // Koninklijk Huis subcategories
            'wapens en deviezen (je maintiendrai)': { category: 'koninklijk', subcategory: 'wapens-deviezen' },
            'wapens en deviezen': { category: 'koninklijk', subcategory: 'wapens-deviezen' },
            'inhuldigingen en geboortelappen (beatrix 1980, geboorte prinses amalia, merklap geboorte beatrix)': { category: 'koninklijk', subcategory: 'inhuldigingen-geboorte' },
            'inhuldigingen en geboortelappen': { category: 'koninklijk', subcategory: 'inhuldigingen-geboorte' },
            'huwelijks en jubileumsamplers (beatrix & claus, willem alexander & máxima)': { category: 'koninklijk', subcategory: 'huwelijks-jubileum' },
            'huwelijks en jubileumsamplers': { category: 'koninklijk', subcategory: 'huwelijks-jubileum' },
            
            // Flora & Fauna subcategories
            'kamer- en wilde bloemen (kaaps viooltje, korenbloemen)': { category: 'flora', subcategory: 'kamer-wilde-bloemen' },
            'kamer- en wilde bloemen': { category: 'flora', subcategory: 'kamer-wilde-bloemen' },
            'bloembollenlandschap (de bollenstreek)': { category: 'flora', subcategory: 'bloembollenlandschap' },
            'bloembollenlandschap': { category: 'flora', subcategory: 'bloembollenlandschap' }
        };

        // Direct mapping lookup first
        let filterConfig = subcategoryMap[fullText];
        
        // If no direct match, try partial matching
        if (!filterConfig) {
            for (const [key, value] of Object.entries(subcategoryMap)) {
                // Try to match key words from the beginning of the text
                const keyWords = key.split(' ').slice(0, 3); // Take first 3 words
                const textWords = fullText.split(' ').slice(0, 3);
                
                // Check if the first few words match
                if (keyWords.every(word => fullText.includes(word))) {
                    filterConfig = value;
                    break;
                }
            }
        }
        
        // Apply filter based on configuration
        if (filterConfig) {
            console.log('Applying subcategory filter:', filterConfig); // Debug log
            this.filterGalleryBySubcategory(filterConfig.category, filterConfig.subcategory);
        } else {
            // Fallback to category-level filtering
            console.log('No subcategory match found, trying category-level filter for:', fullText);
            this.filterGallery('all'); // Default to show all
        }
        
        // Scroll to gallery
        const gallery = document.querySelector('.embroidery-gallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async loadEmbroideryData() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '<div class="gallery-loading"><div class="loading-spinner"></div><p>Laden van borduurwerken...</p></div>';
        }

        try {
            // Use the pre-generated data from embroideryData.js
            if (window.EMBROIDERY_DATA) {
                this.embroideryData = window.EMBROIDERY_DATA;
                this.filteredData = [...this.embroideryData];
                this.populateGallery(this.filteredData);
            } else {
                throw new Error('Embroidery data not loaded');
            }
        } catch (error) {
            console.error('Error loading embroidery data:', error);
            // Fallback to some basic data if loading fails
            this.setupFallbackData();
        }
    }

    setupFallbackData() {
        // Basic fallback data in case markdown files can't be loaded
        const imageFiles = [
            '1.JPEG', '2.JPEG', '3.JPEG', '4.JPEG', '5.JPEG', '6.JPEG', '7.JPEG',
            '10.JPEG', '11.JPEG', '12.JPEG', '13.JPEG', '14.JPEG', '15.JPEG',
            '19.JPEG', '21.JPEG', '22.JPEG', '23.JPEG', '25.JPEG', '26.JPEG',
            '27.JPEG', '28.JPEG', '29.JPEG', '30.JPEG', '31.JPEG', '32.JPEG',
            '33.JPEG', '34.JPEG', '35.JPEG', '36.JPEG', '37.JPEG', '38.JPEG',
            '39.JPEG', '40.JPEG', '41.JPEG', '42.JPEG', '43.JPEG', '44.JPEG', '45.JPEG'
        ];

        this.embroideryData = imageFiles.map((image, index) => ({
            image,
            category: 'traditioneel',
            titleNL: `Borduurwerk ${index + 1}`,
            titleEN: `Embroidery ${index + 1}`,
            descriptionNL: 'Beschrijving wordt binnenkort toegevoegd...',
            descriptionEN: 'Description will be added soon...',
            dimensions: '25x30 cm',
            technique: 'Kruissteek',
            year: '2024',
            tags: []
        }));

        this.filteredData = [...this.embroideryData];
        this.populateGallery(this.filteredData);
    }

    setupGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter gallery
                this.filterGallery(filter);
            });
        });
    }

    filterGallery(category) {
        if (category === 'all') {
            this.filteredData = [...this.embroideryData];
        } else {
            this.filteredData = this.embroideryData.filter(item => item.category === category);
        }
        
        this.populateGallery(this.filteredData);
    }

    filterGalleryBySubcategory(category, subcategory) {
        this.filteredData = this.embroideryData.filter(item => 
            item.category === category && item.subcategory === subcategory
        );
        
        this.populateGallery(this.filteredData);
    }

    populateGallery(data) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        // Show loading state
        galleryGrid.innerHTML = '<div class="gallery-loading"><div class="loading-spinner"></div><p>Laden van borduurwerken...</p></div>';

        // Simulate loading delay for better UX
        setTimeout(() => {
            galleryGrid.innerHTML = '';

            data.forEach((item, index) => {
                const galleryItem = this.createGalleryItem(item, index);
                galleryGrid.appendChild(galleryItem);
            });

            // Trigger animation
            setTimeout(() => {
                const items = galleryGrid.querySelectorAll('.gallery-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('show');
                    }, index * 100);
                });
            }, 50);
        }, 300);
    }

    createGalleryItem(item, index) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.index = index;
        
        const categoryText = this.getCategoryText(item.category);
        const subcategoryText = this.getSubcategoryText(item.subcategory);
        const title = this.currentLanguage === 'nl' ? item.titleNL : item.titleEN;
        const priceText = this.currentLanguage === 'nl' ? 'Prijs' : 'Price';
        const detailsText = this.currentLanguage === 'nl' ? 'Bekijk details' : 'View details';
        
        // Create price info HTML only if price exists
        const priceHtml = item.price ? `<p class="price">${priceText}: ${item.price}</p>` : '';
        
        // Create subcategory display
        const subcategoryHtml = subcategoryText ? ` • ${subcategoryText}` : '';
        
        div.innerHTML = `
            <img src="images/${item.image}" alt="${title}" loading="lazy">
            <div class="item-info">
                <span class="item-category">${categoryText}${subcategoryHtml}</span>
                <h3>${title}</h3>
                ${priceHtml}
                <div class="item-actions">
                    <button class="details-button">
                        <i class="fas fa-eye"></i>
                        <span>${detailsText}</span>
                    </button>
                </div>
            </div>
            <div class="hover-overlay">
                <div class="overlay-content">
                    <i class="fas fa-search-plus"></i>
                    <p>${detailsText}</p>
                </div>
            </div>
        `;
        
        // Add click handler for modal
        div.addEventListener('click', () => {
            this.openModal(item, this.filteredData.indexOf(item));
        });

        return div;
    }

    getCategoryText(category) {
        const categoryTexts = {
            'traditioneel': { nl: 'Traditioneel', en: 'Traditional' },
            'modern': { nl: 'Modern', en: 'Modern' },
            'zaanse': { nl: 'Zaanse Taferelen', en: 'Zaan Region' },
            'stadsgezichten': { nl: 'Stadsgezichten', en: 'Cityscapes' },
            'molens': { nl: 'Molens', en: 'Windmills' },
            'klederdracht': { nl: 'Klederdracht', en: 'Traditional Dress' },
            'delfts': { nl: 'Delfts Blauw', en: 'Delftware' },
            'koninklijk': { nl: 'Koninklijk Huis', en: 'Royal House' },
            'flora': { nl: 'Flora & Fauna', en: 'Flora & Fauna' }
        };
        
        return categoryTexts[category] ? categoryTexts[category][this.currentLanguage] : category;
    }

    getSubcategoryText(subcategory) {
        const subcategoryTexts = {
            // Zaanse subcategories
            'zaanse-schans': { nl: 'Zaanse Schans', en: 'Zaanse Schans' },
            'zaan-sampler': { nl: 'Zaan Sampler', en: 'Zaan Sampler' },
            
            // Stadsgezichten subcategories
            '17de-eeuws': { nl: '17de eeuw', en: '17th Century' },
            'markt-plein': { nl: 'Markt & Plein', en: 'Market & Square' },
            'iconische-panden': { nl: 'Iconische Panden', en: 'Iconic Buildings' },
            'algemeen-stadsgezicht': { nl: 'Algemeen', en: 'General' },
            
            // Molens subcategories
            'molentypen': { nl: 'Molentypen', en: 'Mill Types' },
            'watermolens': { nl: 'Watermolens', en: 'Water Mills' },
            'molen-zeilschip': { nl: 'Molen & Zeilschip', en: 'Mill & Sailing Ship' },
            
            // Klederdracht subcategories
            'traditionele-kostuums': { nl: 'Traditionele Kostuums', en: 'Traditional Costumes' },
            'regio-merklappen': { nl: 'Regio Merklappen', en: 'Regional Samplers' },
            
            // Delfts subcategories
            'tegelmotieven': { nl: 'Tegelmotieven', en: 'Tile Motifs' },
            'postzegel-borduurwerken': { nl: 'Postzegel Borduurwerken', en: 'Postage Stamp Embroidery' },
            
            // Koninklijk subcategories
            'wapens-deviezen': { nl: 'Wapens & Deviezen', en: 'Coats of Arms & Mottos' },
            'inhuldigingen-geboorte': { nl: 'Inhuldigingen & Geboorte', en: 'Inaugurations & Birth' },
            'huwelijks-jubileum': { nl: 'Huwelijks & Jubileum', en: 'Wedding & Jubilee' },
            
            // Flora subcategories
            'kamer-wilde-bloemen': { nl: 'Kamer- & Wilde Bloemen', en: 'House & Wild Flowers' },
            'bloembollenlandschap': { nl: 'Bloembollenlandschap', en: 'Flower Bulb Landscape' }
        };
        
        return subcategoryTexts[subcategory] ? subcategoryTexts[subcategory][this.currentLanguage] : '';
    }

    setupModal() {
        const modal = document.getElementById('image-modal');
        const closeBtn = document.querySelector('.close-modal');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Close modal events
        closeBtn.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Navigation events
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPreviousImage();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showNextImage();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('show')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.showPreviousImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                }
            }
        });
    }

    openModal(item, index) {
        const modal = document.getElementById('image-modal');
        this.currentImageIndex = index;
        
        this.updateModalContent(item);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('image-modal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    showPreviousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.filteredData.length) % this.filteredData.length;
        this.updateModalContent(this.filteredData[this.currentImageIndex]);
    }

    showNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.filteredData.length;
        this.updateModalContent(this.filteredData[this.currentImageIndex]);
    }

    updateModalContent(item) {
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalCategory = document.getElementById('modal-category');
        const modalDimensions = document.getElementById('modal-dimensions');
        const modalTechnique = document.getElementById('modal-technique');
        const modalYear = document.getElementById('modal-year');
        const modalPrice = document.getElementById('modal-price');

        const title = this.currentLanguage === 'nl' ? item.titleNL : item.titleEN;
        const description = this.currentLanguage === 'nl' ? item.descriptionNL : item.descriptionEN;
        const categoryText = this.getCategoryText(item.category);

        modalImage.src = `images/${item.image}`;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalCategory.textContent = categoryText;
        modalDimensions.textContent = item.dimensions;
        modalTechnique.textContent = item.technique;
        modalYear.textContent = item.year;
        modalPrice.textContent = item.price || '';
    }

    setInitialLanguage() {
        // Check for saved language preference or browser language
        const savedLang = localStorage.getItem('stitching-heritage-lang');
        const browserLang = navigator.language.slice(0, 2);
        
        let initialLang = 'nl'; // Default to Dutch
        
        if (savedLang && (savedLang === 'nl' || savedLang === 'en')) {
            initialLang = savedLang;
        } else if (browserLang === 'en') {
            initialLang = 'en';
        }
        
        // Set initial language
        if (initialLang !== 'nl') {
            const enButton = document.querySelector('[data-lang="en"]');
            if (enButton) {
                enButton.click();
            }
        }
    }

    // Save language preference
    saveLanguagePreference(language) {
        localStorage.setItem('stitching-heritage-lang', language);
    }
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StitchingDutchHeritage();
    setupLazyLoading();
    
    // Add some entrance animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StitchingDutchHeritage;
}