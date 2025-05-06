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

// Authenticate user
const authenticateUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["users"], "readonly");
        const usersStore = transaction.objectStore("users");
        
        const request = usersStore.get(username);
        
        request.onsuccess = (event) => {
            const user = event.target.result;
            
            if (user && user.password === password) {
                // Authentication successful
                resolve(user);
            } else {
                // Authentication failed
                reject(new Error("Invalid username or password"));
            }
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Handle login form submission
const handleLoginSubmit = async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        const user = await authenticateUser(username, password);
        
        // Store user info in session storage
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            fullName: user.fullName,
            email: user.email
        }));
        
        // Redirect to index.html
        window.location.href = 'index.html';
    } catch (error) {
        // Display error message
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
};

// Add demo user if none exists
const addDemoUserIfNeeded = () => {
    const transaction = db.transaction(["users"], "readwrite");
    const usersStore = transaction.objectStore("users");
    
    const countRequest = usersStore.count();
    
    countRequest.onsuccess = () => {
        if (countRequest.result === 0) {
            // Add a demo user
            const demoUser = {
                username: "demo",
                password: "password",
                fullName: "Demo User",
                email: "demo@example.com"
            };
            
            usersStore.add(demoUser);
            console.log("Demo user added");
        }
    };
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize database
    initUserDatabase();
    
    // Add event listener for login form
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
    
    // Wait for database to initialize before adding demo user
    setTimeout(() => {
        if (db) {
            addDemoUserIfNeeded();
        }
    }, 500);
});
