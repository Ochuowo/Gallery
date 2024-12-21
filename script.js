// Toggle Sidebar and Hamburger Menu
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const searchBar = document.getElementById("search-bar");
const switchBoard = document.getElementById("switchBoard");

const allProducts = document.getElementById("show-data-button");
const addProduct = document.getElementById("add-data-button");

const allForm = document.getElementById("data-table");
const addForm = document.getElementById("add-data-form");

// Add Save button
const saveButton = document.getElementById("save-button");
const location = document.getElementById("location");
const count = document.getElementById("count");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    sidebar.classList.toggle("active");
});

// Select the Home button by its ID
const homeButton = document.getElementById("homeButton");

// Add click event listener to refresh the page
homeButton.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior
    searchBar.style.display = "none";
    addForm.style.display = "none";
    switchBoard.style.display = "block";
    //window.location.reload();  // Reload the page
});

allProducts.addEventListener("click", () => {
    allForm.style.display = "block";
    addForm.style.display = "none";
})

addProduct.addEventListener("click", () => {
    allForm.style.display = "none";
    addForm.style.display = "block";
})

const navLinks = document.querySelectorAll(".nav-link");
const gallery = document.getElementById("gallery");
const galleryTitle = document.getElementById("gallery-title");

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        switchBoard.style.display = "none";

        searchBar.style.display = "none";

        allForm.style.display = "none";

        const formId = this.dataset.formId;

        // Hide all forms
        document.querySelectorAll(".report-form").forEach((form) => {
            form.style.display = "none";
        });

        // Show the selected form
        if (formId) {
            document.getElementById(formId).style.display = "block";
        }
    });
});

document.getElementById("homeButton").addEventListener("click", function () {
    // Hide all forms when Home button is clicked
    document.querySelectorAll(".report-form").forEach((form) => {
        form.style.display = "none";
    });
});

// Function to create photo cards dynamically
// function createPhotoCard(category, imageData, imageIndex) {
//     const { file, name, partNumber, location, count } = imageData;

//     const photoCard = document.createElement("div");
//     photoCard.classList.add("photo-card");

//     // Create the image element
//     const img = document.createElement("img");
//     img.src = `src/public/images/${category}/${file}`;
//     img.alt = name || `Image ${imageIndex} from ${category}`;
//     photoCard.appendChild(img);

//     // Create the photo-info element
//     const photoInfo = document.createElement("div");
//     photoInfo.classList.add("photo-info");
//     photoInfo.innerHTML = `
//         <span><strong>category:</strong> ${category}</span>
//         <span><strong>File:</strong> ${file}</span>
//         <span><strong>Name:</strong> ${name}</span>
//         <span><strong>Part No.:</strong> ${partNumber}</span>
//         <span><strong>Location:</strong> ${location}</span>
//         <span><strong>Count:</strong> ${count}</span>
//     `;

//     photoCard.appendChild(photoInfo);

//     const searchInput = document.getElementById("search-input");
//     searchInput.addEventListener("input", () => {
//     const searchTerm = searchInput.value.toLowerCase();
//     const photoCards = document.querySelectorAll(".photo-card");

//     photoCards.forEach(card => {
//     const photoInfo = card.querySelector(".photo-info");
//     const infoText = photoInfo.textContent.toLowerCase();

//         if (infoText.includes(searchTerm)) {
//             card.style.display = "block";
//         } else {
//             card.style.display = "none";
//         }
//       });
//     });

//     return photoCard;
// }

// // Example usage in loadImages function
// async function loadImages(category) {
//     const galleryTitle = document.getElementById("gallery-title");
//     const photoContainer = document.querySelector(".svg-grid");

//     try {
//         const response = await fetch("src/data.json");
//         if (!response.ok) {
//             throw new Error("Failed to fetch image data.");
//         }
//         const folderData = await response.json();

//         galleryTitle.textContent = `Category: ${category}`;
//         photoContainer.innerHTML = ""; // Clear current images

//         const images = folderData[category] || [];
//         images.forEach((imageData, index) => {
//             const photoCard = createPhotoCard(category, imageData, index + 1);
//             photoContainer.appendChild(photoCard);
//         });

//         if (images.length === 0) {
//             photoContainer.innerHTML = "<p>No images found for this category.</p>";
//         }
//     } catch (error) {
//         console.error("Error loading images:", error);
//         photoContainer.innerHTML = "<p>Error loading images.</p>";
//     }
// }

