/* =========================================================
   VIIBGYOR — SCRIPT.JS
   PART 1 / 5
   ========================================================= */

/* ================= GLOBAL STATE ================= */

let cart = [];
let wishlist = [];
let selectedProduct = null;
let selectedSize = "";
let currentReel = null;
let currentSeller = null;
let currentCreator = null;

let searchResults = [];
let currentSearchQuery = "";


/* ================= PRODUCT DATA ================= */

const products = [
    {
        id: 1,
        name: "Prism Oversized Tee",
        category: "Fashion",
        price: 899,
        oldPrice: 1299,
        seller: "Orbit Streetwear",
        rating: 4.8,
        reviews: 126,
        stock: 18,
        sizes: ["S", "M", "L", "XL"],
        image: "images/product1.jpg",
        description:
            "Premium oversized streetwear tee with a clean VIIBGYOR-inspired aesthetic."
    },

    {
        id: 2,
        name: "Aurora Sneakers",
        category: "Sneakers",
        price: 2499,
        oldPrice: 3299,
        seller: "Urban Sole",
        rating: 4.7,
        reviews: 89,
        stock: 11,
        sizes: ["7", "8", "9", "10"],
        image: "images/product2.jpg",
        description:
            "Everyday sneakers designed for comfort, street style and all-day movement."
    },

    {
        id: 3,
        name: "Galaxy Collectible",
        category: "Collectibles",
        price: 1499,
        oldPrice: 1999,
        seller: "RareVault",
        rating: 4.9,
        reviews: 54,
        stock: 6,
        sizes: [],
        image: "images/product3.jpg",
        description:
            "A limited collectible piece for enthusiasts and collectors."
    },

    {
        id: 4,
        name: "Prismatic Hoodie",
        category: "Fashion",
        price: 1799,
        oldPrice: 2399,
        seller: "Nova Fits",
        rating: 4.8,
        reviews: 73,
        stock: 14,
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: "images/product4.jpg",
        description:
            "Soft premium hoodie with a modern silhouette and subtle prismatic detailing."
    }
];


/* ================= CREATOR DATA ================= */

const creators = [
    {
        id: 1,
        name: "Aarav",
        username: "@aaravstyle",
        followers: "128K",
        category: "Fashion",
        verified: true
    },

    {
        id: 2,
        name: "Riya",
        username: "@riyapicks",
        followers: "94K",
        category: "Lifestyle",
        verified: true
    },

    {
        id: 3,
        name: "Kabir",
        username: "@kabircollects",
        followers: "71K",
        category: "Collectibles",
        verified: true
    }
];


/* ================= REEL DATA ================= */

const reels = [
    {
        id: 1,
        productId: 1,
        creator: "Aarav",
        title: "Streetwear fit check",
        views: "82K",
        tag: "Trending"
    },

    {
        id: 2,
        productId: 2,
        creator: "Riya",
        title: "Sneakers you need",
        views: "61K",
        tag: "Hot Pick"
    },

    {
        id: 3,
        productId: 3,
        creator: "Kabir",
        title: "Rare collectible reveal",
        views: "44K",
        tag: "Limited"
    }
];


/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});


/* ================= INITIALIZE APP ================= */

function initializeApp() {

    updateCartCount();
    updateWishlistCount();

    setupNavigation();
    setupSearch();

    loadStoredCart();
    loadStoredWishlist();

    updateCartCount();
    updateWishlistCount();

}


/* ================= MOBILE NAVIGATION ================= */

function setupNavigation() {

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");

    });


    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");

        });

    });

}


/* ================= SEARCH ================= */

function setupSearch() {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            performSearch();
        }

    });

}


function openSearch() {

    const searchOverlay = document.getElementById("searchOverlay");

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.add("active");

    const input = document.getElementById("searchInput");

    if (input) {
        setTimeout(() => input.focus(), 100);
    }

}


function closeSearch() {

    const searchOverlay = document.getElementById("searchOverlay");

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.remove("active");

}


function performSearch() {

    const input = document.getElementById("searchInput");

    if (!input) {
        return;
    }

    currentSearchQuery = input.value.trim().toLowerCase();

    if (!currentSearchQuery) {

        showToast("Type something to search.");

        return;
    }


    searchResults = products.filter(product => {

        return (
            product.name.toLowerCase().includes(currentSearchQuery) ||
            product.category.toLowerCase().includes(currentSearchQuery) ||
            product.seller.toLowerCase().includes(currentSearchQuery)
        );

    });


    closeSearch();


    if (searchResults.length === 0) {

        showToast("No products found.");

        return;
    }


    const shopSection = document.getElementById("shop");

    if (shopSection) {
        shopSection.scrollIntoView({
            behavior: "smooth"
        });
    }


    renderSearchResults();

    showToast(
        `${searchResults.length} product${searchResults.length > 1 ? "s" : ""} found.`
    );

}


