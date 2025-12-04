<?php
// api/student/get_courses.php - Get student's enrolled courses
require_once '../../config.php';

// Check if user is logged in and is a student
if (!isLoggedIn() || $_SESSION['role'] !== 'student') {
    sendJSON(['success' => false, 'message' => 'Unauthorized access'], 403);
}

$studentId = $_SESSION['user_id'];

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Get courses enrolled by student with faculty information
$sql = "SELECT 
            c.course_id, 
            c.course_code, 
            c.course_name, 
            c.description, 
            c.credit_hours,
            CONCAT(u.first_name, ' ', u.last_name) as faculty_name
        FROM courses c
        INNER JOIN course_student_list csl ON c.course_id = csl.course_id
        INNER JOIN faculty f ON c.faculty_id = f.faculty_id
        INNER JOIN users u ON f.faculty_id = u.user_id
        WHERE csl.student_id = ?
        ORDER BY c.course_code";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentId);
$stmt->execute();
$result = $stmt->get_result();

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

$stmt->close();
$conn->close();

sendJSON([
    'success' => true,
    'courses' => $courses
]);
?>