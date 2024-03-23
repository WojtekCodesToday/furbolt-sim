const { exec } = require('child_process');

// Define the source and destination paths
const sourcePath = 'assets';
const destinationPath = 'dist/assets'; // Adjust this according to your project structure

// Execute the Git commands
exec(`git remote set-url origin https://github.com/WojtekCodesToday/furbolt-sim.git && git checkout gh-pages && git pull origin gh-pages && git checkout main -- ${sourcePath} && git add ${destinationPath} && git commit -m "Add assets to gh-pages branch" && git push origin gh-pages && git checkout main && git remote set-url origin https://github.com/WojtekCodesToday/furbolt-sim/tree/gh-pages`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Assets moved successfully.`);
});
