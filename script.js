document.getElementById('addCustomerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    
    if (name && email) {
        addCustomerToTable(name, email);
        document.getElementById('addCustomerForm').reset();
    }
});

function addCustomerToTable(name, email) {
    const table = document.getElementById('customerTable');
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>
            <button onclick="editCustomer(this)">Edit</button>
            <button onclick="deleteCustomer(this)">Delete</button>
        </td>
    `;
}

function editCustomer(button) {
    const row = button.closest('tr');
    const nameCell = row.cells[0];
    const emailCell = row.cells[1];
    
    const currentName = nameCell.textContent;
    const currentEmail = emailCell.textContent;
    
    nameCell.innerHTML = `<input type="text" value="${currentName}" class="edit-input">`;
    emailCell.innerHTML = `<input type="email" value="${currentEmail}" class="edit-input">`;
    
    button.textContent = 'Save';
    button.onclick = function() {
        saveCustomer(this);
    };
}

function saveCustomer(button) {
    const row = button.closest('tr');
    const nameInput = row.cells[0].querySelector('input');
    const emailInput = row.cells[1].querySelector('input');
    
    const newName = nameInput.value;
    const newEmail = emailInput.value;
    
    if (newName && newEmail) {
        row.cells[0].textContent = newName;
        row.cells[1].textContent = newEmail;
        
        button.textContent = 'Edit';
        button.onclick = function() {
            editCustomer(this);
        };
    } else {
        alert('Please fill in both name and email!');
    }
}

function deleteCustomer(button) {
    if (confirm('Are you sure you want to delete this customer?')) {
        const row = button.closest('tr');
        row.remove();
    }
} 