document.getElementById("add-data-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const category = document.getElementById("category").value.trim();
    const file = document.getElementById("file").value.trim();
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const partNumber = document.getElementById("partNumber").value.trim();
    const price = document.getElementById("price").value.trim();
    const location = document.getElementById("location").value.trim();
    const count = document.getElementById("count").value.trim();
    const expiryDate = document.getElementById("expiry").value.trim();

    if (!category || !file || !name || !description || !partNumber || !price ||!location || !count ||!expiryDate) {
        alert("All fields are required.");
        return;
    }

    // Prepare the new data object
    const newData = { category, file, name, description, partNumber, price, location, count, expiryDate };

    try {
        const response = await fetch('http://localhost:3000/add-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });

        console.log('Server response =>', response);

        if (response.ok) {
            alert("Data added successfully!");
            document.getElementById("data-table").reset();
        } else {
            alert("Failed to add data.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding data.");
    }
});

document.getElementById("show-data-button").addEventListener("click", function () {

    fetch("src/data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return response.json();
        })
        .then((data) => {
            displayTabsAndContent(data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            alert("Error loading data.");
        });
});

// Display data as tabs with pagination
function displayTabsAndContent(data) {
    const tableContainer = document.getElementById("data-table");
    tableContainer.innerHTML = ""; // Clear previous content

    // Create tabs
    const tabs = document.createElement("div");
    tabs.classList.add("tabs");

    const content = document.createElement("div");
    content.classList.add("tab-content");

    Object.keys(data).forEach((category, idx) => {
        // Create a tab button
        const tabButton = document.createElement("button");
        tabButton.classList.add("tab-button");
        tabButton.textContent = category;
        tabButton.dataset.category = category;
        tabButton.dataset.active = idx === 0; // Activate first tab by default
        tabs.appendChild(tabButton);

        // Create content for the category
        const tabSection = document.createElement("div");
        tabSection.classList.add("tab-section");
        tabSection.dataset.category = category;
        tabSection.style.display = idx === 0 ? "block" : "none"; // Show first tab by default

        renderCategoryContent(data[category], tabSection, 0); // Render first page of category
        content.appendChild(tabSection);

        // Add click event for the tab
        tabButton.addEventListener("click", function () {
        // Deactivate all tabs and hide all sections
        document.querySelectorAll(".tab-button").forEach((btn) => btn.dataset.active = false);
        document.querySelectorAll(".tab-section").forEach((sec) => sec.style.display = "none");

        // Activate the clicked tab and show its section
        tabButton.dataset.active = true;
        tabSection.style.display = "block";
        });

    });

    // Search functionality
    const searchInput = document.getElementById("search-input");
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();

            // Loop through each tab section to find matching items
            document.querySelectorAll(".tab-section").forEach((tabSection) => {
                const items = tabSection.querySelectorAll(".photo-card");
                let hasMatchingItem = false;

                items.forEach((item) => {
                    const itemText = item.textContent.toLowerCase();
                    if (itemText.includes(searchTerm)) {
                        item.style.display = "inline-block"; // Show matching item
                        hasMatchingItem = true;
                    } else {
                        item.style.display = "none"; // Hide non-matching item
                    }
                });

                // Hide the entire tab section if no matching items are found
                tabSection.style.display = hasMatchingItem ? "block" : "none";
            });
        });

    // Add Save Changes button
    saveButton.addEventListener("click", () => saveUpdatedData(data)); // Call saveChanges function

    tableContainer.appendChild(tabs);
    tableContainer.appendChild(content);
}

// Render a category's content with pagination
// function renderCategoryContent(items, container, pageIndex) {
//     container.innerHTML = ""; // Clear existing content

//     const itemsPerPage = 10;
//     if (!items || items.length === 0) {
//         // If no items exist, display a "No Data to Display" message
//         const noDataMessage = document.createElement("p");
//         noDataMessage.textContent = "No Data to Display";
//         noDataMessage.classList.add("no-data-message");
//         container.appendChild(noDataMessage);
//         return; // Exit the function early since there's no data to paginate
//     }

//     const startIndex = pageIndex * itemsPerPage;
//     const endIndex = Math.min(startIndex + itemsPerPage, items.length);

