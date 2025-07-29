// DOM elements
const signupForm = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const errorMessage = document.getElementById('errorMessage');
const subscribeBtn = document.getElementById('subscribeBtn');
const dismissBtn = document.getElementById('dismissBtn');
const userEmail = document.getElementById('userEmail');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form validation state
let isFormValid = false;

// Initialize the application
function init() {
  // Add event listeners
  emailForm.addEventListener('submit', handleFormSubmit);
  emailInput.addEventListener('input', handleEmailInput);
  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('focus', clearError);
  dismissBtn.addEventListener('click', handleDismiss);
  
  // Add keyboard navigation
  emailInput.addEventListener('keydown', handleKeydown);
  dismissBtn.addEventListener('keydown', handleKeydown);
  
  // Focus on email input on page load
  emailInput.focus();
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  
  if (validateEmail(email)) {
    // Show success message
    showSuccessMessage(email);
  } else {
    // Show error state
    showError();
  }
}

// Handle email input changes
function handleEmailInput() {
  const email = emailInput.value.trim();
  
  // Clear error when user starts typing
  if (email && errorMessage.classList.contains('show')) {
    clearError();
  }
  
  // Enable/disable submit button based on input
  subscribeBtn.disabled = !email;
}

// Validate email format
function validateEmail(email = null) {
  const emailToValidate = email || emailInput.value.trim();
  
  if (!emailToValidate) {
    return false;
  }
  
  const isValid = emailRegex.test(emailToValidate);
  isFormValid = isValid;
  
  return isValid;
}

// Show error state
function showError() {
  emailInput.classList.add('error');
  errorMessage.classList.add('show');
  emailInput.focus();
  
  // Add shake animation
  signupForm.classList.add('shake');
  setTimeout(() => {
    signupForm.classList.remove('shake');
  }, 500);
  
  // Update error message text to match Figma design
  errorMessage.textContent = 'Valid email required';
}

// Clear error state
function clearError() {
  emailInput.classList.remove('error');
  errorMessage.classList.remove('show');
}

// Show success message
function showSuccessMessage(email) {
  // Update user email in success message
  userEmail.textContent = email;
  
  // Hide signup form
  signupForm.style.display = 'none';
  
  // Show success message
  successMessage.style.display = 'flex';
  
  // Focus on dismiss button for accessibility
  setTimeout(() => {
    dismissBtn.focus();
  }, 100);
  
  // Add success animation
  successMessage.classList.add('fade-in');
}

// Handle dismiss button click
function handleDismiss() {
  // Hide success message
  successMessage.style.display = 'none';
  successMessage.classList.remove('fade-in');
  
  // Show signup form
  signupForm.style.display = 'flex';
  
  // Reset form
  resetForm();
  
  // Focus on email input
  emailInput.focus();
}

// Reset form to initial state
function resetForm() {
  emailForm.reset();
  clearError();
  isFormValid = false;
  subscribeBtn.disabled = true;
}

// Handle keyboard navigation
function handleKeydown(e) {
  // Allow form submission with Enter key
  if (e.key === 'Enter' && e.target === emailInput) {
    e.preventDefault();
    handleFormSubmit(e);
  }
  
  // Allow dismiss with Enter or Space key
  if ((e.key === 'Enter' || e.key === ' ') && e.target === dismissBtn) {
    e.preventDefault();
    handleDismiss();
  }
  
  // Escape key to dismiss success message
  if (e.key === 'Escape' && successMessage.style.display !== 'none') {
    handleDismiss();
  }
}

// Accessibility enhancements
function enhanceAccessibility() {
  // Add ARIA labels and roles
  emailInput.setAttribute('aria-describedby', 'errorMessage');
  emailInput.setAttribute('aria-invalid', 'false');
  
  // Update ARIA attributes dynamically
  const updateAriaAttributes = () => {
    const hasError = errorMessage.classList.contains('show');
    emailInput.setAttribute('aria-invalid', hasError.toString());
  };
  
  // Observe error message changes
  const observer = new MutationObserver(updateAriaAttributes);
  observer.observe(errorMessage, { attributes: true, classList: true });
}

// Performance optimization
function optimizePerformance() {
  // Debounce email validation
  let validationTimeout;
  
  const debouncedValidation = () => {
    clearTimeout(validationTimeout);
    validationTimeout = setTimeout(() => {
      if (emailInput.value.trim()) {
        validateEmail();
      }
    }, 300);
  };
  
  emailInput.addEventListener('input', debouncedValidation);
}

// Error handling
function handleErrors() {
  window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  enhanceAccessibility();
  optimizePerformance();
  handleErrors();
});

// Export functions for testing (if needed)
export {
  validateEmail,
  showError,
  clearError,
  showSuccessMessage,
  handleDismiss,
  resetForm
}; 