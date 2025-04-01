document.addEventListener("DOMContentLoaded", function () {
    let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
    let restaurantContainer = document.getElementById("restaurants-list");
  
    if (restaurantContainer) {
      restaurants.forEach((restaurant) => {
        let div = document.createElement("div");
        div.classList.add(
          "p-6",
          "bg-gray-900",
          "text-white",
          "rounded-lg",
          "cursor-pointer",
          "hover:bg-gray-800",
          "transition",
          "shadow-lg",
          "mx-4"
        );
  
        div.innerHTML = `
          <img src="${restaurant.logo || "https://via.placeholder.com/300"}" 
          alt="${restaurant.name}" class="w-full h-40 object-cover rounded-t-lg">
          <div class="p-4 flex flex-col items-center text-center">
              <h3 class='text-xl font-bold mb-2'>${restaurant.name}</h3>
              <p class='text-sm text-gray-300 mb-4'>${restaurant.description || "Delicious food available here."}</p>
              <button class="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition" onclick="selectRestaurant('${restaurant.name}')">View Details</button>
          </div>`;
  
        div.addEventListener("click", () => {
          localStorage.setItem("selectedRestaurant", JSON.stringify(restaurant));
          window.location.href = "restaurant.html";
        });
  
        restaurantContainer.appendChild(div);
      });
    }
  
    function selectRestaurant(name) {
      let selectedRestaurant = restaurants.find((resto) => resto.name === name);
      if (selectedRestaurant) {
        localStorage.setItem("selectedRestaurant", JSON.stringify(selectedRestaurant));
        window.location.href = "restaurant.html";
      }
    }
  
    // Menu Display Logic
    let restaurant = JSON.parse(localStorage.getItem("selectedRestaurant")) || {};
    let menuItems = restaurant.dishes || [];
    let detailsContainer = document.getElementById("restaurant-details");
    let menuContainer = document.getElementById("menu-list");
  
    if (detailsContainer && menuContainer) {
      detailsContainer.innerHTML = `
        <h2 class='text-4xl font-bold'>${restaurant.name || "Restaurant Name"}</h2>
        <p class='text-lg text-gray-300 mt-2'>${restaurant.description || "Enjoy delicious meals from this restaurant."}</p>
      `;
  
      if (menuItems.length === 0) {
        menuContainer.innerHTML = `<p class='text-gray-400'>No dishes available.</p>`;
      } else {
        menuItems.forEach((item) => {
          let div = document.createElement("div");
          div.classList.add(
            "p-6",
            "bg-gray-800",
            "text-white",
            "rounded-lg",
            "shadow-lg",
            "mx-4",
            "text-center"
          );
          div.innerHTML = `
            <img src="${item.logo || "https://via.placeholder.com/300"}" 
            alt="${item.name}" class="w-full h-40 object-cover rounded-t-lg">
            <div class="p-4">
                <h3 class='text-xl font-bold mb-2'>${item.name}</h3>
                <p class='text-sm text-gray-300 mb-4'>${item.description || "Delicious dish available."}</p>
                <p class='text-lg font-semibold text-cyan-400'>$${item.price || "0.00"}</p>
                <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mt-2" onclick="orderDish('${restaurant.name}', '${item.name}', '${item.price}', '${item.logo}')">Order Now</button>
            </div>
          `;
          menuContainer.appendChild(div);
        });
      }
    }
  });
  
  // Function to Store Orders
  function orderDish(restaurantName, dishName, dishPrice, dishImage) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
  
    let order = {
      id: new Date().getTime(),
      restaurant: restaurantName,
      dish: dishName,
      price: dishPrice,
      image: dishImage,
      status: "Pending",
    };
  
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  
    Swal.fire({
      title: "Order Placed!",
      text: `Your order for ${dishName} has been placed.`,
      icon: "success",
    });
  }
  