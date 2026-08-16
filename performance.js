// ==================== PERFORMANCE OPTIMIZATION ====================

// 1. Preload Critical Resources
const preloadCriticalResources = () => {
    // Preload Firebase SDK
    const firebasePreload = document.createElement('link');
    firebasePreload.rel = 'preload';
    firebasePreload.as = 'script';
    firebasePreload.href = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    document.head.appendChild(firebasePreload);

    // Preconnect to Firebase
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://sr-toys-53640-default-rtdb.firebaseio.com';
    document.head.appendChild(preconnect);
};

// 2. Lazy Load Images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// 3. Debounce Function for Events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// 4. Cache with IndexedDB (Better than localStorage for large data)
const CacheDB = {
    dbName: 'SRToysCache',
    version: 1,

    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('products')) {
                    db.createObjectStore('products', {
                        keyPath: 'id'
                    });
                }
            };
        });
    },

    async set(key, value) {
        try {
            const db = await this.open();
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            store.put({
                id: key,
                data: value,
                timestamp: Date.now()
            });
            return true;
        } catch (error) {
            console.error('CacheDB set error:', error);
            return false;
        }
    },

    async get(key, maxAge = 5 * 60 * 1000) {
        try {
            const db = await this.open();
            const transaction = db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');

            return new Promise((resolve, reject) => {
                const request = store.get(key);
                request.onsuccess = () => {
                    const result = request.result;
                    if (result && (Date.now() - result.timestamp) < maxAge) {
                        resolve(result.data);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('CacheDB get error:', error);
            return null;
        }
    }
};

// 5. Optimize Firebase Queries
const optimizeFirebaseQuery = (ref, onValue) => {
    // Use once() for one-time reads instead of on()
    // Implement pagination if needed
    // Add indexing rules in Firebase
};

// 6. Compress Images (Client-side)
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

// 7. Request Animation Frame for Smooth Animations
const optimizedAnimation = (callback) => {
    let ticking = false;
    return (...args) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                callback(...args);
                ticking = false;
            });
            ticking = true;
        }
    };
};

// 8. Bundle Critical CSS Inline
const inlineCriticalCSS = () => {
    // Critical CSS should be inlined in <head>
    // Non-critical CSS loaded asynchronously
};

// 9. Prefetch Next Page
const prefetchPage = (url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
};

// 10. Initialize Performance Optimizations
const initPerformance = () => {
    // Preload resources
    preloadCriticalResources();

    // Setup lazy loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', lazyLoadImages);
    } else {
        lazyLoadImages();
    }

    // Prefetch common pages
    setTimeout(() => {
        prefetchPage('products.html');
        prefetchPage('order.html');
    }, 2000);
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformance);
} else {
    initPerformance();
}

// Export for use
window.SRToysPerformance = {
    CacheDB,
    debounce,
    compressImage,
    optimizedAnimation,
    lazyLoadImages
};