//     // Render items for the current page
//     items.slice(startIndex, endIndex).forEach((item, index) => {
//         const row = document.createElement("div");
//         row.classList.add("photo-card");

//         row.innerHTML = `
//          <div class="photo-info">
//             <div id="image" class="item-image">
//                 <img id="item-image" src="${item.file}" alt="${item.name}" class="thumbnail" />
//             </div>
//             <div id="name" class="item-name">
//               <label><strong>Name:</strong></label>
//               <span id="item-name" class="editable" 
//                 data-array-index="${startIndex}" data-field-index="1">${item.name}</span>
//             </div>
//             <div id="description" class="item-description">
//               <label><strong>Description:</strong></label>
//               <span id="item-description" class="editable"
//                 data-array-index="${startIndex}" data-field-index="2">${item.description}</span>
//             </div>
//             <div id="partNumber" class="item-partNumber">
//               <label><strong>P. No.:</strong></label>
//               <span id="item-partNumber" class="editable"
//                 data-array-index="${startIndex}" data-field-index="3">${item.partNumber}</span>
//             </div>
//             <div id="price" class="item-price">
//               <label><strong>Price:</strong></label>
//               <span id="item-price" class="editable"
//                 data-array-index="${startIndex}" data-field-index="4">${item.price}</span>
//             </div>
//             <div id="location" class="item-location">
//                 <label for="location-${startIndex + index}"><strong>Location:</strong></label>
//                 <select id="location-${startIndex + index}" class="location-dropdown">
//                     <option value="AB" ${item.location === "AB" ? "selected" : ""}>AB</option>
//                     <option value="DE" ${item.location === "DE" ? "selected" : ""}>DE</option>
//                     <option value="BG" ${item.location === "BG" ? "selected" : ""}>BG</option>
//                 </select>
//             </div>
//             <div id="count" class="item-count">
//                 <label><strong>Count:</strong></label>
//                 <button class="decrement-button" data-index="${startIndex + index}">-</button>
//                     <span class="count-display" class="editable"
//                         data-array-index="${startIndex}" data-field-index="5">${item.count || 0}</span>
//                 <button class="increment-button" data-index="${startIndex + index}">+</button>
//             </div>
//             <div id="expiry-date" class="item-expiryDate">
//               <label><strong>Expiry:</strong></label>
//               <span id="item-expiryDate" class="editable"
//                 data-array-index="${startIndex}" data-field-index="6">${item.expiryDate}</span>
//             </div>
//             <div class="item-actions">
//                 <a class="edit-button" data-index="${startIndex + index}">Edit</a>
//                 <a class="delete-button" data-index="${startIndex + index}">Delete</a>
//                 <a class="reset-button" data-index="${startIndex + index}">Reset</a>
//             </div>
//           </div>
//         `;

//         container.appendChild(row);

//         //Handle basic info change
//         const image = row.querySelector(".item-image");
//             image.addEventListener("change", (e) => {
//                 item.image = e.target.value;
//         });

//         const name = row.querySelector(".item-name");
//             name.addEventListener("change", (e) => {
//                 item.name = e.target.value;
//         });

//         const description = row.querySelector(".item-description");
//             description.addEventListener("change", (e) => {
//                 item.description = e.target.value;
//         });

//         const partNumber = row.querySelector(".item-partNumber");
//         partNumber.addEventListener("change", (e) => {
//             item.partNumber = e.target.value;
//         });

//         const price = row.querySelector(".item-price");
//             price.addEventListener("change", (e) => {
//                 item.price = e.target.value;
//         });

//         const expiry = row.querySelector('.item-expiryDate');
//             expiry.addEventListener("change", (e) => {
//                 item.expiryDate = e.target.value;
//         });

//         // Handle location change
//         const locationDropdown = row.querySelector(".location-dropdown");
//         locationDropdown.addEventListener("change", (e) => {
//             item.location = e.target.value;
//             alert(`Location updated to ${item.location} for ${item.name}`);
//         });

//         //handle expiry date change
//         // const expiryDate = row.querySelector(".expiry-date");
//         // expiryDate.addEventListener("change", (e) => {
//         //     item.expiryDate = e.target.value;
//         // });

