<?php
// php/db_connect.php - Secure database connection file

// Go UP one level (..) to find the env folder
$env = parse_ini_file(__DIR__ . '/../env/connect.env');

// Check if the environment file loaded successfully
if (!$env) {
    die("Error: Could not load environment configuration file");
}

// Create connection using the values from .env file
$conn = new mysqli(
    $env['localhost'],       
    $env['ramatou.hassane'],       
    $env['H00pla%a'],   
    $env['webtech_2025A_ramatou_hassane']    
);

// Check if connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character encoding to UTF-8
$conn->set_charset("utf8mb4");

// Connection successful!
?>