/*Creates tab functionality in plugin*/
jQuery(document).ready(function() {

  if (jQuery('#tabs').length > 0){
    jQuery("#tabs").tabs();
    jQuery('#tabs li a').bind('click', BCL.ignoreOtherTab);
  }
    
    jQuery('#bc_search').bind('click', BCL.mediaAPISearch);
    jQuery('#show_playlists').bind('click', BCL.seeAllPlaylists);
   /*
   jQuery('#bc_search').bind('click', function(){
     BCL.mediaAPISearch();
   });

  jQuery('#show_playlists').bind('click', function(){
    BCL.seeAllPlaylists();
  });*/

});

// namespace to keep the global clear of clutter
var BCL = {};

// data for our player -- note that it must have ActionScript/JavaScript APIs enabled!!
BCL.playerData = { "playerID" : "",
                    "width" : "480",
                    "height" : "270",
                    "videoID":"",
                    "isRef" : "" };
// flag to keep track of whether there is a player
BCL.isPlayerAdded = false;
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
  document.getElementById("dynamic-bc-placeholder").innerHTML = playerHTML;
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

BCL.onTemplateReady = function(event) {  
  BCL.player = brightcove.api.getExperience("myExperience");
  // get a reference to the video player
  BCL.videoPlayer = BCL.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
  BCL.videoPlayer.getCurrentVideo(function(videoDTO) {
    BCL.currentVideo = videoDTO;
    document.getElementById('bc_title').innerHTML=BCL.currentVideo.displayName;
    document.getElementById('bc_description').innerHTML=BCL.currentVideo.shortDescription;
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

BCL.mediaAPISearch = function() {
  BCL.searchParams = document.getElementById('bc-search-field').value;
  BCMAPI.token = jQuery('#bc_api_key').val();
  /*BCMAPI.token = "pF-Nn_-cfM0eqJ4CgGPQ4dzsM7__X0IrdwmsHgnUoCsy_AOoyGND_Q..";*/
  // Make a call to the API requesting content
  // Note that a callback function is needed to handle the returned data

  /*Show loader*/
  /*Then in callback hide the loader*/
  BCMAPI.search({ "callback" : "BCL.displaySingleVideo", 'all' : BCL.searchParams});
  // Our callback loops through the returned videos, alerting their names
 
};

BCL.seeAllPlaylists = function() {
  BCMAPI.token = jQuery('#bc_api_key').val();
  // Make a call to the API requesting content
  // Note that a callback function is needed to handle the returned data
  
  /*Show loader*/
  /*Then in callback hide the loader*/
  
  BCMAPI.find('find_all_playlists',{ "callback" : "BCL.displayPlaylist"});
  // Our callback loops through the returned videos, alerting their names 
};

BCL.displayPlaylist = function (pResponse)
{
 BCL.typeOfPlayer='playlist';
 BCL.displayVideos(pResponse); 
}

BCL.displaySingleVideo = function (pResponse)
{
  BCL.typeOfPlayer='single';
  BCL.displayVideos(pResponse);
}

 BCL.displayVideos = function (pResponse) {
    var innerHTML="";
    for (var pVideo in pResponse.items) {
      if (pVideo % 3 == 0 && pVideo != 0) {
        innerHTML=innerHTML+'</div><div class="bc_row">';
      } else if (pVideo == 0) {
        innerHTML=innerHTML+'<div class="bc_row">';
      }
      var imgSrc=pResponse.items[pVideo].thumbnailURL;
      if (imgSrc == undefined && pResponse.items[pVideo].videos != undefined) {
        if (pResponse.items[pVideo].videos[0] != undefined) {
          imgSrc=pResponse.items[pVideo].videos[0].thumbnailURL;
        }
      }

      var currentName="<h3>"+BCL.constrain(pResponse.items[pVideo].name,20)+"</h3>";
      var currentVid="<img src='"+imgSrc+"'/>";
      innerHTML = innerHTML+"<div id='bc_video_"+pVideo+"' data-videoID='"+pResponse.items[pVideo].id+"' title='"+pResponse.items[pVideo].name+"' class='bc_video_thumb'>"+currentName+currentVid+"</div>";
    }
    
    jQuery('#bc-video-search').html(innerHTML);
    jQuery('.bc_video_thumb').bind('click', function() {
    console.log(this);
    BCL.setPlayerDataAPI(jQuery(this).data('videoid'));
    });
  }

BCL.setPlayerDataAPI = function (videoId){
  jQuery('#bc-video-search').html('<div id="dynamic-bc-placeholder"></div><button onclick="BCL.insertShortcode()">Insert Video </button><input type="text" id="bc-player" onchange="BCL.changePlayer()" placeholder="Player ID" />');
  if (BCL.typeOfPlayer == 'single') {
    BCL.playerData = {  "playerID" : jQuery('#bc_default_player').val(),
                      "width"   : "480",
                      "height"  : "270",
                      "videoID" : videoId,
                      "isRef"   : ""};
  } else {
   
    BCL.playerData = {  "playerID" : jQuery('#bc_default_player_playlist').val(),
                      "width"   : "480",
                      "height"  : "270",
                      "playlistID" : videoId,
                      "isRef"   : ""};
                    }
  BCL.addPlayer();
}

BCL.changePlayer = function() {
  BCL.playerData.playerID = jQuery('#bc-player').val();
  BCL.addPlayer();
}

BCL.constrain = function (str,n){
  if (str.length > n) {
    var s = str.substr(0, n);
    s = s.toString() + '&hellip;'
    return s;
  } else { 
    return str; 
  }
}




