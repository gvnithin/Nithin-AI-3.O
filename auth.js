// auth.js - User Authentication
class NithinAuth {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.bindAuthEvents();
    }

    bindAuthEvents() {
        document.getElementById('login-btn')?.addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('signup-btn')?.addEventListener('click', () => this.showAuthModal('signup'));
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            // Simulate authentication (replace with actual API call)
            const user = { name: "User", email: email, plan: "free" };
            this.currentUser = user;
            this.isLoggedIn = true;
            this.createSession(user);
            this.hideAuthModal();
            this.updateUI();
            this.showNotification('Login successful!', 'success');
        } catch (error) {
            this.showNotification('Login failed', 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            // Simulate registration
            const user = { name: name, email: email, plan: "free" };
            this.currentUser = user;
            this.isLoggedIn = true;
            this.createSession(user);
            this.hideAuthModal();
            this.updateUI();
            this.showNotification('Account created!', 'success');
        } catch (error) {
            this.showNotification('Signup failed', 'error');
        }
    }

    createSession(user) {
        localStorage.setItem('nithin_ai_user', JSON.stringify(user));
    }

    clearSession() {
        localStorage.removeItem('nithin_ai_user');
        this.currentUser = null;
        this.isLoggedIn = false;
        this.updateUI();
    }

    checkExistingSession() {
        const savedUser = localStorage.getItem('nithin_ai_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.updateUI();
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');
        const usageLimits = document.getElementById('usage-limits');
        
        if (this.isLoggedIn && this.currentUser) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            usageLimits.style.display = 'block';
            userInfo.innerHTML = `Welcome, ${this.currentUser.name}`;
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            usageLimits.style.display = 'none';
            userInfo.innerHTML = '';
        }
    }

    logout() {
        this.clearSession();
        this.showNotification('Logged out', 'success');
    }

    showAuthModal(mode) {
        // Create modal HTML
        const modalHTML = `
            <div id="auth-modal" class="auth-modal">
                <div class="auth-modal-content">
                    <span class="auth-close">&times;</span>
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Login</button>
                        <button class="auth-tab" data-tab="signup">Sign Up</button>
                    </div>
                    <form id="login-form" class="auth-form">
                        <h3>Welcome Back</h3>
                        <input type="email" id="login-email" placeholder="Email" required>
                        <input type="password" id="login-password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                    <form id="signup-form" class="auth-form" style="display: none;">
                        <h3>Create Account</h3>
                        <input type="text" id="signup-name" placeholder="Full Name" required>
                        <input type="email" id="signup-email" placeholder="Email" required>
                        <input type="password" id="signup-password" placeholder="Password" required>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));
        document.querySelector('.auth-close').addEventListener('click', () => this.hideAuthModal());
        
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                document.getElementById('login-form').style.display = tabName === 'login' ? 'block' : 'none';
                document.getElementById('signup-form').style.display = tabName === 'signup' ? 'block' : 'none';
            });
        });
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.remove();
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `${message} <button onclick="this.parentElement.remove()">&times;</button>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

let nithinAuth;
