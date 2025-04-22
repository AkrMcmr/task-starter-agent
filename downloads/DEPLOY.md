# タスク開始支援エージェント デプロイガイド

このガイドでは、タスク開始支援エージェントのデプロイ方法について説明します。

## 前提条件

- LINE Developersアカウント
- Herokuアカウント（または他のサーバーホスティングサービス）
- Pythonの基本的な知識

## 1. LINE Botの設定

### 1.1 LINE Developersでチャネルを作成

1. [LINE Developers Console](https://developers.line.biz/console/)にアクセスし、ログインします。
2. プロバイダーを選択または作成します。
3. 「新規チャネル作成」をクリックします。
4. 「Messaging API」を選択します。
5. 必要な情報を入力し、チャネルを作成します。
   - チャネル名：「タスク開始支援エージェント」など
   - チャネル説明：適切な説明を入力
   - 大業種・小業種：適切なものを選択
   - メールアドレス：連絡先のメールアドレス

### 1.2 チャネルアクセストークンの取得

1. 作成したチャネルの「Messaging API設定」タブを開きます。
2. 「チャネルアクセストークン」セクションで「発行」ボタンをクリックします。
3. 発行されたトークンをメモしておきます。

### 1.3 Webhook URLの設定

1. 「Webhook設定」セクションで「Webhook URL」を入力します。
   - Herokuにデプロイする場合：`https://あなたのアプリ名.herokuapp.com/callback`
   - 他のサーバーの場合：`https://あなたのドメイン/callback`
2. 「Webhookの利用」をオンにします。
3. 「Webhook送信」を「オン」にします。

## 2. サーバーのデプロイ

### 2.1 Herokuへのデプロイ

#### 2.1.1 Herokuアカウントの準備

1. [Heroku](https://www.heroku.com/)にアクセスし、アカウントを作成またはログインします。
2. Heroku CLIをインストールします（[インストール手順](https://devcenter.heroku.com/articles/heroku-cli)）。

#### 2.1.2 アプリケーションの準備

1. 以下のファイルを作成します：

**requirements.txt**
```
flask==2.0.1
line-bot-sdk==2.0.1
schedule==1.1.0
gunicorn==20.1.0
```

**Procfile**
```
web: gunicorn main:app
```

**runtime.txt**
```
python-3.10.12
```

#### 2.1.3 Herokuへのデプロイ

1. ターミナルで以下のコマンドを実行します：

```bash
# Herokuにログイン
heroku login

# アプリケーションを作成
heroku create あなたのアプリ名

# 環境変数を設定
heroku config:set LINE_CHANNEL_ACCESS_TOKEN=あなたのチャネルアクセストークン
heroku config:set LINE_CHANNEL_SECRET=あなたのチャネルシークレット
heroku config:set OBSIDIAN_VAULT_PATH=/path/to/your/obsidian/vault
heroku config:set MORNING_TIME=07:00
heroku config:set AFTERNOON_TIME=13:00
heroku config:set EVENING_TIME=22:00

# アプリケーションをデプロイ
git init
git add .
git commit -m "Initial commit"
git push heroku master
```

### 2.2 他のサーバーへのデプロイ

#### 2.2.1 サーバーの準備

1. Pythonがインストールされたサーバーを用意します。
2. 必要なパッケージをインストールします：

```bash
pip install flask line-bot-sdk schedule gunicorn
```

#### 2.2.2 アプリケーションの実行

1. 環境変数を設定します：

```bash
export LINE_CHANNEL_ACCESS_TOKEN=あなたのチャネルアクセストークン
export LINE_CHANNEL_SECRET=あなたのチャネルシークレット
export OBSIDIAN_VAULT_PATH=/path/to/your/obsidian/vault
export MORNING_TIME=07:00
export AFTERNOON_TIME=13:00
export EVENING_TIME=22:00
```

2. アプリケーションを実行します：

```bash
gunicorn main:app
```

## 3. Obsidianデータの連携

### 3.1 Obsidianデータの同期

Obsidianのデータをサーバーと同期するには、以下の方法があります：

1. **Obsidian Syncを使用する**（有料）
   - Obsidian Syncを設定し、サーバーからアクセスできるようにします。

2. **GitHubなどのリポジトリを使用する**
   - ObsidianのvaultをGitHubリポジトリとして管理します。
   - サーバーでリポジトリをクローンし、定期的に更新します。

3. **Dropboxなどのクラウドストレージを使用する**
   - ObsidianのvaultをDropboxフォルダに配置します。
   - サーバーでDropboxクライアントを設定し、フォルダを同期します。

### 3.2 サーバー側の設定

選択した同期方法に応じて、サーバー側で以下の設定を行います：

1. **Obsidian Syncの場合**
   - サーバーにObsidianをインストールし、Syncを設定します。
   - `OBSIDIAN_VAULT_PATH`環境変数を設定します。

2. **GitHubの場合**
   - サーバーでリポジトリをクローンします：
   ```bash
   git clone https://github.com/yourusername/your-obsidian-vault.git
   ```
   - 定期的に更新するcronジョブを設定します：
   ```
   */10 * * * * cd /path/to/your-obsidian-vault && git pull
   ```
   - `OBSIDIAN_VAULT_PATH`環境変数を設定します。

3. **Dropboxの場合**
   - サーバーにDropboxクライアントをインストールし、設定します。
   - `OBSIDIAN_VAULT_PATH`環境変数をDropboxフォルダのパスに設定します。

## 4. LINEボットの友だち追加

1. LINE Developers Consoleの「Messaging API設定」タブで「QRコード」を確認します。
2. このQRコードをスマートフォンのLINEアプリでスキャンして、ボットを友だちに追加します。

## 5. 動作確認

1. LINEアプリでボットに「ヘルプ」と送信します。
2. ヘルプメッセージが返ってくることを確認します。
3. 「今日のタスク」「次のステップ」「朝の準備」などのコマンドを試してみます。

## トラブルシューティング

### ボットからの応答がない場合

1. Herokuのログを確認します：
```bash
heroku logs --tail
```

2. 環境変数が正しく設定されているか確認します：
```bash
heroku config
```

3. Webhook URLが正しく設定されているか確認します。

### Obsidianデータが取得できない場合

1. `OBSIDIAN_VAULT_PATH`が正しく設定されているか確認します。
2. 同期方法が正しく機能しているか確認します。
3. サーバーからObsidianのvaultにアクセスできるか確認します。

## 参考リンク

- [LINE Messaging API ドキュメント](https://developers.line.biz/ja/docs/messaging-api/)
- [Heroku ドキュメント](https://devcenter.heroku.com/)
- [Flask ドキュメント](https://flask.palletsprojects.com/)
- [Obsidian ドキュメント](https://help.obsidian.md/)
