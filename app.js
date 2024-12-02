document.getElementById('crudForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const response = await fetch('crud.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, email })
    });

    if (response.ok) {
        loadData();
        document.getElementById('crudForm').reset();
        document.getElementById('id').value = '';
    }
});

async function loadData() {
    const response = await fetch('crud.php');
    const data = await response.json();

    const tableBody = document.getElementById('dataTable');
    tableBody.innerHTML = '';
    data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Editar</button>
                <button onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function deleteUser(id) {
    const response = await fetch('crud.php', {
        method: 'DELETE',
        body: `id=${id}`
    });

    if (response.ok) loadData();
}

function editUser(id, name, email) {
    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
}

function filterTable() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#dataTable tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        row.style.display = name.includes(searchValue) || email.includes(searchValue) ? '' : 'none';
    });
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log("Service Worker registrado"))
        .catch(err => console.log("Error al registrar el Service Worker:", err));
}

loadData();
