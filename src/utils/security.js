// Input validation and sanitization
export const validation = {
  // Australian-specific validation
  validateABN(abn) {
    const cleanABN = abn.replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleanABN)) return false;
    
    // ABN checksum validation
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    let sum = 0;
    
    for (let i = 0; i < 11; i++) {
      sum += (parseInt(cleanABN[i]) - (i === 0 ? 1 : 0)) * weights[i];
    }
    
    return sum % 89 === 0;
  },

  validateAustralianPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const australianPhoneRegex = /^(\+61|0)[2-478](?:[0-9]){8}$/;
    return australianPhoneRegex.test(cleanPhone);
  },

  validatePostcode(postcode) {
    return /^\d{4}$/.test(postcode);
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  // Password strength validation
  validatePassword(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      length: password.length >= minLength,
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
      numbers: hasNumbers,
      special: hasSpecialChar,
      score: [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, password.length >= minLength]
        .filter(Boolean).length
    };
  }
};

// Data sanitization
export const sanitizer = {
  // Remove potentially dangerous characters
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  },

  // Sanitize HTML content (for descriptions, etc.)
  sanitizeHTML(html) {
    // In production, use a proper HTML sanitizer like DOMPurify
    const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'];
    // For now, just remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  },

  // Sanitize file names
  sanitizeFileName(fileName) {
    return fileName
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .replace(/_{2,}/g, '_')
      .substr(0, 255);
  }
};

// Rate limiting helper
export const rateLimiter = {
  attempts: new Map(),

  isAllowed(key, limit = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= limit) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  },

  getRemainingAttempts(key, limit = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    const validAttempts = userAttempts.filter(time => now - time < windowMs);
    
    return Math.max(0, limit - validAttempts.length);
  }
};

// Audit logging
export const auditLogger = {
  log(event, userId, details = {}) {
    const auditEntry = {
      event,
      userId,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('session_id') || 'no_session'
    };

    // In development, log to console
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      console.log('AUDIT LOG:', auditEntry);
    }

    // Store in local storage for debugging (remove in production)
    const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    logs.push(auditEntry);
    localStorage.setItem('audit_logs', JSON.stringify(logs.slice(-100))); // Keep last 100
  }
};
