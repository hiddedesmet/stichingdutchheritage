// Language switching and site functionality

class StitchingDutchHeritage {
    constructor() {
        this.currentLanguage = 'nl';
        this.embroideryData = [];
        this.currentImageIndex = 0;
        this.filteredData = [];
        this.featuredWorksIndex = 0;
        this.featuredRotationInterval = null;
        this.init();
    }

    init() {
        this.setupLanguageSwitching();
        this.setupHamburgerMenu();
        this.setupModal();
        this.setupGalleryFilters();
        this.setupExpandButton();
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
                // Use innerHTML for elements that contain HTML markup (like spans)
                if (text.includes('<span') || text.includes('</span>')) {
                    element.innerHTML = text;
                } else {
                    element.textContent = text;
                }
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
        
        // Update featured work title for new language
        this.updateFeaturedWork();
        
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
        const menuItems = navMenu.querySelectorAll('.nav-category-item');
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
        const filterValue = item.getAttribute('data-filter');
        console.log('Clicked menu item with filter:', filterValue); // Debug log
        
        if (filterValue) {
            // Apply the filter directly using the data-filter attribute
            this.filterGallery(filterValue);
            
            // Update the active state on the filter button
            this.updateActiveFilterButton(filterValue);
            
            // Close the hamburger menu
            this.closeMenu();
        }
        
        // Scroll to gallery
        const gallery = document.querySelector('.embroidery-gallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupExpandButton() {
        const expandBtn = document.getElementById('expand-btn');
        const expandedText = document.getElementById('expanded-text');
        
        if (!expandBtn || !expandedText) return;
        
        expandBtn.addEventListener('click', () => {
            const isExpanded = expandedText.classList.contains('show');
            
            if (isExpanded) {
                expandedText.classList.remove('show');
                expandBtn.classList.remove('expanded');
                
                // Update button text
                const btnText = expandBtn.querySelector('span');
                if (this.currentLanguage === 'nl') {
                    btnText.textContent = 'Lees meer over onze geschiedenis';
                } else {
                    btnText.textContent = 'Read more about our history';
                }
            } else {
                expandedText.classList.add('show');
                expandBtn.classList.add('expanded');
                
                // Update button text
                const btnText = expandBtn.querySelector('span');
                if (this.currentLanguage === 'nl') {
                    btnText.textContent = 'Verberg tekst';
                } else {
                    btnText.textContent = 'Hide text';
                }
            }
        });
    }

    updateActiveFilterButton(category) {
        console.log('Updating active filter button for category:', category); // Debug log
        
        // Remove active class from all filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to the corresponding filter button (not hamburger menu items)
        const targetButton = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        console.log('Found target button:', targetButton); // Debug log
        if (targetButton) {
            targetButton.classList.add('active');
            console.log('Added active class to button:', targetButton); // Debug log
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
                // Set up featured rotation now that we have all the data
                this.setupFeaturedRotation();
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
        // Set up featured rotation for fallback data too
        this.setupFeaturedRotation();
    }

    setupFeaturedRotation() {
        // Use all embroidery data for the carousel instead of just a few pieces
        if (this.embroideryData && this.embroideryData.length > 0) {
            this.featuredWorks = this.embroideryData.map(item => ({
                image: item.image,
                titleNL: item.titleNL,
                titleEN: item.titleEN,
                category: item.category
            }));
        } else {
            // Fallback to curated list if embroidery data isn't loaded yet
            this.featuredWorks = [
                {
                    image: '38.JPEG',
                    titleNL: 'Amstelredam 1650',
                    titleEN: 'Amsterdam 1650',
                    category: 'stadsgezichten'
                },
                {
                    image: '23.JPEG',
                    titleNL: 'Zaanse Schans',
                    titleEN: 'Zaanse Schans',
                    category: 'zaanse'
                },
                {
                    image: '42.JPEG',
                    titleNL: 'Je Maintiendrai',
                    titleEN: 'Je Maintiendrai',
                    category: 'koninklijk'
                },
                {
                    image: '27.JPEG',
                    titleNL: 'Stellingmolen',
                    titleEN: 'Post Mill',
                    category: 'molens'
                },
                {
                    image: '44.JPEG',
                    titleNL: 'Kaaps Viooltje',
                    titleEN: 'Cape Violet',
                    category: 'flora'
                },
                {
                    image: '32.JPEG',
                    titleNL: 'Twaalf Echtparen',
                    titleEN: 'Twelve Couples',
                    category: 'klederdracht'
                }
            ];
        }

        // Start rotation after data is loaded
        this.startFeaturedRotation();
    }

    startFeaturedRotation() {
        // Update featured work immediately
        this.updateFeaturedWork();
        
        // Set up automatic rotation every 15 seconds (slower)
        this.featuredRotationInterval = setInterval(() => {
            this.rotateFeaturedWork();
        }, 15000);

        // Pause rotation on hover
        const featuredContainer = document.querySelector('.featured-embroidery');
        if (featuredContainer) {
            featuredContainer.addEventListener('mouseenter', () => {
                clearInterval(this.featuredRotationInterval);
            });

            featuredContainer.addEventListener('mouseleave', () => {
                this.featuredRotationInterval = setInterval(() => {
                    this.rotateFeaturedWork();
                }, 15000);
            });

            // Add click handler to open modal with current featured work details
            featuredContainer.addEventListener('click', (e) => {
                // Don't trigger if clicking on navigation buttons
                if (e.target.closest('.featured-prev') || e.target.closest('.featured-next')) {
                    return;
                }
                
                const currentWork = this.featuredWorks[this.featuredWorksIndex];
                
                // Find the full embroidery data for this work to get all details
                const fullWorkData = this.embroideryData.find(item => item.image === currentWork.image);
                
                if (fullWorkData) {
                    // Open the modal with the current featured work
                    this.openModal(fullWorkData, this.featuredWorksIndex);
                }
            });
        }

        // Set up navigation buttons
        const prevBtn = document.getElementById('featured-prev');
        const nextBtn = document.getElementById('featured-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousFeaturedWork();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextFeaturedWork();
            });
        }
    }

