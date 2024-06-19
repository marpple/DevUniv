const { exec } = require('child_process');
const path = require('path');

const keynoteFilePath = path.resolve(__dirname, 'dev-univ-image-processing.key');

exec(`open "${keynoteFilePath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error opening Keynote file: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log(`Keynote file opened: ${stdout}`);
});