/* ================= SEARCH RESULT RENDER ================= */

function renderSearchResults() {

    const container = document.getElementById("searchResults");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!searchResults.length) {

        container.innerHTML = `
            <div class="cart-empty">
                No matching products found.
            </div>
        `;

        return;
    }


    searchResults.forEach(product => {

        const item = document.createElement("div");

        item.className = "search-result-item";

        item.innerHTML = `
            <div>
                <strong>${product.name}</strong>
                <span>${product.category} • ₹${product.price}</span>
            </div>

            <button
                class="btn btn-small btn-primary"
                onclick="openProduct(${product.id})">
                View
            </button>
        `;

        container.appendChild(item);

    });

}


/* ================= CATEGORY FILTER ================= */

function filterCategory(category) {

    const normalizedCategory =
        category.toLowerCase().trim();


    const filtered = products.filter(product =>
        product.category.toLowerCase() === normalizedCategory
    );


    if (normalizedCategory === "all") {

        renderProducts(products);

        return;
    }


    renderProducts(filtered);

    const shopSection = document.getElementById("shop");

    if (shopSection) {
        shopSection.scrollIntoView({
            behavior: "smooth"
        });
    }

}


/* ================= PRODUCT RENDER ================= */

function renderProducts(productList = products) {

    const grid = document.getElementById("productsGrid");

    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (!productList.length) {

        grid.innerHTML = `
            <div class="cart-empty">
                No products available in this category.
            </div>
        `;

        return;
    }


    productList.forEach(product => {

        const isWishlisted =
            wishlist.includes(product.id);


        const card = document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.style.display='none';"
                >

                <button
                    class="wishlist-btn ${isWishlisted ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})"
                    aria-label="Add to wishlist">
                    ♡
                </button>

            </div>


            <div class="product-details">

                <div class="product-meta">
                    <span>${product.category}</span>
                    <span>★ ${product.rating}</span>
                </div>

                <h3>${product.name}</h3>

                <p class="product-seller">
                    ${product.seller}
                    <span class="verified-badge">✓</span>
                </p>


                <div class="product-price">

                    <strong>₹${product.price}</strong>

                    <del>₹${product.oldPrice}</del>

                </div>


                <button
                    class="btn btn-primary product-buy-btn"
                    onclick="openProduct(${product.id})">
                    View Product
                </button>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* ================= INITIAL PRODUCT LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {

    renderProducts(products);

});


/* ================= PRODUCT MODAL ================= */

function openProduct(productId) {

    const product =
        products.find(item => item.id === productId);


    if (!product) {
        return;
    }


    selectedProduct = product;
    selectedSize = "";


    const modal =
        document.getElementById("productModal");


    if (!modal) {
        return;
    }


    const title =
        document.getElementById("productModalTitle");

    const image =
        document.getElementById("productModalImage");

    const price =
        document.getElementById("productModalPrice");

    const description =
        document.getElementById("productModalDescription");

    const seller =
        document.getElementById("productModalSeller");


    if (title) {
        title.textContent = product.name;
    }


    if (image) {

        image.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.style.display='none';">
        `;

    }


    if (price) {
        price.textContent = `₹${product.price}`;
    }


    if (description) {
        description.textContent =
            product.description;
    }


    if (seller) {

        seller.innerHTML = `
            <strong>${product.seller}</strong>
            <span>
                ✓ Verified Seller • ★ ${product.rating}
            </span>
        `;

    }


    renderProductSizes(product);


    modal.classList.add("active");

}


function renderProductSizes(product) {

    const container =
        document.getElementById("sizeOptions");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!product.sizes || product.sizes.length === 0) {

        container.innerHTML = `
            <span style="color:var(--muted);font-size:12px;">
                No size selection required
            </span>
        `;

        return;
    }


    product.sizes.forEach(size => {

        const button =
            document.createElement("button");


        button.className = "size-option";

        button.textContent = size;

        button.onclick = () =>
            selectSize(size);


        container.appendChild(button);

    });

}


/* ================= CLOSE MODAL ================= */

function closeModal() {

    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.classList.remove("active");

        });

}


/* ================= SIZE SELECTION ================= */

function selectSize(size) {

    selectedSize = size;


    document
        .querySelectorAll(".size-option")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.textContent === size
            );

        });

      }
/* =========================================================
   VIIBGYOR — SCRIPT.JS
   PART 2 / 5
   ========================================================= */

/* ================= WISHLIST ================= */

function toggleWishlist(productId) {

    const index = wishlist.indexOf(productId);

    if (index === -1) {

        wishlist.push(productId);

        showToast("Added to wishlist ♡");

    } else {

        wishlist.splice(index, 1);

        showToast("Removed from wishlist");

    }

    saveWishlist();

    updateWishlistCount();

    renderProducts(products);
}


/* ================= WISHLIST COUNT ================= */

function updateWishlistCount() {

    const elements =
        document.querySelectorAll(".wishlist-count");

    elements.forEach(element => {

        element.textContent = wishlist.length;

    });

}


/* ================= OPEN WISHLIST ================= */

function openWishlist() {

    if (!wishlist.length) {

        showToast("Your wishlist is empty.");

        return;
    }


    const wishlistProducts =
        products.filter(product =>
            wishlist.includes(product.id)
        );


    renderProducts(wishlistProducts);


    const shopSection =
        document.getElementById("shop");


    if (shopSection) {

        shopSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* ================= LOCAL STORAGE — WISHLIST ================= */

function saveWishlist() {

    try {

        localStorage.setItem(
            "viibgyorWishlist",
            JSON.stringify(wishlist)
        );

    } catch (error) {

        console.log("Wishlist storage unavailable.");

    }

}


function loadStoredWishlist() {

    try {

        const stored =
            localStorage.getItem(
                "viibgyorWishlist"
            );


        if (stored) {

            wishlist =
                JSON.parse(stored);

        }

    } catch (error) {

        wishlist = [];

    }

}


/* ================= CART ================= */

function addCurrentProductToCart() {

    if (!selectedProduct) {

        showToast("Select a product first.");

        return;
    }


    if (
        selectedProduct.sizes &&
        selectedProduct.sizes.length > 0 &&
        !selectedSize
    ) {

        showToast("Please select a size.");

        return;
    }


    addToCart(
        selectedProduct.id,
        selectedSize
    );

}


function addToCart(productId, size = "") {

    const product =
        products.find(item =>
            item.id === productId
        );


    if (!product) {
        return;
    }


    const existingItem =
        cart.find(item =>
            item.productId === productId &&
            item.size === size
        );


    if (existingItem) {

        if (existingItem.quantity < product.stock) {

            existingItem.quantity += 1;

        } else {

            showToast("Maximum available stock reached.");

            return;
        }

    } else {

        cart.push({

            productId: productId,

            size: size,

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    renderCart();

    showToast("Added to cart 🛒");

}


/* ================= BUY NOW ================= */

function buyCurrentProduct() {

    if (!selectedProduct) {

        showToast("Select a product first.");

        return;
    }


    if (
        selectedProduct.sizes &&
        selectedProduct.sizes.length > 0 &&
        !selectedSize
    ) {

        showToast("Please select a size.");

        return;
    }


    addToCart(
        selectedProduct.id,
        selectedSize
    );


    closeModal();

    checkout();

}


/* ================= CART COUNT ================= */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document
        .querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent = count;

        });

}


/* ================= OPEN CART ================= */

function openCart() {

    const cartDrawer =
        document.getElementById("cartDrawer");


    const overlay =
        document.getElementById("cartOverlay");


    if (cartDrawer) {

        cartDrawer.classList.add("active");

    }


    if (overlay) {

        overlay.classList.add("active");

    }


    renderCart();

}


/* ================= CLOSE CART ================= */

function closeCart() {

    const cartDrawer =
        document.getElementById("cartDrawer");


    const overlay =
        document.getElementById("cartOverlay");


    if (cartDrawer) {

        cartDrawer.classList.remove("active");

    }


    if (overlay) {

        overlay.classList.remove("active");

    }

}


/* ================= RENDER CART ================= */

function renderCart() {

    const container =
        document.getElementById("cartItems");


    const totalElement =
        document.getElementById("cartTotal");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!cart.length) {

        container.innerHTML = `
            <div class="cart-empty">
                <div style="font-size:40px;margin-bottom:12px;">
                    🛒
                </div>

                <strong>Your cart is empty</strong>

                <p style="margin-top:7px;">
                    Discover something you love on VIIBGYOR.
                </p>
            </div>
        `;


        if (totalElement) {

            totalElement.textContent = "₹0";

        }

        return;
    }


    let total = 0;


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.productId
            );


        if (!product) {
            return;
        }


        const itemTotal =
            product.price * item.quantity;


        total += itemTotal;


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.style.display='none';">

            </div>


            <div class="cart-item-info">

                <strong>${product.name}</strong>

                <span>
                    ₹${product.price}
                    ${item.size ? ` • Size ${item.size}` : ""}
                </span>


                <div class="cart-qty">

                    <button
                        onclick="changeCartQuantity(
                            ${product.id},
                            '${item.size}',
                            -1
                        )">
                        −
                    </button>


                    <span>${item.quantity}</span>


                    <button
                        onclick="changeCartQuantity(
                            ${product.id},
                            '${item.size}',
                            1
                        )">
                        +
                    </button>

                </div>

            </div>


            <div>

                <div class="cart-item-price">
                    ₹${itemTotal}
                </div>


                <button
                    class="btn btn-small btn-danger"
                    style="margin-top:8px;"
                    onclick="removeFromCart(
                        ${product.id},
                        '${item.size}'
                    )">
                    Remove
                </button>

            </div>

        `;


        container.appendChild(cartItem);

    });


    if (totalElement) {

        totalElement.textContent =
            `₹${total}`;

    }

}


/* ================= CHANGE CART QUANTITY ================= */

function changeCartQuantity(
    productId,
    size,
    change
) {

    const item =
        cart.find(item =>
            item.productId === productId &&
            item.size === size
        );


    if (!item) {
        return;
    }


    const product =
        products.find(product =>
            product.id === productId
        );


    item.quantity += change;


    if (
        product &&
        item.quantity > product.stock
    ) {

        item.quantity = product.stock;

        showToast("Available stock limit reached.");

    }


    if (item.quantity <= 0) {

        cart =
            cart.filter(cartItem =>
                !(
                    cartItem.productId === productId &&
                    cartItem.size === size
                )
            );

    }


    saveCart();

    updateCartCount();

    renderCart();

}


/* ================= REMOVE FROM CART ================= */

function removeFromCart(productId, size) {

    cart =
        cart.filter(item =>
            !(
                item.productId === productId &&
                item.size === size
            )
        );


    saveCart();

    updateCartCount();

    renderCart();

    showToast("Item removed from cart.");

}


/* ================= CART TOTAL ================= */

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                products.find(
                    product =>
                        product.id === item.productId
                );


            if (!product) {
                return total;
            }


            return total +
                product.price *
                item.quantity;

        },
        0
    );

}


