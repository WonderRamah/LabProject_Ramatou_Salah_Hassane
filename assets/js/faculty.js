// faculty.js - Faculty dashboard AJAX functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Check session on page load
    checkSession();
    
    // Load courses by default
    loadCourses();
    
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
                    case 'courses':
                        document.getElementById('sectionTitle').textContent = 'My Courses';
                        document.getElementById('coursesSection').classList.add('active');
                        loadCourses();
                        break;
                    case 'sessions':
                        document.getElementById('sectionTitle').textContent = 'Sessions';
                        document.getElementById('sessionsSection').classList.add('active');
                        loadSessions();
                        break;
                    case 'attendance':
                        document.getElementById('sectionTitle').textContent = 'Mark Attendance';
                        document.getElementById('attendanceSection').classList.add('active');
                        break;
                    case 'reports':
                        document.getElementById('sectionTitle').textContent = 'Reports';
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
            if (!data.loggedIn || data.role !== 'faculty') {
                window.location.href = 'login.html';
            } else {
                document.getElementById('facultyName').textContent = 
                    data.firstName + ' ' + data.lastName;
            }
        })
        .catch(error => {
            console.error('Session check error:', error);
            window.location.href = 'login.html';
        });
    }
    
    // ========== LOAD COURSES ==========
    function loadCourses() {
        const coursesList = document.getElementById('coursesList');
        coursesList.innerHTML = '<div class="loading">Loading courses...</div>';
        
        fetch('../api/faculty/get_courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.courses.length === 0) {
                    coursesList.innerHTML = '<p class="no-data">You are not teaching any courses yet.</p>';
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
                                    <span>Students: ${course.student_count || 0}</span>
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
    
    // ========== LOAD SESSIONS ==========
    function loadSessions() {
        const sessionsList = document.getElementById('sessionsList');
        sessionsList.innerHTML = '<div class="loading">Loading sessions...</div>';
        
        fetch('../api/faculty/get_sessions.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.sessions.length === 0) {
                    sessionsList.innerHTML = '<p class="no-data">No sessions scheduled yet.</p>';
                } else {
                    let html = '<div class="cards-grid">';
                    data.sessions.forEach(session => {
                        html += `
                            <div class="card session-card">
                                <h3>${session.course_code} - ${session.course_name}</h3>
                                <p><strong>Topic:</strong> ${session.topic || 'TBD'}</p>
                                <p><strong>Date:</strong> ${session.date}</p>
                                <p><strong>Time:</strong> ${session.start_time} - ${session.end_time}</p>
                                <p><strong>Location:</strong> ${session.location || 'TBD'}</p>
                                <button class="btn btn-primary" onclick="markAttendance(${session.session_id})">
                                    Mark Attendance
                                </button>
                            </div>
                        `;
                    });
                    html += '</div>';
                    sessionsList.innerHTML = html;
                }
            } else {
                sessionsList.innerHTML = '<p class="error">Failed to load sessions.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading sessions:', error);
            sessionsList.innerHTML = '<p class="error">Error loading sessions.</p>';
        });
    }
    
    // ========== LOAD REPORTS ==========
    function loadReports() {
        const reportsList = document.getElementById('reportsList');
        reportsList.innerHTML = '<div class="loading">Loading reports...</div>';
        
        fetch('../api/faculty/get_reports.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let html = '<div class="reports-container">';
                html += '<h3>Course Attendance Summary</h3>';
                
                if (data.reports.length === 0) {
                    html += '<p class="no-data">No attendance data available.</p>';
                } else {
                    html += '<div class="table-container"><table class="data-table">';
                    html += `
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Total Sessions</th>
                                <th>Total Students</th>
                                <th>Average Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                    `;
                    
                    data.reports.forEach(report => {
                        html += `
                            <tr>
                                <td>${report.course_code} - ${report.course_name}</td>
                                <td>${report.total_sessions}</td>
                                <td>${report.total_students}</td>
                                <td>${report.average_attendance}%</td>
                            </tr>
                        `;
                    });
                    
                    html += '</tbody></table></div>';
                }
                
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

// ========== MARK ATTENDANCE (Global function) ==========
function markAttendance(sessionId) {
    alert('Mark attendance for session ID: ' + sessionId);
    // You can implement detailed attendance marking here
    

}