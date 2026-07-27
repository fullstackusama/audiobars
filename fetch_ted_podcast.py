import urllib.request
import os

# Direct public domain TED podcast speech audio link from Internet Archive
url = "https://archive.org/download/TEDTalks-audio-podcast/sir_ken_robinson_do_schools_kill_creativity.mp3"
dest = "C:/Users/LENOVO/.gemini/antigravity/scratch/audiobars/demo/ted_podcast.mp3"

try:
    print("Downloading TED podcast speech audio...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response, open(dest, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
    print("Downloaded bytes:", os.path.getsize(dest))
except Exception as e:
    print("Error:", e)
