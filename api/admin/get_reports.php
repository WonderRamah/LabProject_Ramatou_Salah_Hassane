<?php
// api/admin/get_reports.php - Get overall system reports
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

$reports = [];

// Get total attendance records
$result = $conn->query("SELECT COUNT(*) as count FROM attendance");
$reports['total_records'] = $result->fetch_assoc()['count'];

// Calculate overall attendance rate
$sql = "SELECT 
            ROUND(
                (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0) / 
                NULLIF(COUNT(*), 0), 
                2
            ) as rate
        FROM attendance";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$reports['overall_rate'] = $row['rate'] ?? 0;

$conn->close();

sendJSON([
    'success' => true,
    'reports' => $reports
]);
?>