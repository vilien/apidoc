const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const recursive = require("recursive-readdir");
const yaml = require('js-yaml');
const cfg = require('../config.json');

// 读取菜单信息
function readMenu(apiPath) {
  const confPatt = /urls\.conf$/;
  const yamlPatt = /(?:\.yaml|\.yml)$/;
  const jsonPatt = /\.json$/;
  const headPatt = /#\s*(.+)[\r\n]/;
  const menu = [];
  const list = fs.readdirSync(apiPath);
  const alias = '/api/';
  list.forEach(function(ele){
    const filePath = apiPath + '/' + ele;
    const info = fs.statSync(filePath);
    if (info.isDirectory()) {
      let title = ele;
      if (fs.existsSync(filePath + '/README.md')) {
        const doc = fs.readFileSync(filePath + '/README.md', 'utf8');
        const mat = doc.match(headPatt);
        if (mat) title = mat[1];
      }
      menu.push({
        type: 'category',
        title: title,
        list: readMenu(filePath),
      });
    } else if (info.isFile()) {
      const fileType = confPatt.test(filePath) ? 'conf'
        : yamlPatt.test(filePath)  ? 'yaml'
        : jsonPatt.test(filePath)  ? 'json'
        : 'other';
      if (fileType === 'conf') {
        const urls = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(urls)) {
          urls.forEach(item => {
            menu.push({
              info: { title: item.title },
              type: 'api',
              path: item.url,
            });
          });
        }
      } else if (fileType === 'yaml') {
        try {
          const doc = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
          menu.push({
            info: doc.info,
            type: 'api',
            path: alias + path.relative(cfg.apiPath, filePath).replace(/\\/g, '/'),
          });
        } catch (e) {}
      } else if (fileType === 'json') {
        const doc = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        menu.push({
          info: doc.info,
          type: 'api',
          path: alias + path.relative(cfg.apiPath, filePath).replace(/\\/g, '/'),
        });
      }
    }
  });
  return menu;
}

router.get('/list', function(req, res, next) {
  const yamlPatt = /(?:\.yaml|\.yml)$/;
  const jsonPatt = /\.json$/;
  const readmePatt = /README\.md$/i;
  res.json({
    code: 200,
    msg: 'success',
    data: readMenu(cfg.apiPath)
  });
});

module.exports = router;
