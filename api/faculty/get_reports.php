<?php
// api/faculty/get_reports.php - Get attendance reports for faculty's courses
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

// Get attendance summary for each course
$sql = "SELECT 
            c.course_id,
            c.course_code,
            c.course_name,
            COUNT(DISTINCT s.session_id) as total_sessions,
            COUNT(DISTINCT csl.student_id) as total_students,
            ROUND(
                (COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0) / 
                NULLIF(COUNT(a.attendance_id), 0), 
                2
            ) as average_attendance
        FROM courses c
        LEFT JOIN sessions s ON c.course_id = s.course_id
        LEFT JOIN course_student_list csl ON c.course_id = csl.course_id
        LEFT JOIN attendance a ON s.session_id = a.session_id
        WHERE c.faculty_id = ?
        GROUP BY c.course_id, c.course_code, c.course_name
        ORDER BY c.course_code";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $facultyId);
$stmt->execute();
$result = $stmt->get_result();

$reports = [];
while ($row = $result->fetch_assoc()) {
    // Handle null average_attendance
    if ($row['average_attendance'] === null) {
        $row['average_attendance'] = 0;
    }
    $reports[] = $row;
}

$stmt->close();
$conn->close();

sendJSON([
    'success' => true,
    'reports' => $reports
]);
?>