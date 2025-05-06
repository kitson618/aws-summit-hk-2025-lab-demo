// Initialize database for users
let db;
const initUserDatabase = () => {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
        console.error("Your browser doesn't support IndexedDB.");
        return;
    }

    // Open or create the database
    const request = window.indexedDB.open("FactCheckerUsersDB", 1);

    request.onerror = (event) => {
        console.error("Database error:", event.target.error);
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        
        // Create object store for users
        if (!db.objectStoreNames.contains("users")) {
            const usersStore = db.createObjectStore("users", { keyPath: "username" });
            
            // Create indexes
            usersStore.createIndex("email", "email", { unique: true });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("User database initialized successfully");
    };
};

// Register a new user
const registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["users"], "readwrite");
        const usersStore = transaction.objectStore("users");
        
        // Check if username already exists
        const usernameRequest = usersStore.get(userData.username);
        
        usernameRequest.onsuccess = (event) => {
            if (event.target.result) {
                reject(new Error("Username already exists"));
                return;
            }
            
            // Check if email already exists
            const emailIndex = usersStore.index("email");
            const emailRequest = emailIndex.get(userData.email);
            
            emailRequest.onsuccess = (event) => {
                if (event.target.result) {
                    reject(new Error("Email already in use"));
                    return;
                }
                
                // Add new user
                const addRequest = usersStore.add(userData);
                
                addRequest.onsuccess = () => {
                    resolve();
                };
                
                addRequest.onerror = (event) => {
                    reject(event.target.error);
                };
            };
        };
    });
};

// Handle registration form submission
const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Validate form
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match";
        errorMessage.style.display = 'block';
        return;
    }
    
    // Create user object
    const userData = {
        fullName,
        username,
        email,
        password
    };
    
    try {
        await registerUser(userData);
        
        // Redirect to login page
        alert("Registration successful! Please log in.");
        window.location.href = 'login.html';
    } catch (error) {
        // Display error message
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize database
    initUserDatabase();
    
    // Add event listener for registration form
    document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);
});
