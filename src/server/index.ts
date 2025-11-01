import express from 'express';
import cors from 'cors';
import { Message, SendMessageRequest, ApiResponse, GetMessagesResponse } from './types'; // 共通の型定義

const app = express();
const port = 3000;

// --- ミドルウェアの設定 ---
app.use(cors()); // CORSを許可（おまじない：異なるドメインからのリクエストを許可）
app.use(express.json()); // POSTリクエストのbody(JSON)を解析できるようにする

// --- データストア（簡易版）---
// 本来はデータベースを使いますが、今回はサーバーのメモリ上に保存します
const messages: Message[] = [];

// --- サーバー起動 ---
app.listen(port, () => {
    console.log(`🚀 サーバーが http://localhost:${port} で起動しました`);
});

// --- API: メッセージ送信 (POST /messages) ---
app.post('/messages', (req, res) => {
    // req.body（リクエストの中身）が SendMessageRequest 型であると期待
    const { username, text } = req.body as SendMessageRequest;

    if (!username || !text) {
        // バリデーション
        const errorResponse: ApiResponse<null> = {
            success: false,
            error: 'ユーザー名とメッセージは必須です。'
        };
        return res.status(400).json(errorResponse);
    }

    // 新しいメッセージオブジェクトを作成
    const newMessage: Message = {
        id: String(Date.now()), // 簡易的なユニークID
        username: username,
        text: text,
        timestamp: Date.now()
    };

    messages.push(newMessage); // メッセージを保存

    // 成功レスポンス（作成したメッセージを返す）
    const successResponse: ApiResponse<Message> = {
        success: true,
        data: newMessage
    };
    res.status(201).json(successResponse);
});

// --- API: メッセージ取得 (GET /messages) ---
app.get('/messages', (req, res) => {
    // クエリパラメータから lastMessageId を受け取る
    const lastId = req.query.lastMessageId as string | undefined;
    
    let messagesToSend: Message[];

    if (lastId) {
        // lastId がある場合、それより新しいメッセージのみをフィルタリング
        const lastIndex = messages.findIndex(m => m.id === lastId);
        messagesToSend = lastIndex === -1 ? messages : messages.slice(lastIndex + 1);
    } else {
        // lastId がない場合、全件（または最新の数件）を返す
        messagesToSend = messages.slice(-50); // 最新50件のみ
    }

    const newLastMessageId = messagesToSend.length > 0 
        ? messagesToSend[messagesToSend.length - 1].id 
        : lastId; // 新しいメッセージがなければIDはそのまま

    const response: ApiResponse<GetMessagesResponse> = {
        success: true,
        data: {
            messages: messagesToSend,
            lastMessageId: newLastMessageId ?? null
        }
    };
    res.status(200).json(response);
});