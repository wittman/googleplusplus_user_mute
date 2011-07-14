// ==UserScript==
// @name           googleplusplus_user_mute
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_user_mute
// @include        *plus.google.com*
// @description    Mutes all post by specific users.
// @version        0.1.0
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
	function insert_unmute_button(t, id, share_id, name){
		var unmute_html = '<div>' + name + ' <a style="font-size:10px" class="gpp_user_mute_unmute">UNMUTE</a></div>';
		if( id_match(id, share_id) == 'share' ){
			unmute_html = '<div>' + name + ' &nbsp;(<span style="font-size:10px" class="gpp_user_mute_unmute">MUTED SHARE &ndash; <a style="font-size:10px" href="https://plus.google.com/' + share_id + '">SEE ORIGINAL POSTER TO UNMUTE</a>' + '</span>)</div>'
		}
		t.after(unmute_html);
		t.parent().find('.gpp_user_mute_unmute:first').click(function(){
			if( !t.is(':visible') ){
				t.fadeIn();
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
			var t = $(this);
			var user_link = t.find('.a-f-i-do');
			var share_link = t.find('.a-f-i-u-go a');
			var name = user_link.attr('title');
			var share_id = typeof share_link.attr('oid') != 'undefined' ? share_link.attr('oid') : '';
			var id = typeof user_link.attr('oid') != 'undefined' ? user_link.attr('oid') : '';
			
			//GM_removeItem('gpp__user_mute_id_' + id); return;
			
			//Set click handlers
			if( t.find('.gpp_user_mute_mute:first').length == 0 ){
				t.find('.a-b-f-i-aGdrWb:first').after(' &nbsp;<a style="font-size:10px" class="gpp_user_mute_mute">MUTE USER</a>');
				t.parent().find('.gpp_user_mute_mute:first').click(function(){
					//Mute
					t.fadeOut();
					GM_setValue('gpp__user_mute_id_' + id, '1');
					//Muted, so insert unmute button
					if( t.parent().find('.gpp_user_mute_unmute:first').length == 0 ){
						insert_unmute_button(t, id, share_id, name);
					}
					t.parent().find('.gpp_user_mute_unmute').parent().show();
				});
			}
			
			//Check storage to find out if state == muted
			if( id_match(id, share_id) ){
				if( t.is(':visible') ){
					t.hide();
				}
				if( !t.is(':visible') ){
					t.parent().find('.gpp_user_mute_unmute:first').parent().show();
				}
				if( t.parent().find('.gpp_user_mute_unmute:first').length == 0 ){
					insert_unmute_button(t, id, share_id, name);
				}
			}else{
				if( !t.is(':visible') ){
					t.show();
					t.parent().find('.gpp_user_mute_unmute:first').parent().hide();
				}
			}
		});
	}
	
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