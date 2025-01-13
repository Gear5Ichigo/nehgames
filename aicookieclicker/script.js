// Load saved game state from localStorage
function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem('cookieClickerGameState'));
    if (savedState) {
        // Ensure globalUpgradeCost and purchases are initialized
        if (savedState.globalUpgradeCost === undefined) {
            savedState.globalUpgradeCost = 500; // Set to default value if missing
        }
        if (savedState.globalUpgradePurchases === undefined) {
            savedState.globalUpgradePurchases = 0; // Initialize purchase count if missing
        }
        if (savedState.lootboxCost === undefined) {
            savedState.lootboxCost = 750; // Initialize lootbox cost if missing
        }
        return savedState;
    } else {
        return {
            cookies: 0,
            cookiesPerClick: 1,
            cookiesPerSecond: 0,
            farmsOwned: 0,
            factoriesOwned: 0,
            minesOwned: 0,
            upgradeCost: 10,
            farmCost: 50,
            factoryCost: 200,
            mineCost: 1000,
            globalUpgradeCost: 500, // Initialize globalUpgradeCost with default value
            globalUpgradePurchases: 500, // Track global upgrade purchases
            achievements: [],
            globalUpgradeApplied: false,
            lootboxCost: 750, // Lootbox cost
        };
    }
}

// Save the game state to localStorage
function saveGameState() {
    localStorage.setItem('cookieClickerGameState', JSON.stringify(gameState));
}

// Initialize game state from saved data
let gameState = loadGameState();

// Sound effects
const clickSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
const upgradeSound = new Audio('https://www.soundjay.com/button/button-16.wav');

// Elements
const cookieCountElement = document.getElementById('cookie-count');
const cookiesPerClickElement = document.getElementById('cookies-per-click');
const upgradeButton = document.getElementById('upgrade-button');
const farmButton = document.getElementById('farm-button');
const factoryButton = document.getElementById('factory-button');
const mineButton = document.getElementById('mine-button');
const globalUpgradeButton = document.getElementById('global-upgrade-button');
const cookieFarmCountElement = document.getElementById('cookie-farm-count');
const factoryCountElement = document.getElementById('factory-count');
const mineCountElement = document.getElementById('mine-count');
const cookiesPerSecondElement = document.getElementById('cookies-per-second');
const clickButton = document.getElementById('click-button');
const achievementList = document.getElementById('achievement-list');
const lootboxButton = document.getElementById('lootbox-button');
const lootboxResult = document.getElementById('lootbox-result');

// New element to show global upgrade purchases
const globalUpgradePurchasesElement = document.getElementById('global-upgrade-purchases');

// Function to update the cookie count display
function updateCookieCount() {
    cookieCountElement.textContent = gameState.cookies;
}

// Function to update cookies per second display
function updateCookiesPerSecond() {
    cookiesPerSecondElement.textContent = gameState.cookiesPerSecond;
}

// Function to update farms, factories, and mines count
function updateUpgradeCounts() {
    cookieFarmCountElement.textContent = gameState.farmsOwned;
    factoryCountElement.textContent = gameState.factoriesOwned;
    mineCountElement.textContent = gameState.minesOwned;
}

// Add achievement
function addAchievement(name) {
    if (!gameState.achievements.includes(name)) {
        gameState.achievements.push(name);
        const achievementElement = document.createElement('li');
        achievementElement.textContent = name;
        achievementElement.classList.add('achievement');
        achievementList.appendChild(achievementElement);
        saveGameState();
    }
}

// Function to update upgrade buttons' text
function updateUpgradeButtons() {
    // Update click upgrade button text
    upgradeButton.textContent = `Upgrade Click Power (Cost: ${gameState.upgradeCost} cookies)`;

    // Update farm button text
    farmButton.textContent = `Buy Cookie Farm (Cost: ${gameState.farmCost} cookies)`;

    // Update factory button text
    factoryButton.textContent = `Buy Factory (Cost: ${gameState.factoryCost} cookies)`;

    // Update mine button text
    mineButton.textContent = `Buy Mine (Cost: ${gameState.mineCost} cookies)`;

    // Update global upgrade button text
    globalUpgradeButton.textContent = `Upgrade All Buildings (Cost: ${gameState.globalUpgradeCost} cookies)`;

    // Update lootbox button text
    lootboxButton.textContent = `Open Lootbox (Cost: ${gameState.lootboxCost} cookies)`;
}

