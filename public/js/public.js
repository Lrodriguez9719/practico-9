// Crear una instancia de XMLHttpRequest
const xhr = new XMLHttpRequest();

// Load users already saved on local storage
updateUserTable();

// Function to update the user table
function updateUserTable() {
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = ''; // Clear the table body

  // Retrieve users from local storage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Populate the table with user data
  users.forEach(user => {
    const row = userTableBody.insertRow();
    row.insertCell(0).textContent = user.name;
    row.insertCell(1).textContent = user.email;
    row.insertCell(2).textContent = user.birthdate;
    row.insertCell(3).textContent = user.id;

    // Add a delete button
    const deleteCell = row.insertCell(4);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'btn btn-danger btn-sm me-2';
    deleteButton.addEventListener('click', function () {
      deleteUser(user.id);
    });
    deleteCell.appendChild(deleteButton);

    // Add an update button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Actualizar';
    updateButton.className = 'btn btn-warning btn-sm';
    updateButton.addEventListener('click', function () {
      populateForm(user);
    });
    deleteCell.appendChild(updateButton);
  });
}

// Function to delete a user
function deleteUser(userId) {
  // Retrieve users from local storage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  // Filter out the user to be deleted
  const updatedUsers = users.filter(user => user.id !== userId);
  // Save the updated user list to local storage
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  // Send HTTP Request to delete the user on the server
  xhr.open("DELETE", "http://localhost:3000/eliminar", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  // Manejar la respuesta del servidor
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Display success notification message
      alert("Usuario eliminado correctamente.");
      console.log("Respuesta del servidor:", xhr.responseText);
    } else {
      console.error("Error en la solicitud:", xhr.status, xhr.statusText);
    }
  };

  xhr.send(JSON.stringify({ id: userId }));
  
  // Update the user table
  updateUserTable();
}

// Function to populate the form with user data for updating
function populateForm(user) {
  document.getElementById('nombre').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('fechaNacimiento').value = user.birthdate;
  document.getElementById('id').value = user.id;
}

// JavaScript to handle form submission and user table display
document.getElementById('userForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const birthdate = document.getElementById('fechaNacimiento').value;
  const id = document.getElementById('id').value;

  // Validate the form inputs
  if (!name || !email || !birthdate || !id) {
    alert('Por favor complete todos los campos.');
    return;
  }

  // Check if the email is valid
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Por favor ingrese un email válido.');
    return;
  }

  // Save the user data on the local storage
  const userData = {
    name: name,
    email: email,
    birthdate: birthdate,
    id: id
  };

  // Check if the user ID already exists in local storage
  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  const existingUser = existingUsers.find(user => user.id === id);
  if (existingUser) {
    // Update the existing user's data
    existingUser.name = name;
    existingUser.email = email;
    existingUser.birthdate = birthdate;

    // Send HTTP Request to update the user on the server
    xhr.open("PUT", "http://localhost:3000/actualizar", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Manejar la respuesta del servidor
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert("Usuario actualizado correctamente.");
        console.log("Respuesta del servidor:", xhr.responseText);
      } else {
        console.error("Error en la solicitud:", xhr.status, xhr.statusText);
      }
    };

    xhr.send(JSON.stringify(userData));
  } else {
    // Add the new user to the list
    existingUsers.push(userData);

    // Send HTTP Request to create the user on the server
    xhr.open("POST", "http://localhost:3000/recibir", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Manejar la respuesta del servidor
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert("Usuario agregado correctamente.");
        console.log("Respuesta del servidor:", xhr.responseText);
      } else {
        console.error("Error en la solicitud:", xhr.status, xhr.statusText);
      }
    };

    xhr.send(JSON.stringify(userData));
  }
  // Save the updated user list to local storage
  localStorage.setItem('users', JSON.stringify(existingUsers));

  // Update the user table
  updateUserTable();

  // Clear the form
  document.getElementById('userForm').reset();
});