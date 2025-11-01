export interface Message {
    id: string;
    username: string;
    text: string;
    timestamp: number;
}

export interface SendMessageRequest {
    username: string;
    text: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface GetMessagesResponse {
    messages: Message[];
    lastMessageId: string | null;
}