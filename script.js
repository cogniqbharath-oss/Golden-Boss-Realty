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

    chatTrigger.addEventListener('click', () => {
        chatbotUi.style.display = 'flex';
        chatTrigger.style.display = 'none';
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
        chatInput.value = '';

        // Typing indicator
        const typing = document.createElement('div');
        typing.className = 'msg bot-msg dim';
        typing.textContent = '...searching listings';
        chatMessages.appendChild(typing);

        try {
            // Updated to the provided Cloudflare Worker URL
            const response = await fetch('https://restless-violet-c59a.cogniq-bharath.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: text }]
                })
            });
            const data = await response.json();
            chatMessages.removeChild(typing);
            addMessage(data.response || "I'm interested! Let's discuss this.");
        } catch (error) {
            chatMessages.removeChild(typing);
            addMessage("I'm having trouble connecting. Feel free to call us at +91 84333 73100.");
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
