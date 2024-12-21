const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const morgan = require('morgan');

// Middleware to parse JSON data
app.use(bodyParser.json());

// Monitor http requests over the server
app.use(morgan('dev'));

// Cors for cross origin allowance
const cors = require('cors');//add
const { error } = require("console");
app.use(cors());//add

// Initialize the project folder
app.use(express.static("Gallery"));

  // Update the path to `data.json`
  const dataFilePath = path.join(__dirname, "../src/data.json");

// Endpoint to add data
app.post("/add-data", (req, res) => {
    const { category, file, name, description, partNumber, price, location, count, expiryDate } = req.body;
    console.log(req.body);

    if (!category || !file || !name || !description || !partNumber || !price ||!location || !count ||!expiryDate) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Read the existing data
    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading data.json:", err);
            return res.status(500).json({ error: "Failed to read data file." });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return res.status(500).json({ error: "Invalid JSON data." });
        }

        // Add the new data to the appropriate category
        if (!jsonData[category]) {
            jsonData[category] = [];
        }
        jsonData[category].push({ file, name });

        // Save the updated data back to the file
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error writing to data.json:", writeErr);
                return res.status(500).json({ error: "Failed to write data file." });
            }

            res.status(200).json({ message: "Data added successfully." });
        });
    });
});

// Save updated data to the JSON file
app.post("/save-data", (req, res) => {
    const updatedData = req.body;

    fs.writeFile(
        path.join(__dirname, "../src/data.json"),
        JSON.stringify(updatedData, null, 2),
        (err) => {
            if (err) {
                console.error("Error writing data.json:", err);
                return res.status(500).json({ message: "Failed to save data" });
            }
            res.json({ message: "Data saved successfully" });
        }
    );
});

// Edit data in data.json
app.put("/edit-data", (req, res) => {
    const { category, index, newFile, newName, newPartNo } = req.body;

    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data file." });

        let jsonData = JSON.parse(data);
        if (!jsonData[category] || !jsonData[category][index]) {
            return res.status(404).json({ error: "Data not found." });
        }

        jsonData[category][index] = { file: newFile, name: newName, partNumber: newPartNo };

        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to write data file." });
            res.status(200).json({ message: "Data updated successfully." });
        });
    });
});

// Delete data from data.json
app.delete("/delete-data", (req, res) => {
    const { category, index } = req.body;

    fs.readFile(dataFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data file." });

        let jsonData = JSON.parse(data);
        if (!jsonData[category] || !jsonData[category][index]) {
            return res.status(404).json({ error: "Data not found." });
        }

        jsonData[category].splice(index, 1); // Remove the item

        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to write data file." });
            res.status(200).json({ message: "Data deleted successfully." });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});