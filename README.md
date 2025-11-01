# 💬 TypeScript Chat App

TypeScriptで作成されたリアルタイムチャットアプリケーションです。DOM操作とバックエンドAPI連携の学習用プロジェクトです。

## ✨ 機能

- ✅ リアルタイムメッセージング（ポーリング方式）
- ✅ ユーザー名の設定
- ✅ メッセージの送受信
- ✅ タイムスタンプ表示
- ✅ レスポンシブデザイン
- ✅ TypeScriptによる型安全な実装

## 🛠 技術スタック

### フロントエンド
- TypeScript
- 素のDOM操作（フレームワークなし）
- CSS3（グラデーション、アニメーション）

### バックエンド
- Node.js
- Express.js
- TypeScript
- CORS対応

### 開発ツール
- GitHub Actions（CI/CD）
- nodemon（開発時のホットリロード）
- ts-node（TypeScript実行環境）

## 📋 必要な環境

- Node.js 18.x 以上
- npm 9.x 以上

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/chat-app-typescript.git
cd chat-app-typescript
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. TypeScriptのビルド

```bash
# サーバーのビルド
npm run build

# クライアントのビルド
npm run build:client
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開くとアプリが表示されます。

## 📦 本番環境での起動

```bash
# ビルド
npm run build
npm run build:client

# 起動
npm start
```

## 🎯 学習ポイント

### DOM操作
- `document.getElementById()` によるDOM要素の取得
- `createElement()` による動的な要素作成
- `addEventListener()` によるイベント処理
- クラスの追加/削除による状態管理

### API連携
- `fetch()` を使ったHTTPリクエスト
- RESTful APIの設計（GET, POST, DELETE）
- ポーリングによる疑似リアルタイム通信
- エラーハンドリング

### TypeScript
- インターフェースによる型定義
- ジェネリクスを使った型安全なAPI
- クラスベースの設計
- 非同期処理の型付け

## 📁 プロジェクト構造

```
chat-app-typescript/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CDパイプライン
├── src/
│   ├── server/
│   │   ├── index.ts           # バックエンドのメイン
│   │   └── types.ts           # 型定義
│   └── client/
│       ├── index.html          # HTMLファイル
│       ├── app.ts             # フロントエンドのロジック
│       └── style.css          # スタイル
├── dist/                       # ビルド後のファイル
├── tsconfig.json              # サーバー用TypeScript設定
├── tsconfig.client.json       # クライアント用TypeScript設定
├── package.json
├── .gitignore
└── README.md
```

## 🔧 API エンドポイント

### メッセージ一覧を取得
```
GET /api/messages?since={messageId}
```

### メッセージを送信
```
POST /api/messages
Content-Type: application/json

{
  "username": "ユーザー名",
  "text": "メッセージ内容"
}
```

### メッセージを削除
```
DELETE /api/messages/:id
```

### ヘルスチェック
```
GET /api/health
```

## 🎨 カスタマイズ

### ポーリング間隔の変更
`src/client/app.ts` の `POLLING_INTERVAL` を変更してください。

```typescript
const POLLING_INTERVAL = 2000; // ミリ秒単位
```

### メッセージ保存数の変更
`src/server/index.ts` のメッセージ制限を変更してください。

```typescript
if (messages.length > 100) {
  messages = messages.slice(-100);
}
```

## 🚧 今後の拡張予定

- [ ] WebSocketによる真のリアルタイム通信
- [ ] データベース連携（MongoDB/PostgreSQL）
- [ ] ユーザー認証機能
- [ ] 複数チャットルーム
- [ ] メッセージの編集・削除機能
- [ ] ファイル・画像の送信
- [ ] 既読機能
- [ ] オンラインユーザー表示

## 📝 ライセンス

MIT

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更を行う場合は、まずissueを開いて変更内容を議論してください。

## 📧 お問い合わせ

質問や提案がある場合は、GitHubのissueを作成してください。