/* ================= LOCAL STORAGE — CART ================= */

function saveCart() {

    try {

        localStorage.setItem(
            "viibgyorCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.log("Cart storage unavailable.");

    }

}


function loadStoredCart() {

    try {

        const stored =
            localStorage.getItem(
                "viibgyorCart"
            );


        if (stored) {

            cart =
                JSON.parse(stored);

        }

    } catch (error) {

        cart = [];

    }

}


/* ================= SELLER ================= */

function openSellerForm() {

    const modal =
        document.getElementById("sellerModal");


    if (!modal) {
        return;
    }


    modal.classList.add("active");

}


function submitSellerForm(event) {

    event.preventDefault();


    const form =
        document.getElementById("sellerForm");


    if (!form) {
        return;
    }


    showToast(
        "Seller application received! 🚀"
    );


    form.reset();

    closeModal();

}


/* ================= SELLER PROFILE ================= */

function openSellerProfile(sellerName) {

    currentSeller = sellerName;


    const modal =
        document.getElementById("sellerProfileModal");


    if (!modal) {
        return;
    }


    const name =
        document.getElementById("sellerProfileName");


    if (name) {

        name.textContent =
            sellerName || "VIIBGYOR Seller";

    }


    modal.classList.add("active");

}


/* ================= SELLER MESSAGE ================= */

function messageSeller(sellerName = "") {

    currentSeller =
        sellerName ||
        (
            selectedProduct
                ? selectedProduct.seller
                : "Seller"
        );


    const modal =
        document.getElementById("sellerMessageModal");


    if (!modal) {

        showToast(
            `Message ${currentSeller} — messaging will connect to the seller inbox.`
        );

        return;
    }


    const name =
        document.getElementById("messageSellerName");


    if (name) {

        name.textContent =
            currentSeller;

    }


    modal.classList.add("active");

}


function askSeller() {

    const input =
        document.getElementById("sellerQuestion");


    if (!input || !input.value.trim()) {

        showToast("Write your question first.");

        return;
    }


    showToast(
        "Question sent to the seller."
    );


    input.value = "";

    closeModal();

}


/* ================= SELLER WHATSAPP ================= */

function openSellerWhatsapp() {

    showToast(
        "Verified Business WhatsApp can be connected here."
    );

}
/* =========================================================
   VIIBGYOR — SCRIPT.JS
   PART 3 / 5
   ========================================================= */

/* ================= CREATOR ================= */

function openCreatorForm() {

    const modal =
        document.getElementById("creatorModal");

    if (!modal) {
        return;
    }

    modal.classList.add("active");
}


function submitCreatorForm(event) {

    event.preventDefault();

    const form =
        document.getElementById("creatorForm");

    if (!form) {
        return;
    }

    showToast(
        "Creator application received! 🚀"
    );

    form.reset();

    closeModal();
}


/* ================= CREATOR PROFILE ================= */

function openCreator(creatorId) {

    const creator =
        creators.find(item =>
            item.id === creatorId
        );

    if (!creator) {
        return;
    }

    currentCreator = creator;

    const modal =
        document.getElementById("creatorProfileModal");

    if (!modal) {
        return;
    }

    const name =
        document.getElementById("creatorProfileName");

    const username =
        document.getElementById("creatorProfileUsername");

    const followers =
        document.getElementById("creatorProfileFollowers");

    if (name) {
        name.textContent = creator.name;
    }

    if (username) {
        username.textContent = creator.username;
    }

    if (followers) {
        followers.textContent =
            `${creator.followers} followers`;
    }

    modal.classList.add("active");
}


/* ================= REELS ================= */

function openReel(reelId) {

    const reel =
        reels.find(item =>
            item.id === reelId
        );

    if (!reel) {
        return;
    }

    const product =
        products.find(item =>
            item.id === reel.productId
        );

    currentReel = reel;

    const modal =
        document.getElementById("reelModal");

    if (!modal) {
        return;
    }

    const title =
        document.getElementById("reelModalTitle");

    const creator =
        document.getElementById("reelModalCreator");

    const views =
        document.getElementById("reelModalViews");

    const productName =
        document.getElementById("reelModalProduct");

    const price =
        document.getElementById("reelModalPrice");

    if (title) {
        title.textContent = reel.title;
    }

    if (creator) {
        creator.textContent =
            `@${reel.creator.toLowerCase()}`;
    }

    if (views) {
        views.textContent =
            `${reel.views} views`;
    }

    if (product) {

        if (productName) {
            productName.textContent =
                product.name;
        }

        if (price) {
            price.textContent =
                `₹${product.price}`;
        }

    }

    modal.classList.add("active");
}


/* ================= SHOP FROM REEL ================= */

function shopCurrentReel() {

    if (!currentReel) {
        return;
    }

    const product =
        products.find(item =>
            item.id === currentReel.productId
        );

    if (!product) {
        return;
    }

    closeModal();

    openProduct(product.id);
}


/* ================= LIVE COMMERCE ================= */

function openLive(liveId = 1) {

    const modal =
        document.getElementById("liveModal");

    if (!modal) {
        return;
    }

    const title =
        document.getElementById("liveModalTitle");

    if (title) {

        title.textContent =
            liveId === 1
                ? "Streetwear Live"
                : "VIIBGYOR Live Shopping";

    }

    modal.classList.add("active");

}


/* ================= LIVE CHAT ================= */

function sendLiveMessage() {

    const input =
        document.getElementById("liveChatInput");

    const messages =
        document.getElementById("liveChatMessages");

    if (!input || !messages) {
        return;
    }

    const message =
        input.value.trim();

    if (!message) {
        return;
    }


    const row =
        document.createElement("div");

    row.className =
        "chat-message";


    row.innerHTML = `
        <strong>You</strong>
        <span>${escapeHTML(message)}</span>
    `;


    messages.appendChild(row);

    messages.scrollTop =
        messages.scrollHeight;


    input.value = "";

}


/* ================= ENTER KEY — LIVE CHAT ================= */

function setupLiveChat() {

    const input =
        document.getElementById("liveChatInput");

    if (!input) {
        return;
    }

    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendLiveMessage();

            }

        }
    );

}


