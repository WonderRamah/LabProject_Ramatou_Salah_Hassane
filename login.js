// js/login.js - Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Clear all previous errors
        clearAllErrors();
        
        // Client-side validation
        let isValid = true;
        
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('usernameError', 'Email is required');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError('usernameError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Create data object
        const loginData = {
            email: email,
            password: password
        };
        
        // Show loading state
        Swal.fire({
            title: 'Logging in...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Send data to server
        fetch('../php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            Swal.close();
            
            if (data.success) {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: `Hello, ${data.user.first_name}!`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Redirect based on role
                    switch(data.user.role) {
                        case 'student':
                            window.location.href = 'student_dashboard.html';
                            break;
                        case 'faculty':
                            window.location.href = 'faculty_dashboard.html';
                            break;
                        case 'faculty_intern':
                            window.location.href = 'faculty_intern_dashboard.html';
                            break;
                        default:
                            window.location.href = 'role.html';
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid credentials. Please try again.'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.'
            });
        });
    });
    
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearAllErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(function(error) {
            error.textContent = '';
            error.style.display = 'none';
        });
    }
});