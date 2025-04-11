document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const addUserBtn = document.getElementById('add-user');
    const resetBtn = document.getElementById('reset');
    const usersTable = document.getElementById('users-table').getElementsByTagName('tbody')[0];
    const userCountSpan = document.getElementById('user-count');
    const totalBillSpan = document.getElementById('total-bill');

    const TOTAL_BILL = 100;
    let users = [];

    totalBillSpan.textContent = TOTAL_BILL;
    updateUserCount();
    fetchUsers();

    addUserBtn.addEventListener('click', addUser);
    resetBtn.addEventListener('click', resetUsers);

    emailInput.addEventListener('blur', validateEmail);

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('email-error');

        if (!email) {
            emailError.textContent = 'Email is required';
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        }

        emailError.textContent = '';
        return true;
    }

    function validateName() {
        const name = nameInput.value.trim();
        const nameError = document.getElementById('name-error');

        if (!name) {
            nameError.textContent = 'Name is required';
            return false;
        }

        nameError.textContent = '';
        return true;
    }

    function addUser() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();

        if (!isNameValid || !isEmailValid) {
            return;
        }

        if (users.some(user => user.email === email)) {
            document.getElementById('email-error').textContent = 'This email is already added';
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/back/index.php?action=add', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    fetchUsers();
                    nameInput.value = '';
                    emailInput.value = '';
                } else {
                    alert('Error: ' + response.message);
                }
            } else {
                alert('Request failed. Returned status of ' + xhr.status);
            }
        };

        xhr.send(`name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
    }

    function fetchUsers() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/back/index.php?action=list', true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    users = response.data;
                    renderUsers();
                    updateUserCount();
                } else {
                    alert('Error: ' + response.message);
                }
            } else {
                alert('Request failed. Returned status of ' + xhr.status);
            }
        };

        xhr.send();
    }

    function renderUsers() {
        usersTable.innerHTML = '';

        if (users.length === 0) {
            return;
        }

        const amountPerUser = TOTAL_BILL / users.length;

        users.forEach(user => {
            const row = usersTable.insertRow();

            const nameCell = row.insertCell(0);
            const emailCell = row.insertCell(1);
            const amountCell = row.insertCell(2);

            nameCell.textContent = user.name;
            emailCell.textContent = user.email;
            amountCell.textContent = amountPerUser.toFixed(2) + '€';
        });
    }

    function updateUserCount() {
        userCountSpan.textContent = users.length;
    }

    function resetUsers() {
        if (users.length === 0) {
            return;
        }

        if (!confirm('Are you sure you want to reset all users?')) {
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/back/index.php?action=reset', true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    users = [];
                    renderUsers();
                    updateUserCount();
                } else {
                    alert('Error: ' + response.message);
                }
            } else {
                alert('Request failed. Returned status of ' + xhr.status);
            }
        };

        xhr.send();
    }
});