/* ================= FEATURED LIVE PRODUCT ================= */

function buyLiveProduct(productId) {

    const product =
        products.find(item =>
            item.id === productId
        );

    if (!product) {
        return;
    }

    selectedProduct = product;

    selectedSize = "";

    closeModal();

    openProduct(productId);

}


/* ================= AUCTION ================= */

let auctionState = {
    active: true,
    currentBid: 2500,
    bidCount: 7,
    endsAt: Date.now() + 1000 * 60 * 12
};


/* ================= OPEN AUCTION ================= */

function openAuctionInfo() {

    const modal =
        document.getElementById("auctionModal");

    if (!modal) {
        return;
    }

    modal.classList.add("active");

}


/* ================= PLACE BID ================= */

function placeBid() {

    const input =
        document.getElementById("bidAmount");

    if (!input) {

        showToast(
            "Auction bidding will connect to the live auction engine."
        );

        return;
    }


    const amount =
        Number(input.value);


    if (!amount || amount <= auctionState.currentBid) {

        showToast(
            `Bid must be higher than ₹${auctionState.currentBid}.`
        );

        return;
    }


    auctionState.currentBid =
        amount;

    auctionState.bidCount += 1;


    const currentBid =
        document.getElementById("currentBid");


    const bidCount =
        document.getElementById("bidCount");


    if (currentBid) {

        currentBid.textContent =
            `₹${amount}`;

    }


    if (bidCount) {

        bidCount.textContent =
            `${auctionState.bidCount} bids`;

    }


    input.value = "";


    showToast(
        `Bid placed at ₹${amount}.`
    );

}


