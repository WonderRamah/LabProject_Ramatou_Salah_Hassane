function validateForm(event) {
    event.preventDefault();
    
    var form = event.target;
    var isValid = true;
    
    // Clear all previous errors
    var errors = document.querySelectorAll('.error');
    errors.forEach(function(error) {
        error.innerHTML = "";
        error.style.display = 'none';
    });
    
    // Validate all fields
    var username = document.getElementById('username');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var confirmPassword = document.getElementById('confirmPassword');
    var terms = document.getElementById('terms');
    
    // Username validation
    if (username && username.value.trim() === "") {
        showError('usernameError', 'Username is required');
        isValid = false;
    } else if (username && username.value.trim().length < 3) {
        showError('usernameError', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    // Email validation (only if email field exists)
    if (email) {
        if (email.value.trim() === "") {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Password validation
    if (password && password.value === "") {
        showError('passwordError', 'Password is required');
        isValid = false;
    } else if (password && password.value.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Confirm password validation (only for signup)
    if (confirmPassword) {
        if (confirmPassword.value === "") {
            showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password && confirmPassword.value !== password.value) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
    }
    
    // Terms validation (only for signup)
    if (terms && !terms.checked) {
        showError('termsError', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    // If all validations pass, redirect
    if (isValid) {
        if (form.id === 'loginForm') {
            alert('Login successful!');
        } else {
            alert('Registration successful!');
        }
        window.location.href = 'role.html';
    }
}

function validateEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function showError(elementId, message) {
    var errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    var errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerHTML = "";
        errorElement.style.display = 'none';
    }
}

// Setup real-time validation
function setupRealTimeValidation() {
    var inputs = document.querySelectorAll('input');
    
    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            var errorId = this.id + 'Error';
            clearError(errorId);
        });
    });
}

function validateField(field) {
    var value = field.value.trim();
    var errorId = field.id + 'Error';
    
    switch(field.type) {
        case 'text':
            if (field.id === 'username') {
                if (value === "") {
                    showError(errorId, 'Username is required');
                } else if (value.length < 3) {
                    showError(errorId, 'Username must be at least 3 characters');
                }
            }
            break;
            
        case 'email':
            if (value === "") {
                showError(errorId, 'Email is required');
            } else if (!validateEmail(value)) {
                showError(errorId, 'Please enter a valid email address');
            }
            break;
            
        case 'password':
            if (field.id === 'password') {
                if (value === "") {
                    showError(errorId, 'Password is required');
                } else if (value.length < 6) {
                    showError(errorId, 'Password must be at least 6 characters');
                }
            } else if (field.id === 'confirmPassword') {
                var password = document.getElementById('password');
                if (value === "") {
                    showError(errorId, 'Please confirm your password');
                } else if (password && value !== password.value) {
                    showError(errorId, 'Passwords do not match');
                }
            }
            break;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', validateForm);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', validateForm);
    }
    
    setupRealTimeValidation();
});