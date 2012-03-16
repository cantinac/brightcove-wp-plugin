// namespace to keep the global clear of clutter
var BCL = {};
// data for our player -- note that it must have ActionScript/JavaScript APIs enabled!!
BCL.playerData = { "playerID" : "1450315110001",
                    "width" : "480",
                    "height" : "270",
                    "videoID" : "1140969113001" };
// flag to keep track of whether there is a player
BCL.isPlayerAdded = false;
// template for the player object - will populate it with data using markup()
BCL.singlePlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"playerKey\" value=\"{{playerKey}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\"; /><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"</object>";
BCL.playlistPlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"playerKey\" value=\"{{playerKey}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@playlistTabs\" value=\"{{playlistID}}\"; /><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"</object>";

BCL.addPlayer = function () {

  
  // if we don't already have a player
  if (BCL.isPlayerAdded == false) {
    BCL.isPlayerAdded = true;
    var playerHTML = "";

    BCL.playerData.playerID = document.getElementById('bc-player').value;
    
    // set the videoID to the selected video

    BCL.playerData.videoID = document.getElementById('bc-video').value;
    BCL.playerData.playlistID = document.getElementById('bc-playlist').value;

    
    if (document.getElementById('bc-video-ref').checked == 'true')
    {
      BCL.playerData.videoID = "ref:"+BCL.playerData.videoID;
    }

    if (document.getElementById('bc-playlist-ref').checked == 'true')
    {
      BCL.playerData.playlistID = "ref:"+BCL.playerData.playlistID;
    }

    
    console.log(BCL.playerData.playlistID);

    
    if ( BCL.playerData.videoID != '') {
      // populate the player object template
      playerHTML = BCL.markup(BCL.singlePlayerTemplate, BCL.playerData);
    } else if (BCL.playerData.playlistID != '') {
      playerHTML = BCL.markup(BCL.playlistPlayerTemplate, BCL.playerData);
    }

    
    
    // inject the player code into the DOM
    document.getElementById("placeHolder").innerHTML = playerHTML;
    // instantiate the player
    brightcove.createExperiences();
  }
  // user must have requested a different video for player already loaded
  else {
    console.log(BCL.videoSelect.selectedIndex);
    BCL.videoPlayer.loadVideo(BCL.videoData[BCL.videoSelect.selectedIndex].videoID);
  }
};
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