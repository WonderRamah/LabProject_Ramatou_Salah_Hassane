// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    
    // Add event listener for form submission
    loginForm.addEventListener('submit', function(e) {
        // Prevent the default form submission
        e.preventDefault();
        
        // Get form values (note: using 'username' ID but it's actually email)
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
        
        // If validation fails, stop here
        if (!isValid) {
            return;
        }
        
        // Create data object to send
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
        
        // Send data to server using Fetch API
        fetch('../php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            // Check if the response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse JSON response
            return response.json();
        })
        .then(data => {
            // Close loading alert
            Swal.close();
            
            // Check if login was successful
            if (data.success) {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: `Hello, ${data.first_name}!`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Redirect based on role
                    if (data.role === 'student') {
                        window.location.href = 'student_dashboard.html';
                    } else if (data.role === 'faculty') {
                        window.location.href = 'faculty_dashboard.html';
                    } else {
                        // Default redirect if role is unknown
                        window.location.href = 'role.html';
                    }
                });
            } else {
                // Show error message from server
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid credentials. Please try again.'
                });
            }
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.'
            });
        });
    });
    
    // Helper function to show error
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Helper function to clear all errors
    function clearAllErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(function(error) {
            error.textContent = '';
            error.style.display = 'none';
        });
    }
});