/* ================= AUCTION TIMER ================= */

function updateAuctionTimer() {

    const timer =
        document.getElementById("auctionTimer");

    if (!timer) {
        return;
    }


    const remaining =
        auctionState.endsAt -
        Date.now();


    if (remaining <= 0) {

        timer.textContent =
            "Auction ended";

        auctionState.active =
            false;

        return;
    }


    const totalSeconds =
        Math.floor(
            remaining / 1000
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* ================= CHECKOUT ================= */

function checkout() {

    if (!cart.length) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    closeCart();


    const modal =
        document.getElementById("checkoutModal");

    if (!modal) {
        return;
    }


    const total =
        document.getElementById("checkoutTotal");


    if (total) {

        total.textContent =
            `₹${getCartTotal()}`;

    }


    modal.classList.add("active");

}


/* ================= SUBMIT CHECKOUT ================= */

function submitCheckout(event) {

    event.preventDefault();


    if (!cart.length) {

        showToast(
            "Your cart is empty."
        );

        closeModal();

        return;
    }


    const checkoutForm =
        document.getElementById("checkoutForm");


    if (checkoutForm) {
        checkoutForm.reset();
    }


    const orderId =
        "VBG" +
        Date.now()
            .toString()
            .slice(-8);


    const orderIdElement =
        document.getElementById("orderId");


    if (orderIdElement) {

        orderIdElement.textContent =
            orderId;

    }


    cart = [];

    saveCart();

    updateCartCount();

    closeModal();


    const successModal =
        document.getElementById("orderSuccessModal");


    if (successModal) {

        successModal.classList.add(
            "active"
        );

    }


    showToast(
        "Order placed successfully! 🎉"
    );

}


/* ================= TOAST ================= */

let toastTimeout;


function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimeout);


    toastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* ================= SAFE HTML ================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* ================= MODAL BACKDROP ================= */

function setupModalClosing() {

    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        modal.classList.remove(
                            "active"
                        );

                    }

                }
            );

        });

}


