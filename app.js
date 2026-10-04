// --- EPL/Local Fantasy League App Logic ---

const fantasyConfig = {
    maxSquadSize: 15,
    maxBudget: 100.0,
    apiBaseUrl: "https://api.github.com", // Adjust if hitting GitHub REST endpoints
};

// Sample Player Database Structure
const playersDatabase = [
    // 1. SAINT GEORGE SC
    { id: 129, name: "E. Selesh", club: "Saint George", pos: "MID", price: 4.5 },
    { id: 130, name: "B. Endale", club: "Saint George", pos: "MID", price: 5.0 },
    { id: 131, name: "A. Yalew", club: "Saint George", pos: "FWD", price: 8.5 },
    { id: 132, name: "T. Teshome", club: "Saint George", pos: "FWD", price: 7.5 },
    
    // 2. ETHIOPIAN COFFEE SC
    { id: 201, name: "I. Danlad", club: "Ethiopian Coffee", pos: "GKP", price: 5.0 },
    { id: 202, name: "T. Kibatu", club: "Ethiopian Coffee", pos: "GKP", price: 4.5 },
    { id: 204, name: "R. James", club: "Ethiopian Coffee", pos: "DEF", price: 5.0 },
];

// User Squad State
let userSquad = {
    players: [],
    remainingBudget: 100.0
};

/**
 * Validates and adds a player to the user's squad
 * @param {Object} player 
 */
function addPlayerToSquad(player) {
    if (userSquad.players.length >= fantasyConfig.maxSquadSize) {
        console.warn("Squad is full!");
        return false;
    }
    
    if (userSquad.remainingBudget - player.price < 0) {
        console.warn("Not enough budget!");
        return false;
    }

    userSquad.players.push(player);
    userSquad.remainingBudget -= player.price;
    return true;
}

// Example GitHub API sync helper (handling potential 400 payloads safely)
async function syncSquadToRepo(repoPath, token, commitMessage) {
    try {
        const payload = {
            message: commitMessage,
            content: btoa(JSON.stringify(userSquad, null, 2)) // base64 encode for GitHub Contents API
        };

        const response = await fetch(`${fantasyConfig.apiBaseUrl}/repos/${repoPath}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`GitHub Error (${response.status}): ${errData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Sync failed:", error.message);
    }
}
