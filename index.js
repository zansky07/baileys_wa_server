const {makeWASocket,  DisconnectReason, useMultiFileAuthState} = require ('@whiskeysockets/baileys')
const express = require('express');

const app = express();
app.use(express.json()); // untuk parsing JSON dari request

let sock;
async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    
    sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on ('creds.update', saveCreds)
}

(async () => {
    
    app.post('/send-message', async (req, res) => {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({ error: 'phoneNumber and message are required' });
        }

        try {
            const formattedNumber = phoneNumber.startsWith('62') ? `${phoneNumber}@s.whatsapp.net` : `62${phoneNumber}@s.whatsapp.net`;
            await sock.sendMessage(formattedNumber, { text: message });
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Failed to send message' });
        }
    });
})();
// run in main file
app.listen(3000, () => {
    connectToWhatsApp()
    console.log('Server is running on port 3000');
});