    previousFeaturedWork() {
        clearInterval(this.featuredRotationInterval);
        this.featuredWorksIndex = (this.featuredWorksIndex - 1 + this.featuredWorks.length) % this.featuredWorks.length;
        this.updateFeaturedWork();
        
        // Restart rotation with 10 second timing
        this.featuredRotationInterval = setInterval(() => {
            this.rotateFeaturedWork();
        }, 10000);
    }

    nextFeaturedWork() {
        clearInterval(this.featuredRotationInterval);
        this.rotateFeaturedWork();
        
        // Restart rotation with 10 second timing
        this.featuredRotationInterval = setInterval(() => {
            this.rotateFeaturedWork();
        }, 10000);
    }

    rotateFeaturedWork() {
        this.featuredWorksIndex = (this.featuredWorksIndex + 1) % this.featuredWorks.length;
        this.updateFeaturedWork();
    }

    updateFeaturedWork() {
        const featuredImage = document.getElementById('featured-image');
        const featuredTitle = document.querySelector('.featured-title');
        const featuredContainer = document.querySelector('.featured-embroidery');
        
        if (!featuredImage || !featuredTitle || !featuredContainer) return;

        const currentWork = this.featuredWorks[this.featuredWorksIndex];
        
        // Add fade out effect
        featuredContainer.style.opacity = '0.7';
        featuredContainer.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // Update content
            featuredImage.src = `images/${currentWork.image}`;
            featuredImage.alt = this.currentLanguage === 'nl' ? currentWork.titleNL : currentWork.titleEN;
            
            // Update title with language support
            featuredTitle.textContent = this.currentLanguage === 'nl' ? currentWork.titleNL : currentWork.titleEN;
            featuredTitle.setAttribute('data-nl', currentWork.titleNL);
            featuredTitle.setAttribute('data-en', currentWork.titleEN);
            
            // Add fade in effect
            featuredContainer.style.opacity = '1';
            featuredContainer.style.transform = 'scale(1)';
        }, 300);
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
        // const priceText = this.currentLanguage === 'nl' ? 'Prijs' : 'Price';
        const detailsText = this.currentLanguage === 'nl' ? 'Bekijk details' : 'View details';
        
        // Create price info HTML only if price exists - HIDDEN FOR NOW
        // const priceHtml = item.price ? `<p class="price">${priceText}: ${item.price}</p>` : '';
        
        // Create subcategory display
        const subcategoryHtml = subcategoryText ? ` • ${subcategoryText}` : '';
        
        div.innerHTML = `
            <img src="images/${item.image}" alt="${title}" loading="lazy">
            <div class="item-info">
                <span class="item-category">${categoryText}${subcategoryHtml}</span>
                <h3>${title}</h3>
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
        // const modalTechnique = document.getElementById('modal-technique');
        // const modalYear = document.getElementById('modal-year');
        // const modalPrice = document.getElementById('modal-price');

        const title = this.currentLanguage === 'nl' ? item.titleNL : item.titleEN;
        const description = this.currentLanguage === 'nl' ? item.descriptionNL : item.descriptionEN;
        const categoryText = this.getCategoryText(item.category);

        modalImage.src = `images/${item.image}`;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalCategory.textContent = categoryText;
        modalDimensions.textContent = item.dimensions;
        // modalTechnique.textContent = item.technique;
        // modalYear.textContent = item.year;
        // modalPrice.textContent = item.price || '';
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
    window.stitchingApp = new StitchingDutchHeritage();
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
    
    // Setup contact form event listener
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                subject: document.getElementById('contactSubject').value.trim(),
                message: document.getElementById('contactMessage').value.trim()
            };
            
            submitContactForm(formData);
        });
        
        // Real-time validation
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const subjectInput = document.getElementById('contactSubject');
        const messageInput = document.getElementById('contactMessage');
        const messageCount = document.getElementById('messageCount');
        
        // Name validation
        nameInput.addEventListener('blur', () => {
            const value = nameInput.value.trim();
            if (value && (value.length < 2 || value.length > 50)) {
                showFieldError('contactName', 
                    value.length < 2 ? 'Naam moet minimaal 2 karakters bevatten' : 'Naam mag maximaal 50 karakters bevatten',
                    value.length < 2 ? 'Name must be at least 2 characters' : 'Name may be at most 50 characters'
                );
            } else if (value) {
                document.getElementById('contactName').classList.remove('error');
                document.getElementById('contactNameError').style.display = 'none';
            }
        });
        
        // Email validation
        emailInput.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const value = emailInput.value.trim();
            if (value && !emailRegex.test(value)) {
                showFieldError('contactEmail', 'Voer een geldig email adres in', 'Please enter a valid email address');
            } else if (value) {
                document.getElementById('contactEmail').classList.remove('error');
                document.getElementById('contactEmailError').style.display = 'none';
            }
        });
        
        // Subject validation
        subjectInput.addEventListener('blur', () => {
            const value = subjectInput.value.trim();
            if (value && (value.length < 3 || value.length > 100)) {
                showFieldError('contactSubject', 
                    value.length < 3 ? 'Onderwerp moet minimaal 3 karakters bevatten' : 'Onderwerp mag maximaal 100 karakters bevatten',
                    value.length < 3 ? 'Subject must be at least 3 characters' : 'Subject may be at most 100 characters'
                );
            } else if (value) {
                document.getElementById('contactSubject').classList.remove('error');
                document.getElementById('contactSubjectError').style.display = 'none';
            }
        });
        
        // Message validation and character count
        messageInput.addEventListener('input', () => {
            const value = messageInput.value;
            messageCount.textContent = value.length;
            
            if (value.length > 1000) {
                messageCount.style.color = '#e74c3c';
                showFieldError('contactMessage', 'Bericht mag maximaal 1000 karakters bevatten', 'Message may be at most 1000 characters');
            } else {
                messageCount.style.color = value.length > 900 ? '#f39c12' : '#666';
                if (value.length >= 10) {
                    document.getElementById('contactMessage').classList.remove('error');
                    document.getElementById('contactMessageError').style.display = 'none';
                }
            }
        });
        
        messageInput.addEventListener('blur', () => {
            const value = messageInput.value.trim();
            if (value && value.length < 10) {
                showFieldError('contactMessage', 'Bericht moet minimaal 10 karakters bevatten', 'Message must be at least 10 characters');
            }
        });
    }
    
    // Initialize EmailJS
    initializeEmailJS();
    
    // Close modal when clicking outside
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactForm();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.style.display === 'flex') {
            closeContactForm();
        }
    });
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

// Global function for "View collection" button
function viewCollection() {
    // Reset filter to "all" and scroll to gallery
    if (window.stitchingApp) {
        window.stitchingApp.filterGallery('all');
        window.stitchingApp.updateActiveFilterButton('all');
    }
    
    // Scroll to gallery
    document.querySelector('.embroidery-gallery').scrollIntoView({behavior: 'smooth'});
}

// Global function for toggling expanded text in summary cards
function toggleExpandedText(cardElement) {
    const expandedContent = cardElement.querySelector('.expanded-content');
    if (expandedContent) {
        const isVisible = expandedContent.style.display !== 'none';
        expandedContent.style.display = isVisible ? 'none' : 'block';
        
        // Add visual feedback for clickable card
        cardElement.classList.toggle('expanded', !isVisible);
    }
}

// Global function for opening Google Maps to Zaanse Schans
function openGoogleMaps() {
    // Coordinates for Zaanse Schans: 52.4746° N, 4.8162° E
    const googleMapsUrl = 'https://www.google.com/maps/place/Zaanse+Schans/@52.4746,4.8162,15z/data=!3m1!4b1!4m6!3m5!1s0x47c5fb4d043c0c83:0x2d1b02bb8dd988d9!8m2!3d52.4746!4d4.8162!16zL20vMDVyNGc?entry=ttu';
    
    // Show notification message first
    showLocationNotification();
    
    // Open in new tab after a longer delay so user can read the notification
    setTimeout(() => {
        const newTab = window.open(googleMapsUrl, '_blank');
        if (newTab) {
            // Try multiple approaches to keep focus on current tab
            setTimeout(() => {
                newTab.blur();
                window.focus();
                document.body.focus();
            }, 100);
        }
    }, 2500); // 2.5 seconds delay to show notification first
}

// Global function for adding calendar event
function downloadCalendarEvent() {
    // Event details
    const eventTitle = 'Folkloredag Zaanse Schans';
    const eventDescription = 'Stitching Dutch Heritage - De plek waar oude hollande borduurtradities herleven.';
    const eventLocation = 'Zaanse Schans, Nederland';
    
    // Date: August 16, 2025, 09:00 - 17:00
    const startDate = '20250816T090000';
    const endDate = '20250816T170000';
    
    // Check if it's a mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // For mobile devices, create a calendar URL that opens in the default calendar app
        const startDateFormatted = '20250816T090000Z';
        const endDateFormatted = '20250816T170000Z';
        
        // Create Google Calendar URL (works on most mobile devices)
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateFormatted}/${endDateFormatted}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;
        
        // For iOS devices, also try the native calendar protocol
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
            // Try iOS calendar URL first
            const iosCalendarUrl = `calshow:${Math.floor(new Date('2025-08-16T09:00:00').getTime() / 1000)}`;
            
            // Create a fallback approach for iOS
            const tempLink = document.createElement('a');
            tempLink.href = iosCalendarUrl;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            
            // Try to open iOS calendar, fallback to Google Calendar
            try {
                tempLink.click();
                setTimeout(() => document.body.removeChild(tempLink), 100);
            } catch (e) {
                document.body.removeChild(tempLink);
                window.open(googleCalendarUrl, '_blank');
            }
        } else {
            // For Android and other mobile devices, use Google Calendar
            window.open(googleCalendarUrl, '_blank');
        }
        
        // Show mobile-appropriate notification
        showMobileCalendarNotification();
        
    } else {
        // For desktop, create and download ICS file
        const eventId = 'folkloredag-2025-' + new Date().getTime() + '@stitchingdutchheritage.nl';
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Stitching Dutch Heritage//Folkloredag//NL',
            'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            `UID:${eventId}`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${eventTitle}`,
            `DESCRIPTION:${eventDescription}`,
            `LOCATION:${eventLocation}`,
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
        
        // Create download link
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'folkloredag-zaanse-schans-2025.ics';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show desktop notification
        showCalendarNotification();
    }
}

