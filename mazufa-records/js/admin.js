class FeatureManager {
    constructor() {
        this.features = {};
        this.initializeFeatures();
        this.setupEventListeners();
    }

    initializeFeatures() {
        // Fetch initial feature states from the server
        fetch('/api/features')
            .then(response => response.json())
            .then(features => {
                this.features = features;
                this.updateUI();
            })
            .catch(error => {
                console.error('Error loading features:', error);
                this.showNotification('Error loading features', 'error');
            });
    }

    setupEventListeners() {
        // Set up listeners for all feature toggles
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                this.toggleFeature(event.target.id, event.target.checked);
            });
        });

        // Theme toggle listener
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleFeature(featureId, enabled) {
        fetch('/api/features/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify({
                feature: featureId,
                enabled: enabled
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            this.features[featureId] = enabled;
            this.showNotification(`${featureId} has been ${enabled ? 'enabled' : 'disabled'}`, 'success');
            this.logFeatureChange(featureId, enabled);
        })
        .catch(error => {
            console.error('Error:', error);
            this.showNotification('Failed to update feature', 'error');
            // Revert the toggle
            const checkbox = document.getElementById(featureId);
            if (checkbox) {
                checkbox.checked = !enabled;
            }
        });
    }

    updateUI() {
        // Update all checkboxes to match current feature states
        Object.entries(this.features).forEach(([featureId, enabled]) => {
            const checkbox = document.getElementById(featureId);
            if (checkbox) {
                checkbox.checked = enabled;
            }
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    logFeatureChange(featureId, enabled) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Feature "${featureId}" ${enabled ? 'enabled' : 'disabled'}`);
        
        // In production, you might want to send this to a logging service
        this.sendToAnalytics({
            event: 'feature_toggle',
            feature: featureId,
            enabled: enabled,
            timestamp: timestamp
        });
    }

    sendToAnalytics(data) {
        // Mock analytics service
        console.log('Analytics:', data);
    }

    getAuthToken() {
        // In production, implement proper token management
        return localStorage.getItem('authToken');
    }

    toggleTheme() {
        const body = document.body;
        const icon = document.querySelector('#theme-toggle i');
        
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        if (icon) {
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        }

        // Save theme preference
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
}

// Analytics Dashboard
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.initializeCharts();
    }

    initializeCharts() {
        // Feature Usage Chart
        this.createFeatureUsageChart();
        
        // User Activity Chart
        this.createUserActivityChart();
        
        // Performance Metrics
        this.createPerformanceChart();
    }

    createFeatureUsageChart() {
        const ctx = document.getElementById('featureUsageChart');
        if (!ctx) return;

        this.charts.featureUsage = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(featureManager.features),
                datasets: [{
                    label: 'Feature Usage',
                    data: Object.values(featureManager.features).map(() => Math.floor(Math.random() * 100)),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createUserActivityChart() {
        const ctx = document.getElementById('userActivityChart');
        if (!ctx) return;

        this.charts.userActivity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Active Users',
                    data: Array(7).fill(0).map(() => Math.floor(Math.random() * 1000)),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            }
        });
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        this.charts.performance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Excellent', 'Good', 'Average', 'Poor'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.update();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.featureManager = new FeatureManager();
    window.analyticsDashboard = new AnalyticsDashboard();
});