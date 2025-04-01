let loginForm = document.getElementById("login-form");
let adminPanel = document.getElementById("admin-panel");
adminPanel.style.display = "none";
function adminLogin() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  localStorage.setItem(
    "admin",
    JSON.stringify({ email: "admin@admin.com", password: "admin" })
  );
  let get = localStorage.getItem("admin");
  get = JSON.parse(get);
  if (get.email == email.value && get.password == password.value) {
    localStorage.setItem("loggedIn", "true");
    loginForm.style.display = "none";
    adminPanel.style.display = "flex";
  } else {
    Swal.fire({
      icon: "error",
      title: "Your email and password is incorrect!",
    });
  }
}

function checkLoginStatus() {
  if (localStorage.getItem("loggedIn") === "true") {
    loginForm.style.display = "none"; // Hide form if already logged in
    adminPanel.style.display = "flex";
  } else {
    loginForm.style.display = "flex";
    adminPanel.style.display = "none";
  }
}
checkLoginStatus();

function logout() {
  localStorage.removeItem("loggedIn");
  loginForm.style.display = "flex";
}

function showContent(section) {
  let content = document.getElementById("content");
  if (section === "dashboard") {
    content.innerHTML =
      "<h1 class='text-3xl font-semibold text-cyan-400'>Dashboard</h1><p class='text-gray-300 mt-2'>Overview of restaurant analytics.</p>";
  } else if (section === "restaurants") {
    content.innerHTML = `
          <h1 class='text-3xl font-semibold text-cyan-400'>Manage Restaurants</h1>
          <button class='mt-4 px-4 py-2 bg-gradient-to-br from-purple-900 to-teal-700 text-white rounded' onclick='openModal()'>Add Restaurant</button>
          <table class='mt-4 w-full border-collapse border'>
              <thead>
                  <tr class='bg-gray-800'>
                      <th class='border p-2'>Logo</th>
                      <th class='border p-2'>Name</th>
                      <th class='border p-2'>Description</th>
                      <th class='border p-2'>Contact</th>
                      <th class='border p-2'>Address</th>
                      <th class='border p-2'>Edit</th>
                      <th class='border p-2'>Delete</th>
                  </tr>
              </thead>
              <tbody id='restaurantList'>
              </tbody>
          </table>
      `;
    loadRestaurants();
  } else if (section === "dishes") {
    content.innerHTML = `<h1 class='text-3xl font-semibold text-cyan-400'>Manage Dishes</h1>
      <button class='mt-4 px-4 py-2 bg-gradient-to-br from-purple-900 to-teal-700 text-white rounded' onclick='openDishModal()'>Add Dishes</button>
          <table class='mt-4 w-full border-collapse border border-cyan-300'>
              <thead>
                  <tr class='bg-gray-800'>
                      <th class='border p-2'>Restaurant</th>
                      <th class='border p-2'>Name</th>
                      <th class='border p-2'>Description</th>
                      <th class='border p-2'>Price</th>
                      <th class='border p-2'>Edit</th>
                      <th class='border p-2'>Delete</th>
                  </tr>
              </thead>
              <tbody id='dishList'>
              </tbody>
          </table>`;
    loadRestaurantOptions();
    loadDishes();
  } else if (section === "orders") {
    content.innerHTML = `<h1 class='text-3xl font-semibold text-cyan-400'>Orders</h1>
      <table class='mt-4 w-full border-collapse border border-cyan-300'>
          <thead>
              <tr class='bg-gray-800'>
                  <th class='border p-2'>Image</th>
                  <th class='border p-2'>Restaurant</th>
                  <th class='border p-2'>Dish</th>
                  <th class='border p-2'>Price</th>
                  <th class='border p-2'>Status</th>
                  <th class='border p-2'>Check</th>
                  <th class='border p-2'>Delete</th>
              </tr>
          </thead>
          <tbody id='orderList'>
          </tbody>
      </table>`;
    loadOrders();
  } else if (section === "settings") {
    content.innerHTML =
      "<h1 class='text-3xl font-semibold text-cyan-400'>Settings</h1><p class='text-gray-300 mt-2'>Configure restaurant settings.</p>";
  }
}

