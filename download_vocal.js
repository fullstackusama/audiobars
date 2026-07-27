const https = require('https');
const fs = require('fs');

const fileUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const destPath = 'C:/Users/LENOVO/.gemini/antigravity/scratch/audiobars/demo/vocal_sample.mp3';

const file = fs.createWriteStream(destPath);
https.get(fileUrl, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Vocal audio file downloaded successfully.');
  });
}).on('error', function(err) {
  fs.unlink(destPath, () => {});
  console.error('Error downloading audio file:', err.message);
});
