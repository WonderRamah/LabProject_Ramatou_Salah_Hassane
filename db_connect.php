<?php
// db_connection.php - Place this in your ROOT folder
// This file connects to your database

// Load environment variables from env folder
$env_file = __DIR__ . '/env/connect.env';

// Check if environment file exists
if (!file_exists($env_file)) {
    die("Error: Environment configuration file not found at: " . $env_file);
}

// Parse the .env file
$env = parse_ini_file($env_file);

// Check if the environment file loaded successfully
if (!$env) {
    die("Error: Could not load environment configuration file");
}

// Verify all required keys exist
$required_keys = ['host', 'user', 'password', 'database'];
foreach ($required_keys as $key) {
    if (!isset($env[$key])) {
        die("Error: Missing required configuration: " . $key);
    }
}

// Create connection using values from .env file
$conn = new mysqli(
    $env['host'],
    $env['user'],
    $env['password'],
    $env['database']
);

// Check if connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character encoding to UTF-8
$conn->set_charset("utf8mb4");

// Connection successful
?>