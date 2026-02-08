export interface IChatRequest {
    message: string;
    sessionId: string;
}

export interface IChatResponse {
    response: string;
}

export interface IMessage {
	id: number;
	date: string;
	type: MessageType;
	message: string;
}

export enum MessageType {
    USER = "user",
    BOT = "bot"
}