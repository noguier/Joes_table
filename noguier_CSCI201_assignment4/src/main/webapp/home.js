/**
 * 
 */

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
        
		 restaurantDiv.append(imageTag);
         restaurantDiv.append(infoDiv);
        // Append the detailed info div to the container
         container.append(restaurantDiv);
    }