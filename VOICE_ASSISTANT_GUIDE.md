# AI Voice Assistant Integration - Golden Boss Realty

## Overview
I've successfully integrated a comprehensive AI voice assistant into your chatbot. The voice assistant includes both **speech-to-text** (voice input) and **text-to-speech** (voice output) capabilities.

## Features Implemented

### 1. **Voice Input (Speech-to-Text)**
- Click the microphone button to start voice input
- Speak your query in English (optimized for Indian English)
- The chatbot will automatically transcribe and process your speech
- Visual feedback: The microphone button turns red and pulses while listening

### 2. **Voice Output (Text-to-Speech)**
- Bot responses are automatically read aloud
- Natural-sounding voice in Indian English accent
- Can be toggled on/off using the speaker icon in the chat header

### 3. **Visual Feedback**
- **Listening State**: Red pulsing microphone button with animation
- **Speaking State**: Animated gradient effect on the chat header
- **Toggle Switch**: Shows current state of auto-speak feature

### 4. **User Controls**
- **Microphone Button**: Located in the chat input area
  - Click to start/stop voice input
  - Changes icon when listening (microphone-slash)
  - Red pulsing animation while active
  
- **Auto-Speak Toggle**: Located in the chat header
  - Toggle switch with speaker icon
  - Enable/disable automatic voice responses
  - Checked by default (voice enabled)

## How to Use

### Starting a Voice Conversation
1. Open the chatbot by clicking the chat trigger button (bottom-right)
2. Click the microphone button in the input area
3. Speak your query clearly
4. The bot will transcribe, process, and respond both visually and verbally

### Disabling Voice Output
1. Click the toggle switch in the chat header (next to the close button)
2. The bot will stop reading responses aloud
3. You can still use voice input

### Manual Text Input
- You can still type messages manually
- Voice and text input work seamlessly together

## Technical Details

### Browser Compatibility
- **Voice Input**: Requires Chrome, Edge, or Safari (uses Web Speech API)
- **Voice Output**: Works in all modern browsers (uses Speech Synthesis API)
- Graceful degradation: If voice input is not supported, the microphone button is hidden

### Language Settings
- **Recognition Language**: `en-IN` (Indian English)
- **Speech Language**: `en-IN` (Indian English)
- **Speech Rate**: 1.0 (normal speed)
- **Speech Pitch**: 1.0 (normal pitch)
- **Speech Volume**: 1.0 (maximum)

### Error Handling
- "No speech detected" message if no voice is heard
- Automatic stop if recognition fails
- Console logging for debugging

## Files Modified

### 1. `script.js`
- Added speech recognition initialization
- Implemented voice input toggle function
- Added text-to-speech functionality
- Integrated visual feedback for listening/speaking states

### 2. `index.html`
- Added voice input button in chat input area
- Added auto-speak toggle switch in chat header
- Updated placeholder text to indicate voice capability

### 3. `style.css`
- Styled voice button with hover and listening states
- Created pulsing animation for active listening
- Designed toggle switch for auto-speak control
- Added speaking state gradient animation for chat header

## Testing Instructions

1. **Start the local server**:
   ```bash
   python server.py
   ```

2. **Open in browser**:
   - Navigate to `http://localhost:8000`
   - Use Chrome, Edge, or Safari for full voice support

3. **Test Voice Input**:
   - Open the chatbot
   - Click the microphone button
   - Say: "I want to buy a property in Zirakpur"
   - Verify the text appears and bot responds

4. **Test Voice Output**:
   - Ensure auto-speak is enabled (toggle is ON)
   - Send any message
   - Listen for the bot's voice response

5. **Test Toggle**:
   - Click the speaker toggle to disable voice
   - Send a message - no voice should play
   - Toggle back on and verify voice returns

## Browser Permissions

When you first use voice input, the browser will ask for microphone permission:
- Click "Allow" to enable voice features
- This permission is remembered for future visits

## Customization Options

You can customize the voice settings in `script.js`:

```javascript
// Change speech rate (0.1 to 10)
currentUtterance.rate = 1.0; // 1.0 is normal speed

// Change pitch (0 to 2)
currentUtterance.pitch = 1.0; // 1.0 is normal pitch

// Change volume (0 to 1)
currentUtterance.volume = 1.0; // 1.0 is maximum

// Change language
currentUtterance.lang = 'en-IN'; // Indian English
// Other options: 'en-US', 'en-GB', 'hi-IN', etc.
```

## Known Limitations

1. **Voice Recognition Accuracy**: Depends on:
   - Microphone quality
   - Background noise
   - Accent and pronunciation
   - Internet connection (for some browsers)

2. **Browser Support**:
   - Voice input works best in Chrome/Edge
   - Safari has limited support
   - Firefox doesn't support Web Speech API

3. **Continuous Listening**: 
   - Current implementation uses single-shot recognition
   - Click microphone for each query

## Future Enhancements (Optional)

If you want to add more features:
- Wake word detection ("Hey Goldie")
- Continuous conversation mode
- Voice activity detection
- Multiple language support
- Voice selection (male/female voices)
- Speed and pitch controls in UI

## Troubleshooting

### Voice Input Not Working
- Check browser compatibility (use Chrome/Edge)
- Ensure microphone permission is granted
- Check microphone is not used by another app
- Look for errors in browser console (F12)

### Voice Output Not Working
- Verify auto-speak toggle is ON
- Check browser volume is not muted
- Try different browser
- Check console for synthesis errors

### Button Not Visible
- If microphone button is hidden, browser doesn't support voice input
- Use a compatible browser (Chrome/Edge recommended)

## Demo Workflow

Here's a complete conversation flow:

1. **User clicks chat trigger** → Chatbot opens
2. **Bot greets** → "Welcome to Golden Boss Realty..." (spoken aloud)
3. **User clicks microphone** → Button turns red and pulses
4. **User speaks** → "I want to buy a 3BHK in VIP Road"
5. **Bot transcribes** → Text appears in chat
6. **Bot responds** → Message + voice response
7. **User can toggle voice off** → Click speaker toggle
8. **Continue conversation** → Mix of voice and text

## Support

The voice assistant is fully integrated and ready to use. Simply open the website in a compatible browser and start chatting!

For any issues or customization requests, check the browser console for detailed error messages.
