var url      = require('url');
var _        = require('underscore');
var cheerio  = require('cheerio');

//var request  = require('request');
var request = require('request').defaults({ 'proxy': 'http://proxy.noc.kochi-tech.ac.jp:3128' });

var TARGET_URL = 'http://www.hottomotto.com/menu/';

function getPrefectures(callback){
	'use strict';
  
	request(TARGET_URL, function(err, res_, body){
		if(err){
			return callback(err);
		}
		
		if(res_.statusCode != 200){
			return callback(new Error('Can\'t get the menu page, the status code is ' + res_.statusCode + '.'));
		}
		
		var prefectures = parsePrefectures(body);
		
		if(prefectures){
			return callback(null, prefectures);
		}
		
		else {
			return callback(new Error('Can\'t find prefectures data.'));
		}
	});
}

function parsePrefectures(body){
  'use strict';
  
	var $     = cheerio.load(body);
	var elems = $('.map_block li a');
  
	var prefectures = _.map(elems, function(elem_){
		var elem    = $(elem_);
		var name    = elem.find('img').attr('alt');
		var linkUrl = url.resolve(TARGET_URL, elem.attr('href'));
		
		var matches = linkUrl.match(/\d+$/);
		var id      = matches ? matches[0] : null;
		
		return {
			_id: id,
			name: name,
			url : linkUrl
		};
	});
	
	return prefectures.length > 0 ? prefectures : null;
}

function getPrefecture(simplePrefecture, callback){
  'use strict';
  
  request(simplePrefecture.url, function(err, res, body){
    if(err){ return callback(err); }
    var menu = parsePrefecture(body, simplePrefecture);
    return callback(null, _.extend(simplePrefecture, { menu: menu }));
  });
}

function parsePrefecture(body, simplePrefecture){
  'use strict';
  
  var $     = cheerio.load(body);
  var elems = $('#menu_all .list_inner > a');
  
  var tabs      = $('#menu_tab li');
  var tabInners = $('#menu_all .tab_inner');
  
  return _.map(tabs, function(tab, i){
    var tabName   = $(tab).text();
    var listsElem = $(tabInners[i]).children();
    
    var lists = _.map(listsElem, function(list){
      var listName  = $(list).find('h2').text() || null;
      var itemElems = $(list).find('.list_inner a');
      
      var items = _.map(itemElems, function(item_){
        var item      = $(item_);
        var img       = item.find('.ph img');
        var name      = item.find('h3').text();
        var moneyText = item.find('p:first-of-type').text();
        var money     = parseInt(moneyText.replace(/,/g, ''), 10);
        
        // id を抽出
        var matches = item.attr('href').match(/\/(\d+)$/);
        var id      = matches ? parseInt(matches[1]) : null;
        
        return {
          id   : id,
          name : name,
          image: {
            url   : url.resolve(simplePrefecture.url, img.attr('src')),
            width : parseInt(img.attr('width'), 10),
            height: parseInt(img.attr('height'), 10),
          },
          money: money,
        };
      });
      
      return {
        listName: listName,
        items   : items,
      };
    });
    
    return {
      tabName: tabName,
      lists  : lists,
    };
  });
}

function update(){
  'use strict';
  
  console.log('update start');
  
  getPrefectures(function(err, simplePrefectures){
    if(err){ return console.log(err); }
    
    _.each(simplePrefectures, function(simplePrefecture){
      getPrefecture(simplePrefecture, function(err, prefecture){
        if(err){ return console.log(err); };
        
        Prefecture.find(prefecture._id, function(err, entity){
          if(err){ return console.log(err); }
          
          if(entity.length > 0){
            _.extend(entity[0], prefecture);
            entity[0].save(function(err){
              if(err){ return console.log('save error:', err); }
            });
          }
          
          else {
            Prefecture.create(prefecture, function(err){
              if(err){ return console.log(err); }
            });
          }
        });
      });
    });
  });
};

module.exports = update;