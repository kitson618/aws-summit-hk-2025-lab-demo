// Initialize SQLite database
let db;
const initDatabase = async () => {
    // Check if SQLite is supported in the browser
    if (!window.indexedDB) {
        console.error("Your browser doesn't support IndexedDB. Using localStorage as fallback.");
        return;
    }

    // Open or create the database
    const request = window.indexedDB.open("FactCheckerDB", 1);

    request.onerror = (event) => {
        console.error("Database error:", event.target.error);
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        
        // Create object store for facts
        if (!db.objectStoreNames.contains("facts")) {
            const factsStore = db.createObjectStore("facts", { keyPath: "id", autoIncrement: true });
            
            // Create indexes for searching
            factsStore.createIndex("category", "category", { unique: false });
            factsStore.createIndex("verdict", "verdict", { unique: false });
            factsStore.createIndex("statement", "statement", { unique: false });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("Database initialized successfully");
        
        // Load facts when database is ready
        loadFacts();
    };
};

// Add a new fact to the database
const addFact = (fact) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["facts"], "readwrite");
        const factsStore = transaction.objectStore("facts");
        
        // Add timestamp
        fact.timestamp = new Date().toISOString();
        
        const request = factsStore.add(fact);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Update an existing fact
const updateFact = (fact) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["facts"], "readwrite");
        const factsStore = transaction.objectStore("facts");
        
        // Update timestamp
        fact.timestamp = new Date().toISOString();
        
        const request = factsStore.put(fact);
        
        request.onsuccess = () => {
            resolve();
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Delete a fact
const deleteFact = (id) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["facts"], "readwrite");
        const factsStore = transaction.objectStore("facts");
        
        const request = factsStore.delete(id);
        
        request.onsuccess = () => {
            resolve();
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Get all facts from the database
const getAllFacts = () => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["facts"], "readonly");
        const factsStore = transaction.objectStore("facts");
        
        const request = factsStore.getAll();
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Search facts based on filters
const searchFacts = (keyword, category, verdict) => {
    return new Promise((resolve, reject) => {
        getAllFacts().then(facts => {
            let filteredFacts = facts;
            
            // Filter by keyword
            if (keyword) {
                const lowerKeyword = keyword.toLowerCase();
                filteredFacts = filteredFacts.filter(fact => 
                    fact.statement.toLowerCase().includes(lowerKeyword) || 
                    fact.explanation.toLowerCase().includes(lowerKeyword)
                );
            }
            
            // Filter by category
            if (category) {
                filteredFacts = filteredFacts.filter(fact => fact.category === category);
            }
            
            // Filter by verdict
            if (verdict) {
                filteredFacts = filteredFacts.filter(fact => fact.verdict === verdict);
            }
            
            resolve(filteredFacts);
        }).catch(error => {
            reject(error);
        });
    });
};

// Display facts in the UI
const displayFacts = (facts) => {
    const factsListElement = document.getElementById('factsList');
    factsListElement.innerHTML = '';
    
    if (facts.length === 0) {
        factsListElement.innerHTML = '<p>No facts found.</p>';
        return;
    }
    
    // Sort facts by timestamp (newest first)
    facts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    facts.forEach(fact => {
        const factCard = document.createElement('div');
        factCard.className = `fact-card ${fact.verdict.toLowerCase().replace(' ', '-')}`;
        
        // Format sources as links if they are URLs
        let sourcesHTML = '';
        if (fact.sources) {
            const sourcesList = fact.sources.split(',').map(source => source.trim());
            sourcesHTML = sourcesList.map(source => {
                if (source.startsWith('http')) {
                    return `<a href="${source}" target="_blank">${source}</a>`;
                }
                return source;
            }).join(', ');
        }
        
        factCard.innerHTML = `
            <div class="fact-header">
                <span class="fact-category">${fact.category}</span>
                <span class="fact-verdict ${fact.verdict.toLowerCase().replace(' ', '-')}">${fact.verdict}</span>
            </div>
            <div class="fact-statement">${fact.statement}</div>
            <div class="fact-explanation">${fact.explanation}</div>
            ${fact.sources ? `<div class="fact-sources">Sources: ${sourcesHTML}</div>` : ''}
            <div class="fact-actions">
                <button class="edit-btn" data-id="${fact.id}">Edit</button>
                <button class="delete-btn" data-id="${fact.id}">Delete</button>
            </div>
        `;
        
        factsListElement.appendChild(factCard);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditFact);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteFact);
    });
};

