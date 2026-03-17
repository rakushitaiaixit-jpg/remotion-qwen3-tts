# Auto Remotion Qwen3-TTS Video Pipeline

このプロジェクトは、Remotion と Qwen3-TTS (AI音声合成) を組み合わせて、自動的に動画を生成するためのパイプラインです。

## プロジェクト構成

- `ai_engines/`: AI音声合成（TTS）に関連するロジックが含まれています。
- `youtube_videos/`: 
  - `remotion-app/`: 動画のレンダリングを行う Remotion プロジェクト。
  - `00*_*/`: 各動画プロジェクトごとの音声データや設定ファイル。

## セットアップ

### 音声合成エンジン (Python)

1. `ai_engines` ディレクトリに移動します。
2. 仮想環境を作成し、必要な依存関係をインストールします。
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # macOS
   pip install -r requirements.txt
   ```

### 動画レンダリング (Remotion)

1. `youtube_videos/remotion-app` ディレクトリに移動します。
2. 依存パッケージをインストールします。
   ```bash
   npm install
   ```
3. プレビューを起動します。
   ```bash
   npm start
   ```

## ライセンス

[ライセンスを選択して記述してください。例: MIT]
