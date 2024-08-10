const add_user = document.querySelector("#add-user");
const user_modal = document.querySelector("#user-modal");
const cancel = document.querySelector("#cancel");
const save = document.querySelector("#save");
const result = document.querySelector("#result");
const count_pages = document.querySelector("#count-pages");

let form = {};
let edit_user = -1;
let users = JSON.parse(localStorage.getItem("users")) || [];
let search = "";
let current_page = 1;
let items_per_page = document.querySelector("#count-pages").value || 2;

count_pages.addEventListener("input", () => {
   const value = parseInt(count_pages.value);
   items_per_page = value;
   current_page = 1;
   displayUsers();
   saveStorage();
});

document.addEventListener("DOMContentLoaded", () => {
   save.addEventListener("click", addUsers);
   displayUsers();
   saveStorage();
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
   let filtered_users = users.filter((item) => {
      if (item.first_name.toLowerCase().includes(search)) {
         return item;
      }
   });
   let start_index = (current_page - 1) * items_per_page;
   let end_index = current_page * items_per_page;
   let display_users = filtered_users.slice(start_index, end_index);
   display_users.forEach((item, index) => {
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
   paginationUser(filtered_users.length);
}

function paginationUser(total_users) {
   let pagination_control = document.querySelector("#pagination-control");
   let total_pages = Math.ceil(total_users / items_per_page);
   pagination_control.innerHTML = "";
   for (let i = 1; i <= total_pages; i++) {
      let page_btn = document.createElement("button");
      page_btn.innerText = i;
      page_btn.className =
         i === current_page
            ? "btn btn-primary mx-1"
            : "btn btn-outline-primary mx-1";
      page_btn.addEventListener("click", () => {
         current_page = i;
         displayUsers();
         saveStorage();
      });
      pagination_control.appendChild(page_btn);
   }
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