/* ================= ESCAPE KEY ================= */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeModal();
            closeSearch();
            closeCart();

        }
    );

}


/* ================= PAGE INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupLiveChat();
        setupModalClosing();
        setupEscapeKey();

        updateAuctionTimer();

        setInterval(
            updateAuctionTimer,
            1000
        );

    }
);
/* =========================================================
   VIIBGYOR — SCRIPT.JS
   PART 4 / 5
   ========================================================= */

/* ================= NAVIGATION HELPERS ================= */

function scrollToSection(sectionId) {

    const section =
        document.getElementById(sectionId);

    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ================= HOME ================= */

function goHome() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= SHOP ================= */

function openShop() {

    const shop =
        document.getElementById("shop");

    if (!shop) {
        return;
    }

    shop.scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= LIVE SECTION ================= */

function openLiveSection() {

    const live =
        document.getElementById("live");

    if (!live) {
        return;
    }

    live.scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= REELS SECTION ================= */

function openReels() {

    const reelsSection =
        document.getElementById("reels");

    if (!reelsSection) {
        return;
    }

    reelsSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= CREATOR SECTION ================= */

function openCreators() {

    const creatorsSection =
        document.getElementById("creators");

    if (!creatorsSection) {
        return;
    }

    creatorsSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= SELLER SECTION ================= */

function openSellerSection() {

    const sellerSection =
        document.getElementById("seller");

    if (!sellerSection) {
        return;
    }

    sellerSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= CATEGORY NAVIGATION ================= */

function showCategory(category) {

    filterCategory(category);

}


/* ================= PRODUCT QUICK ACTION ================= */

function quickBuy(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }

    selectedProduct = product;

    selectedSize = "";

    openProduct(productId);

}


/* ================= ADD TO CART QUICK ACTION ================= */

function quickAddToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }


    if (
        product.sizes &&
        product.sizes.length > 0
    ) {

        openProduct(productId);

        showToast(
            "Please select a size."
        );

        return;
    }


    addToCart(productId);

}


/* ================= WISHLIST QUICK ACTION ================= */

function isInWishlist(productId) {

    return wishlist.includes(
        productId
    );

}


/* ================= CREATOR FOLLOW ================= */

const followedCreators = [];


function toggleCreatorFollow(creatorId) {

    const index =
        followedCreators.indexOf(
            creatorId
        );


    const creator =
        creators.find(
            item => item.id === creatorId
        );


    if (!creator) {
        return;
    }


    if (index === -1) {

        followedCreators.push(
            creatorId
        );

        showToast(
            `Following ${creator.name}`
        );

    } else {

        followedCreators.splice(
            index,
            1
        );

        showToast(
            `Unfollowed ${creator.name}`
        );

    }


    updateCreatorFollowButton(
        creatorId
    );

}


function updateCreatorFollowButton(
    creatorId
) {

    const buttons =
        document.querySelectorAll(
            `[data-creator-id="${creatorId}"]`
        );


    const following =
        followedCreators.includes(
            creatorId
        );


    buttons.forEach(button => {

        button.textContent =
            following
                ? "Following"
                : "Follow";

        button.classList.toggle(
            "active",
            following
        );

    });

}


/* ================= PRODUCT RATING ================= */

function showProductRating(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    showToast(
        `${product.name} • ★ ${product.rating} (${product.reviews} reviews)`
    );

}


/* ================= SHARE PRODUCT ================= */

async function shareProduct(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    const shareText =
        `${product.name} — ₹${product.price} on VIIBGYOR`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title: product.name,

                text: shareText,

                url: window.location.href

            });

        } catch (error) {

            /* User cancelled sharing. */

        }

        return;
    }


    try {

        await navigator.clipboard.writeText(
            window.location.href
        );

        showToast(
            "Product link copied!"
        );

    } catch (error) {

        showToast(
            "Sharing is not available on this device."
        );

    }

}


