// --- 型定義のインポート ---
// サーバーと共通の型定義を読み込みます
import { Message, SendMessageRequest, GetMessagesResponse, ApiResponse } from "../server/types";

// --- DOM要素の取得 ---
// index.html にある要素をIDで取得します
// スライド[cite: 90, 91]の「DOM操作」です

// 型アサーション (as HTMLInputElement) を使い、TypeScriptに「これは入力欄だよ」と教えてあげます
const usernameInput = document.getElementById('username-input') as HTMLInputElement;
const setUsernameBtn = document.getElementById('set-username-btn') as HTMLButtonElement;
const usernameModal = document.getElementById('username-modal') as HTMLDivElement;
const usernameDisplay = document.getElementById('username-display') as HTMLSpanElement;

const messageInput = document.getElementById('message-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
const messagesContainer = document.getElementById('messages') as HTMLDivElement;
const loadingIndicator = document.getElementById('loading') as HTMLDivElement;
const statusIndicator = document.querySelector('.status-indicator') as HTMLSpanElement;

// --- アプリケーションの状態 ---
let currentUsername = 'Guest';
let lastMessageId: string | null = null; // どこまでメッセージを取得したかを記録
const API_BASE_URL = 'http://localhost:3000'; // バックエンドサーバーのアドレス

// --- ユーザー名設定 ---
setUsernameBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim(); // .trim()で前後の空白を削除
    if (username) {
        currentUsername = username;
        usernameDisplay.textContent = username; // 画面右上のユーザー名を更新
        usernameModal.classList.add('hidden'); // モーダルを隠す
        messageInput.disabled = false; // メッセージ入力を有効化
        sendBtn.disabled = false;
        
        // メッセージの読み込みを開始
        showLoading(true);
        fetchMessages();
    }
});

// --- API通信（非同期処理） ---

// メッセージをサーバーから取得する
async function fetchMessages() {
    try {
        // API (GET /messages) を叩く
        const response = await fetch(`${API_BASE_URL}/messages?lastMessageId=${lastMessageId || ''}`);
        
        // サーバーからの応答(JSON)を ApiResponse<GetMessagesResponse> 型として解釈
        const result: ApiResponse<GetMessagesResponse> = await response.json();

        if (result.success && result.data) {
            // 取得成功
            statusIndicator.style.backgroundColor = '#4caf50'; // 接続中(緑)
            result.data.messages.forEach(addMessageToDOM); // メッセージをDOMに追加
            lastMessageId = result.data.lastMessageId; // 最後のIDを更新
        } else {
            console.error('メッセージの取得に失敗:', result.error);
            statusIndicator.style.backgroundColor = '#f44336'; // エラー(赤)
        }
    } catch (error) {
        console.error('通信エラー:', error);
        statusIndicator.style.backgroundColor = '#f44336'; // エラー(赤)
    } finally {
        showLoading(false); // ローディングを非表示
    }
}

// メッセージをサーバーに送信する
async function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return; // 入力が空なら何もしない

    messageInput.disabled = true; // 送信中は入力を無効化
    sendBtn.disabled = true;

    const body: SendMessageRequest = {
        username: currentUsername,
        text: text
    };

    try {
        // API (POST /messages) を叩く
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), // SendMessageRequest オブジェクトをJSON文字列に変換
        });

        const result: ApiResponse<Message> = await response.json();

        if (result.success) {
            // 送信成功（サーバーが返したメッセージをDOMに追加）
            // ※ fetchMessages で取得するので、ここでは追加しない方がシンプル
            messageInput.value = ''; // 入力欄を空にする
        } else {
            alert(`送信失敗: ${result.error}`);
        }
    } catch (error) {
        alert('通信エラーが発生しました。');
    } finally {
        messageInput.disabled = false; // 入力を再度有効化
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

// --- DOM操作: メッセージの表示 ---

// 受け取ったメッセージオブジェクトをHTML要素に変換して追加
function addMessageToDOM(message: Message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // 自分が送信したメッセージかどうかでスタイルを変更
    if (message.username === currentUsername) {
        messageElement.classList.add('my-message');
    }

    const timestamp = new Date(message.timestamp).toLocaleTimeString('ja-JP', {
        hour: '2-digit', minute: '2-digit'
    });

    messageElement.innerHTML = `
        <div class="message-header">
            <span class="message-username">${message.username}</span>
            <span class="message-timestamp">${timestamp}</span>
        </div>
        <p class="message-text">${message.text}</p>
    `;

    messagesContainer.appendChild(messageElement);
    // 自動で一番下にスクロール
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ローディング表示の切り替え
function showLoading(isLoading: boolean) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

// --- イベントの設定 ---
sendBtn.addEventListener('click', sendMessage);

// Enterキーでも送信できるようにする
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// --- メッセージのポーリング（定期取得） ---
// ユーザー名が設定されたら、3秒ごとに新しいメッセージがないか確認
setUsernameBtn.addEventListener('click', () => {
    // ... (既存の処理) ...

    // 定期実行
    setInterval(() => {
        if (!usernameModal.classList.contains('hidden')) {
            // ユーザー名が設定されていなければ何もしない
            return;
        }
        fetchMessages();
    }, 3000); // 3000ミリ秒 = 3秒ごと
});