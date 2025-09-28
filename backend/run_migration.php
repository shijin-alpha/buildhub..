<?php
// Simple script to run the database migration
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Read the SQL file
    $sql = file_get_contents(__DIR__ . '/database/modify_layout_requests_for_architect_view.sql');
    
    // Split by semicolon and execute each statement
    $statements = explode(';', $sql);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $db->exec($statement);
                echo "✓ Executed: " . substr($statement, 0, 50) . "...\n";
            } catch (Exception $e) {
                echo "⚠ Warning: " . $e->getMessage() . "\n";
                echo "Statement: " . substr($statement, 0, 100) . "...\n";
            }
        }
    }
    
    echo "\n✅ Migration completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
}
?>
