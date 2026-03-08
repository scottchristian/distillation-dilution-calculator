# Alcohol Dilution Calculator

A lightweight, responsive, and premium alcohol dilution calculator designed for easy embedding into any website or WordPress blog.

## Features
- **Real-time Core Logic**: Calculates the precise amount of water needed to reach your target alcohol percentage.
- **Unit Toggle**: Support for both Millilitres (ml) and Litres (L).
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop.
- **Micro-animations**: Smooth transitions and interactive tooltips for a premium feel.
- **Embed-friendly**: No fixed background, allowing it to blend seamlessly into your site's design.

## How to Use
1. **Current Alcohol %**: Enter the percentage of your starting spirit (e.g., 95% for high-proof).
2. **Current Volume**: Enter how much you have (e.g., 1000ml).
3. **Target Alcohol %**: Enter the percentage you want to achieve (e.g., 40% for vodka).
4. **Water to add**: The calculator automatically shows you how much water is needed and what the final volume will be.

## How to Embed This Calculator on Your Website

Even if you've never edited a website before, you can add this calculator to your page. Here are two easy ways to do it.

### Method 1: Using an Iframe (The Easiest Way)
Use this method if you want to host the code on GitHub and simply "window" it into your website.

1. **Host it on GitHub Pages**:
   - Go to your repository settings on GitHub.
   - Click on **Pages** in the left sidebar.
   - Under "Build and deployment", set the source to **Deploy from a branch** and select `main`.
   - Click **Save**. GitHub will give you a URL like `https://scottchristian.github.io/distillation-dilution-calculator/`.

2. **Paste this code into your website**:
   Copy and paste the following code into the place where you want the calculator to appear (in WordPress, use a "Custom HTML" block):

```html
<!-- Alcohol Dilution Calculator Embed -->
<iframe 
    src="https://scottchristian.github.io/distillation-dilution-calculator/" 
    width="100%" 
    height="550" 
    style="border:none; background:transparent;" 
    allowtransparency="true"
    title="Alcohol Dilution Calculator">
</iframe>
```

---

### Method 2: Embedding Directly into WordPress
Use this method if you want the code to live directly on your WordPress site.

1. **Open your WordPress Page**:
   - Go to the page or post where you want the calculator.
   - Click the **+** (plus) icon to add a new block.
   - Search for **"Custom HTML"** and select it.

2. **Paste the following Combine Code**:
   Copy and paste this entire block into that Custom HTML box. It includes everything needed to make it work.

```html
<div id="wp-alcohol-calc-wrapper" style="min-height: 500px;">
    <!-- The Calculator Screen -->
    <div id="dilution-calculator-container">
        <!-- The HTML, CSS, and JS will be loaded here -->
    </div>
</div>

<script>
    // This script fetches the calculator files and puts them in your page
    fetch('https://scottchristian.github.io/distillation-dilution-calculator/index.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('.calculator-card').outerHTML;
            document.getElementById('dilution-calculator-container').innerHTML = content;
            
            // Load Styles
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://scottchristian.github.io/distillation-dilution-calculator/style.css';
            document.head.appendChild(link);
            
            // Load Logic
            const script = document.createElement('script');
            script.src = 'https://scottchristian.github.io/distillation-dilution-calculator/script.js';
            document.body.appendChild(script);
        });
</script>
```

### Method 3: For Advanced Users (Full Control)
If you want to host the files yourself on your WordPress server:
1. Upload `index.html`, `style.css`, and `script.js` to your server.
2. Copy the content of `index.html` (the part inside the `<body>` tags) and paste it into a Custom HTML block.
3. Add a `<link>` tag for the CSS and a `<script>` tag for the JS at the bottom of the HTML block.

---

## Calculation Formula
The calculator uses the standard dilution formula:
$$V_{water} = V_{initial} \times \left( \frac{C_{initial}}{C_{target}} - 1 \right)$$
Where:
- $V_{initial}$ = Initial Volume
- $C_{initial}$ = Initial Concentration (%)
- $C_{target}$ = Target Concentration (%)
