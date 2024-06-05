const axios = require('axios');

module.exports = {
  name: "imgur",
  aurthor: "Miraibot//converted to goatbot by obito"
  description: "Uploads images to Imgur",
  async execute(message) {
    const uid = message.author.id;
    let link;

    if (message.reference && message.reference.messageID) {
      const referencedMessage = await message.channel.messages.fetch(message.reference.messageID);
      if (referencedMessage.attachments.size > 0) {
        link = referencedMessage.attachments.first().url;
      } else {
        return message.channel.send('No attachment detected in the referenced message. Please reply to an image.');
      }
    } else if (message.attachments.size > 0) {
      link = message.attachments.first().url;
    } else {
      return message.channel.send('No attachment detected. Please attach an image or reply to an image.');
    }

    try {
      const res = await axios.get(`http://158.101.198.227:8609/imgur2?link=${encodeURIComponent(link)}`);
      const uploadedLink = res.data.uploaded.image;
      return message.channel.send(`Here is the Imgur link for the image you provided:\n\n${uploadedLink}`);
    } catch (error) {
      console.error("Error uploading image to Imgur:", error);
      return message.channel.send("An error occurred while uploading the image to Imgur.");
    }
  },
};
