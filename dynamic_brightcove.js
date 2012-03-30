(function ($) {

var singlePlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\"; /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";
var playlistPlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@playlistTabs\" value=\"{{playlistID}}\"; /><param name=\"@videoList\" value=\"{{playlistID}}\"; /><param name=\"@playlistCombo\" value=\"{{playlistID}}\"; /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";

playerDataPlaylist = {
    "playerID" : "",
    "width" : "", //Fallback height and width
    "height" : "",
    "playlistID":"",
    "isRef" : false
  };

playerDataPlayer = {
    "playerID" : "",
    "width" : "", //Fallback height and width
    "height" : "",
    "videoID":"",
    "isRef" : false
  };
  
addPlayer = function (typeOfPlayer)	{
	var playerHTML;
	if (typeOfPlayer == 'single')	{
		playerHTML = markup(singlePlayerTemplate, playerDataPlayer);
		$('#dynamic-bc-placeholder-video').html(playerHTML);

	} else if (typeOfPlayer == 'playlist') {
		playerHTML = markup(playlistPlayerTemplate, playerDataPlaylist);
		$('#dynamic-bc-placeholder-playlist').html(playerHTML);	
	}
}

setPlayerData = function (typeOfPlayer) {
	changeHeight(typeOfPlayer);
	changeWidth(typeOfPlayer);
	changePlayer(typeOfPlayer);
}

//Helper functions to set height, width and playerID
changeHeight = function (typeOfPlayer) {
	if (typeOfPlayer == 'single') {
		playerDataPlayer.height = $('#bc-height').val();
		if (playerDataPlayer.height == ''){
			playerDataPlayer.height=getDefaultHeight();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlaylist.height = $('#bc-height-playlist').val();
		if (playerDataPlaylist.height == ''){
			playerDataPlaylist.height=getDefaultHeightPlaylist();
		}
	}
}

changeWidth = function (typeOfPlayer) {
		
	if (typeOfPlayer == 'single') {
		playerDataPlayer.width = $('#bc-width').val();
		if (playerDataPlayer.width == ''){
			playerDataPlayer.width=getDefaultWidth();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlaylist.width = $('#bc-width-playlist').val();
		if (playerDataPlaylist.width == ''){
			playerDataPlaylist.width=getDefaultWidthPlaylist();
		}
	}

}

changePlayer = function (typeOfPlayer) {
	if (typeOfPlayer == 'single') {
		playerDataPlayer.playerID = $('#bc-playerID').val();
		if (playerDataPlayer.playerID == ''){
			playerDataPlayer.playerID=getDefaultPLayer();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlayerPlayerlist.playerID = $('#bc-playerID-playlist').val();
		if (playerDataPlayerPlaylist.playerID == ''){
			playerDataPlayerPlaylist.playerID=getDefaultPlayerPlaylist();
		}
	}
}

//Helper functions for video player
getDefaultHeight = function () {
	return $('#bc-default-height').val();
}
getDefaultWidth = function () {
	return $('#bc-default-height').val();
}

getDefaultPlayer = function () {
	return $('#bc-default-player').val();
}

//Helper functions for playlist player
getDefaultHeightPlaylist = function () {
	return $('#bc-default-height-playlist').val();
}

getDefaultWidthPlaylist = function () {	
	return $('#bc-default-width-playlist').val();
}

getDefaultPlayerPlaylist = function () {
	return $('#bc-default-player-playlist').val();
}

switchSettings =function (typeOfPlayer) {	
	if (typeOfPlayer == 'playlist'){
		$('.video-hide').addClass('hidden');
		$('.playlist-hide').removeClass('hidden');
	} else if (typeOfPlayer == 'single') {
		$('.video-hide').removeClass('hidden');
		$('.playlist-hide').addClass('hidden');
	}	
}
////////////////////////General Helper Functions/////////////////

markup = function (html, data) {
      var m;
      var i = 0;
      var match = html.match(data instanceof Array ? /{{\d+}}/g : /{{\w+}}/g) || [];
      while (m = match[i++]) {
          html = html.replace(m, data[m.substr(2, m.length-4)]);
      }
      return html;
  };

$(function () {
	if ($('#tabs').length > 0) {
	    $("#tabs").tabs();
	    $('.video-tab').bind('click', function (){
			switchSettings('single');
		});
		$('.playlist-tab').bind('click', function (){
			switchSettings('playlist');
		})
	}

	$('#bc-video').bind('change', function () {

		setPlayerData('single');
		addPlayer('single');
	})

	$('#bc-playlist').bind('change', function () {
		setPlayerData('playlist');
		addPlayer('playlist');
	})



	$('#playlist-settings').addClass('hidden');
});






})(jQuery);