//         // Handle count increment and decrement
//         const countDisplay = row.querySelector(".count-display");
//         const decrementButton = row.querySelector(".decrement-button");
//         const incrementButton = row.querySelector(".increment-button");
//         const resetButton = row.querySelector(".reset-button");

//         decrementButton.addEventListener("click", () => {
//             let count = parseInt(countDisplay.textContent, 10);
//             count = Math.max(count - 1, 0); // Prevent negative counts
//             countDisplay.textContent = count;
//             item.count = count;
//         });

//         incrementButton.addEventListener("click", () => {
//             let count = parseInt(countDisplay.textContent, 10);
//             countDisplay.textContent = ++count;
//             item.count = count;
//         });

//         resetButton.addEventListener('click', () => {
//             let count = parseInt(countDisplay.textContent, 10);
//             count = 0;
//             countDisplay.textContent = count;
//             item.count = count;
//         });

//     });

//     // Add pagination controls
//     const pagination = document.createElement("div");
//     pagination.classList.add("pagination");

//     for (let i = 0; i < Math.ceil(items.length / itemsPerPage); i++) {
//         const pageButton = document.createElement("button");
//         pageButton.textContent = i + 1;
//         pageButton.classList.add("page-button");
//         pageButton.dataset.page = i;
//         pageButton.dataset.active = i === pageIndex;
//         pagination.appendChild(pageButton);

//         pageButton.addEventListener("click", function () {
//             renderCategoryContent(items, container, i);
//         });
//     }

//     container.appendChild(pagination);
// }

function renderCategoryContent(items, container, pageIndex) {
    container.innerHTML = ""; // Clear existing content

    const itemsPerPage = 10;
    if (!items || items.length === 0) {
        const noDataMessage = document.createElement("p");
        noDataMessage.textContent = "No Data to Display";
        noDataMessage.classList.add("no-data-message");
        container.appendChild(noDataMessage);
        return;
    }

    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    items.slice(startIndex, endIndex).forEach((item, index) => {
        const row = document.createElement("div");
        row.classList.add("photo-card");

        row.innerHTML = `
         <div class="photo-info">
            <div id="image" class="item-image">
                <img id="item-image" src="${item.file}" alt="${item.name}" class="thumbnail" />
            </div>
            <div id="name" class="item-name">
              <label><strong>Name:</strong></label>
              <span id="item-name" class="editable" 
                data-array-index="${startIndex + index}" data-field-index="1">${item.name}</span>
            </div>
            <div id="description" class="item-description">
              <label><strong>Description:</strong></label>
              <span id="item-description" class="editable"
                data-array-index="${startIndex + index}" data-field-index="2">${item.description}</span>
            </div>
            <div id="partNumber" class="item-partNumber">
              <label><strong>P. No.:</strong></label>
              <span id="item-partNumber" class="editable"
                data-array-index="${startIndex + index}" data-field-index="3">${item.partNumber}</span>
            </div>
            <div id="price" class="item-price">
              <label><strong>Price:</strong></label>
              <span id="item-price" class="editable"
                data-array-index="${startIndex + index}" data-field-index="4">${item.price}</span>
            </div>
            <div id="location" class="item-location">
                <label for="location-${startIndex + index}"><strong>Location:</strong></label>
                <select id="location-${startIndex + index}" class="location-dropdown">
                    <option value="AB" ${item.location === "AB" ? "selected" : ""}>AB</option>
                    <option value="DE" ${item.location === "DE" ? "selected" : ""}>DE</option>
                    <option value="BG" ${item.location === "BG" ? "selected" : ""}>BG</option>
                </select>
            </div>
            <div id="count" class="item-count">
                <label><strong>Count:</strong></label>
                <button class="decrement-button" data-index="${startIndex + index}">-</button>
                    <span class="count-display" class="editable"
                        data-array-index="${startIndex + index}" data-field-index="5">${item.count || 0}</span>
                <button class="increment-button" data-index="${startIndex + index}">+</button>
            </div>
            <div id="expiry-date" class="item-expiryDate">
              <label><strong>Expiry:</strong></label>
              <span id="item-expiryDate" class="editable"
                data-array-index="${startIndex + index}" data-field-index="6">${item.expiryDate}</span>
            </div>
            <div class="item-actions">
                <a class="edit-button" data-category="${item.category}" data-index="${startIndex + index}">Edit</a>
            </div>
          </div>
        `;

        container.appendChild(row);

        //Handle basic info change
        const image = row.querySelector(".item-image");
            image.addEventListener("change", (e) => {
                item.image = e.target.value;
        });

        const name = row.querySelector(".item-name");
            name.addEventListener("change", (e) => {
                item.name = e.target.value;
        });

        const description = row.querySelector(".item-description");
            description.addEventListener("change", (e) => {
                item.description = e.target.value;
        });

        const partNumber = row.querySelector(".item-partNumber");
        partNumber.addEventListener("change", (e) => {
            item.partNumber = e.target.value;
        });

        const price = row.querySelector(".item-price");
            price.addEventListener("change", (e) => {
                item.price = e.target.value;
        });

        const expiry = row.querySelector('.item-expiryDate');
            expiry.addEventListener("change", (e) => {
                item.expiryDate = e.target.value;
        });

        // Handle location change
        const locationDropdown = row.querySelector(".location-dropdown");
        locationDropdown.addEventListener("change", (e) => {
            item.location = e.target.value;
            alert(`Location updated to ${item.location} for ${item.name}`);
        });

        // Handle count increment and decrement
        const countDisplay = row.querySelector(".count-display");
        const decrementButton = row.querySelector(".decrement-button");
        const incrementButton = row.querySelector(".increment-button");

        decrementButton.addEventListener("click", () => {
            let count = parseInt(countDisplay.textContent, 10);
            count = Math.max(count - 1, 0); // Prevent negative counts
            countDisplay.textContent = count;
            item.count = count;
        });

        incrementButton.addEventListener("click", () => {
            let count = parseInt(countDisplay.textContent, 10);
            countDisplay.textContent = ++count;
            item.count = count;
        });

    });

    // Event delegation to handle "edit" button clicks
    container.addEventListener("click", async (event) => {

        const index = parseInt(event.target.dataset.index, 10);
        const activeTab = document.querySelector(".tab-button[data-active='true']");
        const activeCategory = activeTab ? activeTab.dataset.category : null;

        if (event.target.classList.contains("edit-button")) {
            
            console.log("Edit clicked for category:", activeCategory, "index:", index);
            
            const row = event.target.closest(".photo-card");
            convertRowToEditable(row, items[index], event, activeCategory);
        }
    });

    // Add pagination controls
    const pagination = document.createElement("div");
    pagination.classList.add("pagination");

    for (let i = 0; i < Math.ceil(items.length / itemsPerPage); i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i + 1;
        pageButton.classList.add("page-button");
        pageButton.dataset.page = i;
        pageButton.dataset.active = i === pageIndex;
        pagination.appendChild(pageButton);

        pageButton.addEventListener("click", function () {
            renderCategoryContent(items, container, i);
        });
    }

    container.appendChild(pagination);
}

