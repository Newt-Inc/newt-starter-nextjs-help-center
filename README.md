## End of Life Notice

**The Newt headless CMS will be retired on 2026-11-24.**

2026年11月24日（火）をもちまして、Newt株式会社が提供しているヘッドレスCMS「Newt」のサービス提供を終了させていただくこととなりました。

サービス終了後は、管理画面・APIともにご利用いただくことができなくなります。

これまでヘッドレスCMS「Newt」をご支援・ご愛顧いただき、誠にありがとうございました。

## 概要

[Newt](https://www.newt.so/) と [Next.js](https://nextjs.org/) を利用したヘルプセンターです。<br />
[App Router](https://nextjs.org/docs/app) を用いて、ヘルプセンターを作成してみたい方はぜひお試しください。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNewt-Inc%2Fnewt-starter-nextjs-help-center)

## 開発をはじめる

### Step1: Newt スペースをセットアップ

1. スペースを作成します
   - スペース UID を控えておきましょう。スペース UID は 管理画面 URL（ `https://app.newt.so/{スペースUID}` ） もしくは スペース設定 > 一般 から確認できます。
2. App を作成します
   - App テンプレートから作成する場合、**Help center**を選択し「このテンプレートを追加」をクリックしてください。
   - AppUID を控えておきましょう。AppUID は管理画面 URL（ `https://app.newt.so/{スペースUID}/app/{AppUID}` ） または App 設定 > 一般 から確認できます。
3. スペース設定 > API キー から CDN API トークンを作成します

### Step2: .env.local ファイルを作成する

[.env.local.example](https://github.com/Newt-Inc/newt-starter-nextjs-help-center/blob/main/.env.local.example) ファイルを参考に、`.env.local` ファイルを作成します。<br />
Step1 で取得したスペース UID・AppUID・CDN API トークンの値を設定します。

```conf
NEXT_PUBLIC_NEWT_SPACE_UID=スペースUID
NEXT_PUBLIC_NEWT_APP_UID=help-center
NEXT_PUBLIC_NEWT_API_TOKEN=CDN APIトークン
NEXT_PUBLIC_NEWT_API_TYPE=cdn
NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID=article
NEXT_PUBLIC_NEWT_CATEGORY_MODEL_UID=category
NEXT_PUBLIC_PAGE_LIMIT=20
```

Next.js における環境変数の扱いについては、[公式ドキュメント](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)を参照してください。

### Step3: dev サーバーを起動する

Yarn を使う

```bash
# 依存パッケージをインストール
$ yarn install

# localhost:3000でdevサーバーを起動
$ yarn dev
```

npm を使う

```bash
# 依存パッケージをインストール
$ npm install

# localhost:3000でdevサーバーを起動
$ npm run dev
```

## ページの構成

| ページ             | パス                                                                           | ファイル                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 一覧               | /                                                                              | [ソース](https://github.com/Newt-Inc/newt-starter-nextjs-help-center/blob/main/app/page.tsx)                                           |
| カテゴリで絞り込み | /categories/usage<br>/categories/usage/1・/categories/usage/2…（ページ遷移時） | [ソース](https://github.com/Newt-Inc/newt-starter-nextjs-help-center/blob/main/app/categories/%5Bslug%5D/%5B%5B...page%5D%5D/page.tsx) |
| 検索結果           | /search?q=hoge                                                                 | [ソース](https://github.com/Newt-Inc/newt-starter-nextjs-help-center/blob/main/app/search/page.tsx)                                    |
| 詳細               | /articles/article-1                                                            | [ソース](https://github.com/Newt-Inc/newt-starter-nextjs-help-center/blob/main/app/articles/%5Bslug%5D/page.tsx)                       |

## モデルの定義

`Help center` app の中に Article・Category の 2 つのモデルを作ります。

| App 名（任意） | モデル名（モデル UID） |
| -------------- | ---------------------- |
| Help center    | Article (`article`)    |
|                | Category (`category`)  |

### Article（`uid: article`）モデル

| フィールド ID | フィールド名 | フィールドタイプ           | オプション                                         |
| ------------- | ------------ | -------------------------- | -------------------------------------------------- |
| title         | タイトル     | テキスト                   | 必須フィールド<br />このフィールドをタイトルに使う |
| slug          | スラッグ     | テキスト                   | 必須フィールド<br />一意の文字列（ユニーク）       |
| meta          | メタ情報     | カスタムフィールド         |                                                    |
| body          | 本文         | Markdown or リッチテキスト | 必須フィールド                                     |
| category      | カテゴリ     | 参照（Category モデル）    | 必須フィールド                                     |
| tags          | タグ         | 選択                       | 複数値<br />必須フィールド                         |

### Category（`uid: category`）モデル

| フィールド ID | フィールド名 | フィールドタイプ | オプション                                         |
| ------------- | ------------ | ---------------- | -------------------------------------------------- |
| emoji         | 絵文字       | 絵文字           | 必須フィールド                                     |
| name          | 名前         | テキスト         | 必須フィールド<br />このフィールドをタイトルに使う |
| slug          | スラッグ     | テキスト         | 必須フィールド<br />一意の文字列（ユニーク）       |
| description   | 説明文       | テキスト         | 必須フィールド                                     |

### メタ情報（`id: META`）カスタムフィールドタイプ

| フィールド ID | フィールド名       | フィールドタイプ | オプション |
| ------------- | ------------------ | ---------------- | ---------- |
| title         | タイトル           | テキスト         |            |
| description   | ディスクリプション | テキスト         |            |
| ogImage       | OG 画像            | 画像             |            |

## License

[MIT License](https://github.com/Newt-Inc/newt-starter-nextjs-help-center/blob/main/LICENSE)
