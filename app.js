import express from "express";
import bodyParser from "body-parser";
import { readFile, appendFile } from "fs/promises"; // Importing promises version of fs
import { readFileSync } from "fs"; // Importing synchronous version of fs

const app = express(); // Creating express application
const PORT = 3000;

// Using bodyParser middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handling GET request for the homepage
app.get("/", (req, res) => {
  res.send("Welcome to the greeting page!");
});

// Handling GET request for the create form page
app.get("/create", (req, res) => {
  res.send(`
        <form action="/add" method="post">
            <input type="text" name="userName" placeholder="Enter your name">
            <button type="submit">Submit</button>
        </form>
    `);
});

// Handling POST request to add a user
app.post("/add", async (req, res) => {
  const { userName } = req.body; // Extracting userName from request body
  try {
    await appendFile("users.txt", userName + "\n"); // Appending user to file asynchronously
    console.log("User added to file");
    res.send("User added successfully");
  } catch (err) {
    console.error("Error writing to file:", err);
    res.status(500).send("Error adding user");
  }
});

// Handling GET request to fetch and display users
app.get("/users", (req, res) => {
  try {
    const data = readFileSync("users.txt", "utf8"); // Reading users file synchronously
    if (!data.trim()) {
      // If file is empty, redirect to create page
      return res.redirect("/create");
    }
    const users = data.trim().split("\n"); // Splitting user data by new lines
    // Displaying users as an unordered list
    res.send(`
          <h1>Users</h1>
          <ul>${users.map((user) => `<li>${user}</li>`).join("")}</ul>
      `);
  } catch (err) {
    console.error("Error reading file:", err);
    res.redirect("/create");
  }
});

// Handling 404 error for unknown routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Handling general error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