// Function to show notification when map is opened
function showLocationNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'location-notification';
    
    // Get current language
    const currentLang = window.stitchingApp ? window.stitchingApp.currentLanguage : 'nl';
    const text = currentLang === 'nl' ? 'Locatie geopend in nieuw tabblad' : 'Location opened in new tab';
    
    notification.innerHTML = `
        <i class="fas fa-map-marker-alt"></i>
        <span data-nl="Locatie geopend in nieuw tabblad" data-en="Location opened in new tab">${text}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Function to show notification when calendar is downloaded (desktop)
function showCalendarNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'location-notification';
    
    // Get current language
    const currentLang = window.stitchingApp ? window.stitchingApp.currentLanguage : 'nl';
    const text = currentLang === 'nl' ? 'Agenda bestand gedownload' : 'Calendar file downloaded';
    
    notification.innerHTML = `
        <i class="fas fa-calendar-download"></i>
        <span data-nl="Agenda bestand gedownload" data-en="Calendar file downloaded">${text}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Function to show notification when calendar is opened on mobile
function showMobileCalendarNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'location-notification';
    
    // Get current language
    const currentLang = window.stitchingApp ? window.stitchingApp.currentLanguage : 'nl';
    const text = currentLang === 'nl' ? 'Agenda app geopend' : 'Calendar app opened';
    
    notification.innerHTML = `
        <i class="fas fa-calendar-plus"></i>
        <span data-nl="Agenda app geopend" data-en="Calendar app opened">${text}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Global function for opening contact form
function openContactForm() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Reset form and validation
    const form = document.getElementById('contactForm');
    form.reset();
    clearFormErrors();
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('contactName').focus();
    }, 100);
}

// Global function for closing contact form
function closeContactForm() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    clearFormErrors();
}

// Clear form validation errors
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Show validation error
function showFieldError(fieldId, messageNL, messageEN = null) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    // Get current language
    const currentLang = window.stitchingApp ? window.stitchingApp.currentLanguage : 'nl';
    const message = currentLang === 'nl' ? messageNL : (messageEN || messageNL);
    
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Validate form fields
function validateContactForm(formData) {
    clearFormErrors();
    let isValid = true;
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        showFieldError('contactName', 'Naam moet minimaal 2 karakters bevatten', 'Name must be at least 2 characters');
        isValid = false;
    } else if (formData.name.trim().length > 50) {
        showFieldError('contactName', 'Naam mag maximaal 50 karakters bevatten', 'Name may be at most 50 characters');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        showFieldError('contactEmail', 'Voer een geldig email adres in', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!formData.subject || formData.subject.trim().length < 3) {
        showFieldError('contactSubject', 'Onderwerp moet minimaal 3 karakters bevatten', 'Subject must be at least 3 characters');
        isValid = false;
    } else if (formData.subject.trim().length > 100) {
        showFieldError('contactSubject', 'Onderwerp mag maximaal 100 karakters bevatten', 'Subject may be at most 100 characters');
        isValid = false;
    }
    
    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
        showFieldError('contactMessage', 'Bericht moet minimaal 10 karakters bevatten', 'Message must be at least 10 characters');
        isValid = false;
    } else if (formData.message.trim().length > 1000) {
        showFieldError('contactMessage', 'Bericht mag maximaal 1000 karakters bevatten', 'Message may be at most 1000 characters');
        isValid = false;
    }
    
    return isValid;
}

// Initialize EmailJS
function initializeEmailJS() {
    // Initialize EmailJS with your public key
    // You'll need to replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('YOUR_PUBLIC_KEY');
}

// Handle contact form submission with EmailJS
async function submitContactForm(formData) {
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    try {
        // Send email using EmailJS
        // You'll need to replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
        const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'desmet.hidde@gmail.com'
        });
        
        if (response.status === 200) {
            // Success
            closeContactForm();
            showContactSuccessNotification();
        } else {
            throw new Error('Email service responded with error');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        showContactErrorNotification();
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Function to show success notification
function showContactSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'location-notification success';
    
    // Get current language
    const currentLang = window.stitchingApp ? window.stitchingApp.currentLanguage : 'nl';
    const text = currentLang === 'nl' ? 'Bericht succesvol verzonden!' : 'Message sent successfully!';
    
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span data-nl="Bericht succesvol verzonden!" data-en="Message sent successfully!">${text}</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
}

// Function to show error notification
function showContactErrorNotification() {
    const notification = document.createElement('div');
    notification.className = 'location-notification error';
    
    // Get current language
    const currentLang = window.stitchingApp ? window.stitchingApp.currentLanguage : 'nl';
    const text = currentLang === 'nl' ? 'Er is een fout opgetreden. Probeer het opnieuw.' : 'An error occurred. Please try again.';
    
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span data-nl="Er is een fout opgetreden. Probeer het opnieuw." data-en="An error occurred. Please try again.">${text}</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
}

// Function to show notification when contact form is sent
function showContactNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'location-notification';
    notification.innerHTML = `
        <i class="fas fa-envelope"></i>
        <span data-nl="Email programma geopend" data-en="Email program opened">Email programma geopend</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StitchingDutchHeritage;
}