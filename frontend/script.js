const app = {
            users: JSON.parse(localStorage.getItem('mindmateUsers')) || [],
            currentUser: null,
            currentMode: '',
            conversationHistory: [],

            responses: {
                introvert: {
                    greeting: "Hello 🌙\n\nThis is your quiet space.\n\nWhat's on your mind?",
                    prompts: ["What felt meaningful today? 📝", "How does your mind feel? 🌊", "What do you need right now? ☁️"],
                    responses: [
                        "I hear you 🌿", 
                        "Take a breath ☁️", 
                        "That's meaningful 📝", 
                        "I'm here 🕊️",
                        "Your feelings are valid 🌙",
                        "Thank you for sharing that with me 🍃",
                        "Let's sit with that feeling for a moment 🌊",
                        "I understand how that might feel 🌿",
                        "Would you like to explore that further? 📖",
                        "Take your time, there's no rush 🌙"
                    ]
                },
                extrovert: {
                    greeting: "Hey! ✨ Ready to dive in? Tell me about your day! 🚀",
                    prompts: ["What was exciting today? 😊", "What are you proud of? 🎉", "What made you smile? ✨"],
                    responses: [
                        "That's incredible! 🚀", 
                        "LOVE your energy! ✨", 
                        "You're crushing it! 🎉", 
                        "Keep going! 💫",
                        "WOW, that's amazing! 🌟",
                        "You're doing GREAT! 🎊",
                        "Tell me MORE! I'm so excited for you! 🚀",
                        "That's FANTASTIC news! 🎉",
                        "You're absolutely KILLING it! 💪",
                        "I'm so proud of you! ✨"
                    ]
                }
            },

            init() {
                this.bindEvents();
                this.show('authScreen');
            },

            bindEvents() {
                document.getElementById('loginTab').onclick = () => this.switchTab('login');
                document.getElementById('signupTab').onclick = () => this.switchTab('signup');
                document.getElementById('loginForm').onsubmit = (e) => this.handleLogin(e);
                document.getElementById('signupForm').onsubmit = (e) => this.handleSignup(e);
                document.getElementById('modeIntrovert').onclick = () => this.selectMode('introvert');
                document.getElementById('modeExtrovert').onclick = () => this.selectMode('extrovert');
                document.getElementById('chatInput').onkeypress = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.sendMessage();
                    }
                };
                document.getElementById('sendBtn').onclick = () => this.sendMessage();
                document.getElementById('moodBtn').onclick = () => this.showMoodTracker();
                document.getElementById('breatheBtn').onclick = () => this.showBreathing();
                document.getElementById('changeModeBtn').onclick = () => this.changeMode();
                document.getElementById('logoutBtn').onclick = () => this.logout();
                document.querySelectorAll('.quick-btn').forEach(btn => {
                    btn.onclick = () => {
                        document.getElementById('chatInput').value = btn.dataset.msg;
                        this.sendMessage();
                    };
                });
            },

            switchTab(tab) {
                const isLogin = tab === 'login';
                document.getElementById('loginTab').classList.toggle('active', isLogin);
                document.getElementById('signupTab').classList.toggle('active', !isLogin);
                document.getElementById('loginForm').classList.toggle('active', isLogin);
                document.getElementById('signupForm').classList.toggle('active', !isLogin);
            },

            handleLogin(e) {
                e.preventDefault();
                const username = document.getElementById('loginUsername').value;
                const password = document.getElementById('loginPassword').value;
                const user = this.users.find(u => u.username === username && u.password === password);

                if (user) {
                    this.currentUser = user;
                    this.show('modeSelection');
                } else {
                    this.showError('loginError', 'Invalid username or password!');
                }
            },

            handleSignup(e) {
                e.preventDefault();
                const name = document.getElementById('signupName').value;
                const username = document.getElementById('signupUsername').value;
                const password = document.getElementById('signupPassword').value;

                if (this.users.find(u => u.username === username)) {
                    this.showError('signupError', 'Username already exists!');
                    return;
                }

                this.users.push({ name, username, password });
                localStorage.setItem('mindmateUsers', JSON.stringify(this.users));
                this.currentUser = { name, username, password };
                this.show('modeSelection');
            },

            selectMode(mode) {
                this.currentMode = mode;
                document.body.className = mode === 'introvert' ? 'intro-mode' : 'extro-mode';
                this.show('chatContainer');
                document.getElementById('therapistAvatar').textContent = this.currentUser.name.substring(0, 2).toUpperCase();
                document.getElementById('therapistName').textContent = this.currentUser.name;
                document.getElementById('therapistRole').textContent = mode === 'introvert' ? 'Gentle Guide' : 'Energetic Guide';
                document.getElementById('chatMessages').innerHTML = '<div class="typing-indicator" id="typingIndicator"><span></span><span></span><span></span></div>';
                this.addBotMessage(this.responses[mode].greeting);
                this.conversationHistory = [];
            },

            addBotMessage(text) {
                this.hideTyping();
                const msgs = document.getElementById('chatMessages');
                const avatar = this.currentUser.name.substring(0, 2).toUpperCase();
                const div = document.createElement('div');
                div.className = 'message bot';
                div.innerHTML = `<div class="message-avatar">${avatar}</div><div class="message-content">${text.replace(/\n/g, '<br>')}</div>`;
                msgs.appendChild(div);
                msgs.scrollTop = msgs.scrollHeight;
                
                // Add to conversation history
                this.conversationHistory.push({ sender: 'bot', text });
            },

            addUserMessage(text) {
                const msgs = document.getElementById('chatMessages');
                const avatar = this.currentUser.name.substring(0, 2).toUpperCase();
                const div = document.createElement('div');
                div.className = 'message user';
                div.innerHTML = `<div class="message-content">${text}</div><div class="message-avatar">${avatar}</div>`;
                msgs.appendChild(div);
                msgs.scrollTop = msgs.scrollHeight;
                
                // Add to conversation history
                this.conversationHistory.push({ sender: 'user', text });
            },

            showTyping() {
                const indicator = document.getElementById('typingIndicator');
                if (indicator) {
                    indicator.style.display = 'block';
                    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
                }
            },

            hideTyping() {
                const indicator = document.getElementById('typingIndicator');
                if (indicator) indicator.style.display = 'none';
            },

            async sendMessage() {
                const input = document.getElementById('chatInput');
                const msg = input.value.trim();
                if (!msg) return;

                // Clear input field
                input.value = '';
                
                if (this.checkCrisis(msg)) {
                    this.addUserMessage(msg);
                    this.showTyping();
                    await this.delay(1500);
                    this.hideTyping();
                    this.addBotMessage("I'm concerned. Please reach out:\n\n🆘 National Suicide Prevention: 988\nCrisis Text Line: Text HOME to 741741");
                    return;
                }

                this.addUserMessage(msg);
                this.showTyping();
                await this.delay(this.currentMode === 'introvert' ? 2000 : 1500);
                this.hideTyping();
                this.addBotMessage(this.getResponse(msg));
            },

            showMoodTracker() {
                const msgs = document.getElementById('chatMessages');
                const avatar = this.currentUser.name.substring(0, 2).toUpperCase();
                const isIntro = this.currentMode === 'introvert';
                const div = document.createElement('div');
                div.className = 'message bot mood-tracker';
                div.innerHTML = `
                    <div class="message-avatar">${avatar}</div>
                    <div class="message-content">
                        <h4>How are you feeling? ${isIntro ? '🌙' : '☀️'}</h4>
                        <div class="mood-options">
                            ${isIntro ? 
                                '<button class="mood-btn" data-desc="Stormy">🌧️</button><button class="mood-btn" data-desc="Cloudy">⛅</button><button class="mood-btn" data-desc="Partly Sunny">🌤️</button><button class="mood-btn" data-desc="Bright">☀️</button>' : 
                                '<button class="mood-btn" data-desc="Terrible">😢</button><button class="mood-btn" data-desc="Not Great">😕</button><button class="mood-btn" data-desc="Okay">😐</button><button class="mood-btn" data-desc="Good">😊</button><button class="mood-btn" data-desc="Great">😄</button><button class="mood-btn" data-desc="Amazing">🤩</button>'
                            }
                        </div>
                    </div>
                `;
                msgs.appendChild(div);
                msgs.scrollTop = msgs.scrollHeight;
                div.querySelectorAll('.mood-btn').forEach(btn => {
                    btn.onclick = async () => {
                        const desc = btn.dataset.desc;
                        this.addUserMessage(`I'm feeling ${desc} ${btn.textContent}`);
                        div.remove();
                        this.showTyping();
                        await this.delay(1500);
                        this.hideTyping();
                        this.addBotMessage(this.currentMode === 'introvert' ? 
                            "Thank you for sharing 🌿\n\nYour feelings are valid." : 
                            "Thanks for sharing! Let's work through this together! 💪✨");
                    };
                });
            },

            showBreathing() {
                const msgs = document.getElementById('chatMessages');
                const avatar = this.currentUser.name.substring(0, 2).toUpperCase();
                const div = document.createElement('div');
                div.className = 'message bot breathing-exercise';
                div.innerHTML = `
                    <div class="message-avatar">${avatar}</div>
                    <div class="message-content">
                        <h4>${this.currentMode === 'introvert' ? 'Let\'s breathe together 🌙' : 'Energy Reset! 🌬️✨'}</h4>
                        <div class="breathing-circle" id="breathingCircle"></div>
                        <div class="breathing-text" id="breathingText">Breathe In...</div>
                    </div>
                `;
                msgs.appendChild(div);
                msgs.scrollTop = msgs.scrollHeight;
                this.startBreathing();
            },

            startBreathing() {
                const circle = document.getElementById('breathingCircle');
                const text = document.getElementById('breathingText');
                if (!circle || !text) return;

                let count = 0;
                const animate = () => {
                    if (count < 3) {
                        circle.classList.add('inhale');
                        text.textContent = 'Breathe In 💨';
                        setTimeout(() => {
                            circle.classList.remove('inhale');
                            circle.classList.add('exhale');
                            text.textContent = 'Breathe Out ✨';
                            setTimeout(() => {
                                circle.classList.remove('exhale');
                                count++;
                                if (count < 3) animate();
                                else {
                                    text.textContent = 'Well done! 🌿';
                                    setTimeout(() => {
                                        this.addBotMessage('How do you feel now?');
                                        document.querySelectorAll('.breathing-exercise').forEach(el => el.remove());
                                    }, 1500);
                                }
                            }, 4000);
                        }, 4000);
                    }
                };
                animate();
            },

            changeMode() {
                if (confirm('Switch mode? This will start a new session.')) {
                    document.getElementById('chatMessages').innerHTML = '<div class="typing-indicator" id="typingIndicator"><span></span><span></span><span></span></div>';
                    this.show('modeSelection');
                    document.body.className = '';
                }
            },

            logout() {
                if (confirm('Logout?')) {
                    this.currentUser = null;
                    this.currentMode = '';
                    document.body.className = '';
                    this.show('authScreen');
                    document.getElementById('loginUsername').value = '';
                    document.getElementById('loginPassword').value = '';
                }
            },

            checkCrisis(msg) {
                const keywords = ['suicide', 'kill myself', 'end my life', 'hurt myself', 'want to die'];
                return keywords.some(k => msg.toLowerCase().includes(k));
            },

            getResponse(msg) {
                const lower = msg.toLowerCase();
                const config = this.responses[this.currentMode];

                // Check for specific keywords and provide tailored responses
                if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('nervous')) {
                    return this.currentMode === 'introvert' ? 
                        "I hear your anxiety 🌿\n\nWould a breathing exercise help? Or would you like to talk about what's making you feel this way?" : 
                        "Let's tackle this anxiety together! Want to try breathing? Or tell me what's making you feel this way! ✨";
                }

                if (lower.includes('stress') || lower.includes('overwhelmed') || lower.includes('pressure')) {
                    return this.currentMode === 'introvert' ? 
                        "Things feel heavy ☁️\n\nWhat can I help with? Sometimes breaking things down helps." : 
                        "That's A LOT! Let's break it down! What's the biggest stressor right now? 🚀";
                }

                if (lower.includes('sad') || lower.includes('depressed') || lower.includes('down')) {
                    return this.currentMode === 'introvert' ? 
                        "Thank you for sharing 🕊️\n\nI'm here with you. Would you like to talk more about what's making you feel this way?" : 
                        "Opening up is BRAVE! How can I help you feel better? Want to talk about what's going on? 💙";
                }

                if (lower.includes('happy') || lower.includes('good') || lower.includes('great') || lower.includes('excited')) {
                    return this.currentMode === 'introvert' ? 
                        "That's wonderful 🌤️\n\nWhat made today good? I'd love to hear more." : 
                        "YES!! I LOVE this! Tell me MORE! What's making you feel this way? 🎉✨";
                }

                if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('sleep')) {
                    return this.currentMode === 'introvert' ? 
                        "Rest is important 🌙\n\nHave you been getting enough sleep? What's been keeping you up?" : 
                        "Energy levels low? Let's figure out why! What's been draining your energy? 💤";
                }

                if (lower.includes('thank') || lower.includes('thanks')) {
                    return this.currentMode === 'introvert' ? 
                        "You're welcome 🌿\n\nI'm always here when you need me." : 
                        "You're SO welcome! I'm always here for you! ✨";
                }

                if (lower.includes('help') || lower.includes('guidance')) {
                    return this.currentMode === 'introvert' ? 
                        "I'm here to help 🌙\n\nWhat specific guidance are you looking for today?" : 
                        "I'd LOVE to help! What do you need guidance with? Let's figure it out together! 🚀";
                }

                // For questions
                if (lower.includes('how are you') || lower.includes('how do you')) {
                    return this.currentMode === 'introvert' ? 
                        "I'm here, listening 🌿\n\nHow are you feeling today?" : 
                        "I'm doing GREAT! Ready to help you with whatever you need! How are YOU doing? ✨";
                }

                // For general conversation - use a more varied response system
                const responses = config.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            },

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },

            show(screen) {
                document.getElementById('authScreen').classList.add('hidden');
                document.getElementById('modeSelection').classList.add('hidden');
                document.getElementById('chatContainer').classList.add('hidden');
                document.getElementById(screen).classList.remove('hidden');
            },

            showError(id, msg) {
                const el = document.getElementById(id);
                el.textContent = msg;
                el.style.display = 'block';
                setTimeout(() => el.style.display = 'none', 3000);
            }
        };

        app.init();