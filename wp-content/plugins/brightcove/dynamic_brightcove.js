// namespace to keep the global clear of clutter
var BCL = {};
// data for our player -- note that it must have ActionScript/JavaScript APIs enabled!!
BCL.playerData = { "playerID" : "1450315110001",
                    "width" : "480",
                    "height" : "270",
                    "videoID" : "1140969113001",
                    "isRef" : "" };
// flag to keep track of whether there is a player
BCL.isPlayerAdded = false;
// template for the player object - will populate it with data using markup()
BCL.singlePlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"playerKey\" value=\"{{playerKey}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\"; /><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"</object>";
BCL.playlistPlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"playerKey\" value=\"{{playerKey}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@playlistTabs\" value=\"{{playlistID}}\"; /><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"</object>";

BCL.addPlayer = function () { 
  /*BCL.isPlayerAdded = true;*/
  var playerHTML = "";
  // set the playerID to the selected player
  BCL.playerData.playerID = document.getElementById('bc-player').value;
  if (BCL.playerData.playerID == '')
  {
    BCL.playerData.playerID = document.getElementById('bc_default_player').value;
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
};

BCL.insertShortcode = function() {

      var isRef='';
      if (BCL.playerData.isRef == 'true') {
       isRef="isRef='"+BCL.playerData.isRef+"'";
      }
         
      if (BCL.playerData.videoID != '')
      {
         var shortcode = '[brightcove videoID="'+BCL.playerData.videoID+'" '+isRef+' playerID="'+BCL.playerData.playerID+'"]';
      }

      else if (BCL.playerData.playlistID != '')
      {
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