<?php
class Database {
    private $host = "localhost";
    private $database_name = "pertanian";
    private $username = "root";
    private $password = "";
    private $conn;

    public function getKoneksi() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                ]
            );
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
            exit;
        }
        return $this->conn;
    }
}
?>