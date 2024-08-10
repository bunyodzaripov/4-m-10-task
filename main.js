const add_user = document.querySelector("#add-user");
const user_modal = document.querySelector("#user-modal");
const cancel = document.querySelector("#cancel");
const save = document.querySelector("#save");
const result = document.querySelector("#result");
const form_user = document.querySelector("form");

let form = {};
let edit_user = -1;
let users = JSON.parse(localStorage.getItem("users")) || [];
let search = "";

document.addEventListener("DOMContentLoaded", () => {
   save.addEventListener("click", addUsers);
   displayUsers();
});

add_user.addEventListener("click", () => {
   toggleModal("block");
});

cancel.addEventListener("click", () => {
   toggleModal("none");
});

window.addEventListener("click", (event) => {
   if (event.target == user_modal) {
      toggleModal("none");
   }
});

function addUsers() {
   if (edit_user > -1) {
      users[edit_user] = form;
   } else {
      users.push({ ...form });
   }
   displayUsers();
   toggleModal("none");
   saveStorage();
}

function displayUsers() {
   result.innerHTML = "";
   users
      .filter((item) => {
         if (item.first_name.toLowerCase().includes(search)) {
            return item;
         }
      })
      .forEach((item, index) => {
         let tr = document.createElement("tr");
         tr.innerHTML = `
       <td>${index + 1}</td>
       <td>${item.first_name}</td>
       <td>${item.last_name}</td>
       <td>${item.age}</td>
       <td>${item.phone_number}</td>
       <td>${item.email}</td>
       <td><button class="btn btn-info btn-sm" onclick="editUser(${index})">Edit</button> 
       <button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">Delete</button></td>
     `;
         result.appendChild(tr);
      });
}

function hadneChange(event) {
   const { name, value } = event.target;
   form = { ...form, [name]: value };
}

function handleSearch(event) {
   search = event.target.value.toLowerCase();
   displayUsers();
}

function toggleModal(display) {
   user_modal.style.display = display;
}

function saveStorage() {
   localStorage.setItem("users", JSON.stringify(users));
}

function editUser(index) {
   form = { ...users[index] };
   edit_user = index;
   document.querySelector("input[name='first_name']").value = form.first_name;
   document.querySelector("input[name='last_name']").value = form.last_name;
   document.querySelector("input[name='age']").value = form.age;
   document.querySelector("input[name='phone_number']").value =
      form.phone_number;
   document.querySelector("input[name='email']").value = form.email;
   toggleModal("block");
}

function deleteUser(index) {
   users.splice(index, 1);
   displayUsers();
   saveStorage();
}
