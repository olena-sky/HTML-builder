const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, '02-write-file', 'output.txt');

// Creating a folder
fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
  if (err) throw err;
});

// Creating a stream to write to a file
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

// Configuring readline to read from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Enable keypress events and handle Escape
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (_, key) => {
  if (key.sequence === '\u001b') { // '\u001b' — це Escape
    exitProcess();
  }
});

console.log('Welcome! Enter the text to write to the file:');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    exitProcess();
  } else {
    writeStream.write(input + '\n');
  }
});

process.on('SIGINT', exitProcess);

function exitProcess() {
  writeStream.end(() => {
    rl.close();
    process.stdin.destroy();
    process.exit();
  });
}

process.on('exit', () => {
  console.log("\nYour words are already on the pages of the file. See you soon!");
});
