/*Creates tab functionality in plugin*/
jQuery(document).ready(function() {

/*
function ($) {*/
  //Check to see if the default players are set if not return error
  if (jQuery('#defaults_not_set').data('defaultsset') ==  false)
  {
    jQuery('.no-error').addClass('hidden');
    jQuery('#defaults_not_set').removeClass('hidden');
  } else {
    //Check to see if the tabs on the express tab exist
    if (jQuery('#tabs').length > 0){
      jQuery("#tabs").tabs();
      jQuery('#tabs li a').bind('click', BCL.ignoreOtherTab);
    }
    //Check to see if the media api tabs exist
    if (jQuery('#tabs-api').length > 0) {
      jQuery("#tabs-api").tabs();
    } //Bind search functionality to media API
    if (jQuery('#bc_search').length > 0) {
      jQuery('#bc_search').bind('click', BCL.mediaAPISearch);
      jQuery('.playlist-tab-api').bind('click', BCL.seeAllPlaylists);
    }
  }
});

// namespace to keep the global clear of clutter
var BCL = {};

// data for our player -- note that it must have ActionScript/JavaScript APIs enabled!!
BCL.playerData = { "playerID" : "",
                    "width" : "480", //Fallback height and width
                    "height" : "270",
                    "videoID":"",
                    "isRef" : "" };

// template for the player object - will populate it with data using markup()
BCL.singlePlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\"; /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";
BCL.playlistPlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@playlistTabs\" value=\"{{playlistID}}\"; /><param name=\"@videoList\" value=\"{{playlistID}}\"; /><param name=\"@playlistCombo\" value=\"{{playlistID}}\"; /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";

BCL.setPlayerData = function ()
{
  /*Hides any error messages from previous attempts*/
  $('#bc-error').addClass('hidden');

  /*Checks to see if there is an ID for the player, if not then it assigns a default 
  player depending on if it's a single video or playlist*/
 
  // set the videoID to the selected video
  if ($('#bc-video').hasClass('ignore') == false) {
    BCL.playerData.videoID = $('#bc-video').val();
  } else {
    BCL.playerData.videoID = undefined; 
  }

  if ($('#bc-playlist').hasClass('ignore') == false) {
       // set the playlistID to the selected playlist
    BCL.playerData.playlistID = $('#bc-playlist').val();
  } else {
    BCL.playerData.playlistID= undefined;
  }
  
  BCL.playerData.playerID = $('#bc-player').val();
  console.log(BCL.playerData);
  if ((BCL.playerData.playerID == '' || BCL.playerData.playerID == undefined) && (BCL.playerData.playlistID == undefined || BCL.playerData.playlistID == "")) {
      BCL.playerData.playerID = $('#bc_default_player').val();
  } else if ((BCL.playerData.playerID == '' || BCL.playerData.playerID == undefined) && (BCL.playerData.videoID == undefined || BCL.playerData.videoID == "")) {
     BCL.playerData.playerID = $('#bc_default_player_playlist').val();
  }
  console.log(BCL.playerData);
  

  //If video reference box is checked
  if ($('#bc-video-ref').is(':checked') == true && $('#bc-video-ref').hasClass('ignore') == false) {
    BCL.playerData.videoID = "ref:"+BCL.playerData.videoID;
    BCL.playerData.isRef = "true";
  }

  //If playlist reference box is checked
  if ($('#bc-playlist-ref').is(':checked') == true && $('#bc-playlist-ref').hasClass('ignore') == false) {
    BCL.playerData.playlistID = "ref:"+BCL.playerData.playlistID;
    BCL.playerData.isRef = "true";
  } 

  if ($('#bc-height').val() != undefined && $('#bc-height').val() != '') {
    BCL.playerData.height = $('#bc-height').val();
  } else {
    BCL.playerData.height=$('#bc_default_height').val();
  }

  if ($('#bc-width').val() != undefined && $('#bc-width').val() != '') {
    BCL.playerData.width = $('#bc-width').val();
  } else {
    BCL.playerData.width=$('#bc_default_width').val();
  }

  BCL.addPlayer();
}

BCL.ignoreOtherTab = function () {
  
  BCL.playerData.playlistID='';
  BCL.playerData.videoID='';
  
  $('.ignore').removeClass('ignore');
  
  var currentTab = $(this).attr('class');

  if (currentTab == 'playlist-tab') {
    BCL.tempVideoPlayer=$('#bc-player').val();
    if (BCL.tempPlaylistPlayer != undefined) {
      $('#bc-player').val(BCL.tempPlaylistPlayer);
    } else {
      $('#bc-player').val('');
    }
  } else if (currentTab == 'video-tab') {
    BCL.tempPlaylistPlayer=$('#bc-player').val();
    if (BCL.tempVideoPlayer != undefined) {
      $('#bc-player').val(BCL.tempVideoPlayer);
    } else {
      $('#bc-player').val('');
    }
  }

  $('#tabs li a').each(function(i) {
    if ($(this).hasClass(currentTab) == false) {
     var otherTab = $(this).attr('class');
     $('.tab.'+otherTab).find(":input").addClass('ignore');
    }
  });
  BCL.setPlayerData();
}