// Function to update global upgrade purchase counter display
function updateGlobalUpgradePurchases() {
    globalUpgradePurchasesElement.textContent = `Global Upgrades Purchased: ${gameState.globalUpgradePurchases}`;
}

// Function to handle clicking the button
clickButton.addEventListener('click', () => {
    gameState.cookies += gameState.cookiesPerClick;
    updateCookieCount();
    saveGameState();

    // Visual feedback on click
    clickButton.classList.add('clicked');

    // Play sound effect
    clickSound.play();

    // Remove the 'clicked' class after the animation completes (0.2s)
    setTimeout(() => {
        clickButton.classList.remove('clicked');
    }, 200); // match this duration with the CSS animation time

    // Check achievements
    if (gameState.cookies >= 100) {
        addAchievement("100 Cookies Earned!");
    }

    if (gameState.cookies >= 1000) {
        addAchievement("1000 Cookies Earned!");
    }
});

// Function to handle upgrading click power
upgradeButton.addEventListener('click', () => {
    if (gameState.cookies >= gameState.upgradeCost) {
        gameState.cookies -= gameState.upgradeCost;
        gameState.cookiesPerClick += 1;
        gameState.upgradeCost = Math.floor(gameState.upgradeCost * 1.5);
        cookiesPerClickElement.textContent = gameState.cookiesPerClick;
        updateCookieCount();
        saveGameState();
        updateUpgradeButtons(); // Update button text after upgrade
        upgradeSound.play();
    } else {
        alert("Not enough cookies for upgrade!");
    }
});

// Function to handle buying Cookie Farms
farmButton.addEventListener('click', () => {
    if (gameState.cookies >= gameState.farmCost) {
        gameState.cookies -= gameState.farmCost;
        gameState.farmsOwned += 1;
        gameState.cookiesPerSecond += 10;
        gameState.farmCost = Math.floor((gameState.farmsOwned+1 ) * 50);
        updateUpgradeCounts();
        updateCookiesPerSecond();
        updateUpgradeButtons(); // Update button text after purchase
        updateCookieCount();
        saveGameState();
    } else {
        alert("Not enough cookies for a farm!");
    }
});

// Function to handle buying Factories
factoryButton.addEventListener('click', () => {
    if (gameState.cookies >= gameState.factoryCost) {
        gameState.cookies -= gameState.factoryCost;
        gameState.factoriesOwned += 1;
        gameState.cookiesPerSecond += 25;
        gameState.factoryCost = Math.floor((gameState.factoriesOwned+1) * 500);
        updateUpgradeCounts();
        updateCookiesPerSecond();
        updateUpgradeButtons(); // Update button text after purchase
        updateCookieCount();
        saveGameState();
    } else {
        alert("Not enough cookies for a factory!");
    }
});

// Function to handle buying Mines
mineButton.addEventListener('click', () => {
    if (gameState.cookies >= gameState.mineCost) {
        gameState.cookies -= gameState.mineCost;
        gameState.minesOwned += 1;
        gameState.cookiesPerSecond += 50;
        gameState.mineCost = Math.floor((gameState.minesOwned+1) * 1000);
        updateUpgradeCounts();
        updateCookiesPerSecond();
        updateUpgradeButtons(); // Update button text after purchase
        updateCookieCount();
        saveGameState();
    } else {
        alert("Not enough cookies for a mine!");
    }
});

// Function to apply a global upgrade
globalUpgradeButton.addEventListener('click', () => {
    if (gameState.cookies >= gameState.globalUpgradeCost) {
        gameState.cookies -= gameState.globalUpgradeCost;
        gameState.cookiesPerSecond *= 2; // Double cookies per second with each global upgrade
        gameState.globalUpgradeCost = Math.floor((gameState.globalUpgradePurchases+1) * 500); // Increase global upgrade cost by 50%
        
        // Increment the global upgrade purchase counter
        gameState.globalUpgradePurchases += 1;

        updateCookiesPerSecond();
        updateCookieCount();
        saveGameState();
        updateUpgradeButtons(); // Update button text after purchase
        updateGlobalUpgradePurchases(); // Update global upgrade purchases display
        alert("All buildings upgraded!");
    } else {
        alert("Not enough cookies for a global upgrade!");
    }
});

