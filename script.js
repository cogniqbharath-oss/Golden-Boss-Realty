document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Simplified)
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    mobileMenu.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#1A1A1A';
        navLinks.style.padding = '2rem';
    });

    // Chatbot Logic
    const chatTrigger = document.getElementById('chat-trigger');
    const chatbotUi = document.getElementById('chatbot-ui');
    const chatClose = document.querySelector('.chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatChips = document.getElementById('chat-chips');
    const voiceBtn = document.getElementById('voice-btn');
    const autoSpeakToggle = document.getElementById('auto-speak-toggle');

    // Voice Assistant Variables
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let isListening = false;
    let autoSpeak = true; // Auto-read bot responses by default
    let currentUtterance = null;

    let conversationHistory = [];

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Indian English

        recognition.onstart = () => {
            isListening = true;
            voiceBtn.classList.add('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            handleChat();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopListening();
            if (event.error === 'no-speech') {
                addMessage('No speech detected. Please try again.', false);
            }
        };

        recognition.onend = () => {
            stopListening();
        };
    } else {
        // Hide voice button if not supported
        if (voiceBtn) voiceBtn.style.display = 'none';
    }

    const suggestions = {
        initial: ["I want to Buy", "Looking to Invest", "Rent a Property"],
        type: ["Residential", "Commercial", "Plots"],
        location: ["VIP Road", "Nagla Road", "Patiala Road", "High Ground"],
        budget: ["Under 50L", "50L - 1Cr", "Above 1Cr"]
    };

    function showChips(chipList) {
        chatChips.innerHTML = '';
        chipList.forEach(text => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = text;
            chip.onclick = () => {
                chatInput.value = text;
                handleChat();
            };
            chatChips.appendChild(chip);
        });
    }

    chatTrigger.addEventListener('click', () => {
        chatbotUi.style.display = 'flex';
        chatTrigger.style.display = 'none';

        // Initial greeting if history is empty
        if (conversationHistory.length === 0) {
            const welcomeMsg = "Welcome to Golden Boss Realty! Are you looking to Buy, Invest, or Rent a property in Zirakpur today?";
            addMessage(welcomeMsg, false);
            conversationHistory.push({ role: 'assistant', content: welcomeMsg });
            showChips(suggestions.initial);
        }
    });

    chatClose.addEventListener('click', () => {
        chatbotUi.style.display = 'none';
        chatTrigger.style.display = 'flex';
    });

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${isUser ? 'user-msg' : 'bot-msg'}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        conversationHistory.push({ role: 'user', content: text });
        chatInput.value = '';
        chatChips.innerHTML = ''; // Clear chips while waiting

        // Typing indicator
        const typing = document.createElement('div');
        typing.className = 'msg bot-msg dim';
        typing.id = 'typing-indicator';
        typing.textContent = 'Goldie is typing...';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('https://restless-violet-c59a.cogniq-bharath.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: conversationHistory
                })
            });
            const data = await response.json();

            const indicator = document.getElementById('typing-indicator');
            if (indicator) chatMessages.removeChild(indicator);

            const aiResponse = data.response || "I'd love to help you with that. Could you please share your budget and preferred location?";
            addMessage(aiResponse, false);
            conversationHistory.push({ role: 'assistant', content: aiResponse });

            // Speak the response
            speakText(aiResponse);

            // Logic to update chips based on AI response content
            const lowerAI = aiResponse.toLowerCase();
            if (lowerAI.includes("type") || lowerAI.includes("residential")) {
                showChips(suggestions.type);
            } else if (lowerAI.includes("budget")) {
                showChips(suggestions.budget);
            } else if (lowerAI.includes("location")) {
                showChips(suggestions.location);
            } else if (lowerAI.includes("thank you") || lowerAI.includes("advisor")) {
                chatChips.innerHTML = ''; // No more chips for end of flow
            } else {
                // Fallback to budget or location if not specific
                showChips(suggestions.location);
            }

        } catch (error) {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) chatMessages.removeChild(indicator);

            // Try to parse the error message if its JSON
            console.error("Chatbot Error:", error);
            addMessage("Service is currently unavailable. Please check your internet or try again later.");
        }
    }

    chatSend.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Voice Button Event
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceInput);
    }

    // Auto-Speak Toggle Event
    if (autoSpeakToggle) {
        autoSpeakToggle.addEventListener('change', (e) => {
            autoSpeak = e.target.checked;
            if (!autoSpeak && currentUtterance) {
                synthesis.cancel();
            }
        });
    }

    // Voice Assistant Functions
    function toggleVoiceInput() {
        if (!recognition) {
            alert('Voice input is not supported in your browser.');
            return;
        }

        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    function startListening() {
        if (synthesis.speaking) {
            synthesis.cancel();
        }
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
        }
    }

    function stopListening() {
        isListening = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }

    function speakText(text) {
        if (!autoSpeak || !synthesis) return;

        // Cancel any ongoing speech
        synthesis.cancel();

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = 'en-IN';
        currentUtterance.rate = 1.0;
        currentUtterance.pitch = 1.0;
        currentUtterance.volume = 1.0;

        // Visual feedback when speaking
        currentUtterance.onstart = () => {
            chatbotUi.classList.add('speaking');
        };

        currentUtterance.onend = () => {
            chatbotUi.classList.remove('speaking');
            currentUtterance = null;
        };

        currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            chatbotUi.classList.remove('speaking');
        };

        synthesis.speak(currentUtterance);
    }

    // Form Submission
    const enquiryForm = document.getElementById('enquiryForm');
    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your enquiry! Our representative will call you shortly.');
        enquiryForm.reset();
    });
});
