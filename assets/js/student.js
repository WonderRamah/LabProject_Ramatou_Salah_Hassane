// student.js - Student dashboard AJAX functionality

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
                    case 'attendance':
                        document.getElementById('sectionTitle').textContent = 'My Attendance';
                        document.getElementById('attendanceSection').classList.add('active');
                        loadAttendance();
                        break;
                    case 'sessions':
                        document.getElementById('sectionTitle').textContent = 'Upcoming Sessions';
                        document.getElementById('sessionsSection').classList.add('active');
                        loadSessions();
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
            if (!data.loggedIn) {
                window.location.href = 'login.html';
            } else {
                document.getElementById('studentName').textContent = 
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
        
        fetch('../api/student/get_courses.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.courses.length === 0) {
                    coursesList.innerHTML = '<p class="no-data">You are not enrolled in any courses yet.</p>';
                } else {
                    let html = '<div class="cards-grid">';
                    data.courses.forEach(course => {
                        html += `
                            <div class="card course-card" data-course-id="${course.course_id}">
                                <h3>${course.course_code}</h3>
                                <h4>${course.course_name}</h4>
                                <p>${course.description || 'No description'}</p>
                                <div class="card-footer">
                                    <span>Credits: ${course.credit_hours}</span>
                                    <span>Faculty: ${course.faculty_name}</span>
                                </div>
                            </div>
                        `;
                    });
                    html += '</div>';
                    coursesList.innerHTML = html;
                    
                    // Add click event to course cards
                    document.querySelectorAll('.course-card').forEach(card => {
                        card.addEventListener('click', function() {
                            const courseId = this.getAttribute('data-course-id');
                            alert('Course ID: ' + courseId + ' clicked!');
                            // You can load course details here
                        });
                    });
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
    
    // ========== LOAD ATTENDANCE ==========
    function loadAttendance() {
        const attendanceList = document.getElementById('attendanceList');
        attendanceList.innerHTML = '<div class="loading">Loading attendance...</div>';
        
        fetch('../api/student/get_attendance.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.attendance.length === 0) {
                    attendanceList.innerHTML = '<p class="no-data">No attendance records found.</p>';
                } else {
                    let html = '<div class="table-container"><table class="data-table">';
                    html += `
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Session</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Check-in Time</th>
                            </tr>
                        </thead>
                        <tbody>
                    `;
                    
                    data.attendance.forEach(record => {
                        const statusClass = record.status === 'present' ? 'status-present' : 
                                          record.status === 'late' ? 'status-late' : 'status-absent';
                        html += `
                            <tr>
                                <td>${record.course_code}</td>
                                <td>${record.topic || 'N/A'}</td>
                                <td>${record.date}</td>
                                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                                <td>${record.check_in_time || 'N/A'}</td>
                            </tr>
                        `;
                    });
                    
                    html += '</tbody></table></div>';
                    attendanceList.innerHTML = html;
                }
            } else {
                attendanceList.innerHTML = '<p class="error">Failed to load attendance.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading attendance:', error);
            attendanceList.innerHTML = '<p class="error">Error loading attendance.</p>';
        });
    }
    
    // ========== LOAD SESSIONS ==========
    function loadSessions() {
        const sessionsList = document.getElementById('sessionsList');
        sessionsList.innerHTML = '<div class="loading">Loading sessions...</div>';
        
        fetch('../api/student/view_sessions.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.sessions.length === 0) {
                    sessionsList.innerHTML = '<p class="no-data">No upcoming sessions.</p>';
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
});