export interface IChatRequest {
    message: string;
}

export interface IChatResponse {
    response: string;
}

export interface IMessage {
	id: number;
	type: string;
	message: string;
}