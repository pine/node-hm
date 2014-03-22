/**
 * PrefectureController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('underscore');

module.exports = {
  
  /**
   * Action blueprints:
   *    `/prefectures`
   */
  index: function(req, res){
    Prefecture.find({}, function(err, prefectures){
      if(err){ throw err; }
      
      // Send a JSON response
      res.json(_.map(
        prefectures,
        function(prefecture){ return _.pick(prefecture, 'id', 'name', 'updatedAt'); }
      ));
    });
  },
  
  /**
   * Action blueprints:
   *    `/prefecture/:id`
   */
  show: function(req, res){
    Prefecture.find(req.params.id, function(err, prefecture){
      if(err){ throw err; }
      
      // Send a JSON response
      if(prefecture.length > 0){
        return res.json(_.pick(prefecture[0], 'id', 'name', 'menu', 'updatedAt'));
      }
      
      else {
        throw new Error('Can\'t find prefecture');
      }
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PrefectureController)
   */
  _config: {},
  
  
};
