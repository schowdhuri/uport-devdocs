#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')
const repos = require('../repos')
const exec = require('child_process').exec

const TEMPLATE = 'readme-template.md'
const README = 'README.md'

let outStream = fs.createWriteStream(__dirname + '/../' + README)
let lines = readline.createInterface({
  input: fs.createReadStream(__dirname + '/../' + TEMPLATE)
});
console.log("Adding repository information to the README...")
lines.on('line', line => {
  if (line === '<deployed-markdown>') {
    outStream.write('## Deployed Markdown\n\n');
    outStream.write('|Name|Source|\n');
    outStream.write('| --|--|\n');
    Object.keys(repos).forEach(repo => {
      let {source, branch, url, title, commit} = repos[`${repo}`];
      let link = "";
      if (commit !== null && commit !== "") {
        link = `${url}/tree/${commit}`;
      } else {
        link = `${url}`;
      }
      outStream.write('|' + `[${title}](${url})` + '|' + `[${branch} ${commit}](${link})` + '|\n');
    });
  } else {
    outStream.write(line + '\n');
  }
});

outStream.write('\n');
console.log("Finished.");
