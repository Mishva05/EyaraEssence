# Eyara Essence Frontend

A premium, modern, and fully responsive e-commerce frontend for the handmade crochet brand **“Eyara Essence.”** The website features a warm, cozy, and elegant handmade aesthetic, tailored for an independent boutique.

---

## 1. Technologies Used
- **React 19**
- **Vite 8** (scaffold and dev server)
- **JavaScript**
- **Tailwind CSS v4** (natively integrated with Vite)
- **React Router 7** (client-side routing)
- **Lucide React** (premium SVG iconography)
- **HTML5 & Vanilla CSS**

---

## 2. Key Frontend Features
- **Responsive Sticky Navigation**: Fully responsive navbar with custom cart/wishlist count badges and a collapsible mobile drawer.
- **Search System**: Inline search overlay in the navbar that routes queries directly to the shop page filters.
- **Shop & Filters**: Advanced product filtering by keyword search, category selector tags, and a price boundary slider. Sort products by popularity, price (high-to-low/low-to-high), and rating.
- **Interactive Product Details**: Thumbnail image gallery switcher, color radio switches, quantity controllers, and tabbed guides (Care instructions, shipping logs, and material details).
- **Persistent Shopping Cart**: Full cart lifecycle (add, remove, quantity update, clear) with automatic calculations of subtotal and a dynamic delivery threshold (Free delivery on orders above ₹799, otherwise ₹60). Synchronizes with `localStorage` so items persist on refresh.
- **Persistent Wishlist**: Save favorite items via heart toggles and directly move items from the wishlist into the shopping cart. Syncs with `localStorage`.
- **Checkout Funnel**: Validate checkout forms (contact inputs, address, payment mode) and mock order placement. Includes a detailed order receipt popup containing simulated tracking details.
- **Account Portal**: Dashboard indicating member profiles and displaying past order histories retrieved from localStorage, with forms to toggle between login and signup.
- **Responsive Cozy Aesthetics**: Warm color choices (cream, beige, blush, dusty rose) and elegant typography (Playfair Display serif headings and Inter sans-serif body text) optimized for all screens (desktop, tablet, mobile).
- **Empty & Error Fallbacks**: Custom empty states (empty cart, empty wishlist, no search results) with Call-to-Actions, and a custom loose-thread 404 page.

---

## 3. Project Structure
The project folder organization separates features into clean React folders:

```
frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Global styles, fonts, and assets
│   ├── components/      # Reusable React components
│   │   ├── Common/      # Header, Footer, ScrollToTop
│   │   ├── Product/     # ProductCard, ProductGrid
│   │   └── Feedback/    # Toast notifications, Spinners, EmptyStates
│   ├── context/         # React Context state layers
│   │   ├── CartContext.jsx
│   │   ├── WishlistContext.jsx
│   │   └── ToastContext.jsx
│   ├── data/            # Local mock databases
│   │   └── mockData.js  # Crochet products across 10 categories
│   ├── pages/           # Page containers
│   │   ├── Home.jsx     # Landing page
│   │   ├── Shop.jsx     # Interactive catalog
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Wishlist.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Account.jsx   # Login & SignUp
│   │   ├── Checkout.jsx
│   │   └── NotFound.jsx  # 404 Error page
│   ├── services/        # Service logic for external connections
│   │   └── api.js       # Asynchronous mock API methods
│   ├── App.jsx          # Route management & Layout wrapping
│   ├── index.css        # Tailwind imports & Custom design tokens
│   └── main.jsx         # App mounting point
├── package.json
├── vite.config.js
└── README.md
```

---

## 4. Setup & Running Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **NPM** (v9.0.0 or higher)

### Installation Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
4. Build the application for production:
   ```bash
   npm run build
   ```

---

## 5. Future Backend Integration Guide
The architecture has been designed with a dedicated service layer (`src/services/api.js`) so that changing to a real backend is seamless. 

When a backend is introduced:
1. **API endpoints**: Update `src/services/api.js` methods (e.g. `getProducts`, `login`, `placeOrder`) to trigger actual API endpoints (`fetch('/api/products')`) instead of returning simulated delays and mock items.
2. **Persistent Cart / Wishlist**: Modify `CartContext` and `WishlistContext` to synchronize state with database records (when a user is logged in) by calling backend synchronization endpoints rather than relying solely on local browser storage.
3. **Authentication**: Swap local authentication mock triggers with a real JWT / OAuth flow to authenticate users securely.
4. **Order processing**: Integrate payment gateway checkouts (e.g. Stripe, Razorpay) inside the Checkout page instead of relying on mock triggers.
