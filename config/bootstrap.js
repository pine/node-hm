'use strict';

/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var cron = require('cron');

module.exports.bootstrap = function (cb) {
  // 更新処理
  var job = new cron.CronJob({
    cronTime: '* * 0 * * * *',
    onTick: function(){
      sails.services['update']();
    },
    start: true,
    timeZone: 'Asia/Tokyo',
  });
  
  // 初回更新処理
  sails.services['update']();
  
  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};