// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the signup form
    const signupForm = document.getElementById('signupForm');
    
    // Add event listener for form submission
    signupForm.addEventListener('submit', function(e) {
        // Prevent the default form submission
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('role').value;
        const terms = document.getElementById('terms').checked;
        
        // Clear all previous errors
        clearAllErrors();
        
        // Client-side validation
        let isValid = true;
        
        // Validate first name
        if (!firstName) {
            showError('firstNameError', 'First name is required');
            isValid = false;
        } else if (firstName.length < 2) {
            showError('firstNameError', 'First name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate last name
        if (!lastName) {
            showError('lastNameError', 'Last name is required');
            isValid = false;
        } else if (lastName.length < 2) {
            showError('lastNameError', 'Last name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        // Validate role
        if (!role) {
            showError('roleError', 'Please select a role');
            isValid = false;
        }
        
        // Validate terms
        if (!terms) {
            showError('termsError', 'You must agree to the terms and conditions');
            isValid = false;
        }
        
        // If validation fails, stop here
        if (!isValid) {
            return;
        }
        
        // Create data object to send
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            role: role
        };
        
        // Show loading state
        Swal.fire({
            title: 'Creating your account...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Send data to server using Fetch API
        // Adjust the path based on where your signup.php is located
        fetch('../php/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
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
            
            // Check if signup was successful
            if (data.success) {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: data.message || 'Account created successfully!',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    // Redirect to login page after 2 seconds
                    window.location.href = 'login.html';
                });
            } else {
                // Show error message from server
                Swal.fire({
                    icon: 'error',
                    title: 'Signup Failed',
                    text: data.message || 'An error occurred. Please try again.'
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