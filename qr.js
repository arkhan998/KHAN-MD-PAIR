const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const {ByteID} = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const {
	default: Byte,
	useMultiFileAuthState,
	jidNormalizedUser,
	Browsers,
	delay,
	makeInMemoryStore,
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
	if (!fs.existsSync(FilePath)) return false;
	fs.rmSync(FilePath, {
		recursive: true,
		force: true
	})
};
const {
	readFile
} = require("node:fs/promises")
router.get('/', async (req, res) => {
	const id = ByteID();
	async function Byte_QR() {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState('./temp/' + id)
		try {
			let DJMODZX = Byte({
				auth: state,
				printQRInTerminal: false,
				logger: pino({
					level: "silent"
				}),
				browser: Browsers.macOS("Desktop"),
			});

			DJMODZX.ev.on('creds.update', saveCreds)
			DJMODZX.ev.on("connection.update", async (s) => {
				const {
					connection,
					lastDisconnect,
					qr
				} = s;
				if (qr) await res.end(await QRCode.toBuffer(qr));
				if (connection == "open") {
					await delay(5000);
					let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
					await delay(800);
				   let b64data = Buffer.from(data).toString('base64');
				   let session = await DJMODZX.sendMessage(DJMODZX.user.id, { text: 'Khan;;;' + b64data });
	
				   let Byte_Text = `
┏━━━━━━━━━━━━━━
┃ *KHAN-MD SUCCESSFULLY LINKED*
┃ *WITH YOUR WHATSAPP*
┗━━━━━━━━━━━━━━━
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
o: || Owner = *Joun Khan*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
o: || Channel = *https://whatsapp.com/channel/0029Vab3snj5kg75cXYgoH2M*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
© Powered BY *DJMODZOFC* `
	 await DJMODZX.sendMessage(DJMODZX.user.id,{text:Byte_Text},{quoted:session})



					await delay(100);
					await DJMODZX.ws.close();
					return await removeFile("temp/" + id);
				} else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
					await delay(10000);
					Byte_QR();
				}
			});
		} catch (err) {
			if (!res.headersSent) {
				await res.json({
					code: "Service Unavailable"
				});
			}
			console.log(err);
			await removeFile("temp/" + id);
		}
	}
	return await Byte_QR()
});
module.exports = router
