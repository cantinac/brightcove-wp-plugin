//TODO namespace
var BCL = {};

(function ($) {
//brightcove.wordpress = { 
//TODO make ID more dynamic
var singlePlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperienceVideo\" class=\"BrightcoveExperience singlePlayer\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\" /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";
var playlistPlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperiencePlaylist\" class=\"BrightcoveExperience playlistPlayer\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@playlistTabs\" value=\"{{playlistID}}\"; /><param name=\"@videoList\" value=\"{{playlistID}}\"; /><param name=\"@playlistCombo\" value=\"{{playlistID}}\"; /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";

playerDataPlaylist = {
    "playerID" : "",
    "width" : "", 
    "height" : "",
    "playlistID":"",
    "isRef" : false
  };

playerDataPlayer = {
    "playerID" : "",
    "width" : "", 
    "height" : "",
    "videoID":"",
    "isRef" : false
  };
  
addPlayer = function (typeOfPlayer)	{
	hideErrorMessage();
	var playerHTML;
	if (typeOfPlayer == 'single')	{
		playerHTML = replaceTokens(singlePlayerTemplate, playerDataPlayer);
		$('#dynamic-bc-placeholder-video').html(playerHTML);
		$('.video-hide').removeClass('hidden');
		$('#video-shortcode-button').removeAttr('disabled');
	} else if (typeOfPlayer == 'playlist') {
		playerHTML = replaceTokens(playlistPlayerTemplate, playerDataPlaylist);
		$('#dynamic-bc-placeholder-playlist').html(playerHTML);	
		$('.playlist-hide').removeClass('hidden');
		$('#playlist-shortcode-button').removeAttr('disabled');
	}
	brightcove.createExperiences();  
}

setPlayerData = function (typeOfPlayer) {
	getVideoID(typeOfPlayer);
	changeHeight(typeOfPlayer);
	changeWidth(typeOfPlayer);
	changePlayerID(typeOfPlayer);
}


getVideoID = function (typeOfPlayer) {
	if (typeOfPlayer == 'single') {
		playerDataPlayer.videoID = $('#bc-video').val();
	} else if (typeOfPlayer == 'playlist') {;
		playerDataPlaylist.playlistID = parsePlaylistIds($('#bc-playlist').val());
	}
}

parsePlaylistIds = function (listOfIds) {
	var regex = /[\s,]+/g;
	listOfIds = listOfIds.replace(regex, ",");
	return listOfIds;
}

//Helper functions to set height, width and playerID
changeHeight = function (typeOfPlayer) {
	if (typeOfPlayer == 'single') {
		playerDataPlayer.height = $('#bc-height').val();
		//TODO check javascript is value set?
		if (playerDataPlayer.height == '' || playerDataPlaylist.height == undefined){
			playerDataPlayer.height=getDefaultHeight();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlaylist.height = $('#bc-height-playlist').val();
		if (playerDataPlaylist.height == '' || playerDataPlaylist.height == undefined){
			playerDataPlaylist.height=getDefaultHeightPlaylist();
		}
	}
}

changeWidth = function (typeOfPlayer) {
		
	if (typeOfPlayer == 'single') {
		playerDataPlayer.width = $('#bc-width').val();
		if (playerDataPlayer.width == '' || playerDataPlaylist.width == undefined){
			playerDataPlayer.width=getDefaultWidth();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlaylist.width = $('#bc-width-playlist').val();
		if (playerDataPlaylist.width == '' || playerDataPlaylist.width == undefined){
			playerDataPlaylist.width=getDefaultWidthPlaylist();
		}
	}

}

changePlayerID = function (typeOfPlayer) {
	if (typeOfPlayer == 'single') {
		playerDataPlayer.playerID = $('#bc-playerID').val();
		if (playerDataPlayer.playerID == undefined || playerDataPlayer.playerID == ''){
			playerDataPlayer.playerID=getDefaultPlayerID();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlaylist.playerID = $('#bc-playerID-playlist').val();
		if (playerDataPlaylist.playerID == undefined || playerDataPlaylist.playerID == ''){
			playerDataPlaylist.playerID=getDefaultPlayerIDPlaylist();
		}
	}
}

//Helper functions for video player
getDefaultHeight = function () {
	return $('#bc-default-height').val();
}
getDefaultWidth = function () {
	return $('#bc-default-width').val();
}

getDefaultPlayerID = function () {
	return $('#bc-default-player').val();
}

//Helper functions for playlist player
getDefaultHeightPlaylist = function () {
	return $('#bc-default-height-playlist').val();
}

getDefaultWidthPlaylist = function () {	
	return $('#bc-default-width-playlist').val();
}

getDefaultPlayerIDPlaylist = function () {
	return $('#bc-default-player-playlist').val();
}

updateTab =function (typeOfPlayer) {	
	if (typeOfPlayer == 'playlist'){
		$('.video-hide').addClass('hidden');
		$('.playlist-hide').removeClass('hidden');
		if ($('#bc-playlist').val() == undefined || $('#bc-playlist').val() == '') {
			$('.playlist-hide.player-preview').addClass('hidden');
		}
		
	} else if (typeOfPlayer == 'single') {
		$('.playlist-hide').addClass('hidden');
		$('.video-hide').removeClass('hidden');
		if ($('#bc-video').val() == undefined || $('#bc-video').val() == '') {
			$('.video-hide.player-preview').addClass('hidden');
		}
	}	
}

insertShortcode = function(typeOfPlayer) {
	console.log('here');
    var isRef='', shortcode;

    if (typeOfPlayer == 'video') {
    	if (playerDataPlayer.isRef) {
      		isRef="isRef=true";
    	}
      shortcode = '[brightcove videoID='+playerDataPlayer.videoID+' '+isRef+' playerID='+playerDataPlayer.playerID+' height='+playerDataPlayer.height+' width='+playerDataPlayer.width+']';
    } else if (typeOfPlayer == 'playlist') {
    	if (playerDataPlaylist.isRef) {
      		isRef="isRef=true";
    	}
      shortcode = '[brightcove playlistID='+playerDataPlaylist.playlistID+' '+isRef+' playerID='+playerDataPlaylist.playerID+' height='+playerDataPlaylist.height+' width='+playerDataPlaylist.width+']';
    }
       
    var win = window.dialogArguments || opener || parent || top;
    var isVisual = (typeof win.tinyMCE != "undefined") && win.tinyMCE.activeEditor && !win.tinyMCE.activeEditor.isHidden();    
    if (isVisual) {
        win.tinyMCE.activeEditor.execCommand('mceInsertContent', false, shortcode);
    } else {
        var currentContent = $('#content', window.parent.document).val();
        if ( typeof currentContent == 'undefined' )
             currentContent = '';        
        $( '#content', window.parent.document ).val( currentContent + shortcode );
    }
    self.parent.tb_remove();
  }

///////////////////////////////Media API Specific Function ////////////////////////////////

seeAllPlaylists = function() {
    $('#bc-video-search-playlist').html("<p> Loading...</p>");
    BCMAPI.token = $('#bc_api_key').val();
    // Make a call to the API requesting content
    // Note that a callback function is needed to handle the returned data
    
    /*Show loader*/
    /*Then in callback hide the loader*/
    BCMAPI.find('find_all_playlists',{ "callback" : "displayPlaylist"});
  };

///////////////////Template Functions ////////////////////////////
BCL.onTemplateError = function (event) {
    var errorType = ("errorType: " + event.errorType)
 	$('#specific-error').remove();
    $('#bc-error').removeClass('hidden');
	$('#bc-error').append('<div id="specific-error">'+errorType+'</div>');
  }

//TODO check onTemplateReady to see if ID gets passed through
BCL.onTemplateReady = function(event) {  
	//TODO set different ID's based on template
    player = brightcove.api.getExperience("myExperience");
    // get a reference to the video player
    videoPlayer = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    videoPlayer.getCurrentVideo(function(videoDTO) {
      currentVideo = videoDTO;
      $('#bc_title').html(currentVideo.displayName);
      $('#bc_description').html(currentVideo.shortDescription);
    });
  }

////////////////////////General Helper Functions/////////////////
hideErrorMessage = function () {	
	$('#bc-error').addClass('hidden');
}

replaceTokens = function (html, data) {
      var m;
      var i = 0;
      var match = html.match(data instanceof Array ? /{{\d+}}/g : /{{\w+}}/g) || [];
      while (m = match[i++]) {
          html = html.replace(m, data[m.substr(2, m.length-4)]);
      }
      return html;
  };

//validation code for player settings
validatePlayerSettings = function (id) {
	
	$(id).validate ({ 
       rules: {
        	bcHeight: 'digits',
        	bcWidth: 'digits',
        	bcPlayer : 'digits'
        } , 
        messages: {
	        bcHeight : "Please enter a valid height",
	        bcWidth : "Please enter a valid width",
	        bcPlayer : "Please enter a valid player number"
        }       
      });
}

//All of the extra validation needed for these forms
validate = function () {

	//Sets up validation messages and rules for the player settings
	validatePlayerSettings('#video-settings');
	validatePlayerSettings('#playlist-settings');

    //Sets up validation for the video so that if reference ID is not checked then it does not have to be a number
      $('#validate-video').validate({
        rules : {
          bcVideo : {
            number : { depends: function(element) {
                if ($("#bc-video-ref").attr('checked') == 'checked'){
                return false;
                } else {
                 return true;
                }
              }
            }
          }
        },//Sets up custom message
        messages: {
          bcVideo: {
          	number:"Please enter a number or check the box for reference ID"
          } 
        }
      });
    //Adds two methods to the validator that deals with a list of playlist IDs and a list of reference IDs
    $.validator.addMethod("listOfIds", function(value, element) {
    	//TODO see if you can remove first bracketed group
    	return (this.optional(element) || /^[^a-z\W][0-9,\s]*$/ig.test(value));
    }, "Please enter a single playlist ID or a list of IDs seperated by commas or spaces.");

    $.validator.addMethod("listOfRefIds", function(value, element) {
    	//TODO see if you can remove first bracketed group
    	return (this.optional(element) || /^[^\W][a-z0-9,\s_]*$/ig.test(value));
    }, "Please enter a single playlist ID or a list of IDs seperated by commas or spaces.");

    //Validates the list of playlist IDs
    $('#validate-playlist').validate({
      rules: {
        bcPlaylist : {
          listOfIds : { 
            depends : function(element) {
              if ($("#bc-playlist-ref").attr('checked') == 'checked'){
                return false;
              } else {
               return true;
              }
            }
          },
          listOfRefIds : { 
            depends : function(element) {
              if ($("#bc-playlist-ref").attr('checked') == '') {
                return false;
              } else {
                return true;
              }
            }
          }
        }
      }
    });

    //Makes it so form validates on the fly on #bc-video-ref changing
    $('#bc-video-ref').bind('change',function() {
      $('#bc-video').removeClass('valid').removeClass('error');
      //TODO check for underscores
      $('#validate-video').valid();
    });

    $('#bc-playlist-ref').bind('change',function() {
      $('#bc-playlist').removeClass('valid').removeClass('error');
      //TODO check for underscores
      $('#validate-playlist').valid();
    });
}

$(function () {

	var shortcodeHandlerVideo = function () {
		insertShortcode('video');
		return false;
	}

	var shortcodeHandlerPlaylist = function () {
		insertShortcode('playlist');
		return false;
	}

////////////////////////////Express tab//////////////////////////////
	//Checks to see if we are in express tabs or media API tabs
	if ($('#tabs').length > 0) {
	    $("#tabs").tabs();
	    $('.video-tab').bind('click', function (){
	    	hideErrorMessage();
			updateTab('single');
		});
		$('.playlist-tab').bind('click', function (){
			hideErrorMessage();
			updateTab('playlist');
		})
	}

	//Binds changes for video tab
	//TODO bind onto keydown in autocomplete fashion
	$('#bc-video').bind('change', function () {
		setPlayerData('single');
		addPlayer('single');
	});

	$('#bc-player').bind('change', function () {
		changePlayerID('single');
		addPlayer('single');
	});

	$('#bc-width').bind('change', function () {
		changeWidth('single');
		addPlayer('single');
	});

	$('#bc-height').bind('change', function () {
		changeHeight('single');
		addPlayer('single');
	});

	$('#video-settings').bind('submit', shortcodeHandlerVideo);
	$('#validate-video').bind('submit', shortcodeHandlerVideo);
	$('#video-shortcode-button').bind('click', shortcodeHandlerVideo);


	//Intitally always hides the playlist settings since video tab is first displayed
	$('#playlist-settings').addClass('hidden');

	///////////////////////////////API TAB/////////////////////////////

	//Checks to see if we are in express tabs or media API tabs
	if ($('#tabs-api').length > 0) {
		$('#video-settings').addClass('hidden');
	    $("#tabs-api").tabs();
	    $('.video-tab').bind('click', function (){
	    	hideErrorMessage();
			updateTab('single');
		});
		$('.playlist-tab').bind('click', function (){
			hideErrorMessage();
			updateTab('playlist');
		})
	}

	//Binds changes for playlist tab

	$('#bc-playlist').bind('change', function () {
		setPlayerData('playlist');
		addPlayer('playlist');
	});

	$('#bc-player-playlist').bind('change', function () {
		changePlayerID('playlist');
		addPlayer('playlist');
	});

	$('#bc-width-playlist').bind('change', function () {
		changeWidth('playlist');
		addPlayer('playlist');
	});

	$('#bc-height-playlist').bind('change', function () {
		changeHeight('playlist');
		addPlayer('playlist');
	});

	$('#playlist-settings').bind('submit', shortcodeHandlerPlaylist);
	$('#validate-playlist').bind('submit', shortcodeHandlerPlaylist);
	$('#playlist-shortcode-button').bind('click', shortcodeHandlerPlaylist);

	validate();

});

})(jQuery);


