# Stitching Dutch Heritage Website

A bilingual website showcasing traditional Dutch embroidery patterns and heritage crafts.

## 🌟 Features

- **Bilingual Support**: Dutch and English language switching
- **Responsive Design**: Works on all devices
- **Interactive Navigation**: Hamburger menu with categorized embroidery collections
- **Gallery Display**: Showcase of embroidery works with details
- **Heritage Focus**: Celebrating Dutch cultural traditions

## 🎨 Website Sections

### Language Support
- Dutch (NL) - Default language
- English (EN) - Alternative language
- Dynamic logo switching based on language selection

### Navigation Categories
- **Zaanse Taferelen** (Zaan Region Scenes)
- **Stadsgezichten & Architectuur** (Cityscapes & Architecture)
- **Molens & Waterwerken** (Windmills & Waterworks)
- **Klederdracht & Streekdracht** (Traditional Costume & Regional Dress)
- **Delfts Blauw & Philatelie** (Delftware & Philately)
- **Koninklijk Huis & Ceremoniële Borduurwerken** (Royal House & Ceremonial Embroidery)
- **Flora & Fauna**

### Content
- Welcoming landing page with heritage story
- Gallery of embroidery works
- Link to Folkloredag event (August 16, 2025)

## 🚀 Getting Started

### Prerequisites
- A web browser
- GitHub Pages hosting (or any web server)

### Installation
1. Clone this repository
2. Add your logo files to `src/images/`:
   - `dutch-heritage-logo-nl.png` (Dutch version)
   - `dutch-heritage-logo-en.png` (English version)
   - `folkloredag-logo.png` (Event logo)
3. Add your embroidery images to `src/images/`
4. Customize the content in `src/js/main.js` if needed

## Project Structure

```
my-github-pages-site/
├── _config.yml
├── package.json
├── README.md
└── src/
    ├── index.html
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        ├── (embroidery images 1.JPEG - 45.JPEG)
        ├── dutch-heritage-logo-nl.svg
        ├── dutch-heritage-logo-en.svg
        ├── folkloredag-logo.svg
        └── README-IMAGES.md
```

## 🎨 Customization

### Adding New Embroidery Items
Edit the `embroideryData` array in `src/js/main.js`:

```javascript
{
    image: 'your-image.JPEG',
    titleNL: 'Nederlandse titel',
    titleEN: 'English title',
    descriptionNL: 'Nederlandse beschrijving',
    descriptionEN: 'English description',
    dimensions: '25x30 cm'
}
```

### Styling
Modify `src/css/style.css` to change colors, fonts, or layout.

### Language Content
Update text content by modifying the `data-nl` and `data-en` attributes in `index.html`.

## 📱 Responsive Design

The website is fully responsive and includes:
- Mobile-first design approach
- Collapsible hamburger navigation
- Optimized images for different screen sizes
- Touch-friendly interface elements

## Deployment

This site is hosted on GitHub Pages. To deploy your changes, push your updates to the `main` branch of the repository. GitHub Pages will automatically update the site.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This project is created for Stitching Dutch Heritage. All embroidery designs and content are proprietary.

## 📧 Contact

For questions about the website or embroidery collections, please contact through the Folkloredag event.

---

*Website showcasing Dutch embroidery heritage - Celebrating traditional crafts for modern times*