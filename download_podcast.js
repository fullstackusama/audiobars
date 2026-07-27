const https = require('https');
const http = require('http');
const fs = require('fs');

// Public domain TED / Speech podcast audio sample from Wikimedia/Archive
const url = 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Steve_Jobs_Speech_at_Stanford_2005.ogg';
const dest = 'C:/Users/LENOVO/.gemini/antigravity/scratch/audiobars/demo/podcast_speech.ogg';

const file = fs.createWriteStream(dest);

function download(fileUrl) {
  const client = fileUrl.startsWith('https') ? https : http;
  client.get(fileUrl, function(response) {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      return download(response.headers.location);
    }
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log('Successfully downloaded podcast speech audio file.');
    });
  }).on('error', function(err) {
    fs.unlink(dest, () => {});
    console.error('Download error:', err.message);
  });
}

download(url);
