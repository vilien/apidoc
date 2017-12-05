/**
 * 导入路由
 */
const apimenu = require('./routes/apimenu');

/**
 * 配置路由
 */
const router = (app) => {
  app.use('/apimenu', apimenu);
}

let loaded = false;
/* 加载路由 */
module.exports = (app) => {
  if (loaded) {
    throw new Error('load router failed!');
  } else {
    loaded = true;
    router(app);
  }
};
