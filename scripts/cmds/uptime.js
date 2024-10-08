const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "uptime",
        aliases: ["up", "upt"],
        version: "1.0",
        author: "Itachi",//-modified by dinesh
        role: 0,
        shortDescription: {
            en: "Displays the uptime of the bot."
        },
        longDescription: {
            en: "Displays the amount of time that the bot has been running for."
        },
        category: "System",
        guide: {
            en: "Use {p}uptime to display the uptime of the bot."
        }
    },
    onStart: async function ({ api, event, args }) {
        const videoUrls = [
            'https://i.imgur.com/k5py3Tj.mp4',
            'https://i.imgur.com/2Fz5gXT.mp4',
            'https://i.imgur.com/JbVg4Ld.mp4'
    ];

        // Randomly select one video URL
        const randomIndex = Math.floor(Math.random() * videoUrls.length);
        const selectedVideoUrl = videoUrls[randomIndex];

        const tmpFolderPath = './tmp'; // Ensure this path exists or create it dynamically if needed

        // Ensure the tmp folder exists
        if (!fs.existsSync(tmpFolderPath)) {
            fs.mkdirSync(tmpFolderPath);
        }

        try {
            const videoResponse = await axios.get(selectedVideoUrl, { responseType: 'arraybuffer' });
            const videoPath = path.join(tmpFolderPath, 'uptime_video.mp4');
            fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

            const uptime = process.uptime();
            const seconds = Math.floor(uptime % 60);
            const minutes = Math.floor((uptime / 60) % 60);
            const hours = Math.floor((uptime / (60 * 60)) % 24);
            const days = Math.floor(uptime / (60 * 60 * 24));
            const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

            const message = {
                body: `Hello Master 😸

                                      Your Bot has been running for

${uptimeString}.`,
                attachment: fs.createReadStream(videoPath)
            };

            api.sendMessage(message, event.threadID);
        } catch (error) {
            console.error('Error fetching video:', error);
            api.sendMessage('Sorry, there was an error fetching the video.', event.threadID);
        }
    }
};