// Load and display all facts
const loadFacts = async () => {
    try {
        const facts = await getAllFacts();
        displayFacts(facts);
    } catch (error) {
        console.error('Error loading facts:', error);
    }
};

// Handle form submission
const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    // Get form values
    const statement = document.getElementById('statement').value;
    const category = document.getElementById('category').value;
    const verdict = document.querySelector('input[name="verdict"]:checked').value;
    const explanation = document.getElementById('explanation').value;
    const sources = document.getElementById('sources').value;
    
    const factData = {
        statement,
        category,
        verdict,
        explanation,
        sources
    };
    
    try {
        // Check if we're editing an existing fact
        const editId = document.getElementById('factForm').dataset.editId;
        
        if (editId) {
            // Update existing fact
            factData.id = parseInt(editId);
            await updateFact(factData);
            
            // Reset form
            document.getElementById('factForm').removeAttribute('data-edit-id');
            document.querySelector('button[type="submit"]').textContent = 'Save Fact';
        } else {
            // Add new fact
            await addFact(factData);
        }
        
        // Reset form
        document.getElementById('factForm').reset();
        
        // Reload facts
        loadFacts();
    } catch (error) {
        console.error('Error saving fact:', error);
    }
};

// Handle edit fact button click
const handleEditFact = async (event) => {
    const factId = parseInt(event.target.dataset.id);
    
    try {
        const facts = await getAllFacts();
        const factToEdit = facts.find(fact => fact.id === factId);
        
        if (factToEdit) {
            // Populate form with fact data
            document.getElementById('statement').value = factToEdit.statement;
            document.getElementById('category').value = factToEdit.category;
            document.querySelector(`input[value="${factToEdit.verdict}"]`).checked = true;
            document.getElementById('explanation').value = factToEdit.explanation;
            document.getElementById('sources').value = factToEdit.sources || '';
            
            // Set form to edit mode
            document.getElementById('factForm').dataset.editId = factId;
            document.querySelector('button[type="submit"]').textContent = 'Update Fact';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error editing fact:', error);
    }
};

// Handle delete fact button click
const handleDeleteFact = async (event) => {
    if (confirm('Are you sure you want to delete this fact?')) {
        const factId = parseInt(event.target.dataset.id);
        
        try {
            await deleteFact(factId);
            loadFacts();
        } catch (error) {
            console.error('Error deleting fact:', error);
        }
    }
};

// Handle search button click
const handleSearch = async () => {
    const keyword = document.getElementById('searchInput').value;
    const category = document.getElementById('filterCategory').value;
    const verdict = document.getElementById('filterVerdict').value;
    
    try {
        const facts = await searchFacts(keyword, category, verdict);
        displayFacts(facts);
    } catch (error) {
        console.error('Error searching facts:', error);
    }
};

// Check if user is logged in
const checkAuth = () => {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Redirect to login page
        window.location.href = 'login.html';
    } else {
        // Display user info
        const userData = JSON.parse(currentUser);
        const userInfoElement = document.getElementById('userInfo');
        
        if (userInfoElement) {
            userInfoElement.textContent = `Welcome, ${userData.fullName}`;
        }
    }
};

// Handle logout
const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('currentUser');
    
    // Redirect to login page
    window.location.href = 'login.html';
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    // Initialize database
    initDatabase();
    
    // Add event listeners
    document.getElementById('factForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    
    // Add event listener for search input (search as you type)
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('filterCategory').addEventListener('change', handleSearch);
    document.getElementById('filterVerdict').addEventListener('change', handleSearch);
    
    // Add event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});
