// config.js - Built-in API Configuration
const NITHIN_AI_CONFIG = {
    API_KEYS: {
        groq: [
            "gsk_1234567890abcdef1234567890abcdef1234567890abcdef",
            "gsk_abcdef1234567890abcdef1234567890abcdef1234567890"
        ],
        huggingFace: [
            "hf_1234567890abcdef1234567890abcdef1234567890abcdef",
            "hf_abcdef1234567890abcdef1234567890abcdef1234567890"
        ],
        openRouter: [
            "sk-or-1234567890abcdef1234567890abcdef1234567890abcdef",
            "sk-or-abcdef1234567890abcdef1234567890abcdef1234567890"
        ]
    },
    GOOGLE_SHEETS: {
        SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyvWP3BvfnZOOip4QmKLO7RU6YiO-_g2H405T_M5J4KDnlJF3EW7-nIhMsp8gZPogqJ/exec",
        SHEET_ID: "1mIKl7M9YnQogG0K_g4YZrgoLwg0hdi2aZPYGbeWPyFY"
    },
    FEATURES: {
        FREE_TIER_LIMITS: {
            daily_requests: 50,
            max_text_length: 2000,
            max_image_generations: 10
        }
    },
    MODELS: {
        groq: "llama3-70b-8192",
        huggingFace: {
            text: "microsoft/DialoGPT-large",
            image: "runwayml/stable-diffusion-v1-5"
        },
        openRouter: "anthropic/claude-3-sonnet"
    }
};

// API Key Rotation System
class APIRotation {
    constructor(service) {
        this.service = service;
        this.keys = NITHIN_AI_CONFIG.API_KEYS[service] || [];
        this.currentIndex = 0;
        this.failedKeys = new Set();
    }

    getNextKey() {
        if (this.keys.length === 0) return null;
        let attempts = 0;
        while (attempts < this.keys.length) {
            const key = this.keys[this.currentIndex];
            this.currentIndex = (this.currentIndex + 1) % this.keys.length;
            if (!this.failedKeys.has(key)) return key;
            attempts++;
        }
        this.failedKeys.clear();
        return this.keys[0];
    }

    markKeyFailed(key) { this.failedKeys.add(key); }
    markKeySuccess(key) { this.failedKeys.delete(key); }
}

const groqRotator = new APIRotation('groq');
const hfRotator = new APIRotation('huggingFace');
const openRouterRotator = new APIRotation('openRouter');
