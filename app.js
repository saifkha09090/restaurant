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
    content.innerHTML =
      "<h1 class='text-3xl font-semibold text-cyan-400'>Orders</h1><p class='text-gray-300 mt-2'>View and manage customer orders.</p>";
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

          // Scale down if the image is too large
          if (width > maxWidth || height > maxHeight) {
              const scale = Math.min(maxWidth / width, maxHeight / height);
              width = width * scale;
              height = height * scale;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert back to Base64
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 0.7 = 70% quality
          callback(compressedBase64);
      };
  };
}

// function getLocalStorage(key) {
//   return JSON.parse(localStorage.getItem(key)) || [];
// }

// function setLocalStorage(key, value) {
//   localStorage.setItem(key, JSON.stringify(value));
// }

// // Admin login functionality
// function adminLogin() {
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();
//   const loginForm = document.getElementById("login-form");
//   const adminPanel = document.getElementById("admin-panel");

//   const admin = { email: "admin@admin.com", password: "admin" };
//   localStorage.setItem("admin", JSON.stringify(admin));

//   if (email === admin.email && password === admin.password) {
//     localStorage.setItem("loggedIn", "true");
//     loginForm.style.display = "none";
//     adminPanel.style.display = "flex";
//   } else {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: "Your email and password is incorrect!",
//     });
//   }
// }

// // Check login status
// function checkLoginStatus() {
//   const loginForm = document.getElementById("login-form");
//   const adminPanel = document.getElementById("admin-panel");

//   if (localStorage.getItem("loggedIn") === "true") {
//     loginForm.style.display = "none";
//     adminPanel.style.display = "flex";
//   } else {
//     loginForm.style.display = "flex";
//     adminPanel.style.display = "none";
//   }
// }

// // Logout functionality
// function logout() {
//   localStorage.removeItem("loggedIn");
//   document.getElementById("login-form").style.display = "flex";
//   document.getElementById("admin-panel").style.display = "none";
// }

// // Show content based on section
// function showContent(section) {
//   const content = document.getElementById("content");

//   const sections = {
//     dashboard: `
//       <h1 class='text-3xl font-semibold text-cyan-400'>Dashboard</h1>
//       <p class='text-gray-300 mt-2'>Overview of restaurant analytics.</p>
//     `,
//     restaurants: `
//       <h1 class='text-3xl font-semibold text-cyan-400'>Manage Restaurants</h1>
//       <button class='mt-4 px-4 py-2 bg-gradient-to-br from-purple-900 to-teal-700 text-white rounded' onclick='openModal()'>Add Restaurant</button>
//       <table class='mt-4 w-full border-collapse border border-cyan-300'>
//         <thead>
//           <tr class='bg-gray-800'>
//             <th class='border p-2'>Logo</th>
//             <th class='border p-2'>Name</th>
//             <th class='border p-2'>Contact</th>
//             <th class='border p-2'>Address</th>
//             <th class='border p-2'>Edit</th>
//             <th class='border p-2'>Delete</th>
//           </tr>
//         </thead>
//         <tbody id='restaurantList'></tbody>
//       </table>
//     `,
//     dishes: `
//       <h1 class='text-3xl font-semibold text-cyan-400'>Manage Dishes</h1>
//       <button class='mt-4 px-4 py-2 bg-gradient-to-br from-purple-900 to-teal-700 text-white rounded' onclick='openDishModal()'>Add Dishes</button>
//       <table class='mt-4 w-full border-collapse border border-cyan-300'>
//         <thead>
//           <tr class='bg-gray-800'>
//             <th class='border p-2'>Restaurant</th>
//             <th class='border p-2'>Name</th>
//             <th class='border p-2'>Price</th>
//             <th class='border p-2'>Category</th>
//             <th class='border p-2'>Edit</th>
//             <th class='border p-2'>Delete</th>
//           </tr>
//         </thead>
//         <tbody id='dishList'></tbody>
//       </table>
//     `,
//     orders: `
//       <h1 class='text-3xl font-semibold text-cyan-400'>Orders</h1>
//       <p class='text-gray-300 mt-2'>View and manage customer orders.</p>
//     `,
//     settings: `
//       <h1 class='text-3xl font-semibold text-cyan-400'>Settings</h1>
//       <p class='text-gray-300 mt-2'>Configure restaurant settings.</p>
//     `,
//   };

