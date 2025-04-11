<?php

require_once __DIR__ . '/UserModel.php';
require_once __DIR__ . '/config/Database.php';

class MainController
{
    private $userModel;

    /**
     * @throws Exception
     */
    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->userModel = new UserModel($db);
    }

    /**
     * @return void
     */
    public function handleRequest() {
        $action = isset($_GET['action']) ? $_GET['action'] : '';

        try {
            switch ($action) {
                case 'add':
                    $this->addUser();
                    break;
                case 'list':
                    $this->listUsers();
                    break;
                case 'reset':
                    $this->resetUsers();
                    break;
                default:
                    $this->sendResponse(false, 'Invalid action');
            }
        } catch (Exception $e) {
            $this->sendResponse(false, $e->getMessage());
        }
    }

    /**
     * @return void
     * @throws Exception
     */
    private function addUser() {
        $name = isset($_POST['name']) ? $_POST['name'] : '';
        $email = isset($_POST['email']) ? $_POST['email'] : '';

        if (empty($name) || empty($email)) {
            throw new Exception('Name and email are required');
        }

        $this->userModel->add($name, $email);
        $this->sendResponse(true, 'User added successfully');
    }

    /**
     * @return void
     * @throws Exception
     */
    private function listUsers() {
        $users = $this->userModel->getAll();
        $this->sendResponse(true, 'Users retrieved successfully', $users);
    }

    /**
     * @return void
     * @throws Exception
     */
    private function resetUsers() {
        $this->userModel->reset();
        $this->sendResponse(true, 'Users reset successfully');
    }

    /**
     * @param $success
     * @param $message
     * @param $data
     * @return void
     */
    private function sendResponse($success, $message, $data = []) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }
}