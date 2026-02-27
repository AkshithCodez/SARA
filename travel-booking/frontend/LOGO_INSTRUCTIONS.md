# SARA Logo Setup Instructions

## Adding the Logo

1. Save the SARA logo image (the one with blue wing and yellow seat) as `sara-logo.png`

2. Place it in the `public` folder:
   ```
   travel-booking/frontend/public/sara-logo.png
   ```

3. The logo will automatically appear in the header next to "SARA Dashboard"

## Logo Specifications

- **Current size**: 50x50 pixels
- **Format**: PNG with transparent background recommended
- **Location**: `/public/sara-logo.png`

## Customizing Logo Size

To change the logo size, edit `Header.css`:

```css
.logo-image {
  width: 50px;   /* Change this */
  height: 50px;  /* Change this */
  object-fit: contain;
}
```

## Alternative: Using Base64 Encoded Image

If you prefer to embed the logo directly in the code, you can convert the image to base64 and use it like this:

In `Header.jsx`:
```jsx
<img 
  src="data:image/png;base64,YOUR_BASE64_STRING_HERE" 
  alt="SARA Logo" 
  className="logo-image" 
/>
```

## Current Setup

The header now displays:
- SARA logo (left)
- "SARA Dashboard" text (next to logo)
- Navigation tabs (center)
- Live status indicator (right)

The logo is already integrated into the header component and will display once you place the image file in the public folder.
