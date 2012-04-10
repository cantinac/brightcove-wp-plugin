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
		playerHTML = markup(singlePlayerTemplate, playerData);
		$('#dynamic-bc-placeholder-video').html(playerHTML);

	} else if (typeOfPlayer == 'playlist') {
		playerHTML = markup(playlistPlayerTemplate, playerDataPlaylist);
		$('#dynamic-bc-placeholder-video').html(playerHTML);	
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
		playerDataPlayerPlayerlist.height = $('#bc-height-playlist').val();
		if (playerDataPlayerPlaylist.height == ''){
			playerDataPlayerPlaylist.height=getDefaultHeightPlaylist();
		}
	}
}

changeWidth = function (typeOfPlayer) {
	if (typeOfPlayer == 'single') {
		playerDataPlayer.width = $('#bc-width').val();
		if (playerDataPlayer.width == ''){
			playerDataPlayer.width=getDefaultwidth();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlayerPlayerlist.width = $('#bc-width-playlist').val();
		if (playerDataPlayerPlaylist.width == ''){
			playerDataPlayerPlaylist.width=getDefaultwidthPlaylist();
		}
	}
}

changePlayer = function (typeOfPlayer) {
	if (typeOfPlayer == 'single') {
		playerDataPlayer.playerID = $('#bc-playerID-playlist').val();
		if (playerDataPlayer.playerID == ''){
			playerDataPlayer.playerID=getDefaultwidth();
		}
	} else if (typeOfPlayer == 'playlist') {
		playerDataPlayerPlayerlist.playerID = $('#bc-playerID-playlist').val();
		if (playerDataPlayerPlaylist.playerID == ''){
			playerDataPlayerPlaylist.playerID=getDefaultwidthPlaylist();
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








})(jQuery);