// Get DOM elements
const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const btn = document.querySelector('.btn');

let selectedUserId = null; // To track the selected user for editing

// Event listeners
myForm.addEventListener('submit', onSubmit);

// Load existing users from cloud storage on page load
window.addEventListener('DOMContentLoaded', () => {
  axios.get("https://crudcrud.com/api/5af870d6289e423db64a09d967e415e5/Appointmentdata")
    .then((response) => {
      console.log(response);
      for (let i = 0; i < response.data.length; i++) {
        showUsersOnScreen(response.data[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    })
});

function onSubmit(e) {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;

  if (name === '' || email === '' || phone === '') {
    showMessage('Please enter all fields.', 'error');
    return;
  }

  const newUser = {
    name,
    email,
    phone
  };

  if (selectedUserId) {
    // If a user is selected for editing, update the existing user
    updateUser(selectedUserId, newUser);
  } else {
    // If no user is selected, create a new user
    createUser(newUser);
  }

  nameInput.value = '';
  emailInput.value = '';
  phoneInput.value = '';
}

function createUser(newUser) {
  axios.post("https://crudcrud.com/api/5af870d6289e423db64a09d967e415e5/Appointmentdata", newUser)
    .then((response) => {
      showUsersOnScreen(response.data);
      console.log(response);
      showMessage('User created successfully!');
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateUser(userId, updatedUser) {
  axios.put(`https://crudcrud.com/api/5af870d6289e423db64a09d967e415e5/Appointmentdata/${userId}`, updatedUser)
    .then((response) => {
      updateUI(userId, updatedUser);
      console.log(response);
      showMessage('User updated successfully!');
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateUI(userId, updatedUser) {
  const user = document.querySelector(`li[data-id="${userId}"]`);
  if (user) {
    const userText = document.createElement('span');
    userText.textContent = `${updatedUser.name} - ${updatedUser.email} - ${updatedUser.phone}`;
    user.innerHTML = ''; // Clear the existing content
    user.appendChild(userText);
    user.appendChild(createEditButton(updatedUser));
    user.appendChild(createDeleteButton(updatedUser._id));
  }
  selectedUserId = null;
}

function createEditButton(user) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('btn', 'btn-primary', 'me-2');
  editButton.addEventListener('click', () => {
    populateFormForEditing(user);
  });
  return editButton;
}

function createDeleteButton(userId) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.addEventListener('click', () => {
    deleteUser(userId);
  });
  return deleteButton;
}

function showUsersOnScreen(newUser) {
  const parentEle = document.getElementById('listOfItems');
  const childEle = document.createElement('li');
  childEle.dataset.id = newUser._id;

  const userText = document.createElement('span');
  userText.textContent = `${newUser.name} - ${newUser.email} - ${newUser.phone}`;
  childEle.appendChild(userText);

  childEle.appendChild(createEditButton(newUser));
  childEle.appendChild(createDeleteButton(newUser._id));

  parentEle.appendChild(childEle);
}

function populateFormForEditing(user) {
  selectedUserId = user._id;
  nameInput.value = user.name;
  emailInput.value = user.email;
  phoneInput.value = user.phone;
}

function deleteUser(userId) {
  axios.delete(`https://crudcrud.com/api/5af870d6289e423db64a09d967e415e5/Appointmentdata/${userId}`)
    .then((response) => {
      const user = document.querySelector(`li[data-id="${userId}"]`);
      if (user) {
        user.remove();
      }
      console.log(response);
      showMessage('User deleted successfully!');
    })
    .catch((err) => {
      console.log(err);
    });
}

function showMessage(message, type = 'success') {
  const msg = document.querySelector('.msg');
  msg.classList.remove('error', 'success');
  msg.classList.add(type);
  msg.innerHTML = message;

  setTimeout(() => {
    msg.innerHTML = '';
  }, 5000);
}
