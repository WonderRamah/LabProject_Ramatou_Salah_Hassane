// auth.js - Handles login and signup with AJAX

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== LOGIN FORM HANDLER ==========
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            
            // Clear previous messages
            clearMessages();
            
            // Disable button during request
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            // AJAX request
            fetch('../api/auth/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess(data.message);
                    
                    // Redirect based on role after 1 second
                    setTimeout(() => {
                        switch(data.role) {
                            case 'student':
                                window.location.href = 'student_dashboard.html';
                                break;
                            case 'faculty':
                                window.location.href = 'faculty_dashboard.html';
                                break;
                            case 'admin':
                                window.location.href = 'admin_dashboard.html';
                                break;
                            default:
                                window.location.href = '../index.php';
                        }
                    }, 1000);
                } else {
                    showError(data.message);
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Login';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('An error occurred. Please try again.');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            });
        });
    }
    
    // ========== SIGNUP FORM HANDLER ==========
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const dob = document.getElementById('dob').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('role').value;
            const signupBtn = document.getElementById('signupBtn');
            
            // Clear previous messages
            clearMessages();
            
            // Client-side validation
            if (password !== confirmPassword) {
                showError('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                showError('Password must be at least 6 characters long!');
                return;
            }
            
            if (!role) {
                showError('Please select a role!');
                return;
            }
            
            // Disable button during request
            signupBtn.disabled = true;
            signupBtn.textContent = 'Creating Account...';
            
            // AJAX request
            fetch('../api/auth/signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    dob: dob,
                    password: password,
                    role: role
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess(data.message);
                    
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showError(data.message);
                    signupBtn.disabled = false;
                    signupBtn.textContent = 'Create Account';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('An error occurred. Please try again.');
                signupBtn.disabled = false;
                signupBtn.textContent = 'Create Account';
            });
        });
    }
    
    // ========== HELPER FUNCTIONS ==========
    function showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
    
    function showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }
    
    function clearMessages() {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        
        if (successDiv) {
            successDiv.textContent = '';
            successDiv.style.display = 'none';
        }
    }
});