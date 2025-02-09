// script.js

// Use Immediately Invoked Function Expression (IIFE) to prevent global scope pollution
(function() {
    'use strict';

    // Initial Players Data
    let players = [];
    const defaultPlayers = [
        { name: 'Player 1', coins: 250000, password: 'pass1' },
        { name: 'Player 2', coins: 250000, password: 'pass2' },
        { name: 'Player 3', coins: 250000, password: 'pass3' },
        { name: 'Player 4', coins: 250000, password: 'pass4' }
    ];

    // Transaction Log
    let transactionLog = [];

    // DOM Elements
    let islandContainer;
    let addPlayerBtn;
    let transactionBtn;
    let changeThemeBtn;
    let header;
    let alertBox;
    let viewLogBtn;
    let modalOverlay;

    // Ensure the DOM is fully loaded before manipulating it
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize DOM Elements
        islandContainer = document.getElementById('islandContainer');
        addPlayerBtn = document.getElementById('addPlayerBtn');
        transactionBtn = document.getElementById('transactionBtn');
        changeThemeBtn = document.getElementById('changeThemeBtn');
        header = document.querySelector('header');
        alertBox = document.getElementById('alertBox');
        viewLogBtn = document.getElementById('viewLogBtn');
        modalOverlay = document.getElementById('modalOverlay');

        // Event Listeners
        addPlayerBtn.addEventListener('click', openAddPlayerModal);
        transactionBtn.addEventListener('click', openTransactionModal);
        changeThemeBtn.addEventListener('click', handleChangeTheme);
        viewLogBtn.addEventListener('click', openLogModal);

        // Load data from localStorage
        loadData();

        // Populate islands
        populateIslands();
    });

    // Load Data from localStorage
    function loadData() {
        const storedPlayers = localStorage.getItem('players');
        const storedLog = localStorage.getItem('transactionLog');

        if (storedPlayers) {
            players = JSON.parse(storedPlayers);
        } else {
            players = defaultPlayers;
            savePlayers();
        }

        if (storedLog) {
            transactionLog = JSON.parse(storedLog);
        }

        // Check saved theme preference
        const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
    }

    // Save Players to localStorage
    function savePlayers() {
        localStorage.setItem('players', JSON.stringify(players));
    }

    // Save Log to localStorage
    function saveLog() {
        localStorage.setItem('transactionLog', JSON.stringify(transactionLog));
    }

    // Populate the islands
    function populateIslands() {
        // Clear existing islands
        islandContainer.innerHTML = '';

        // Get total coins for proportion calculation
        const totalCoins = players.reduce((sum, player) => sum + player.coins, 0);

        // Populate container with islands
        players.forEach((player, index) => {
            const island = document.createElement('div');
            island.className = 'island';

            // Assign background colors
            const colors = ['#FFB6C1', '#87CEFA', '#90EE90', '#FFD700', '#FFA07A', '#9370DB', '#20B2AA'];
            island.style.backgroundColor = colors[index % colors.length];

            // Determine island size based on player's coins
            const sizeFactor = player.coins / totalCoins;
            const maxSize = 1000; // Maximum size in pixels
            const minSize = 200;  // Minimum size in pixels
            const islandSize = Math.max(minSize, sizeFactor * maxSize);

            island.style.width = island.style.height = islandSize + 'px';

            const islandContent = document.createElement('div');
            islandContent.className = 'island-content';

            const nameElem = document.createElement('h3');
            nameElem.textContent = player.name;

            const coinsElem = document.createElement('p');
            coinsElem.textContent = player.coins.toLocaleString() + ' coins';

            islandContent.appendChild(nameElem);
            islandContent.appendChild(coinsElem);
            island.appendChild(islandContent);
            islandContainer.appendChild(island);

            // Hover effect
            island.addEventListener('mouseenter', () => {
                islandContent.style.transform = 'translateY(-10px)';
            });
            island.addEventListener('mouseleave', () => {
                islandContent.style.transform = 'translateY(0)';
            });
        });
    }

    // Open Add Player Modal
    function openAddPlayerModal() {
        const modalContent = `
            <div class="modal">
                <button class="close-modal-btn" onclick="closeModal()">&times;</button>
                <h3>Add New Player</h3>
                <label for="playerName">Player Name:</label>
                <input type="text" id="playerName" required />
                <label for="playerPassword">Set Password:</label>
                <input type="password" id="playerPassword" required />
                <button onclick="addPlayer()">Add Player</button>
            </div>
        `;
        showModal(modalContent);
    }

    // Open Transaction Modal
    function openTransactionModal() {
        if (players.length < 2) {
            showAlert('Not enough players to make a transaction.');
            return;
        }

        const playerOptions = players.map((player, index) => `<option value="${index}">${player.name}</option>`).join('');

        const modalContent = `
            <div class="modal">
                <button class="close-modal-btn" onclick="closeModal()">&times;</button>
                <h3>Make a Transaction</h3>
                <label for="senderSelect">Select Sender:</label>
                <select id="senderSelect">${playerOptions}</select>

                <label for="receiverSelect">Select Receiver:</label>
                <select id="receiverSelect">${playerOptions}</select>

                <label for="amountInput">Enter Amount (Multiple of 1000):</label>
                <input type="number" id="amountInput" min="1000" step="1000" required />

                <label for="passwordInput">Enter Sender's Password:</label>
                <input type="password" id="passwordInput" required />

                <button onclick="makeTransaction()">Submit Transaction</button>
            </div>
        `;
        showModal(modalContent);
    }

    // Open Log Modal
    function openLogModal() {
        const logEntries = transactionLog.map(log => `<p>${log}</p>`).join('') || '<p>No transactions yet.</p>';
        const modalContent = `
            <div class="modal">
                <button class="close-modal-btn" onclick="closeModal()">&times;</button>
                <h3>Transaction Log</h3>
                <div class="log-entries">${logEntries}</div>
                <button onclick="downloadLog()">Download Log File</button>
                <label for="uploadLogInput" class="custom-file-upload">
                    <button>Upload Log File</button>
                </label>
                <input type="file" id="uploadLogInput" accept=".txt" onchange="uploadLog(event)" />
            </div>
        `;
        showModal(modalContent);
    }

    // Show Modal
    function showModal(content) {
        modalOverlay.innerHTML = content;
        modalOverlay.style.display = 'block';
    }

    // Close Modal
    window.closeModal = function() {
        modalOverlay.style.display = 'none';
    }

    // Add Player
    window.addPlayer = function() {
        const playerName = document.getElementById('playerName').value.trim();
        const playerPassword = document.getElementById('playerPassword').value.trim();

        if (playerName && playerPassword) {
            players.push({ name: playerName, coins: 250000, password: playerPassword });
            savePlayers();
            populateIslands();
            closeModal();
            showAlert(`Player ${playerName} added successfully.`);
        } else {
            showAlert('Please fill in all fields.');
        }
    }

    // Make Transaction
    window.makeTransaction = function() {
        const senderIndex = parseInt(document.getElementById('senderSelect').value, 10);
        const receiverIndex = parseInt(document.getElementById('receiverSelect').value, 10);
        const amount = parseInt(document.getElementById('amountInput').value, 10);
        const password = document.getElementById('passwordInput').value;

        if (senderIndex === receiverIndex) {
            showAlert('Sender and receiver cannot be the same.');
            return;
        }

        const sender = players[senderIndex];
        const receiver = players[receiverIndex];

        if (isNaN(amount) || amount <= 0 || amount > sender.coins || amount % 1000 !== 0) {
            showAlert('Invalid amount entered.');
            return;
        }

        if (password !== sender.password) {
            showAlert('Incorrect password.');
            return;
        }

        // Perform Transaction
        sender.coins -= amount;
        receiver.coins += amount;

        savePlayers();

        populateIslands();

        const transactionMessage = `Transaction of ${amount.toLocaleString()} coins from ${sender.name} to ${receiver.name} completed.`;
        showAlert(transactionMessage);

        // Append to Log
        const logEntry = `${new Date().toLocaleString()}: ${transactionMessage}`;
        transactionLog.push(logEntry);
        saveLog();

        closeModal();
    }

    // Change Theme Handler
    function handleChangeTheme() {
        document.body.classList.toggle('dark-theme');
        // Save theme preference
        localStorage.setItem('isDarkTheme', document.body.classList.contains('dark-theme'));
    }

    // Show Alert
    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.classList.add('show');
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 5000);
    }

    // Download Log
    window.downloadLog = function() {
        if (transactionLog.length === 0) {
            showAlert('No transactions to download.');
            return;
        }

        const logText = transactionLog.join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'transaction_log.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Upload Log
    window.uploadLog = function(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                transactionLog = contents.split('\n').filter(line => line.trim() !== '');
                saveLog();
                showAlert('Log file uploaded successfully.');
                closeModal();
            };
            reader.readAsText(file);
        } else {
            showAlert('Please select a valid text file.');
        }
        // Reset the input so the same file can be selected again if needed
        event.target.value = '';
    }

})();