function convertRowToEditable(row, item, event, category) {

    const editableFields = row.querySelectorAll(".editable");

    editableFields.forEach((field) => {
        const fieldIndex = field.dataset.fieldIndex;
        const value = field.textContent;

        const input = document.createElement("input");
        input.type = "text";
        input.value = value;
        input.dataset.fieldIndex = fieldIndex;

        field.replaceWith(input);
    });

        handleEdit(row, item);

    // Add a "Save" button to save changes
    const actions = row.querySelector(".item-actions");
        actions.innerHTML = `
            <a class="delete-button">Delete</a>
            <a class="reset-button">Reset</a>
            <a class="close-button">X</a>
        `;

    actions.querySelector(".delete-button").addEventListener("click", () => {
        handleDelete(event, category);
    });

    actions.querySelector(".reset-button").addEventListener("click", () => {
        const countDisplay = row.querySelector('.count-display');
            let count = parseInt(countDisplay.textContent, 10);
            count = 0;
            countDisplay.textContent = count;
            item.count = count;
    });

    actions.querySelector(".close-button").addEventListener("click", () => {
        // Convert inputs back to spans with original values
        const inputs = row.querySelectorAll("input");
        inputs.forEach((input) => {
            const fieldIndex = input.dataset.fieldIndex;
            const span = document.createElement("span");
            span.className = "editable";
            span.dataset.fieldIndex = fieldIndex;

            // Restore the value from the item object
            switch (fieldIndex) {
                case "1":
                    span.textContent = item.name;
                    break;
                case "2":
                    span.textContent = item.description;
                    break;
                case "3":
                    span.textContent = item.partNumber;
                    break;
                case "4":
                    span.textContent = item.price;
                    break;
                case "5":
                    span.textContent = item.count;
                    break;
                case "6":
                    span.textContent = item.expiryDate;
                    break;
                default:
                    span.textContent = input.value; // Fallback if index doesn't match
            }

            input.replaceWith(span);
        });

        // Reset actions back to the original buttons
        actions.innerHTML = `
            <a class="edit-button" data-index="${event.target.dataset.index}">Edit</a>
        `;
    });

}


