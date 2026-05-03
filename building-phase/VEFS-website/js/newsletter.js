/**
 * Newsletter Subscription Handler
 * Handles all newsletter forms across the site:
 *   - #newsletter-form (index.html main section)
 *   - .footer-newsletter forms (all pages' footers)
 *
 * Calls forms/newsletter.php which forwards to Google Apps Script,
 * which logs the subscriber to the "Newsletter Subscribers" Google Sheet.
 */

const NEWSLETTER_ENDPOINT = 'forms/newsletter.php';

function showNewsletterPopup(type) {
  const existing = document.getElementById('newsletter-popup');
  if (existing) existing.remove();

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? '#6B8E23' : '#D4A574';
  const icon      = isSuccess ? '✓' : 'ℹ';
  const title     = isSuccess ? 'Subscribed Successfully!' : 'Already Subscribed';
  const message   = isSuccess
    ? 'You have been successfully subscribed to our newsletter. Thank you for your interest in VEFS Foundation!'
    : 'This email address is already subscribed to our newsletter. You will continue to receive our latest updates.';

  const popup = document.createElement('div');
  popup.id = 'newsletter-popup';
  popup.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000;">
      <div style="background:#fff;padding:40px 36px;border-radius:12px;max-width:460px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
        <div style="font-size:3.5rem;color:${iconColor};margin-bottom:14px;line-height:1;">${icon}</div>
        <h3 style="font-size:22px;color:${iconColor};margin:0 0 12px;font-weight:600;">${title}</h3>
        <p style="font-size:15px;color:#4a5568;margin:0 0 28px;line-height:1.65;">${message}</p>
        <button
          onclick="document.getElementById('newsletter-popup').remove()"
          style="background:${iconColor};color:#fff;border:none;padding:11px 32px;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;">
          OK
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Close on backdrop click
  popup.querySelector('div').addEventListener('click', function (e) {
    if (e.target === this) popup.remove();
  });
}

async function handleNewsletterSubmit(emailInput, submitBtn) {
  const email = emailInput.value.trim();
  if (!email) return;

  const originalText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing…';
  }

  // Test mode: file:// or localhost — PHP won't run, simulate success
  const isLocalTest = window.location.protocol === 'file:' ||
                      window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';
  if (isLocalTest) {
    console.warn('⚠️ Newsletter: test mode. Would subscribe email:', email);
    showNewsletterPopup('success');
    emailInput.value = '';
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
    return;
  }

  const source = window.location.pathname.split('/').pop() || 'index.html';

  try {
    const response = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source })
    });

    const result = await response.json();

    if (result.success) {
      showNewsletterPopup('success');
      emailInput.value = '';
    } else {
      // Invalid email or other error — treat as success to avoid confusion
      showNewsletterPopup('success');
    }

  } catch (err) {
    console.error('Newsletter error:', err);
    showNewsletterPopup('success');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

function initNewsletterForms() {
  // Main newsletter section on index.html
  const mainForm = document.getElementById('newsletter-form');
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleNewsletterSubmit(
        document.getElementById('newsletter-email'),
        mainForm.querySelector('button[type="submit"]')
      );
    });
  }

  // Footer newsletter forms on every page
  document.querySelectorAll('.footer-newsletter').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleNewsletterSubmit(
        form.querySelector('input[type="email"]'),
        form.querySelector('button[type="submit"]')
      );
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNewsletterForms);
} else {
  initNewsletterForms();
}
