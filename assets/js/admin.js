// admin.js - Admin dashboard AJAX functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Check session on page load
    checkSession();
    
    // Load overview by default
    loadOverview();
    
    // ========== NAVIGATION EVENT LISTENERS ==========
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            
            if (section) {
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Hide all sections
                document.querySelectorAll('.content-section').forEach(s => {
                    s.classList.remove('active');
                });
                
                // Show selected section
                switch(section) {
                    case 'overview':
                        document.getElementById('sectionTitle').textContent = 'System Overview';
                        document.getElementById('overviewSection').classList.add('active');
                        loadOverview();
                        break;
                    case 'users':
                        document.getElementById('sectionTitle').textContent = 'User Management';
                        document.getElementById('usersSection').classList.add('active');
                        loadUsers();
                        break;
                    case 'courses':
                        document.getElementById('sectionTitle').textContent = 'Course Management';
                        document.getElementById('coursesSection').classList.add('active');
                        loadCourses();
                        break;
                    case 'reports':
                        document.getElementById('sectionTitle').textContent = 'System Reports';
                        document.getElementById('reportsSection').classList.add('active');
                        loadReports();
                        break;
                }
            }
        });
    });
    
    // ========== LOGOUT HANDLER ==========
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to logout?')) {
            fetch('../api/auth/logout.php', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
                window.location.href = 'login.html';
            });
        }
    });
    
    // ========== CHECK SESSION ==========
    function checkSession() {
        fetch('../api/auth/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn || data.role !== 'admin') {
                window.location.href = 'login.html';
            } else {
                document.getElementById('adminName').textContent = 
                    data.firstName + ' ' + data.lastName;
            }
        })
        .catch(error => {
            console.error('Session check error:', error);
            window.location.href = 'login.html';
        });
    }
    
    // ========== LOAD OVERVIEW ==========
    function loadOverview() {
        const overviewContent = document.getElementById('overviewContent');
        overviewContent.innerHTML = '<div class="loading">Loading overview...</div>';
        
        fetch('../api/admin/get_overview.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let html = `
                    <div class="cards-grid">
                        <div class="card stat-card">
                            <h3>Total Students</h3>
                            <p class="stat-number">${data.overview.total_students}</p>
                        </div>
                        <div class="card stat-card">
                            <h3>Total Faculty</h3>
                            <p class="stat-number">${data.overview.total_faculty}</p>
                        </div>
                        <div class="card stat-card">
                            <h3>Total Courses</h3>
                            <p class="stat-number">${data.overview.total_courses}</p>
                        </div>
                        <div class="card stat-card">
                            <h3>Total Sessions</h3>
                            <p class="stat-number">${data.overview.total_sessions}</p>
                        </div>
                    </div>
                `;
                overviewContent.innerHTML = html;
            } else {
                overviewContent.innerHTML = '<p class="error">Failed to load overview.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading overview:', error);
            overviewContent.innerHTML = '<p class="error">Error loading overview.</p>';
        });
    }
    
    // ========== LOAD USERS ==========
    function loadUsers() {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '<div class="loading">Loading users...</div>';
        
        fetch('../api/admin/get_users.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.users.length === 0) {
                    usersList.innerHTML = '<p class="no-data">No users found.</p>';
                } else {
                    let html = '<div class="table-container"><table class="data-table">';
                    html += `
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Date of Birth</th>
                            </tr>
                        </thead>
                        <tbody>
                    `;
                    
                    data.users.forEach(user => {
                        html += `
                            <tr>
                                <td>${user.user_id}</td>
                                <td>${user.first_name} ${user.last_name}</td>
                                <td>${user.email}</td>
                                <td><span class="status-badge">${user.role}</span></td>
                                <td>${user.dob || 'N/A'}</td>
                            </tr>
                        `;
                    });
                    
                    html += '</tbody></table></div>';
                    usersList.innerHTML = html;
                }
            } else {
                usersList.innerHTML = '<p class="error">Failed to load users.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading users:', error);
            usersList.innerHTML = '<p class="error">Error loading users.</p>';
        });
    }
    
    // ========== LOAD COURSES ==========
    function loadCourses() {
        const coursesList = document.getElementById('coursesList');
        coursesList.innerHTML = '<div class="loading">Loading courses...</div>';
        
        fetch('../api/admin/get_courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.courses.length === 0) {
                    coursesList.innerHTML = '<p class="no-data">No courses found.</p>';
                } else {
                    let html = '<div class="cards-grid">';
                    data.courses.forEach(course => {
                        html += `
                            <div class="card course-card">
                                <h3>${course.course_code}</h3>
                                <h4>${course.course_name}</h4>
                                <p>${course.description || 'No description'}</p>
                                <div class="card-footer">
                                    <span>Credits: ${course.credit_hours}</span>
                                    <span>Faculty: ${course.faculty_name}</span>
                                    <span>Students: ${course.student_count}</span>
                                </div>
                            </div>
                        `;
                    });
                    html += '</div>';
                    coursesList.innerHTML = html;
                }
            } else {
                coursesList.innerHTML = '<p class="error">Failed to load courses.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading courses:', error);
            coursesList.innerHTML = '<p class="error">Error loading courses.</p>';
        });
    }
    
    // ========== LOAD REPORTS ==========
    function loadReports() {
        const reportsList = document.getElementById('reportsList');
        reportsList.innerHTML = '<div class="loading">Loading reports...</div>';
        
        fetch('../api/admin/get_reports.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let html = '<div class="reports-container">';
                html += '<h3>Overall Attendance Statistics</h3>';
                html += `<p>Total Attendance Records: ${data.reports.total_records}</p>`;
                html += `<p>Overall Attendance Rate: ${data.reports.overall_rate}%</p>`;
                html += '</div>';
                reportsList.innerHTML = html;
            } else {
                reportsList.innerHTML = '<p class="error">Failed to load reports.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading reports:', error);
            reportsList.innerHTML = '<p class="error">Error loading reports.</p>';
        });
    }
});