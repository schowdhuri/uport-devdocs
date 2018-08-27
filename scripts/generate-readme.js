#!/usr/bin/env node

const fs = require('fs')
const ini = require('ini')
const readline = require('readline')
const exec = require('child_process').exec

let markdown = ini.parse(fs.readFileSync('./.gitmodules', 'utf-8'))


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
    outStream.write('|Name|Branch|\n');
    outStream.write('| --|--|\n');
    Object.keys(markdown).forEach(repo => {
      let {branch, url, path} = markdown[`${repo}`];
      outStream.write('|' + `[${repo.split('"')[1]}](${url})` + '|' + `${branch}` + '|\n');
    });
  } else {
      outStream.write(line + '\n');

  }
});

outStream.write('\n');
console.log("Finished.");
