/*
 * @Author: duyaoyao
 * @Date: 2020-08-31 17:27:55
 * @LastEditors: duyaoyao
 * @LastEditTime: 2020-09-01 10:05:56
 */
const zipper = require("zip-local");
const del = require("del");
const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;
(async function() {
  let { dir, name, target } = argv;
  if (dir && name) {
    dir = path.resolve(process.cwd(), dir);
    const zipFile = path.resolve(`${path.dirname(dir)}/${target}`, name);
    const isExistDir = fs.existsSync(dir);
    const isExistZip = fs.existsSync(zipFile);
    if (isExistZip) {
      del.sync([zipFile]);
    }
    if (dir && isExistDir && zipFile) {
      zipper.sync
        .zip(dir)
        .compress()
        .save(zipFile);
      del.sync([`dist/**/*`, `!dist/dist.zip`], {
        cwd: path.dirname(`${dir}`)
      });
    }
  }
})();
