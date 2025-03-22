// Theme Management
class ThemeManager {
    constructor() {
        this.darkMode = false;
        this.initTheme();
    }

    initTheme() {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.enableDarkMode();
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches) {
                this.enableDarkMode();
            } else {
                this.disableDarkMode();
            }
        });
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        this.darkMode = true;
        localStorage.setItem('theme', 'dark');
    }

    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        this.darkMode = false;
        localStorage.setItem('theme', 'light');
    }

    toggleTheme() {
        if (this.darkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
}

// 3D Animation Manager
class AnimationManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.objects = [];
        this.init();
    }

    init() {
        // Set up renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add to DOM
        const container = document.querySelector('.hero-section');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }

        // Camera position
        this.camera.position.z = 5;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Start animation loop
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Animate objects
        this.objects.forEach(obj => {
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
        });

        this.renderer.render(this.scene, this.camera);
    }

    addObject(geometry, material) {
        const mesh = new THREE.Mesh(geometry, material);
        this.objects.push(mesh);
        this.scene.add(mesh);
        return mesh;
    }
}

// Form Validation
class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    }

    static showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }

    static clearErrors(form) {
        const errors = form.querySelectorAll('.text-red-500');
        errors.forEach(error => error.remove());
    }
}

// API Service
class APIService {
    static async signup(userData) {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }

    static async login(credentials) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}

// UI Components
class UIComponents {
    static createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold mb-4">${title}</h2>
                <div>${content}</div>
                <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
        
        modal.querySelector('button').addEventListener('click', () => {
            modal.remove();
        });

        return modal;
    }

    static createToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);

        return toast;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Initialize 3D animations
    const animationManager = new AnimationManager();

    // Add event listeners
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            FormValidator.clearErrors(signupForm);

            const email = signupForm.querySelector('[name="email"]').value;
            const password = signupForm.querySelector('[name="password"]').value;

            if (!FormValidator.validateEmail(email)) {
                FormValidator.showError(signupForm.querySelector('[name="email"]'), 'Please enter a valid email');
                return;
            }

            if (!FormValidator.validatePassword(password)) {
                FormValidator.showError(signupForm.querySelector('[name="password"]'), 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
                return;
            }

            try {
                const response = await APIService.signup({ email, password });
                UIComponents.createToast('Signup successful!');
            } catch (error) {
                UIComponents.createToast('Signup failed. Please try again.', 'error');
            }
        });
    }

    // Theme toggle button
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggleTheme();
        });
    }
});