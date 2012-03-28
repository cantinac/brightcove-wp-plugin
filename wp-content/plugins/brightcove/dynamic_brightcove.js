/*Creates tab functionality in plugin*/
jQuery(document).ready(function() {

  jQuery('#validate_settings').validate({
    
    messages:{
      bcHeight : "Please enter a valid height",
      bcWidth : "Please enter a valid width",
      bcPlayer : "Please enter a valid player number",
    }
  });


  jQuery('#validate_video').validate({
   rules : {
     bcVideo : {
       number : { depends: function(element) {
           if (jQuery("#bc-video-ref").attr('checked') == 'checked'){
           return false;
         } else {
             return true;
           }
         }
        }
      }
    },
   messages: {
      bcVideo: {
       number:"Please enter a number or check the box for being a reference ID"
      } 
    }
  });

    jQuery.validator.addMethod("listOfIds", function(value, element) {
      return (this.optional(element) || /^[^a-z\W][0-9,\s]*$/ig.test(value));
    }, "Please enter a single playlist ID or a list of IDs seperated by commas or spaces.");

    jQuery.validator.addMethod("listOfRefIds", function(value, element) {
      return (this.optional(element) || /^[^\W][a-z0-9,\s]*$/ig.test(value));
    }, "Please enter a single playlist ID or a list of IDs seperated by commas or spaces.");

  jQuery('#validate_playlist').validate({
    rules: {
      bcPlaylist: {
        listOfIds:{ depends: function(element) {
            if (jQuery("#bc-playlist-ref").attr('checked') == 'checked'){
              return false;
            } else {
              return true;
            }
          }
        },
        listOfRefIds:{ depends: function(element) {
            if (jQuery("#bc-playlist-ref").attr('checked') == ''){
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
  jQuery('#bc-video-ref').bind('change',function() {
    jQuery('#bc-video').removeClass('valid').removeClass('error');
    jQuery('#validate_video').valid();
  });

  jQuery('#bc-playlist-ref').bind('change',function() {
    jQuery('#bc-playlist').removeClass('valid').removeClass('error');
    jQuery('#validate_playlist').valid();
  });

/*function ($) {*/
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

BCL.setError = function()
{
  if (jQuery('#validate_video').find('label[generated]').length >0) {
      jQuery('#validate_video').find('label[generated]').html('Please enter a number or check box for ref ID if this is a reference ID');
      alert('stop');
    }
}

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
  jQuery('#bc-error').addClass('hidden');

  /*Checks to see if there is an ID for the player, if not then it assigns a default 
  player depending on if it's a single video or playlist*/
 
  // set the videoID to the selected video
  if (jQuery('#bc-video').hasClass('ignore') == false) {
    BCL.playerData.videoID = jQuery('#bc-video').val();
  } else {
    BCL.playerData.videoID = undefined; 
  }

  if (jQuery('#bc-playlist').hasClass('ignore') == false) {
       // set the playlistID to the selected playlist
    BCL.playerData.playlistID = jQuery('#bc-playlist').val();
  } else {
    BCL.playerData.playlistID= undefined;
  }
  
  BCL.playerData.playerID = jQuery('#bc-player').val();
  console.log(BCL.playerData);
  if ((BCL.playerData.playerID == '' || BCL.playerData.playerID == undefined) && (BCL.playerData.playlistID == undefined || BCL.playerData.playlistID == "")) {
      BCL.playerData.playerID = jQuery('#bc_default_player').val();
  } else if ((BCL.playerData.playerID == '' || BCL.playerData.playerID == undefined) && (BCL.playerData.videoID == undefined || BCL.playerData.videoID == "")) {
     BCL.playerData.playerID = jQuery('#bc_default_player_playlist').val();
  }
  console.log(BCL.playerData);
  

  //If video reference box is checked
  if (jQuery('#bc-video-ref').is(':checked') == true && jQuery('#bc-video-ref').hasClass('ignore') == false) {
    BCL.playerData.videoID = "ref:"+BCL.playerData.videoID;
    BCL.playerData.isRef = "true";
  }

  //If playlist reference box is checked
  if (jQuery('#bc-playlist-ref').is(':checked') == true && jQuery('#bc-playlist-ref').hasClass('ignore') == false) {
    BCL.playerData.playlistID = "ref:"+BCL.playerData.playlistID;
    BCL.playerData.isRef = "true";
  } 

  if (jQuery('#bc-height').val() != undefined && jQuery('#bc-height').val() != '') {
    BCL.playerData.height = jQuery('#bc-height').val();
  } else {
    BCL.playerData.height=jQuery('#bc_default_height').val();
  }

  if (jQuery('#bc-width').val() != undefined && jQuery('#bc-width').val() != '') {
    BCL.playerData.width = jQuery('#bc-width').val();
  } else {
    BCL.playerData.width=jQuery('#bc_default_width').val();
  }

  BCL.addPlayer();
}

BCL.ignoreOtherTab = function () {
  
  BCL.playerData.playlistID='';
  BCL.playerData.videoID='';
  
  jQuery('.ignore').removeClass('ignore');
  
  var currentTab = jQuery(this).attr('class');

  if (currentTab == 'playlist-tab') {
    BCL.tempVideoPlayer=jQuery('#bc-player').val();
    if (BCL.tempPlaylistPlayer != undefined) {
      jQuery('#bc-player').val(BCL.tempPlaylistPlayer);
    } else {
      jQuery('#bc-player').val('');
    }
  } else if (currentTab == 'video-tab') {
    BCL.tempPlaylistPlayer=jQuery('#bc-player').val();
    if (BCL.tempVideoPlayer != undefined) {
      jQuery('#bc-player').val(BCL.tempVideoPlayer);
    } else {
      jQuery('#bc-player').val('');
    }
  }

  jQuery('#tabs li a').each(function(i) {
    if (jQuery(this).hasClass(currentTab) == false) {
     var otherTab = jQuery(this).attr('class');
     jQuery('.tab.'+otherTab).find(":input").addClass('ignore');
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
      jQuery('#bc-video-search-playlist').before('<button class="see_all_playlists button">See all playlists</button>');
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
  jQuery('#bc-error').html("An error has occured, please check to make sure that you have a valid video or playlist ID");
  jQuery('#bc-error').removeClass('hidden');
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
      var currentContent = jQuery('#content', window.parent.document).val();
      if ( typeof currentContent == 'undefined' )
           currentContent = '';        
      jQuery( '#content', window.parent.document ).val( currentContent + shortcode );
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

    var playlistOrVideo='video';
    if (pResponse.items[pVideo].videos != undefined) {
      playlistOrVideo='playlist';
      }
  
      /*playlists: name, # of videos, last updated*/
      if (playlistOrVideo == 'playlist'){
        var lastModifiedDate = 99999999999999;
        jQuery.each(pResponse.items[pVideo].videos, function(key,value) {
          tempDate = value.lastModifiedDate;
          if (tempDate < lastModifiedDate) {
            lastModifiedDate = tempDate;
          }
        });

        var month = new Date(lastModifiedDate*10).getDate();
        var day = new Date(lastModifiedDate*10).getDay();
        var year = new Date(lastModifiedDate*10).getYear();
        console.log(new Date (lastModifiedDate));
        lastModifiedDate ='<span class="title">'+month+'/'+day+'/'+year+'</span>';


        var numVideos='<span class="title">'+pResponse.items[pVideo].videos.length+'</span>';
        var heading = '<table class="widefat" cellspacing="0"><thead><tr><th>Name</th><th>Number of videos</th><th>Last Updated</th></tr></thead></table>';
        if (pResponse.items[pVideo].videos.length > 0) {
          var imgSrc=pResponse.items[pVideo].videos[0].thumbnailURL;
        }
        var currentName="<div class='filename new'><span class='title'>"+BCL.constrain(pResponse.items[pVideo].name,13)+"</span></div>";
        var currentVid="<img class='pinkynail toggle' src='"+imgSrc+"'/>";
        
        innerHTML = innerHTML+"<div data-videoID='"+pResponse.items[pVideo].id+"' title='"+pResponse.items[pVideo].name+"' class='clearfix bc_video media-item child-of-2 preloaded'>"+currentVid+currentName+numVideos+lastModifiedDate+"</div>";  

    } else {
        //videos: small thumbnail, name, duration, published date
        var currentName="<div class='filename new'><span class='title'>"+BCL.constrain(pResponse.items[pVideo].name,13)+"</span></div>";
        var currentVid="<img class='pinkynail toggle' src='"+imgSrc+"'/>";
        var lengthMin = Math.floor(pResponse.items[pVideo].length/60000);
        var lengthSec = Math.floor((pResponse.items[pVideo].length%60000)/1000);
        var length = (lengthMin+":"+lengthSec);
        var date='<span>'+new Date(pResponse.items[pVideo].publishedDate*1000)+'</span>';
        var imgSrc=pResponse.items[pVideo].thumbnailURL;

        var heading = '<table class="widefat" cellspacing="0"><thead><tr><th>Name</th><th>Duration</th><th>Published Date</th></tr></thead></table>';
        innerHTML = innerHTML+"<div data-videoID='"+pResponse.items[pVideo].id+"' title='"+pResponse.items[pVideo].name+"' class='clearfix bc_video media-item child-of-2 preloaded'>"+currentVid+currentName+numVideos+date+"</div>";  

      }
  }
    innerHTML = '<div id="media-items" style="width:603px" class="ui-sortable">'+innerHTML+'</div>';
    
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
  jQuery.each(brightcove.errorCodes, function(key, value) {
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




