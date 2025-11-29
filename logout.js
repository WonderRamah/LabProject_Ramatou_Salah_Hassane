// Logout functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get the logout button
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to logout?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // User confirmed logout
                    logout();
                }
            });
        });
    }
});

function logout() {
    // Show loading state
    Swal.fire({
        title: 'Logging out...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Make fetch call to logout.php
    fetch('../php/logout.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        Swal.close();
        
        if (data.logout) {
            // Logout successful
            Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: data.message || 'You have been logged out successfully',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Redirect to login page
                window.location.href = 'login.html';
            });
        } else {
            // Logout failed
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Failed to logout. Please try again.'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again.'
        });
    });
}