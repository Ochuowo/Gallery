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
    switchBoard.style.display = "block";
    window.location.reload();  // Reload the page
});

allProducts.addEventListener("click", () => {
    allForm.style.display = "block";
    addForm.style.display = "none";
})

addProduct.addEventListener("click", () => {
    allForm.style.display = "none";
    addForm.style.display = "block";
})

saveButton.addEventListener("click", () => saveChanges(location, count)); // Call saveChanges function

const navLinks = document.querySelectorAll(".nav-link");
const gallery = document.getElementById("gallery");
const galleryTitle = document.getElementById("gallery-title");

// Map titles to corresponding folders
const categories = ["Oils", "Filters", "Bulbs", "Batteries", "Belts"];

navLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        searchBar.style.display = "block";
        switchBoard.style.display = "none";
        allForm.style.display = "none";
        addForm.style.display = "none";
        const title = `${categories[index]}`;
        updateGalleryTitle(title);
        loadImages(categories[index]);
    });
});

function updateGalleryTitle(title) {
    galleryTitle.textContent = title;
}

// Function to create photo cards dynamically
function createPhotoCard(category, imageData, imageIndex) {
    const { file, name, partNo, location, count } = imageData;

    const photoCard = document.createElement("div");
    photoCard.classList.add("photo-card");

    // Create the image element
    const img = document.createElement("img");
    img.src = `src/public/images/${category}/${file}`;
    img.alt = name || `Image ${imageIndex} from ${category}`;
    photoCard.appendChild(img);

    // Create the photo-info element
    const photoInfo = document.createElement("div");
    photoInfo.classList.add("photo-info");
    photoInfo.innerHTML = `
        <span><strong>category:</strong> ${category}</span>
        <span><strong>File:</strong> ${file}</span>
        <span><strong>Name:</strong> ${name}</span>
        <span><strong>Part No.:</strong> ${partNo}</span>
        <span><strong>Location:</strong> ${location}</span>
        <span><strong>Count:</strong> ${count}</span>
    `;

    photoCard.appendChild(photoInfo);

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const photoCards = document.querySelectorAll(".photo-card");

    photoCards.forEach(card => {
    const photoInfo = card.querySelector(".photo-info");
    const infoText = photoInfo.textContent.toLowerCase();

        if (infoText.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
      });
    });

    return photoCard;
}

// Example usage in loadImages function
async function loadImages(category) {
    const galleryTitle = document.getElementById("gallery-title");
    const photoContainer = document.querySelector(".svg-grid");

    try {
        const response = await fetch("src/data.json");
        if (!response.ok) {
            throw new Error("Failed to fetch image data.");
        }
        const folderData = await response.json();

        galleryTitle.textContent = `Category: ${category}`;
        photoContainer.innerHTML = ""; // Clear current images

        const images = folderData[category] || [];
        images.forEach((imageData, index) => {
            const photoCard = createPhotoCard(category, imageData, index + 1);
            photoContainer.appendChild(photoCard);
        });

        if (images.length === 0) {
            photoContainer.innerHTML = "<p>No images found for this category.</p>";
        }
    } catch (error) {
        console.error("Error loading images:", error);
        photoContainer.innerHTML = "<p>Error loading images.</p>";
    }
}

document.getElementById("add-data-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const category = document.getElementById("category").value.trim();
    const file = document.getElementById("file").value.trim();
    const name = document.getElementById("name").value.trim();

    if (!category || !file || !name) {
        alert("All fields are required.");
        return;
    }

    // Prepare the new data object
    const newData = { category, file, name };

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

    tableContainer.appendChild(tabs);
    tableContainer.appendChild(content);
}