/* ================= COPY STORE LINK ================= */

async function copyStoreLink(
    sellerName = "VIIBGYOR Seller"
) {

    const text =
        `${sellerName} on VIIBGYOR — ${window.location.href}`;


    try {

        await navigator.clipboard.writeText(
            text
        );

        showToast(
            "Store link copied!"
        );

    } catch (error) {

        showToast(
            "Could not copy the link."
        );

    }

}


/* ================= CONTACT SUPPORT ================= */

function contactSupport() {

    showToast(
        "VIIBGYOR support will be connected here."
    );

}


/* ================= NOTIFICATION ================= */

function openNotifications() {

    showToast(
        "No new notifications."
    );

}


/* ================= ACCOUNT ================= */

function openAccount() {

    showToast(
        "Buyer account system will connect here."
    );

}


/* ================= SELLER DASHBOARD ================= */

function openSellerDashboard() {

    showToast(
        "Seller dashboard is ready for backend integration."
    );

}


/* ================= SELLER PRODUCT UPLOAD ================= */

function openProductUpload() {

    showToast(
        "Product upload will connect to seller storage."
    );

}


/* ================= SELLER ORDERS ================= */

function openSellerOrders() {

    showToast(
        "Seller orders will appear here."
    );

}


/* ================= SELLER EARNINGS ================= */

function openSellerEarnings() {

    showToast(
        "Seller earnings will appear here."
    );

}


/* ================= CREATOR EARNINGS ================= */

function openCreatorEarnings() {

    showToast(
        "Creator affiliate earnings will appear here."
    );

}


/* ================= CREATOR LIVE ================= */

function startCreatorLive() {

    showToast(
        "Live streaming infrastructure will connect here."
    );

}


/* ================= PRODUCT TAGGING ================= */

function tagProductToContent(
    productId
) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    showToast(
        `${product.name} tagged to your content.`
    );

}


/* ================= AUCTION ELIGIBILITY ================= */

function checkAuctionEligibility() {

    showToast(
        "Auction eligibility will be verified before bidding."
    );

}


/* ================= AUCTION BID VALIDATION ================= */

function validateBid(amount) {

    const bid =
        Number(amount);


    if (!Number.isFinite(bid)) {
        return false;
    }


    return (
        bid >
        auctionState.currentBid
    );

}


/* ================= AUCTION BID INPUT ================= */