BCL.addPlayer = function () { 
  /*Remove all of the old HTML for the player and the old title and description*/
  jQuery('#dynamic-bc-placeholder').html('');
  jQuery('#bc_title').html('');
  jQuery('#bc_description').html('');
  
  var playerHTML = "";
  // set the playerID to the selected player
  // populate the player object template
  if ( BCL.playerData.videoID != '' && BCL.playerData.videoID != undefined) {
    //If a single video id is entered
    playerHTML = BCL.markup(BCL.singlePlayerTemplate, BCL.playerData);
  } else if (BCL.playerData.playlistID != '' && BCL.playerData.playlistID != undefined) {
    //If a playlist is loaded
    playerHTML = BCL.markup(BCL.playlistPlayerTemplate, BCL.playerData);
  }
 

  // inject the player code into the DOM
  //Check to see if we are in the media API then check to see what the player type is
  if (BCL.typeOfPlayer == 'playlist' && jQuery('#tabs-api').length > 0) {
    jQuery('#bc-video-search-playlist').find('#dynamic-bc-placeholder').html(playerHTML);  
    BCL.dontDisplay = 'true';
    if (jQuery('.see_all_playlists').length == 0)
    {
      jQuery('#bc-video-search-playlist').prepend('<button class="see_all_playlists button">See all playlists</button>');
    }
    jQuery('.see_all_playlists').bind('click',function()
    {
      BCL.dontDisplay = 'false';
      BCL.seeAllPlaylists();
    });

  } else {
    jQuery('#dynamic-bc-placeholder').html(playerHTML);
  }
  
  // instantiate the player

  brightcove.createExperiences();  
  /*onTemplateLoaded('myExperience');*/
};

BCL.onTemplateError = function (event) {
  /*console.log(event);
  console.log(BCL.getErrorCode(event.code));*/
  $('#bc-error').html("An error has occured, please check to make sure that you have a valid video or playlist ID");
  $('#bc-error').removeClass('hidden');
}



BCL.onTemplateReady = function(event) {  
  BCL.player = brightcove.api.getExperience("myExperience");
  // get a reference to the video player
  BCL.videoPlayer = BCL.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
  BCL.videoPlayer.getCurrentVideo(function(videoDTO) {
    BCL.currentVideo = videoDTO;
    jQuery('#bc_title').html(BCL.currentVideo.displayName);
    jQuery('#bc_description').html(BCL.currentVideo.shortDescription);
  });
}