//   content.innerHTML = sections[section] || "";
//   if (section === "restaurants") loadRestaurants();
//   if (section === "dishes") {
//     loadRestaurantOptions();
//     loadDishes();
//   }
// }

// // Restaurant management
// function loadRestaurants() {
//   const restaurants = getLocalStorage("restaurants");
//   const restaurantList = document.getElementById("restaurantList");

//   restaurantList.innerHTML = restaurants
//     .map(
//       (restaurant) => `
//       <tr class='bg-gray-800'>
//         <td class='border p-2'><img src="${restaurant.logo}" class="w-12 h-12 rounded-full"></td>
//         <td class='border p-2'>${restaurant.name}</td>
//         <td class='border p-2'>${restaurant.phone}</td>
//         <td class='border p-2'>${restaurant.address}</td>
//         <td class='border p-2'><button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="editRestaurant(${restaurant.id})">Edit</button></td>
//         <td class='border p-2'><button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteRestaurant(${restaurant.id})">Delete</button></td>
//       </tr>
//     `
//     )
//     .join("");
// }

// function addRestaurant() {
//   const restaurants = getLocalStorage("restaurants");
//   const id = Date.now();
//   const name = document.getElementById("restaurantName").value.trim();
//   const phone = document.getElementById("restaurantContact").value.trim();
//   const address = document.getElementById("restaurantAddress").value.trim();
//   const logoFile = document.getElementById("restaurantImg").files[0];

//   if (!name || !phone || !address || !logoFile) {
//     alert("⚠️ All fields are required.");
//     return;
//   }

