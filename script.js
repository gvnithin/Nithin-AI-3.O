// script.js - Main Nithin AI Application
class NithinAI {
    constructor() {
        this.currentResponse = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateInputVisibility();
        nithinAuth = new NithinAuth();
    }

    bindEvents() {
        document.getElementById('input-type').addEventListener('change', () => this.updateInputVisibility());
        document.getElementById('generate-btn').addEventListener('click', () => this.handleGenerate());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearOutput());
        document.getElementById('copy-btn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadResponse());
    }

    updateInputVisibility() {
        const inputType = document.getElementById('input-type').value;
        document.querySelectorAll('.input-area').forEach(area => area.classList.remove('active'));
        document.getElementById(`${inputType}-input`).classList.add('active');
    }

    async handleGenerate() {
        if (!nithinAuth.isLoggedIn) {
            nithinAuth.showNotification('Please login first', 'error');
            nithinAuth.showAuthModal('login');
            return;
        }

        const inputType = document.getElementById('input-type').value;
        const outputType = document.getElementById('output-type').value;
        const generateBtn = document.getElementById('generate-btn');
        const btnText = generateBtn.querySelector('.btn-text');
        const spinner = generateBtn.querySelector('.loading-spinner');

        btnText.textContent = 'Generating...';
        spinner.style.display = 'block';
        generateBtn.disabled = true;

        try {
            let response;
            const prompt = document.getElementById('prompt-input').value;
            
            if (!prompt.trim()) throw new Error('Please enter a prompt');
            
            response = await this.generateText(prompt, outputType);
            this.displayResponse(response, outputType);
            nithinAuth.showNotification('Generated successfully!', 'success');
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            btnText.textContent = 'Generate';
            spinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    }

    async generateText(prompt, outputType) {
        const key = groqRotator.getNextKey();
        if (!key) throw new Error('Service temporarily unavailable');

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: NITHIN_AI_CONFIG.MODELS.groq,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 2048
                })
            });

            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            groqRotator.markKeySuccess(key);
            return data.choices[0].message.content;
            
        } catch (error) {
            groqRotator.markKeyFailed(key);
            throw error;
        }
    }

    displayResponse(response, outputType) {
        const outputContent = document.getElementById('output-content');
        this.currentResponse = response;

        if (outputType === 'code') {
            outputContent.innerHTML = `
                <div class="code-response">
                    <h4>💻 Generated Code</h4>
                    <div class="code-block">
                        <pre><code class="language-javascript">${this.formatCode(response)}</code></pre>
                    </div>
                </div>
            `;
            hljs.highlightAll();
        } else {
            const formattedText = marked.parse(response);
            outputContent.innerHTML = `<div class="ai-response">${formattedText}</div>`;
        }
    }

    formatCode(code) {
        return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    showError(message) {
        const outputContent = document.getElementById('output-content');
        outputContent.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    }

    clearOutput() {
        document.getElementById('output-content').innerHTML = `
            <div class="welcome-message">
                <h4>🚀 Welcome to Nithin AI!</h4>
                <p>Select your input/output types and start creating!</p>
            </div>
        `;
    }

    async copyToClipboard() {
        if (!this.currentResponse) return;
        await navigator.clipboard.writeText(this.currentResponse);
        nithinAuth.showNotification('Copied to clipboard!', 'success');
    }

    downloadResponse() {
        if (!this.currentResponse) return;
        const blob = new Blob([this.currentResponse], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nithin-ai-response.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new NithinAI();
});
