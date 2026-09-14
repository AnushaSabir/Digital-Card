// NextGen AI Engineers - Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close mobile menu when clicking any link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
});

// Consultation & Inquiry WhatsApp Generator
function handleInquirySubmit(e) {
  e.preventDefault();

  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const service = document.getElementById('serviceType').value;
  const city = document.getElementById('clientCity').value.trim() || 'Not specified';
  const notes = document.getElementById('clientNotes').value.trim() || 'None';

  const message = `*Hello NextGen AI Engineers!*%0A%0A` +
    `I would like to inquire about your services:%0A` +
    `*Client / Clinic:* ${encodeURIComponent(name)}%0A` +
    `*Phone / WA:* ${encodeURIComponent(phone)}%0A` +
    `*Service Needed:* ${encodeURIComponent(service)}%0A` +
    `*City:* ${encodeURIComponent(city)}%0A` +
    `*Notes / Details:* ${encodeURIComponent(notes)}%0A%0A` +
    `Please share pricing and details with me. Thank you!`;

  const waUrl = `https://wa.me/923422246124?text=${message}`;
  window.open(waUrl, '_blank');
}
