import requests

def lookup_word(word):
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word.lower()}"
    try:
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()
        defs = data[0]['meanings'][0]['definitions'][0]
        return defs['definition']
    except Exception as e:
        print(f"[Dictionary Error] {word}: {e}")
        return "Không rõ nghĩa"
