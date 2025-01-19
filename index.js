const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const boom = require('@hapi/boom'); // Tambahkan Boom untuk penanganan error

const app = express();
app.use(express.json());

let sock;
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const reason = new boom.Boom(lastDisconnect?.error)?.output?.statusCode;

            if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.connectionClosed) {
                console.log('Clearing authentication state...');
                await sock.logout(); // Bersihkan file autentikasi
                connectToWhatsApp(); // Login ulang
            } else {
                console.log(`Reconnecting due to: ${reason}`);
                setTimeout(() => connectToWhatsApp(), 5000); // Tunggu 5 detik sebelum reconnect
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

(async () => {
    app.post('/send-message', async (req, res) => {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({ error: 'phoneNumber and message are required' });
        }

        try {
            const formattedNumber = phoneNumber.startsWith('62')
                ? `${phoneNumber}@s.whatsapp.net`
                : `62${phoneNumber}@s.whatsapp.net`;

            await sock.sendMessage(formattedNumber, { text: message });
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        } catch (err) {
            console.error('Failed to send message:', err);
            res.status(500).json({ success: false, error: 'Failed to send message' });
        }
    });
})();

app.listen(3000, () => {
    connectToWhatsApp();
    console.log('Server is running on port 3000');
});
