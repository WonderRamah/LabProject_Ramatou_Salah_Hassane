<?php
// api/admin/get_courses.php - Get all courses with details
require_once '../../config.php';

// Check if user is logged in and is admin
if (!isLoggedIn() || $_SESSION['role'] !== 'admin') {
    sendJSON(['success' => false, 'message' => 'Unauthorized access'], 403);
}

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Get all courses with faculty names and student count
$sql = "SELECT 
            c.course_id,
            c.course_code,
            c.course_name,
            c.description,
            c.credit_hours,
            CONCAT(u.first_name, ' ', u.last_name) as faculty_name,
            COUNT(DISTINCT csl.student_id) as student_count
        FROM courses c
        INNER JOIN faculty f ON c.faculty_id = f.faculty_id
        INNER JOIN users u ON f.faculty_id = u.user_id
        LEFT JOIN course_student_list csl ON c.course_id = csl.course_id
        GROUP BY c.course_id, c.course_code, c.course_name, c.description, 
                 c.credit_hours, u.first_name, u.last_name
        ORDER BY c.course_code";

$result = $conn->query($sql);

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

$conn->close();

sendJSON([
    'success' => true,
    'courses' => $courses
]);
?>