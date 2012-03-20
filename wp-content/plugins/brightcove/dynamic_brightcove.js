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
BCL.singlePlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"playerKey\" value=\"{{playerKey}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\"; /><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"</object>";
BCL.playlistPlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"playerKey\" value=\"{{playerKey}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@playlistTabs\" value=\"{{playlistID}}\"; /><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"</object>";



BCL.setPlayerData = function ()
{
  BCL.playerData.playerID = document.getElementById('bc-player').value;

  if (BCL.playerData.playerID == '' && document.getElementById('bc-playlist').value == '') {
    BCL.playerData.playerID = document.getElementById('bc_default_player').value;
  } else if (BCL.playerData.playerID == '' && document.getElementById('bc-video').value == '') {
     BCL.playerData.playerID = document.getElementById('bc_default_player_playlist').value;
  }
  // set the videoID to the selected video
  BCL.playerData.videoID = document.getElementById('bc-video').value;
  // set the playlistID to the selected playlist
  BCL.playerData.playlistID = document.getElementById('bc-playlist').value;

  //If video reference box is checked
  if (document.getElementById('bc-video-ref').checked == true) {
    BCL.playerData.videoID = "ref:"+BCL.playerData.videoID;
    BCL.playerData.isRef = "true";
  }

  //If playlist reference box is checked
  if (document.getElementById('bc-playlist-ref').checked == true) {
    BCL.playerData.playlistID = "ref:"+BCL.playerData.playlistID;
    BCL.playerData.isRef = "true";
  } 
  BCL.addPlayer();
}


BCL.addPlayer = function () { 

  /*BCL.isPlayerAdded = true;*/
  var playerHTML = "";
  // set the playerID to the selected player
  // populate the player object template
  if ( BCL.playerData.videoID != '') {
    //If a single video id is entered
    playerHTML = BCL.markup(BCL.singlePlayerTemplate, BCL.playerData);
  } else if (BCL.playerData.playlistID != '') {
    //If a playlist is loaded
    playerHTML = BCL.markup(BCL.playlistPlayerTemplate, BCL.playerData);
  }

  // inject the player code into the DOM
  document.getElementById("dynamic-bc-placeholder").innerHTML = playerHTML;
  // instantiate the player

  brightcove.createExperiences();  
  /*onTemplateLoaded('myExperience');*/
};

BCL.onTemplateLoaded = function(id) {
   BCL.player = brightcove.getExperience(id);
   BCL.currPlayer= BCL.player.getModule(APIModules.EXPERIENCE);
   BCL.currVid= BCL.player.getModule(APIModules.CONTENT);
   BCL.currID=BCL.currPlayer.getExperienceID();
   console.log(BCL.currVid.getMedia(ID));
}

BCL.insertShortcode = function() {
  var isRef='';
  if (BCL.playerData.isRef == 'true') {
    isRef="isRef='"+BCL.playerData.isRef+"'";
  }
  if (BCL.playerData.videoID != undefined && BCL.playerData.videoID != '') {
    var shortcode = '[brightcove videoID="'+BCL.playerData.videoID+'" '+isRef+' playerID="'+BCL.playerData.playerID+'"]';
  } else if (BCL.playerData.playlistID != undefined) {
     var shortcode = '[brightcove playlistID="'+BCL.playerData.playlistID+'" '+isRef+' playerID="'+BCL.playerData.playerID+'"]';
  }
     
  var win = window.dialogArguments || opener || parent || top;
  var isVisual = (typeof win.tinyMCE != "undefined") && win.tinyMCE.activeEditor && !win.tinyMCE.activeEditor.isHidden();    
  if (isVisual) {
      win.tinyMCE.activeEditor.execCommand('mceInsertContent', false, shortcode);
  } else {
      var currentContent = jQuery('#content', window.parent.document).val();
      if ( typeof currentContent == 'undefined' )
           currentContent = '';        
      jQuery( '#content', window.parent.document ).val( currentContent + shortcode );
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
  BCMAPI.token = "pF-Nn_-cfM0eqJ4CgGPQ4dzsM7__X0IrdwmsHgnUoCsy_AOoyGND_Q..";
  // Make a call to the API requesting content
  // Note that a callback function is needed to handle the returned data
  BCMAPI.search({ "callback" : "BCL.displaySingleVideo", 'all':BCL.searchParams});
  // Our callback loops through the returned videos, alerting their names
 
};

BCL.seeAllPlaylists = function() {
  BCMAPI.token = "pF-Nn_-cfM0eqJ4CgGPQ4dzsM7__X0IrdwmsHgnUoCsy_AOoyGND_Q..";
  // Make a call to the API requesting content
  // Note that a callback function is needed to handle the returned data
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
        
      var currentName="<h3>"+BCL.constrain(pResponse.items[pVideo].name,20)+"</h3>";
      var currentVid="<img src='"+pResponse.items[pVideo].thumbnailURL+"'/>";
      innerHTML = innerHTML+"<div id='bc_video_"+pVideo+"' onclick='BCL.setPlayerDataAPI("+pVideo+","+pResponse.items[pVideo].id+")' title='"+pResponse.items[pVideo].name+"' class='bc_video_thumb'>"+currentName+currentVid+"</div>";
    }
    document.getElementById("bc-video-search").innerHTML = innerHTML;
  }

BCL.setPlayerDataAPI = function (id, videoId){
  document.getElementById('bc-video-search').innerHTML='<div id="dynamic-bc-placeholder"></div><button onclick="BCL.insertShortcode()">Insert Video </button><input type="text" id="bc-player" onchange="BCL.changePlayer()" placeholder="Player ID" />';
  
  if (BCL.typeOfPlayer == 'playlist')
  {
    console.log('something');
  }
  console.log(BCL.typeOfPlayer);
  if (BCL.typeOfPlayer == 'single') {
    console.log('something');
    BCL.playerData = {  "playerID" : document.getElementById('bc_default_player').value,
                      "width"   : "480",
                      "height"  : "270",
                      "videoID" : videoId,
                      "isRef"   : ""};
  } else {
   
    BCL.playerData = {  "playerID" : document.getElementById('bc_default_player_playlist').value,
                      "width"   : "480",
                      "height"  : "270",
                      "playlistID" : videoId,
                      "isRef"   : ""};
                    }
  BCL.addPlayer();
}

BCL.changePlayer = function() {
  BCL.playerData.playerID = document.getElementById('bc-player').value;
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




