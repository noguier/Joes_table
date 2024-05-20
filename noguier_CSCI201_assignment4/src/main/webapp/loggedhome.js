/**
 * 
 */
/**
 * 
 */
src="https://code.jquery.com/jquery-3.6.4.min.js"

var username = sessionStorage.getItem('username');


// Check if the username is present
if (username) {
    // Display the username on the page
   document.getElementById("usernameDisplay").innerHTML = "Welcome, " + username + "!";
} else {
    // Handle the case when the username is not present
    document.getElementById("usernameDisplay").innerHTML = "Welcome!";
}
sessionStorage.setItem('username', username);
    $("#searchRest").submit(function (event) {
        event.preventDefault();
        var formData = {
            restaurantName: $("input[name='restaurantName']").val(),
            latitude: $("input[name='latitude']").val(),
            longitude: $("input[name='longitude']").val(),
            searchOpt: $("input[name='searchOpt']:checked").val()
        };
        $(".homepage").hide();
        // Make a POST request to the server
        fetch("RestaurantSearchServlet", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response data (assuming it's an array of restaurants)
            if (data && Array.isArray(data)) {
                // Update the HTML with the new restaurant data
                updateRestaurantTable(data, formData.restaurantName);
            } else {
                // Handle the case where no restaurants are returned
                console.log("No restaurants returned from the server");
            }
        })
        .catch(error => console.error(error));
    });

    // Function to update the restaurant table in the HTML
    function updateRestaurantTable(restaurantData, searchTerm) {
        var container = $("#myTable");
        container.empty(); // Clear existing content

        // Display search term above the first div with a faded line
        container.append("<div class='search-term'>Results for " + searchTerm + "</div>");
        container.append("<hr class='separator'/>");

        // Iterate through the array of restaurants and append divs to the container
        restaurantData.forEach(function (restaurant) {
            // Create a div for each restaurant
            var restaurantDiv = $("<div class='restaurant'></div>");

            // Create a clickable image with the restaurant image URL
            var imageTag = $("<img class='restaurant-image' src='" + restaurant.image + "' alt='" + restaurant.name + "' />")
                .click(function () {
                    showDetailedInfo(restaurant);
                });
			
            // Create a div with the restaurant name, address, and clickable website link
            var infoDiv = $("<div class='info'>" +
                "<h3>" + restaurant.name + "</h3>" +
                "<p>" + restaurant.address.replace(/\[|\]|"/g, '') + "</p>" +
                "<a href='" + restaurant.website + "' target='_blank'>" + restaurant.website + "</a>" +
                "</div>");

            // Append image and info to the restaurant div
            restaurantDiv.append(imageTag);
            restaurantDiv.append(infoDiv);

            // Append the restaurant div to the container
            container.append(restaurantDiv);
        });
    }

    // Function to show detailed information when a restaurant image is clicked
    function showDetailedInfo(restaurant) {
        // Hide other divs
        $(".search-term").hide();
        $(".restaurant").hide();
        var container = $("#myTable");
		container.append("<div class='rest-name'>" + restaurant.name + "</div>");
		var restaurantDiv = $("<div class='restaurant'></div>");
        var imageTag = $("<img class='restaurant-image' src='" + restaurant.image + "' alt='" + restaurant.name + "' />")
	 	var infoDiv = $("<div class='info'>" +
                
                "<p>Address: " + restaurant.address.replace(/\[|\]|"/g, '') + "</p>" +
                "<p>Phone No: " + restaurant.phoneNo + "</p>" +
                "<p>Cuisine: " + restaurant.cuisine + "</p>" +
                "<p>Price: " + restaurant.price + "</p>" +
                "<p>Rating: " + restaurant.rating + "</p>" 
                +"</div>");
        // var addToFavoritesButton = $("<button class='add-to-favorites'>Add to Favorites</button>")
        //.click(function () {
          //  addToFavorites(restaurant);
        //});
         //var removeFavoritesButton = $("<button class='remove-favorites'>Remove Favorites</button>")
        //.click(function () {
          //  removeFavorites(restaurant);
        //});
        var favoritesButton = $("<button class='favorites'>Add to Favorites</button>")
        .click(function () {
            toggleFavorites(restaurant, favoritesButton);
        });
        var reservationButton = $("<button class='reservation'>Add Reservation</button>") 
        .click(function() {
			showReservationForm(restaurant);
		});
		
        checkIfInFavorites(restaurant, favoritesButton);
		 restaurantDiv.append(imageTag);
         restaurantDiv.append(infoDiv);
         container.append(restaurantDiv);
         //container.append(addToFavoritesButton);
         //container.append(removeFavoritesButton);
         container.append(favoritesButton);
         container.append(reservationButton);
    }
  function showReservationForm(restaurant) {
    var reservationForm = $("<div class='reservation-form'>" +
        "<label for='reservationDate'>Date:</label>" +
        "<input type='date' id='reservationDate' name='reservationDate' placeholder='Date' required><br>" +
        "<label for='reservationTime'>Time:</label>" +
        "<input type='time' id='reservationTime' name='reservationTime' placeholder='Time' required><br>" +
        "<label for='reservationNotes'>Reservation Notes:</label>" +
        "<textarea id='reservationNotes' name='reservationNotes' placeholder='Reservation Notes'></textarea><br>" +
        "<button onclick='submitReservation(" + JSON.stringify(restaurant) + ", " +
        "document.getElementById(\"reservationDate\").value, " +
        "document.getElementById(\"reservationTime\").value)'>Submit Reservation</button>" +
        "</div>");

    var container = $("#myTable");
    container.append(reservationForm);
}

function submitReservation(restaurant, reservationDate, reservationTime) {
    // Construct the reservation data object
    var reservationData = {
        restaurant: restaurant,
        date: reservationDate,
        time: reservationTime
    };
    console.log(reservationData);

    // Make a POST request to submit the reservation
    fetch("ReservationsServlet", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server (if needed)
        console.log(data);
        // Close the reservation form or update UI as needed
        $(".reservation-form").remove();
    })
    .catch(error => console.error(error));
}


    function checkIfInFavorites(restaurant, favoritesButton) {
    var username = sessionStorage.getItem('username');
    // Make a GET request to check if the restaurant is in favorites
    fetch("FavoritesServlet?username=" + username)
        .then(response => response.json())
        .then(data => {
            if (data && data.favorites) {
                // Check if the restaurant is in the favorites list
                var isFavorite = data.favorites.some(fav => fav.website === restaurant.website);
                if (isFavorite) {
                    favoritesButton.text("Remove from Favorites");
                }
            }
        })
        .catch(error => console.error(error));
}
function toggleFavorites(restaurant, favoritesButton) {
    var username = sessionStorage.getItem('username');
    // Make a GET request to check if the restaurant is in favorites
    fetch("FavoritesServlet?username=" + username)
        .then(response => response.json())
        .then(data => {
            if (data && data.favorites) {
                // Check if the restaurant is in the favorites list
                var isFavorite = data.favorites.some(fav => fav.website === restaurant.website);
                
                if (isFavorite) {
                    // If already in favorites, remove it
                    removeFavorites(restaurant);
                     favoritesButton.text("Add to Favorites");
                } else {
                    // If not in favorites, add it
                    addToFavorites(restaurant);
                     favoritesButton.text("Remove from Favorites");
                }
            }
        })
        .catch(error => console.error(error));
}
    function addToFavorites(restaurant) {
    // Make a POST request to the FavoritesServlet
    fetch("FavoritesServlet", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurant)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server (if needed)
        console.log(data);
    })
    .catch(error => console.error(error));
}
function removeFavorites(restaurant) {
	console.log(restaurant);
    //var restaurantID = restaurant.id; 
    var restaurantURL = restaurant.website;
    console.log(restaurantURL);
	var username = sessionStorage.getItem('username');
    fetch("FavoritesServlet?username" + username + "&restaurantURL=" + restaurantURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurant) // Ensure restaurant is correctly formatted
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        ///$(".remove-favorites").remove(); // Update the UI if needed
    })
    .catch(error => console.error(error));
}




