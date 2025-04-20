from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from transformers import pipeline
import nltk
import re
import whisper
import requests
import os

from dictionary_helper import lookup_word


nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')

app = FastAPI()
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-vi")


def extract_keywords(sentence, max_keywords=2):
    tokens = nltk.word_tokenize(sentence)
    tagged = nltk.pos_tag(tokens)

    # Chỉ lấy những từ là danh từ (NN), động từ (VB), tính từ (JJ)
    valid_tags = ("NN", "NNS", "VB", "VBD", "VBG", "JJ")

    keywords = []
    for word, tag in tagged:
        if tag.startswith(valid_tags) and re.match(r"^[a-zA-Z\-]+$", word) and len(word) > 2:
            keywords.append(word.lower())

    return keywords[:max_keywords]


def fallback_translate_by_context(word):
    context = f"The meaning of the word '{word}' is:"
    try:
        result = translator(context)[0]["translation_text"]
        return result.split(":")[-1].strip()
    except:
        return "Không rõ nghĩa"


def translate_word_smart(word):
    meaning = lookup_word(word)
    if meaning:
        return meaning
    return fallback_translate_by_context(word)

def detect_tense(sentence):
    tokens = nltk.word_tokenize(sentence)
    tags = nltk.pos_tag(tokens)

    has_have = any(w.lower() in ("has", "have") for w, t in tags)
    past_verbs = [w for w, t in tags if t == "VBD"]
    present_ing = [w for w, t in tags if t == "VBG"]

    if has_have and any(t == "VBN" for _, t in tags):
        return "Hiện tại hoàn thành"
    if present_ing and any(w.lower() in ("is", "are", "am") for w, _ in tags):
        return "Hiện tại tiếp diễn"
    if past_verbs:
        return "Quá khứ đơn"
    return "Không xác định"


class TranslateRequest(BaseModel):
    text: str


@app.post("/translate")
def translate_text(req: TranslateRequest):
    original = req.text
    translated = translator(original)[0]["translation_text"]
    grammar = detect_tense(original)

    keywords = extract_keywords(original)
    
    vocab = []
    for word in keywords:
        meaning = translate_word_smart(word)
        vocab.append({
            "word": word,
            "meaning": meaning,
            "example": f"{original}"
        })

    return {
        "original": original,
        "translation": translated,
        "grammar": grammar,
        "vocab": vocab
    }

# Load mô hình Whisper 1 lần
whisper_model = whisper.load_model("base")  # small, medium, large tùy máy

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    save_path = os.path.join("uploads", audio.filename)
    os.makedirs("uploads", exist_ok=True)

    # Lưu file nhận được
    with open(save_path, "wb") as f:
        f.write(await audio.read())

    # Gọi Whisper để transcribe
    result = whisper_model.transcribe(save_path)
    os.remove(save_path)

    return {"text": result["text"]}