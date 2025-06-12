const { exec } = require('child_process');

exec('npm test', (error, stdout, stderr) => {
  if (error) {
    console.error(`Test execution error: ${error}`);
    return;
  }
  console.log(`Test Results:\n${stdout}`);
});