function openModal() {
  document.getElementById("restaurantModal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("restaurantModal").classList.add("hidden");
  document.getElementById("restaurantName").value = "";
  document.getElementById("restaurantDescription").value = "";
  document.getElementById("restaurantContact").value = "";
  document.getElementById("restaurantAddress").value = "";
  document.getElementById("restaurantImg").value = "";
}

function loadRestaurants() {
  let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  let restaurantList = document.getElementById("restaurantList");

  restaurantList.innerHTML = "";

  restaurants.forEach((restaurant) => {
    let row = document.createElement("tr");
    row.classList.add("bg-gray-800");
    row.innerHTML = `
          <td class='border py-2 px-[29px] w-[110px]'><img src="${restaurant.logo}" class="w-12 h-12 rounded-full"></td>
          <td class='border p-2 w-[140px]'>${restaurant.name}</td>
          <td class='border p-2'>${restaurant.description}</td>
          <td class='border p-2 w-[180px]'>${restaurant.phone}</td>
          <td class="border p-2 break-words overflow-hidden whitespace-normal">${restaurant.address}</td>
          <td class='border p-2'><button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="editRestaurant(${restaurant.id})">Edit</button></td>
          <td class='border p-2'><button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteRestaurant(${restaurant.id})">Delete</button></td>
      `;
    restaurantList.appendChild(row);
  });
}

function addRestaurant() {
  let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  let name = document.getElementById("restaurantName").value.trim();
  let description = document.getElementById("restaurantDescription").value.trim();
  let file = document.getElementById("restaurantImg").files[0];
  let phone = document.getElementById("restaurantContact").value.trim();
  let address = document.getElementById("restaurantAddress").value.trim();

  if (!name || !description) {
    Swal.fire({
      title: "Please enter a valid name and description",
      icon: "error",
    });
    return;
  }

  let phonePattern = /^[0-9]{10,11}$/;
  if (!phonePattern.test(phone)) {
    Swal.fire({
      title: "Please enter a valid phone number (10-11 digits).",
      icon: "error",
    });
    return;
  }

  if (!address) {
    Swal.fire({
      title: "Please enter a valid address",
      icon: "error",
    });
    return;
  }

  if (!file) {
    Swal.fire({
      title: "Please upload a logo",
      icon: "error",
    });
    return;
  }

  resizeImage(file, 200, 200, function (compressedImage) {
    let obj = {
      id: new Date().getTime(),
      logo: compressedImage,
      name,
      description,
      phone,
      address,
      dishes: [],
    };

    restaurants.push(obj);

    localStorage.setItem("restaurants", JSON.stringify(restaurants));
    loadRestaurants();
    closeModal();
  });
}

function deleteRestaurant(id) {
  let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  restaurants = restaurants.filter((restaurant) => restaurant.id !== id);

  localStorage.setItem("restaurants", JSON.stringify(restaurants));

  loadRestaurants();
}

function editRestaurant(id) {
  let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  let restaurant = restaurants.find((res) => res.id === id);

  if (restaurant) {
    let newName = prompt("Enter new name", restaurant.name);
    let newPhone = prompt("Enter new phone", restaurant.phone);
    let newAddress = prompt("Enter new address", restaurant.address);

    if (newName) restaurant.name = newName;
    if (newPhone) restaurant.phone = newPhone;
    if (newAddress) restaurant.address = newAddress;

    localStorage.setItem("restaurants", JSON.stringify(restaurants));

    loadRestaurants();
  }
}

function openDishModal() {
  document.getElementById("dishModal").classList.remove("hidden");
}

function closeDishModal() {
  document.getElementById("dishModal").classList.add("hidden");
  document.getElementById("dishName").value = "";
  document.getElementById("dishDescription").value = "";
  document.getElementById("dishPrice").value = "";
  document.getElementById("dishImg").value = "";
  document.getElementById("restaurantSelect").value = "";
}

function loadDishes() {
  const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  const dishList = document.getElementById("dishList");
  dishList.innerHTML = "";

  restaurants.forEach((restaurant) => {
    restaurant.dishes.forEach((dish) => {
      let row = document.createElement("tr");
      row.classList.add("bg-gray-800");
      row.innerHTML = `
              <td class='border p-2'>${restaurant.name}</td>
              <td class='border p-2'>${dish.name}</td>
              <td class='border p-2'>${dish.description}</td>
              <td class='border p-2'>$${dish.price}</td>
              <td class='border p-2'><button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="editDish(${restaurant.id}, ${dish.id})">Edit</button></td>
              <td class='border p-2'><button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteDish(${restaurant.id}, ${dish.id})">Delete</button></td>
          `;
      dishList.appendChild(row);
    });
  });
}

function addDishes() {
  const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  const name = document.getElementById("dishName").value.trim();
  const description = document.getElementById("dishDescription").value.trim();
  const restaurantId = document.getElementById("restaurantSelect").value;
  const file = document.getElementById("dishImg").files[0];
  const price = document.getElementById("dishPrice").value.trim();

  if (!name || !description || !restaurantId || !price || isNaN(price) || price <= 0 || !file) {
    Swal.fire({
      title: "All fields are required! Please enter a valid price.",
      icon: "error",
    });
    return;
  }

  resizeImage(file, 200, 200, function (compressedImage) {
    let newDish = {
        id: new Date().getTime(),
        logo: compressedImage,
        name,
        description,
        price: parseFloat(price),
    };

    let restaurant = restaurants.find((res) => res.id == restaurantId);
    if (restaurant) {
      restaurant.dishes.push(newDish);
      localStorage.setItem("restaurants", JSON.stringify(restaurants));
      Swal.fire({
        title: "Dish added successfully!",
        icon: "success",
      });
      loadDishes();
      closeDishModal();
    } else {
      Swal.fire({
        title: "Selected restaurant not found!",
        icon: "error",
      });
    }
  });
}

function editDish(restaurantId, dishId) {
  let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  let restaurant = restaurants.find((res) => res.id == restaurantId);
  if (!restaurant) return;

  let dish = restaurant.dishes.find((dish) => dish.id == dishId);
  if (!dish) return;

  let newName = prompt("Enter new dish name", dish.name) || dish.name;
  let newPrice = prompt("Enter new price", dish.price);
  if (!isNaN(newPrice) && newPrice > 0) {
    dish.name = newName;
    dish.price = parseFloat(newPrice);
    localStorage.setItem("restaurants", JSON.stringify(restaurants));
    loadDishes();
  } else {
    Swal.fire({
      title: "Please enter a valid price!",
      icon: "error",
    });
  }
}

function deleteDish(restaurantId, dishId) {
  let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  let restaurant = restaurants.find((res) => res.id == restaurantId);
  if (restaurant) {
    restaurant.dishes = restaurant.dishes.filter((dish) => dish.id !== dishId);
    localStorage.setItem("restaurants", JSON.stringify(restaurants));
    loadDishes();
  }
}

function loadRestaurantOptions() {
  const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
  const restaurantSelect = document.getElementById("restaurantSelect");
  restaurantSelect.innerHTML =
    "<option value=''>-- Select Restaurant --</option>";
  restaurants.forEach((restaurant) => {
    let option = document.createElement("option");
    option.value = restaurant.id;
    option.textContent = restaurant.name;
    restaurantSelect.appendChild(option);
  });
}

function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
              const scale = Math.min(maxWidth / width, maxHeight / height);
              width = width * scale;
              height = height * scale;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 0.7 = 70% quality
          callback(compressedBase64);
      };
  };
}

