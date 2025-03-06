document.addEventListener("DOMContentLoaded", function() {
    const departments = [
        "B.Tech Civil Engineering",
        "B.Tech Mechanical Engineering",
        "B.Tech Electrical Engineering",
        "B.Tech Electronics Engineering",
        "B. Architecture",
        "B.Tech Computer Science & Engineering",
        "B.Tech Chemical Engineering",
        "B.Tech Information Technology",
        "B.Tech Electronics & Telecommunication Engineering",
        "B.Tech Automobile Engineering",
        "B.Tech Information Technology(Artificial Intelligence and Robotics)",
        "B.Tech Internet of Things (IoT)",
        "B.Tech Mathematics and Computing",
        "B.Tech Internet of Things (Electrical Engineering)",
        "B.Tech Artificial Intelligence(AI) and Data Science",
        "B.Tech Artificial Intelligence and Machine Learning",
        "B.Tech Computer Science and Design"
    ];

    function populateDropdowns() {
        // Populate the dropdowns with department options
        let branchDropdowns = [document.getElementById("branch"), document.getElementById("department"), document.getElementById("search-branch")];

        branchDropdowns.forEach(dropdown => {
            dropdown.innerHTML = "";
            departments.forEach(dept => {
                let option = document.createElement("option");
                option.value = dept;
                option.textContent = dept;
                dropdown.appendChild(option);
            });
        });
    }

    populateDropdowns(); // Call for admin panel
    populateDropdowns(); // Call for preview panel

});

function signup() {
    // Handle user signup
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup Successful!");
    toggleForm();
}

function login() {
    let email = document.getElementById("login-email").value;

    // Check if the user is already logged in
    if (localStorage.getItem("loggedIn")) {
        showAdminPanel(); // Redirect to admin panel if already logged in
        return;
    }

    let password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("loggedIn", email);
        // Show only the admin and check timetable panels
        showAdminPanel();
    } else {
        alert("Invalid Login!");
    }
}

function unlockAdmin() {
    // Unlock the admin panel if the correct password is entered
    let password = document.getElementById("admin-password").value;
    if (password === "2025") {
        document.getElementById("admin-content").style.display = "block";
    } else {
        alert("Incorrect Password!");
    }
}

function logout() {
    // Log out the user and redirect to the login page
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}

function showAdminPanel() {
    // Show the admin panel
    document.getElementById("admin-panel").style.display = "block";
    document.getElementById("preview-panel").style.display = "none";
}

function showPreviewPanel() {
    // Show the preview panel
    document.getElementById("preview-panel").style.display = "block";
    document.getElementById("admin-panel").style.display = "none";
}

function getSelectedRow() {
    // Logic to get the selected row from the timetable
    let table = document.getElementById("admin-table");
    for (let row of table.rows) {
        row.onclick = function() {
            // Highlight the selected row
            for (let r of table.rows) {
                r.classList.remove("selected");
            }
            this.classList.add("selected");
        };
    }
}

function addEntry() {
    // Add a new timetable entry
    let department = document.getElementById("department").value;
    let semester = document.getElementById("semester").value;
    let day = document.getElementById("day").value;
    let startTime = document.getElementById("start-time").value;
    let endTime = document.getElementById("end-time").value;
    let subject = document.getElementById("subject").value;
    let professor = document.getElementById("professor").value;

    // Validate the input and check for conflicts
    if (department && semester && day && startTime && endTime && subject && professor) {
        let table = document.getElementById("admin-table");
        let existingEntries = Array.from(table.rows).slice(1); // Skip header row

        // Check for conflicts
        for (let entry of existingEntries) {
            if (entry.cells[2].textContent === day && 
                entry.cells[3].textContent === startTime && 
                entry.cells[4].textContent === endTime && 
                entry.cells[6].textContent === professor) {
                alert("Conflict: This professor already has a class scheduled at this time.");
                return;
            }
        }

let row = table.insertRow();
row.insertCell(0).textContent = ""; // Placeholder for department
row.insertCell(1).textContent = semester;
row.insertCell(2).textContent = day;
row.insertCell(3).textContent = startTime;
row.insertCell(4).textContent = endTime;
row.insertCell(5).textContent = subject;
row.insertCell(6).textContent = professor;

// Create edit and delete buttons
let editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.onclick = function() {
    editEntry(row);
};
row.insertCell(7).appendChild(editButton);

let deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.onclick = function() {
    deleteEntry(row);
};
row.insertCell(8).appendChild(deleteButton);



        alert("Entry added successfully!");
    } else {
        alert("Please fill in all fields.");
    }
}

function editEntry(row) {
    // Logic to edit an existing entry
    document.getElementById("department").value = row.cells[0].textContent;
    document.getElementById("semester").value = row.cells[1].textContent;
    document.getElementById("day").value = row.cells[2].textContent;
    document.getElementById("start-time").value = row.cells[3].textContent;
    document.getElementById("end-time").value = row.cells[4].textContent;
    document.getElementById("subject").value = row.cells[5].textContent;
    document.getElementById("professor").value = row.cells[6].textContent;

    // Remove the selected row from the table
    row.remove();

    let selectedRow = getSelectedRow(); // Assume this function gets the selected row
    if (selectedRow) {
        document.getElementById("department").value = selectedRow.cells[0].textContent;
        document.getElementById("semester").value = selectedRow.cells[1].textContent;
        document.getElementById("day").value = selectedRow.cells[2].textContent;
        document.getElementById("start-time").value = selectedRow.cells[3].textContent;
        document.getElementById("end-time").value = selectedRow.cells[4].textContent;
        document.getElementById("subject").value = selectedRow.cells[5].textContent;
        document.getElementById("professor").value = selectedRow.cells[6].textContent;

        // Remove the selected row from the table
        selectedRow.remove();
    } else {
        alert("Please select an entry to edit.");
    }
}

function deleteEntry(row) {
    // Logic to delete an existing entry
    row.remove();
    alert("Entry deleted successfully!");

    let selectedRow = getSelectedRow(); // Assume this function gets the selected row
    if (selectedRow) {
        selectedRow.remove();
        alert("Entry deleted successfully!");
    } else {
        alert("Please select an entry to delete.");
    }
}

function toggleForm() {
    // Toggle between signup and login forms
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    if (signupForm.style.display === "none") {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }
    // Reset the form fields
    document.getElementById("signup-form").reset();
    document.getElementById("login-form").reset();
}
