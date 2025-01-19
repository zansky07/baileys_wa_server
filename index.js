const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');

const app = express();
app.use(express.json()); // untuk parsing JSON dari request

let sock;

async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

        sock = makeWASocket({
            printQRInTerminal: true,
            auth: state
        });

        // Event handler untuk update koneksi
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
        
            if (connection === 'close') {
                const error = lastDisconnect?.error;
                const statusCode = error?.output?.statusCode;
        
                console.log('Connection closed due to', error?.message || 'unknown reason', ', reconnecting', statusCode !== DisconnectReason.loggedOut);
        
                if (statusCode === 440) {
                    console.log('Stream error detected (conflict). Clearing authentication state...');
                    // Hapus kredensial yang disimpan jika ada konflik
                    await sock?.logout();
                }
        
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    await connectToWhatsApp();
                }
            } else if (connection === 'open') {
                console.log('Connected to WhatsApp');
            }
        });
        

        // Event handler untuk error
        sock.ev.on('error', (err) => {
            console.error('Error occurred in Baileys:', err);
        });

        // Menyimpan kredensial
        sock.ev.on('creds.update', saveCreds);

        // Menjaga koneksi tetap aktif dengan ping alternatif
        setInterval(() => {
            if (sock?.ws?.readyState === 1) { // Cek apakah websocket aktif
                sock.sendPresenceUpdate('available'); // Kirim status 'available' untuk menjaga koneksi
                console.log('Sent keep-alive signal to WhatsApp');
            }
        }, 10000); // Kirim setiap 10 detik
    } catch (err) {
        console.error('Failed to connect to WhatsApp:', err);
    }
}

(async () => {
    // Endpoint untuk mengirim pesan
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

// Menjalankan server pada port yang dinamis
const PORT = 3000;
app.listen(PORT, () => {
    connectToWhatsApp();
    console.log(`Server is running on port ${PORT}`);
});
