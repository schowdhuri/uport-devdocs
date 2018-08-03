import {exec} from "child_process";
import _ from "lodash";
import fs from "fs";
import path from "path";
import gulp from 'gulp';

let repos = require("../repos");

gulp.task("git:clone", done => {
  let clones = _.map(repos, (data, name) => {
    let dest = path.join("repos", name);

    if (fs.existsSync(dest)) {
      console.log(`info: ${dest} already cloned`);
    } else {
      console.log(`cloning....${data.source}`);
      if (!data.commit && !data.branch){
        exec(`git clone ${data.source} ${dest}`);
      }
      else if (data.commit !== ""){
        exec(`git clone ${data.source} ${dest}`);
        exec(`git fetch origin ${data.commit}`);
      }
      else {
        exec(`git clone -b ${data.branch} ${data.source} ${dest}`);
      }
    }
  });
});
