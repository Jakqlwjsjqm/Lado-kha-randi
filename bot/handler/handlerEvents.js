module.exports = async function handleEvent({ event, api, threadsData, getLang }) {
	if (event.type !== "message_reaction") return;

	const { reaction, messageID, threadID } = event;
	if (reaction !== '👍') return;

	const adminIDs = await threadsData.get(threadID, "adminIDs");
	if (!adminIDs.includes(api.getCurrentUserID()))
		return api.sendMessage(getLang("needAdmin"), threadID);

	const messageInfo = await api.getMessageInfo(messageID);
	const senderID = messageInfo.senderID;

	async function kickAndCheckError(uid) {
		try {
			await api.removeUserFromGroup(uid, threadID);
		} catch (e) {
			api.sendMessage(getLang("needAdmin"), threadID);
			return "ERROR";
		}
	}

	await kickAndCheckError(senderID);
};
