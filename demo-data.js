// Demo data for testing the ApnaCart admin system
// This file can be used to populate the system with sample vegetables

const demoVegetables = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        weightUnit: "250g",
        imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRmVmM2Y0Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNjAiIGZpbGw9IiNmY2ZhZjEiLz4KPHNwYW4geD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VG9tYXRvZXM8L3NwYW4+Cjwvc3ZnPg==",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRmVmM2Y0Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNjAiIGZpbGw9IiNmY2ZhZjEiLz4KPHNwYW4geD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VG9tYXRvZXM8L3NwYW4+Cjwvc3ZnPg==",
        createdAt: "2024-01-15T10:30:00.000Z"
    },
    {
        id: 2,
        name: "Organic Carrots",
        weightUnit: "500g",
        imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRmVmM2Y0Ii8+CjxwYXRoIGQ9Ik0xMDAgMTgwIEwxMDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y5NzM0IiBzdHJva2Utd2lkdGg9IjEwIi8+CjxwYXRoIGQ9Ik0xMDAgNDAgTDEyMCA2MCBMMTQwIDQwIiBmaWxsPSIjMjJjNTFlIi8+CjxzcGFuIHg9IjEwMCIgeT0iMTkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzNzQxNTEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhcnJvdHM8L3NwYW4+Cjwvc3ZnPg==",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRmVmM2Y0Ii8+CjxwYXRoIGQ9Ik0xMDAgMTgwIEwxMDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y5NzM0IiBzdHJva2Utd2lkdGg9IjEwIi8+CjxwYXRoIGQ9Ik0xMDAgNDAgTDEyMCA2MCBMMTQwIDQwIiBmaWxsPSIjMjJjNTFlIi8+CjxzcGFuIHg9IjEwMCIgeT0iMTkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzNzQxNTEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhcnJvdHM8L3NwYW4+Cjwvc3ZnPg==",
        createdAt: "2024-01-15T11:15:00.000Z"
    },
    {
        id: 3,
        name: "Green Bell Peppers",
        weightUnit: "250g",
        imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRmVmM2Y0Ii8+CjxwYXRoIGQ9Ik0xMDAgMTgwIEwxMDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLXdpZHRoPSI4Ii8+CjxwYXRoIGQ9Ik0xMDAgNjAgTDEyMCA4MCBMMTQwIDYwIiBmaWxsPSIjMjJjNTFlIi8+CjxzcGFuIHg9IjEwMCIgeT0iMTkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzNzQxNTEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBlcHBlcnM8L3NwYW4+Cjwvc3ZnPg==",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRmVmM2Y0Ii8+CjxwYXRoIGQ9Ik0xMDAgMTgwIEwxMDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLXdpZHRoPSI4Ii8+CjxwYXRoIGQ9Ik0xMDAgNjAgTDEyMCA4MCBMMTQwIDYwIiBmaWxsPSIjMjJjNTFlIi8+CjxzcGFuIHg9IjEwMCIgeT0iMTkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzNzQxNTEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBlcHBlcnM8L3NwYW4+Cjwvc3ZnPg==",
        createdAt: "2024-01-15T12:00:00.000Z"
    }
];

// Function to load demo data
function loadDemoData() {
    if (typeof admin !== 'undefined' && admin) {
        // Clear existing data
        admin.vegetables = [];
        
        // Add demo vegetables
        demoVegetables.forEach(veg => {
            admin.vegetables.push(veg);
        });
        
        // Save to localStorage
        admin.saveVegetables();
        
        // Refresh display
        admin.loadVegetables();
        
        // Show success message
        admin.showSuccessMessage('Demo data loaded successfully!');
    } else {
        console.log('Admin system not initialized yet. Please wait for page to load.');
    }
}

// Function to clear all data
function clearAllData() {
    if (typeof admin !== 'undefined' && admin) {
        if (confirm('Are you sure you want to clear all vegetables? This cannot be undone.')) {
            admin.vegetables = [];
            admin.saveVegetables();
            admin.loadVegetables();
            admin.showSuccessMessage('All data cleared successfully!');
        }
    }
}

// Make functions globally available
window.loadDemoData = loadDemoData;
window.clearAllData = clearAllData;

console.log('Demo data functions loaded. Use loadDemoData() or clearAllData() in console.');