function loadOrders() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let orderList = document.getElementById("orderList");

  orderList.innerHTML = "";

  orders.forEach((order, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
    <td class='border py-2 px-[29px] w-[110px]'><img src="${order.image}" class="w-12 h-12 rounded-full"></td>
      <td class='border p-2 text-center'>${order.restaurant}</td>
      <td class='border p-2 text-center'>${order.dish}</td>
      <td class='border p-2 text-center'>$${order.price}</td>
      <td class='border p-2 text-center' id="status-${order.id}">${order.status}</td>
      <td class='border p-2 text-center'>
        <button class="px-3 py-1 bg-green-500 text-white rounded" onclick="markAsChecked(${order.id})">Check</button>
      </td>
      <td class='border p-2 text-center'>
        <button class="px-3 py-1 bg-red-500 text-white rounded" onclick="deleteOrder(${index})">Delete</button>
      </td>
    `;
    orderList.appendChild(row);
  });
}

function markAsChecked(orderId) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let order = orders.find(o => o.id === orderId);
  
  if (order) {
    order.status = "Checked";
    localStorage.setItem("orders", JSON.stringify(orders));
    document.getElementById(`status-${orderId}`).innerText = "Checked";
    Swal.fire({ title: "Order Checked!", icon: "success" });
  }
}

function deleteOrder(index) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.splice(index, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}
