import argparse
import json
import os
from pathlib import Path
import soundfile as sf
import torch
import whisper  # ★ 追加
from qwen_tts.inference.qwen3_tts_model import Qwen3TTSModel

# デフォルト設定
DEFAULT_MODEL = "Qwen/Qwen3-TTS-12Hz-1.7B-Base"
DEFAULT_REF_AUDIO = "/Users/Shared/Project/00-auto-remotion-qwen3-tts/ai_engines/reference_voices/my_voice.wav"
DEFAULT_PROMPT_TEXT = "はい、こんにちは、ワニかずです！AIの力って、本当に凄いと思いませんか？今日は音声合成のテストをしています。驚くほど自然な声になったら、最高ですよね！"

# 出力ファイル名の固定
FIXED_FILENAME = "speech"

def generate_tts(text, output_dir: Path, model_id: str = DEFAULT_MODEL, ref_audio: str = DEFAULT_REF_AUDIO, prompt_text: str = DEFAULT_PROMPT_TEXT):
    """
    指定のテキストを Qwen3-TTS で音声合成し、
    Whisper でタイミングを解析して speech.json を作成する
    テキストが空でspeech.wavが存在する場合は、Qwen3-TTSをスキップしてWhisper解析のみ行う。
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    out_wav = output_dir / f"{FIXED_FILENAME}.wav"
    out_json = output_dir / f"{FIXED_FILENAME}.json"

    if text:
        # 1. Qwen3-TTS モデルの初期化
        print(f"Loading '{model_id}' on mps device...")
        model = Qwen3TTSModel.from_pretrained(
            model_id, 
            device_map="mps", 
            torch_dtype=torch.float16
        )
        
        print("Model loaded. Synthesizing audio...")

        # 2. 音声合成
        wavs, sr = model.generate_voice_clone(
            text=text,
            language="japanese",
            ref_audio=ref_audio,
            ref_text=prompt_text,
            x_vector_only_mode=False
        )
        
        audio_data = wavs[0]
        sf.write(str(out_wav), audio_data, sr)
        print(f"Audio saved to: {out_wav}")
    else:
        print("Text not provided or script.txt not found. Skipping Qwen3-TTS processing...")
        if not out_wav.exists():
            print(f"Error: Existing audio file not found at {out_wav}")
            return
        print(f"Found existing audio at {out_wav}. Proceeding to Whisper analysis.")

    # 3. Whisper で音声を「聴く」（詳細な字幕の生成） ★ ここが新機能
    print("Starting Whisper analysis for synced subtitles...")
    # 'base'モデルは軽量で高速、かつ日本語も十分正確です
    whisper_model = whisper.load_model("base") 
    
    # 音声ファイルを解析
    result = whisper_model.transcribe(str(out_wav), language="ja", verbose=False)
    
    subtitles = []
    for segment in result["segments"]:
        subtitles.append({
            "text": segment["text"].strip(),
            "startMs": int(segment["start"] * 1000),
            "endMs": int(segment["end"] * 1000)
        })

    # 4. .json の保存（Remotionが読み取れる形式）
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(subtitles, f, ensure_ascii=False, indent=2)
    
    print(f"Subtitles JSON (synced) saved to: {out_json}")
    print(f"Generated {len(subtitles)} subtitle segments.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Qwen3-TTS + Whisper Sync")
    parser.add_argument("input_src", type=str, help="喋らせたいテキスト、または .txt ファイルやフォルダのパス")
    
    args = parser.parse_args()
    input_path = Path(args.input_src).resolve()
    
    target_text = None
    target_output_dir = None

    if input_path.is_dir():
        # フォルダが指定された場合
        target_output_dir = input_path
        script_file = input_path / "script.txt"
        if script_file.is_file():
            with open(script_file, "r", encoding="utf-8") as f:
                target_text = f.read().strip()
    elif input_path.is_file():
        # .txtファイル等が直接指定された場合
        target_output_dir = input_path.parent
        with open(input_path, "r", encoding="utf-8") as f:
            target_text = f.read().strip()
    else:
        # パスが存在しない場合は、直接のテキストとして扱う
        target_text = args.input_src
        target_output_dir = Path(__file__).parent / "output"

    generate_tts(target_text, target_output_dir)