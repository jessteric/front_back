<?php

class UserModel
{
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function getAll() {
        try {
            $stmt = $this->db->query("SELECT * FROM users");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Failed to fetch users: " . $e->getMessage());
        }
    }

    /**
     * @param $name
     * @param $email
     * @return mixed
     * @throws Exception
     */
    public function add($name, $email) {
        try {
            if (empty($name) || empty($email)) {
                throw new Exception("Name and email are required");
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Invalid email format");
            }

            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->fetch()) {
                throw new Exception("Email exists");
            }

            $stmt = $this->db->prepare("INSERT INTO users (name, email) VALUES (:name, :email)");
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Failed to add user: " . $e->getMessage());
        }
    }

    /**
     * @return true
     * @throws Exception
     */
    public function reset() {
        try {
            $stmt = $this->db->prepare("TRUNCATE TABLE users");
            $stmt->execute();
            return true;
        } catch (PDOException $e) {
            throw new Exception("Failed to reset users: " . $e->getMessage());
        }
    }
}