BCL.insertShortcode = function() {
  var isRef='';
  if (BCL.playerData.isRef == 'true') {
    isRef="isRef='"+BCL.playerData.isRef+"'";
  }
  if (BCL.playerData.videoID != undefined && BCL.playerData.videoID != '') {
    var shortcode = '[brightcove videoID="'+BCL.playerData.videoID+'" '+isRef+' playerID="'+BCL.playerData.playerID+'" height="'+BCL.playerData.height+'" width="'+BCL.playerData.width+'"]';
  } else if (BCL.playerData.playlistID != undefined) {
     var shortcode = '[brightcove playlistID="'+BCL.playerData.playlistID+'" '+isRef+' playerID="'+BCL.playerData.playerID+'" height="'+BCL.playerData.height+'" width="'+BCL.playerData.width+'"]';
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


BCL.mediaAPISearch = function() {
  BCL.searchParams = jQuery('#bc-search-field').val();
  BCMAPI.token = jQuery('#bc_api_key').val();
  // Make a call to the API requesting content
  // Note that a callback function is needed to handle the returned data
  /*Show loader*/
  /*Then in callback hide the loader*/
  BCMAPI.search({ "callback" : "BCL.displaySingleVideo", 'all' : BCL.searchParams}); 
};

BCL.seeAllPlaylists = function() {
  BCMAPI.token = jQuery('#bc_api_key').val();
  // Make a call to the API requesting content
  // Note that a callback function is needed to handle the returned data
  
  /*Show loader*/
  /*Then in callback hide the loader*/
  BCMAPI.find('find_all_playlists',{ "callback" : "BCL.displayPlaylist"});
};

BCL.displayPlaylist = function (pResponse)
{
   if (BCL.dontDisplay == 'true') {
     return;
   } else {
   BCL.typeOfPlayer='playlist';
   BCL.displayVideos(pResponse); 
  }
}

BCL.displaySingleVideo = function (pResponse)
{
  BCL.typeOfPlayer='single';
  BCL.displayVideos(pResponse);
}

 BCL.displayVideos = function (pResponse) {
 
    var innerHTML="";
    for (var pVideo in pResponse.items) {
      var numVideos="";
      var date=new Date(pResponse.items[pVideo].publishedDate*1000);
      /*console.log(date);

      console.log(pResponse.items[pVideo].length/1000);*/
      var modifiedDate = new Date(pResponse.items[pVideo].lastModifiedDate*1000);
      /*console.log(modifiedDate);*/

      var imgSrc=pResponse.items[pVideo].thumbnailURL;
      if (imgSrc == undefined && pResponse.items[pVideo].videos != undefined) {
        if (pResponse.items[pVideo].videos[0] != undefined) {
          imgSrc=pResponse.items[pVideo].videos[0].thumbnailURL;
          numVideos=pResponse.items[pVideo].videos.length;
          numVideos='<span class="title">'+numVideos+'</span>';
        }
      }
      var currentVid="<img src='"+imgSrc+"'/>";
      var currentName="<div class='filename new'><span class='title'>"+BCL.constrain(pResponse.items[pVideo].name,13)+"</span></div>";
      innerHTML = innerHTML+"<div data-videoID='"+pResponse.items[pVideo].id+"' title='"+pResponse.items[pVideo].name+"' class='bc_video media-item child-of-2 preloaded'>"+currentVid+currentName+numVideos+"</div>";  
  }
    innerHTML = '<div id="media-items" style="width:603px" class="ui-sortable">'+innerHTML+'</div>';
    var heading= '<table class="widefat" cellspacing="0"><thead><tr><th>Name</th><th class="order-head">Number of videos</th><th class="actions-head">Last Updated</th></tr></thead></table>';
    innerHTML = heading + innerHTML;

    if (BCL.typeOfPlayer == 'single') {
      jQuery('#bc-video-search-video').html(innerHTML);
    }
    if (BCL.typeOfPlayer == 'playlist') {
     jQuery('#bc-video-search-playlist').html(innerHTML);
    }
    jQuery('.bc_video').bind('click', function() {
    BCL.setHTML(jQuery(this).data('videoid'));
    });
  }

BCL.setHTML =function (videoId)
{
  innerHTML =  '<div id="dynamic-bc-placeholder"></div>';
  innerHTML += '<input class="block" type="text" id="bc-player" placeholder="Player ID" />';
  innerHTML += '<input onchange="BCL.setPlayerDataAPI()" class="block" id="bc-width" type="text" placeholder="Width (optional)" />';
  innerHTML += '<input onchange="BCL.setPlayerDataAPI()" class="block" type="text" id="bc-height" placeholder="Height (optional)" />';
  innerHTML += '<button onclick="BCL.insertShortcode()">Insert Video </button>';
  
  if (BCL.typeOfPlayer == 'single') {
    jQuery('#bc-video-search-video').html(innerHTML);
    BCL.playerData.videoID=videoId;
  } else {
    jQuery('#bc-video-search-playlist').html(innerHTML);
      BCL.playerData.playlistID=videoId;
  } 

  jQuery('#bc-player').bind('change', BCL.changePlayer);
  BCL.setPlayerDataAPI();
}

BCL.setPlayerDataAPI = function (){

  if (BCL.typeOfPlayer == 'single') {
    BCL.playerData = {  "playerID" : jQuery('#bc_default_player').val(),
                      "width"   : jQuery('#bc-width').val(),
                      "height"  : jQuery('#bc-height').val(),
                      "videoID" : BCL.playerData.videoID,
                      "isRef"   : ""};
  } else {
    BCL.playerData = {  "playerID" : jQuery('#bc_default_player_playlist').val(),
                      "width"   : jQuery('#bc-width').val(),
                      "height"  : jQuery('#bc-height').val(),
                      "playlistID" : BCL.playerData.playlistID,
                      "isRef"   : ""};
                    }
                 
  BCL.addPlayer();
}

BCL.changePlayer = function() {
  BCL.playerData.playerID = jQuery('#bc-player').val();
  BCL.addPlayer();
}

///////////////////////////////////  Helper Functions //////////////////////////////////////////
BCL.constrain = function (str,n){
  if (str.length > n) {
    var s = str.substr(0, n);
    s = s.toString() + '&hellip;'
    return s;
  } else { 
    return str; 
  }
}

/* 
simple HTML templating function
 array example:
   demo.markup("
{{1}}, {{0}}
", ["John", "Doe"]);
 object example:
   demo.markup("
{{last}}, {{first}}
", {first:"John", last:"Doe"});
*/
BCL.markup = function (html, data) {
    var m;
    var i = 0;
    var match = html.match(data instanceof Array ? /{{\d+}}/g : /{{\w+}}/g) || [];
    while (m = match[i++]) {
        html = html.replace(m, data[m.substr(2, m.length-4)]);
    }
    return html;
};

BCL.getErrorCode = function (code) {
  var errorCode = undefined;
  $.each(brightcove.errorCodes, function(key, value) {
    if (code == value) {
      errorCode = key;
      return false;
    }
  });
  if(errorCode) {
    return errorCode;
  }
  return "UNKNOWN ERROR CODE";
}