function setupAuctionInput() {

    const input =
        document.getElementById(
            "bidAmount"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            const amount =
                Number(input.value);


            if (
                amount &&
                amount <=
                auctionState.currentBid
            ) {

                input.setCustomValidity(
                    `Bid must be above ₹${auctionState.currentBid}.`
                );

            } else {

                input.setCustomValidity(
                    ""
                );

            }

        }
    );

}


/* ================= PAYMENT PLACEHOLDER ================= */

function startPayment() {

    showToast(
        "Secure payment gateway will connect here."
    );

}


/* ================= ADDRESS VALIDATION ================= */

function validateAddressForm() {

    const form =
        document.getElementById(
            "checkoutForm"
        );


    if (!form) {
        return true;
    }


    return form.checkValidity();

}


/* ================= LOGOUT PLACEHOLDER ================= */

function logoutUser() {

    showToast(
        "Account logout will connect to authentication."
    );

}


/* ================= INITIALIZE EXTRA FEATURES ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupAuctionInput();

    }
);
/* =========================================================
   VIIBGYOR — SCRIPT.JS
   PART 5 / 5
   ========================================================= */

/* ================= SCROLL REVEAL ================= */

function setupScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".section-heading, .live-card, .reel-card, " +
            ".category-card, .product-card, .creator-card, " +
            ".step-card, .ecosystem-card, .trust-card"
        );

    if (!elements.length) {
        return;
    }


    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add("visible");

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* ================= BACK TO TOP ================= */

function setupBackToTop() {

    const button =
        document.getElementById(
            "backToTop"
        );


    if (!button) {
        return;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* ================= CLOSE NAV ON OUTSIDE CLICK ================= */

function setupOutsideNavigation() {

    document.addEventListener(
        "click",
        event => {

            const navMenu =
                document.getElementById(
                    "navMenu"
                );

            const menuToggle =
                document.getElementById(
                    "menuToggle"
                );


            if (!navMenu || !menuToggle) {
                return;
            }


            if (
                navMenu.classList.contains(
                    "active"
                ) &&
                !navMenu.contains(
                    event.target
                ) &&
                !menuToggle.contains(
                    event.target
                )
            ) {

                navMenu.classList.remove(
                    "active"
                );

                menuToggle.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* ================= PREVENT IMAGE DRAG ================= */

function setupImageProtection() {

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "dragstart",
                event => {

                    event.preventDefault();

                }
            );

        });

}


/* ================= KEYBOARD ACCESSIBILITY ================= */

function setupKeyboardAccessibility() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "/" &&
                document.activeElement.tagName !== "INPUT" &&
                document.activeElement.tagName !== "TEXTAREA"
            ) {

                event.preventDefault();

                openSearch();

            }

        }
    );

}


/* ================= PAGE VISIBILITY ================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState === "visible"
        ) {

            updateAuctionTimer();

        }

    }
);


/* ================= FINAL INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupScrollReveal();

        setupBackToTop();

        setupOutsideNavigation();

        setupImageProtection();

        setupKeyboardAccessibility();

        /*
         * IMPORTANT:
         * This frontend stores demo cart/wishlist
         * information locally in the browser.
         *
         * Production VIIBGYOR will require:
         * - Authentication
         * - Database
         * - Seller accounts
         * - Product storage
         * - Orders
         * - Payment gateway
         * - Seller payouts
         * - Messaging
         * - Live streaming
         * - Auction backend
         */


        console.log(
            "VIIBGYOR marketplace frontend initialized."
        );

    }
);


/* =========================================================
   DEMO DATA REFRESH
   ========================================================= */

function refreshMarketplace() {

    renderProducts(products);

    updateCartCount();

    updateWishlistCount();

    renderCart();

}


/* ================= RESET DEMO ================= */

function resetDemoData() {

    cart = [];

    wishlist = [];

    selectedProduct = null;

    selectedSize = "";

    currentReel = null;

    currentSeller = null;

    currentCreator = null;


    try {

        localStorage.removeItem(
            "viibgyorCart"
        );

        localStorage.removeItem(
            "viibgyorWishlist"
        );

    } catch (error) {

        console.log(
            "Local storage reset unavailable."
        );

    }


    refreshMarketplace();


    showToast(
        "Demo data reset successfully."
    );

}


/* ================= DEBUG HELPERS ================= */

window.VIIBGYOR = {

    products,

    creators,

    reels,

    getCart: () => cart,

    getWishlist: () => wishlist,

    getCartTotal,

    refreshMarketplace,

    resetDemoData

};


/* =========================================================
   END OF VIIBGYOR SCRIPT
   ========================================================= */
