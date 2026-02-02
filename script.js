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

    let conversationHistory = [];

    chatTrigger.addEventListener('click', () => {
        chatbotUi.style.display = 'flex';
        chatTrigger.style.display = 'none';

        // Initial greeting if history is empty
        if (conversationHistory.length === 0) {
            const welcomeMsg = "Welcome to Golden Boss Realty! Are you looking to Buy, Invest, or Rent a property in Zirakpur today?";
            addMessage(welcomeMsg, false);
            conversationHistory.push({ role: 'assistant', content: welcomeMsg });
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

        } catch (error) {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) chatMessages.removeChild(indicator);
            addMessage("I'm having trouble connecting at the moment. Please feel free to call our Senior Advisor at +91 84333 73100.");
        }
    }

    chatSend.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Form Submission
    const enquiryForm = document.getElementById('enquiryForm');
    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your enquiry! Our representative will call you shortly.');
        enquiryForm.reset();
    });
});