// Function to auto-generate cookies
function autoGenerateCookies() {
    gameState.cookies += gameState.cookiesPerSecond;
    updateCookieCount();
    saveGameState();
}

// Start the automatic cookie generation
setInterval(autoGenerateCookies, 1000);

// Function to handle opening a lootbox with spinning animation
lootboxButton.addEventListener('click', () => {
    if (gameState.cookies >= gameState.lootboxCost) {
        gameState.cookies -= gameState.lootboxCost;
        updateCookieCount();
        
        // Disable the lootbox button during the animation
        lootboxButton.disabled = true;

        // Start the spinning animation
        lootboxResult.classList.add('spinning');
        lootboxResult.textContent = "Spinning...";

        // Generate random lootbox reward and stop after some time
        let rewardMessage = "";
        let rewardTextOptions = ["Loading...", "Cookies", "Upgrade", "Achievement"];

        // Spin through possible rewards for 3 seconds
        let spinDuration = 3000; // 3 seconds of spinning
        let rewardChosenDelay = 2500; // Stop spinning just before the reward

        // Set a timeout to stop the spinning and show the reward after the specified duration
        setTimeout(() => {
            rewardMessage = "joe";
            // Stop the spinning and show the actual reward
            lootboxResult.classList.remove('spinning');
            // 
            lootboxButton.disabled = false;
            
            const rewardPercentage = Math.floor(Math.random() * 1001);
            if (rewardPercentage < 650)  { // 65 %
                // Reward: Cookies
                const cookiesReward = Math.floor(Math.random() * 1000) + 750;
                gameState.cookies += cookiesReward;
                gameState.updateCookieCount();
                rewardMessage = `You received ${cookiesReward-750} cookies!`;
            } else if (rewarrewardPercentagedType < 300) { // %30
                // Reward: Upgrade
                const upgradeReward = Math.floor(Math.random() * 2);
                if (upgradeReward === 0) {
                    gameState.cookiesPerClick += 77;
                    cookiesPerClickElement.textContent = gameState.cookiesPerClick;
                    rewardMessage = "77 additional click power!";
                } else {
                    const cpsRandom = Math.floor(Math.random() * 100);
                    gameState.cookiesPerSecond += cpsRandom;
                    gameState.updateCookiesPerSecond();
                    rewardMessage = `${cpsRandom} cookies per second!`;
                }
            } else if (rewardPercentage < 45 ) { // %4.5
                // Reward: Achievement
                addAchievement("Lootbox Special!");
                rewardMessage = "You earned an achievement!";
            } else { // %0.5
                addAchievement("Lootbox God!");
                rewardMessage = "You earned an achievement!";
            }

            lootboxResult.textContent = rewardMessage; // Show the real reward
            saveGameState();
        }, rewardChosenDelay);



    } else {
        alert("Not enough cookies to open the lootbox!");
    }
});

// Function to reset game data
function clearGameData() {
    localStorage.removeItem('cookieClickerGameState'); // Remove saved game state from localStorage
    gameState = loadGameState(); // Reload the initial state
    updateCookieCount(); // Reset the UI with the new state
    updateUpgradeCounts();
    updateCookiesPerSecond();
    updateUpgradeButtons();
    updateGlobalUpgradePurchases();
}

// Attach event listener to the "Clear Data" button
const clearDataButton = document.getElementById('clear-data-button');
clearDataButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all game data?")) {
        clearGameData(); // Reset the game
    }
});

// Initial setup
updateCookieCount();
updateUpgradeCounts();
updateCookiesPerSecond();
updateUpgradeButtons(); // Initialize the upgrade buttons with correct values
updateGlobalUpgradePurchases(); // Initialize global upgrade purchase counter