//   const phonePattern = /^[0-9]{10,11}$/;
//   if (!phonePattern.test(phone)) {
//     alert("⚠️ Please enter a valid phone number (10-11 digits).");
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = () => {
//     const newRestaurant = {
//       id,
//       name,
//       phone,
//       address,
//       logo: reader.result,
//       dishes: [],
//     };

//     restaurants.push(newRestaurant);
//     setLocalStorage("restaurants", restaurants);
//     loadRestaurants();
//     closeModal();
//   };
//   reader.readAsDataURL(logoFile);
// }

// function deleteRestaurant(id) {
//   const restaurants = getLocalStorage("restaurants").filter((res) => res.id !== id);
//   setLocalStorage("restaurants", restaurants);
//   loadRestaurants();
// }

// function editRestaurant(id) {
//   const restaurants = getLocalStorage("restaurants");
//   const restaurant = restaurants.find((res) => res.id === id);

//   if (restaurant) {
//     const newName = prompt("Enter new name", restaurant.name);
//     const newPhone = prompt("Enter new phone", restaurant.phone);
//     const newAddress = prompt("Enter new address", restaurant.address);

//     if (newName) restaurant.name = newName;
//     if (newPhone) restaurant.phone = newPhone;
//     if (newAddress) restaurant.address = newAddress;

//     setLocalStorage("restaurants", restaurants);
//     loadRestaurants();
//   }
// }

// // Dish management
// function loadDishes() {
//   const restaurants = getLocalStorage("restaurants");
//   const dishList = document.getElementById("dishList");

//   dishList.innerHTML = restaurants
//     .flatMap((restaurant) =>
//       restaurant.dishes.map(
//         (dish) => `
//         <tr class='bg-gray-800'>
//           <td class='border p-2'><img src="${dish.logo}" class="w-12 h-12 rounded-full"></td>
//           <td class='border p-2'>${dish.name}</td>
//           <td class='border p-2'>${dish.price}</td>
//           <td class='border p-2'>${dish.category}</td>
//           <td class='border p-2'><button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="editDish(${restaurant.id}, ${dish.id})">Edit</button></td>
//           <td class='border p-2'><button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteDish(${restaurant.id}, ${dish.id})">Delete</button></td>
//         </tr>
//       `
//       )
//     )
//     .join("");
// }

// function addDishes() {
//   const restaurants = getLocalStorage("restaurants");
//   const name = document.getElementById("dishName").value.trim();
//   const restaurantId = document.getElementById("restaurantSelect").value;
//   const price = document.getElementById("dishPrice").value.trim();
//   // const category = document.getElementById("dishCategory").value.trim();
//   const logoFile = document.getElementById("dishImg").files[0];

//   if (!name || !restaurantId || !price || !logoFile) {
//     alert("⚠️ All fields are required.");
//     return;
//   }

//   if (isNaN(price) || price <= 0) {
//     alert("⚠️ Please enter a valid price.");
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = () => {
//     const newDish = {
//       id: Date.now(),
//       name,
//       price: parseFloat(price),
//       // category,
//       logo: reader.result,
//     };

//     const restaurant = restaurants.find((res) => res.id == restaurantId);
//     if (restaurant) {
//       restaurant.dishes.push(newDish);
//       setLocalStorage("restaurants", restaurants);
//       alert("✅ Dish added successfully!");
//       loadDishes();
//       closeDishModal();
//     } else {
//       alert("⚠️ Selected restaurant not found.");
//     }
//   };
//   reader.readAsDataURL(logoFile);
// }

// function deleteDish(restaurantId, dishId) {
//   const restaurants = getLocalStorage("restaurants");
//   const restaurant = restaurants.find((res) => res.id == restaurantId);

//   if (restaurant) {
//     restaurant.dishes = restaurant.dishes.filter((dish) => dish.id !== dishId);
//     setLocalStorage("restaurants", restaurants);
//     loadDishes();
//   }
// }

// function editDish(restaurantId, dishId) {
//   const restaurants = getLocalStorage("restaurants");
//   const restaurant = restaurants.find((res) => res.id == restaurantId);

//   if (restaurant) {
//     const dish = restaurant.dishes.find((d) => d.id === dishId);
//     if (dish) {
//       const newName = prompt("Enter new dish name", dish.name);
//       const newPrice = prompt("Enter new price", dish.price);
//       const newCategory = prompt("Enter new category", dish.category);

//       if (newName) dish.name = newName;
//       if (newPrice && !isNaN(newPrice) && newPrice > 0) dish.price = parseFloat(newPrice);
//       if (newCategory) dish.category = newCategory;

//       setLocalStorage("restaurants", restaurants);
//       loadDishes();
//     }
//   }
// }

// // Load restaurant options for the dish modal
// function loadRestaurantOptions() {
//   const restaurants = getLocalStorage("restaurants");
//   const restaurantSelect = document.getElementById("restaurantSelect");

//   restaurantSelect.innerHTML = "<option value=''>-- Select Restaurant --</option>";
//   restaurants.forEach((restaurant) => {
//     const option = document.createElement("option");
//     option.value = restaurant.id;
//     option.textContent = restaurant.name;
//     restaurantSelect.appendChild(option);
//   });
// }

// // Open and close modals
// function openModal() {
//   document.getElementById("restaurantModal").classList.remove("hidden");
// }

// function closeModal() {
//   document.getElementById("restaurantModal").classList.add("hidden");
//   document.getElementById("restaurantName").value = "";
//   document.getElementById("restaurantContact").value = "";
//   document.getElementById("restaurantAddress").value = "";
//   document.getElementById("restaurantImg").value = "";
// }

// function openDishModal() {
//   document.getElementById("dishModal").classList.remove("hidden");
// }

// function closeDishModal() {
//   document.getElementById("dishModal").classList.add("hidden");
//   document.getElementById("dishName").value = "";
//   document.getElementById("dishPrice").value = "";
//   document.getElementById("dishCategory").value = "";
//   document.getElementById("dishImg").value = "";
//   document.getElementById("restaurantSelect").value = "";
// }

// // Initialize
// checkLoginStatus();
