/**
 * Form Validation Component
 * Provides client-side validation for all forms on the website
 */

class FormValidation {
  constructor(formElement) {
    this.form = formElement;
    this.fields = {};
    this.validators = {
      required: this.validateRequired.bind(this),
      email: this.validateEmail.bind(this),
      phone: this.validatePhone.bind(this),
      pan: this.validatePAN.bind(this),
      minLength: this.validateMinLength.bind(this),
      maxLength: this.validateMaxLength.bind(this),
      pattern: this.validatePattern.bind(this),
    };

    this.init();
  }

  /**
   * Initialize form validation
   */
  init() {
    if (!this.form) return;

    // Get all form inputs
    const inputs = this.form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      this.fields[input.name] = input;

      // Validate on blur (when user leaves field)
      input.addEventListener('blur', () => this.validateField(input));

      // Real-time validation for specific fields
      if (input.type === 'email' || input.type === 'tel' || input.type === 'text') {
        input.addEventListener('input', () => {
          if (input.classList.contains('is-invalid') || input.value.length > 3) {
            this.validateField(input);
          }
        });
      }
    });

    // Validate on form submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Handle form submission
   */
  handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      // Form is valid, allow submission
      this.onSuccess();
    } else {
      // Focus on first invalid field
      const firstInvalid = this.form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  /**
   * Validate a single field
   */
  validateField(field) {
    const rules = this.getValidationRules(field);
    let isValid = true;
    let errorMessage = '';

    // Check each validation rule
    for (const rule of rules) {
      const result = this.validators[rule.type](field.value, rule.value, field);

      if (!result.isValid) {
        isValid = false;
        errorMessage = result.message;
        break;
      }
    }

    // Update field UI
    if (isValid) {
      this.markFieldValid(field);
    } else {
      this.markFieldInvalid(field, errorMessage);
    }

    return isValid;
  }

  /**
   * Get validation rules for a field
   */
  getValidationRules(field) {
    const rules = [];

    // Required field
    if (field.hasAttribute('required')) {
      rules.push({ type: 'required' });
    }

    // Email validation
    if (field.type === 'email') {
      rules.push({ type: 'email' });
    }

    // Phone validation
    if (field.type === 'tel' || field.name === 'phone') {
      rules.push({ type: 'phone' });
    }

    // PAN validation
    if (field.name === 'pan' || field.dataset.validate === 'pan') {
      rules.push({ type: 'pan' });
    }

    // Min length
    if (field.hasAttribute('minlength')) {
      rules.push({
        type: 'minLength',
        value: parseInt(field.getAttribute('minlength')),
      });
    }

    // Max length
    if (field.hasAttribute('maxlength')) {
      rules.push({
        type: 'maxLength',
        value: parseInt(field.getAttribute('maxlength')),
      });
    }

    // Pattern (custom regex)
    if (field.hasAttribute('pattern')) {
      rules.push({
        type: 'pattern',
        value: field.getAttribute('pattern'),
      });
    }

    return rules;
  }

  /**
   * Validation functions
   */
  validateRequired(value) {
    const isValid = value.trim().length > 0;
    return {
      isValid,
      message: 'This field is required',
    };
  }

  validateEmail(value) {
    if (!value) return { isValid: true, message: '' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);

    return {
      isValid,
      message: 'Please enter a valid email address',
    };
  }

  validatePhone(value) {
    if (!value) return { isValid: true, message: '' };

    // Indian mobile number format: starts with 6-9, followed by 9 digits
    const phoneRegex = /^[6-9][0-9]{9}$/;
    const cleanedValue = value.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
    const isValid = phoneRegex.test(cleanedValue);

    return {
      isValid,
      message: 'Please enter a valid 10-digit mobile number',
    };
  }

  validatePAN(value) {
    if (!value) return { isValid: true, message: '' };

    // PAN format: ABCDE1234F (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const isValid = panRegex.test(value.toUpperCase());

    return {
      isValid,
      message: 'Please enter a valid PAN number (e.g., ABCDE1234F)',
    };
  }

  validateMinLength(value, minLength) {
    const isValid = value.length >= minLength;

    return {
      isValid,
      message: `Minimum ${minLength} characters required`,
    };
  }

  validateMaxLength(value, maxLength) {
    const isValid = value.length <= maxLength;

    return {
      isValid,
      message: `Maximum ${maxLength} characters allowed`,
    };
  }

  validatePattern(value, pattern) {
    if (!value) return { isValid: true, message: '' };

    const regex = new RegExp(pattern);
    const isValid = regex.test(value);

    return {
      isValid,
      message: 'Please match the requested format',
    };
  }

  /**
   * Mark field as valid
   */
  markFieldValid(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');

    // Clear error message
    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  /**
   * Mark field as invalid
   */
  markFieldInvalid(field, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');

    // Show error message
    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute('role', 'alert');
    }
  }

  /**
   * Get or create error element for a field
   */
  getErrorElement(field) {
    const fieldId = field.id || field.name;
    let errorElement = document.getElementById(`${fieldId}-error`);

    // Create error element if it doesn't exist
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.id = `${fieldId}-error`;
      errorElement.className = 'form-error';
      field.parentNode.appendChild(errorElement);
    }

    return errorElement;
  }

  /**
   * Called when form is valid
   * Override this method to handle form submission
   */
  onSuccess() {
    // Default behavior: submit the form
    this.form.submit();
  }

  /**
   * Reset all field validations
   */
  resetValidation() {
    const inputs = this.form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      input.classList.remove('is-valid', 'is-invalid');

      const errorElement = this.getErrorElement(input);
      if (errorElement) {
        errorElement.textContent = '';
      }
    });
  }

  /**
   * Get form data as an object
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }
}

/**
 * Auto-initialize forms with data-validate attribute
 */
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    new FormValidation(form);
  });
});

/**
 * Export for manual initialization
 */
if (typeof window !== 'undefined') {
  window.FormValidation = FormValidation;
}
