import urllib.request
import os

# Direct public MP3 podcast speech audio URLs
urls = [
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8c/Steve_Jobs_Speech_at_Stanford_2005_%28mono%29.ogg/Steve_Jobs_Speech_at_Stanford_2005_%28mono%29.ogg.mp3",
    "https://raw.githubusercontent.com/mdn/webaudio-examples/main/audio-analyser/viper.mp3",
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7337e.mp3"
]

dest = "C:/Users/LENOVO/.gemini/antigravity/scratch/audiobars/demo/ted_podcast.mp3"

for u in urls:
    try:
        print("Trying:", u)
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(dest, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        size = os.path.getsize(dest)
        if size > 10000:
            print("Successfully downloaded! Size:", size)
            break
    except Exception as e:
        print("Failed:", e)
