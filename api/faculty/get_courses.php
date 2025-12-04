<?php
// api/faculty/get_courses.php - Get faculty's courses
require_once '../../config.php';

// Check if user is logged in and is faculty
if (!isLoggedIn() || $_SESSION['role'] !== 'faculty') {
    sendJSON(['success' => false, 'message' => 'Unauthorized access'], 403);
}

$facultyId = $_SESSION['user_id'];

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Get courses taught by faculty with student count
$sql = "SELECT 
            c.course_id,
            c.course_code,
            c.course_name,
            c.description,
            c.credit_hours,
            COUNT(DISTINCT csl.student_id) as student_count
        FROM courses c
        LEFT JOIN course_student_list csl ON c.course_id = csl.course_id
        WHERE c.faculty_id = ?
        GROUP BY c.course_id, c.course_code, c.course_name, c.description, c.credit_hours
        ORDER BY c.course_code";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $facultyId);
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