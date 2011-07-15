// ==UserScript==
// @name           googleplusplus_user_mute
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_user_mute
// @include        *plus.google.com*
// @description    Mutes all post by specific users.
// @version        0.1.1
// ==/UserScript==


function userMute(){
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}

	function normalize_language(code){
		var r;
		var c = code;
		
		c = c.replace(/_/, '-').toLowerCase();
		if(c.length > 3){
			c = c.substring(0, 3) + c.substring(3).toUpperCase();
		}

		if(c=='xx-XX'){ r = c }
		else if(c=='yy-YY'){ r = c }
		else if(c=='zz-ZZ'){ r = c }
		else{
			//Default to English US
			r = 'en-US';
		}
		
		return r;
	}
	function language_dictionary(){
		var lang = {
			'unmute' : {
				'en-US' : 'UNMUTE',
				'xx-XX' : '_____'
			},
			'muted_share' : {
				'en-US' : 'MUTE SHARE',
				'xx-XX' : '_____'
			},
			'see_original' : {
				'en-US' : 'SEE ORIGINAL POSTER TO UNMUTE',
				'xx-XX' : '_____'
			},
			'mute_user' : {
				'en-US' : 'MUTE USER',
				'xx-XX' : '_____'
			}
		}
		return lang;
	}
	function t(key){
		return LANGUAGE[key][NORMALIZED_LANGUAGE_CODE];
	}
	function insert_unmute_button(th, id, share_id, name){
		var unmute_html = '<div>' + name + ' <a style="font-size:10px" class="gpp_user_mute_unmute">' + t('unmute') + '</a></div>';
		if( id_match(id, share_id) == 'share' ){
			unmute_html = '<div>' + name + ' &nbsp;(<span style="font-size:10px" class="gpp_user_mute_unmute">' + t('muted_share') + ' &ndash; <a style="font-size:10px" href="https://plus.google.com/' + share_id + '">' + t('see_original') + '</a>' + '</span>)</div>'
		}
		th.after(unmute_html);
		th.parent().find('.gpp_user_mute_unmute:first').click(function(){
			if( !th.is(':visible') ){
				th.fadeIn();
			}
			$(this).parent().hide();
			GM_removeItem('gpp__user_mute_id_' + id);
		});
	}
	function id_match(id, share_id){
		if( id != '' && GM_getValue('gpp__user_mute_id_' + id, '') != '' ){
			return 'post';
		}else if( share_id != '' && GM_getValue('gpp__user_mute_id_' + share_id, '') != '' ){
			return 'share';
		}
		return false;
	}
	function main_loop(){
		
		var posts = $('#content .a-f-i-p').each(function(){ 
			var th = $(this);
			var user_link = th.find('.a-f-i-do');
			var share_link = th.find('.a-f-i-u-go a');
			var name = user_link.attr('title');
			var share_id = typeof share_link.attr('oid') != 'undefined' ? share_link.attr('oid') : '';
			var id = typeof user_link.attr('oid') != 'undefined' ? user_link.attr('oid') : '';
			
			//GM_removeItem('gpp__user_mute_id_' + id); return;
			
			//Set click handlers
			if( th.find('.gpp_user_mute_mute:first').length == 0 ){
				th.find('.a-b-f-i-aGdrWb:first').after(' &nbsp;<a style="font-size:10px" class="gpp_user_mute_mute">' + t('mute_user') + '</a>');
				th.parent().find('.gpp_user_mute_mute:first').click(function(){
					//Mute
					th.fadeOut();
					GM_setValue('gpp__user_mute_id_' + id, '1');
					//Muted, so insert unmute button
					if( th.parent().find('.gpp_user_mute_unmute:first').length == 0 ){
						insert_unmute_button(th, id, share_id, name);
					}
					th.parent().find('.gpp_user_mute_unmute').parent().show();
				});
			}
			
			//Check storage to find out if state == muted
			if( id_match(id, share_id) ){
				if( th.is(':visible') ){
					th.hide();
				}
				if( !th.is(':visible') ){
					th.parent().find('.gpp_user_mute_unmute:first').parent().show();
				}
				if( th.parent().find('.gpp_user_mute_unmute:first').length == 0 ){
					insert_unmute_button(th, id, share_id, name);
				}
			}else{
				if( !th.is(':visible') ){
					th.show();
					th.parent().find('.gpp_user_mute_unmute:first').parent().hide();
				}
			}
		});
	}
	
	/****** Before main_loop ******/
	/*** Constants ***/
	var NORMALIZED_LANGUAGE_CODE = normalize_language(navigator.language);
	var LANGUAGE = language_dictionary();
	
	/****** Start main_loop ******/
	setInterval(main_loop, 2000);
}


/****** Load jQuery then callback upon load function ******/
function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", protocol + "ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

/****** Call Load jQuery + callback function ******/
var protocol = window.location.protocol + '//';
addJQuery(userMute);