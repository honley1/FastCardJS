const TelegramBot = require('node-telegram-bot-api');


const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN);

const ADMIN_ID = process.env.ADMIN_ID.split(',').map(id => parseInt(id, 10));

async function sendApplication(fullName, phoneNumber, username) {
    const text = `Новая заявка от: *${username}*\nИмя: *${fullName}*\nТелефон: *${phoneNumber}*`;
    for (const adminId of ADMIN_ID) {
        await bot.sendMessage(adminId, text, { parse_mode: 'MarkdownV2' });
    }
}

module.exports = { sendApplication };