function saveUpdatedData(data) {

    fetch("http://localhost:3000/save-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to save data");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.message); // Log success message
            alert("Data saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving data:", error);
            alert("Error saving data");
        });
}

function handleEdit(row, item) {
    const inputs = row.querySelectorAll("input");

    inputs.forEach((input) => {
        const fieldIndex = input.dataset.fieldIndex;
        const newValue = input.value;

        // Update the corresponding field in the item
        switch (parseInt(fieldIndex, 10)) {
            case 1:
                item.name = newValue;
                break;
            case 2:
                item.description = newValue;
                break;
            case 3:
                item.partNumber = newValue;
                break;
            case 4:
                item.price = newValue;
                break;
            case 5:
                item.count = parseInt(newValue, 10) || 0;
                break;
            case 6:
                item.expiryDate = newValue;
                break;
        }
    });
}

// Fetch and display data in a table
// document.getElementById("show-data-button").addEventListener("click", function () {
//     fetch("src/data.json") // Fetch data.json
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error("Failed to fetch data");
//             }
//             return response.json();
//         })
//         .then((data) => {
//             displayDataTable(data);
//         })
//         .catch((error) => {
//             console.error("Error fetching data:", error);
//             alert("Error loading data.");
//         });
// });

// // Function to display data in a table
// function displayDataTable(data) {
//     const tableContainer = document.getElementById("data-table");
//     tableContainer.innerHTML = ""; // Clear previous content

//     Object.keys(data).forEach((category) => {
//         // Create category heading
//         const categoryHeading = document.createElement("h3");
//         categoryHeading.textContent = category;
//         tableContainer.appendChild(categoryHeading);

//         // Create a table for the category
//         const table = document.createElement("table");
//         table.classList.add("data-table");

//         // Add table headers
//         const headerRow = document.createElement("tr");
//         headerRow.innerHTML = `
//             <th>File</th>
//             <th>Name</th>
//             <th>Actions</th>
//         `;
//         table.appendChild(headerRow);

//         // Add rows for each item in the category
//         data[category].forEach((item, index) => {
//             const row = document.createElement("tr");

//             row.innerHTML = `
//                 <td>${item.file}</td>
//                 <td>${item.name}</td>
//                 <td>
//                     <button class="edit-button" data-category="${category}" data-index="${index}">Edit</button>
//                     <button class="delete-button" data-category="${category}" data-index="${index}">Delete</button>
//                 </td>
//             `;

//             table.appendChild(row);
//         });

//         tableContainer.appendChild(table);
//     });

//     // Add event listeners for edit and delete buttons
//     document.querySelectorAll(".edit-button").forEach((button) => {
//         button.addEventListener("click", handleEdit);
//     });

//     document.querySelectorAll(".delete-button").forEach((button) => {
//         button.addEventListener("click", handleDelete);
//     });
// }

// Handle editing a data item

// function handleEdit(event, category, index) {

//     console.log(`Editing item in category: ${category}, at index: ${index}`);

//     // document.addEventListener('click', (event) => {
//     //     const target = event.target;
    
//     //     if (target.classList.contains('editable')) {
//     //         const arrayIndex = target.getAttribute('data-array-index');
//     //         const fieldIndex = target.getAttribute('data-field-index');
    
//     //         // Replace the text content with an input field for editing
//     //         const currentValue = target.textContent;
//     //         const input = document.createElement('input');
//     //         input.type = 'text';
//     //         input.value = currentValue;
//     //         input.setAttribute('data-array-index', arrayIndex);
//     //         input.setAttribute('data-field-index', fieldIndex);
    
//     //         // Replace the span with the input field
//     //         target.replaceWith(input);
    
