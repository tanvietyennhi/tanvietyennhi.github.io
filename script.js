// Countdown Timer
function updateCountdown() {
    // Set your wedding date here (year, month-1, day, hour, minute)
    const weddingDate = new Date('2025-12-29T08:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<h2>Đám cưới đã diễn ra!</h2>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Gallery Lightbox
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightbox.classList.add('active');
    lightboxImg.src = images[currentImageIndex];
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImg.src = images[currentImageIndex];
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex];
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard Navigation for Lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

// Wishes Management
const wishesList = document.getElementById('wishesList');

// Load wishes from localStorage
function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
    wishesList.innerHTML = '';
    
    if (wishes.length === 0) {
        wishesList.innerHTML = '<p class="no-wishes">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc mừng nhé! 💕</p>';
        return;
    }
    
    wishes.reverse().forEach((wish, index) => {
        addWishToDOM(wish, index === 0);
    });
}

// Add wish to DOM
function addWishToDOM(wish, isNew = false) {
    const wishItem = document.createElement('div');
    wishItem.className = `wish-item ${isNew ? 'wish-new' : ''}`;
    
    const date = new Date(wish.date);
    const dateStr = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    wishItem.innerHTML = `
        <div class="wish-header">
            <div class="wish-author">
                <span class="wish-icon">💐</span>
                <strong class="wish-name">${escapeHtml(wish.name)}</strong>
            </div>
            <span class="wish-date">${dateStr}</span>
        </div>
        <div class="wish-message">${escapeHtml(wish.message)}</div>
        ${wish.phone ? `<div class="wish-contact">📞 ${escapeHtml(wish.phone)}</div>` : ''}
    `;
    
    wishesList.insertBefore(wishItem, wishesList.firstChild);
    
    // Scroll to new wish
    if (isNew) {
        setTimeout(() => {
            wishItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save wish to localStorage
function saveWish(wish) {
    const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
    wishes.push({
        ...wish,
        date: new Date().toISOString()
    });
    localStorage.setItem('weddingWishes', JSON.stringify(wishes));
}

// RSVP Form Handling
const rsvpForm = document.getElementById('rsvpForm');

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    if (!formData.name || !formData.message) {
        alert('Vui lòng điền đầy đủ tên và lời chúc!');
        return;
    }

    // Save to localStorage
    saveWish(formData);
    
    // Add to DOM immediately
    addWishToDOM({
        ...formData,
        date: new Date().toISOString()
    }, true);
    
    // Show success message
    const submitBtn = rsvpForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Đã gửi!';
    submitBtn.style.background = '#4caf50';
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
    }, 2000);
    
    // Reset form
    rsvpForm.reset();
    
    // In a real application, you would send this data to your backend:
    // fetch('/api/wishes', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     saveWish(formData);
    //     addWishToDOM({...formData, date: new Date().toISOString()}, true);
    //     rsvpForm.reset();
    // })
    // .catch(error => {
    //     alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    // });
});

// Load wishes on page load
loadWishes();

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for fade-in effect
document.querySelectorAll('.story-item, .gallery-item, .event-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Audio Player
const audioToggle = document.getElementById('audioToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
let isPlaying = false;

audioToggle.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        audioToggle.classList.remove('playing');
        isPlaying = false;
    } else {
        backgroundMusic.play().catch(e => {
            console.log('Auto-play was prevented:', e);
        });
        audioToggle.classList.add('playing');
        isPlaying = true;
    }
});

// Falling Flowers Effect
function createFlower() {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.innerHTML = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼'][Math.floor(Math.random() * 7)];
    
    const startX = Math.random() * 100;
    const duration = 3 + Math.random() * 4;
    const delay = Math.random() * 2;
    
    flower.style.left = startX + '%';
    flower.style.animationDuration = duration + 's';
    flower.style.animationDelay = delay + 's';
    
    document.getElementById('fallingFlowers').appendChild(flower);
    
    setTimeout(() => {
        flower.remove();
    }, (duration + delay) * 1000);
}

// Create flowers periodically
setInterval(createFlower, 300);

// Create initial flowers
for (let i = 0; i < 10; i++) {
    setTimeout(() => createFlower(), i * 200);
}

// Gift Box Click Event
const giftItems = document.querySelectorAll('.gift-item');

giftItems.forEach(item => {
    item.addEventListener('click', () => {
        // Toggle opened class
        item.classList.toggle('opened');
    });
});

