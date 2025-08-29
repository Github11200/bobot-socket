export function degToRad(degrees: number) {
	return degrees * (Math.PI / 180);
}

export function blobToMessagesParams(blobString: string): string[][] {
	const messagesParams: string[][] = [];
	const messages = blobString.split('%');
	for (const message of messages) messagesParams.push(message.split(','));
	return messagesParams;
}