//     //         // Save changes on blur or Enter key
//     //         const saveChanges = () => {
//     //             const newValue = input.value;
//     //             target.textContent = newValue; // Update the span content
//     //             input.replaceWith(target); // Replace input with the original span
//     //         };
    
//     //         input.addEventListener('blur', saveChanges);
//     //         input.addEventListener('keydown', (e) => {
//     //             if (e.key === 'Enter') saveChanges();
//     //         });
    
//     //         input.focus();
//     //     }
//     // });

//     const itemImage = document.getElementById('item-image');
//     const inputField1 = document.createElement('input');
//     inputField1.type = 'file';
//     inputField1.setAttribute('data-index', index);
//     //Optional: Log to confirm the correct index is attached
//     console.log('Input field index =>', inputField1.dataset.index);
//     inputField1.value = itemImage.innerText;
//     itemImage.parentNode.replaceChild(inputField1, itemImage);

//     // const itemName = document.getElementById('item-name'); 
//     // const inputField2 = document.createElement('input');
//     // inputField2.type = 'text'; 
//     // inputField2.value = itemName.innerText; 
//     // itemName.parentNode.replaceChild(inputField2, itemName);

//     // const itemDescription = document.getElementById('item-description'); 
//     // const inputField3 = document.createElement('input');
//     // inputField3.type = 'text'; 
//     // inputField3.value = itemDescription.innerText; 
//     // itemDescription.parentNode.replaceChild(inputField3, itemDescription);

//     // const itempartNumber = document.getElementById('item-partNumber');
//     // const inputField4 = document.createElement('input');
//     // inputField4.type = 'text'; 
//     // inputField4.value = itempartNumber.innerText; 
//     // itempartNumber.parentNode.replaceChild(inputField4, itempartNumber);

//     // const itemPrice = document.getElementById('item-price');
//     // const inputField5 = document.createElement('input');
//     // inputField5.type = 'number';
//     // inputField5.value = itemPrice.innerText; 
//     // itemPrice.parentNode.replaceChild(inputField5, itemPrice);

//     // const itemExpiryDate = document.getElementById('item-expiryDate'); 
//     // const inputField6 = document.createElement('input');
//     // inputField6.type = 'date'; 
//     // inputField6.value = itemExpiryDate.innerText; 
//     // itemExpiryDate.parentNode.replaceChild(inputField6, itemExpiryDate);

   

//     // const confirmEdit = confirm(`Edit item in category "${category}" at index ${index}?`);

//     // if (!confirmEdit) {
//     //     alert("Edit cancelled.");
//     //     return; // Stop if user cancels
//     // }

//     // const newFile = prompt("Enter new file path:");
//     // const newName = prompt("Enter new name:");
//     // const newPartNo = prompt("Enter Part Number");
    
//     // if (newFile && newName && newPartNo ) {
//     //     fetch("http://localhost:3000/edit-data", {
//     //         method: "PUT",
//     //         headers: { "Content-Type": "application/json" },
//     //         body: JSON.stringify({ category, index, newFile, newName, newPartNo }),
//     //     })
//     //     .then((response) => {
//     //         if (!response.ok) {
//     //             throw new Error("Failed to edit data");
//     //         }
//     //         return response.json();
//     //     })
//     //     .then((data) => {
//     //         alert(data.message);
//     //         document.getElementById("show-data-button").click(); // Refresh the table
//     //     })
//     //     .catch((error) => {
//     //         console.error("Error editing data:", error);
//     //     });
//     //     alert(`Editing item in "${category}" at index ${itemIndex}`);
//     // }
// }

// Handle deleting a data item
function handleDelete(event, category) {

    const index = event.target.dataset.index;

    console.log(event, category);

    const confirmDelete = confirm(`Delete item in category "${category}" at index ${index}?`);
    if (!confirmDelete) {
        alert("Delete cancelled.");
        return; // Stop if user cancels
    }
    
    
    if (confirm("Are you sure you want to delete this item?")) {
        fetch("http://localhost:3000/delete-data", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, index }),
        })
        .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete data");
                }
                return response.json();
            })
            .then((data) => {
                alert(data.message);
                document.getElementById("show-data-button").click(); // Refresh the table
            })
            .catch((error) => {
                console.error("Error deleting data:", error);
            });
            alert(`Deleting item in "${category}" at index ${index}`);
    }
}