// Render a category's content with pagination
function renderCategoryContent(items, container, pageIndex) {
    container.innerHTML = ""; // Clear existing content

    const itemsPerPage = 10;
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    // Render items for the current page
    items.slice(startIndex, endIndex).forEach((item, index) => {
        const row = document.createElement("div");
        row.classList.add("item-row");

        row.innerHTML = `
            <div class="item-file">
              <label>File:</label>
                ${item.file}
            </div>
            <div class="item-name">
              <label>Name:</label>
               ${item.name}
            </div>
            <div id="location" class="item-location">
                <label for="location-${startIndex + index}">Location:</label>
                <select id="location-${startIndex + index}" class="location-dropdown">
                    <option value="shelf-AB" ${item.location === "shelf-AB" ? "selected" : ""}>Shelf AB</option>
                    <option value="shelf-DE" ${item.location === "shelf-DE" ? "selected" : ""}>Shelf DE</option>
                    <option value="shelf-BG" ${item.location === "shelf-BG" ? "selected" : ""}>Shelf BG</option>
                </select>
            </div>
            <div id="count" class="item-count">
                <label>Count:</label>
                <button class="decrement-button" data-index="${startIndex + index}">-</button>
                <span class="count-display">${item.count || 0}</span>
                <button class="increment-button" data-index="${startIndex + index}">+</button>
            </div>
            <div class="item-actions">
                <button class="edit-button" data-index="${startIndex + index}">Edit</button>
                <button class="delete-button" data-index="${startIndex + index}">Delete</button>
            </div>
        `;

    container.appendChild(row);

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

document.getElementById("data-table").addEventListener("click", (event) => {
    const activeTab = document.querySelector(".tab-button[data-active='true']");
    const activeCategory = activeTab ? activeTab.dataset.category : null;

    if (!activeCategory) {
        return; // Exit if no active tab
    }

    // Handle Edit
    if (event.target.classList.contains("edit-button")) {
        handleEdit(event, activeCategory);
    }

    // Handle Delete
    if (event.target.classList.contains("delete-button")) {
        handleDelete(event, activeCategory);
    }
});

function saveChanges(location, count) {

    if(!location || !count) {
        alert('All fields required');
        return;
    }

    fetch("http://localhost:3000/save-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(location, count),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to save data");
            }
            return response.json();
        })
        .then((result) => {
            alert("Changes saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving data:", error);
            alert("Failed to save changes.");
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
function handleEdit(event, category) {
   
    const index = event.target.dataset.index;

    const confirmEdit = confirm(`Edit item in category "${category}" at index ${index}?`);
    if (!confirmEdit) {
        alert("Edit cancelled.");
        return; // Stop if user cancels
    }
    const newFile = prompt("Enter new file path:");
    const newName = prompt("Enter new name:");
    
    if (newFile && newName) {
        fetch("http://localhost:3000/edit-data", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, index, newFile, newName }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to edit data");
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            document.getElementById("show-data-button").click(); // Refresh the table
        })
        .catch((error) => {
            console.error("Error editing data:", error);
        });
        alert(`Editing item in "${category}" at index ${itemIndex}`);
    }
}

// Handle deleting a data item
function handleDelete(event, category) {
    
    const index = event.target.dataset.index;

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


// function loadImages(folder) {
//     const photoContainer = gallery.querySelector(".svg-grid");
//     photoContainer.innerHTML = ""; // Clear previous photos

//     // Assuming a folder structure where each folder contains images named image1.jpg, image2.jpg, etc.
//     for (let i = 0; i < folder.length; i++) { 
//         const photoCard = createPhotoCard(folder, i + 1);
//         photoContainer.appendChild(photoCard);
//     }

//     // Add search functionality
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
// }

// function createPhotoCard(folder, imageIndex) {

//     const photoCard = document.createElement("div");
//     photoCard.classList.add("photo-card");

//     const img = document.createElement("img");
//     img.src = `src/public/images/${folder}/image${imageIndex}.jpg`; // Dynamic folder and image path
//     img.alt = `Image ${imageIndex} from Folder ${folder}`;
//     photoCard.appendChild(img);

//     const photoInfo = document.createElement("div");
//     photoInfo.classList.add("photo-info");
//     photoInfo.innerHTML = `
//         <span><strong>Date:</strong> 2024-11-${10 + imageIndex}</span>
//         <span><strong>Size:</strong> ${Math.floor(Math.random() * 5 + 1)} MB</span>
//         <span><strong>Folder:</strong> ${folder}</span>
//         <span><strong>Dimensions:</strong> 200x150 px</span>
//         <span><strong>Location:</strong> Shelf ${Math.floor(Math.random() * 7 + 1)}</span>
//     `;

//     photoCard.appendChild(photoInfo);

//     return photoCard;
// }

