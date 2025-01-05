const form = document.getElementById('userForm');
const status = document.getElementById('status');
const userTableBody = document.getElementById('userTableBody');

// Load users when the page loads
window.addEventListener('DOMContentLoaded', loadUsers);

// Add user form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
    };

    try {
        const response = await fetch('/add_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            status.textContent = 'User added successfully!';
            form.reset();
            loadUsers(); // Refresh the user table
        } else {
            status.textContent = 'Error adding user.';
        }
    } catch (error) {
        status.textContent = 'An error occurred!';
        console.error(error);
    }
});

// Load users from the server
async function loadUsers() {
    try {
        const response = await fetch('/get_users');
        const users = await response.json();
        userTableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                    <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`/delete_user/${userId}`, { method: 'DELETE' });
        if (response.ok) {
            loadUsers(); // Refresh the user table
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Edit a user
function editUser(id, name, email) {
    const newName = prompt('Enter new name:', name);
    const newEmail = prompt('Enter new email:', email);

    if (newName && newEmail) {
        updateUser(id, newName, newEmail);
    }
}

async function updateUser(id, name, email) {
    try {
        const response = await fetch(`/update_user/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
            loadUsers(); // Refresh the user table
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}
