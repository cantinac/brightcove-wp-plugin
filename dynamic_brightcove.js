var BCL = {};

(function ($) {

  // Displays video ID validation error
  BCL.setError = function() {
    if ($('#validate_video').find('label[generated]').length >0) {
        $('#validate_video').find('label[generated]').html('Please enter a number or check box for ref ID if this is a reference ID');
        alert('stop');
      }
  }

  // data for our player -- note that it must have ActionScript/JavaScript APIs enabled!!
  // TODO take out of namespace?
  BCL.playerData = {
    "playerID" : "",
    "width" : "480", //Fallback height and width
    "height" : "270",
    "videoID":"",
    "isRef" : false
  };

  // template for the player object - will populate it with data using markup()
  BCL.singlePlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"{{videoID}}\"; /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";
  BCL.playlistPlayerTemplate = "<div style=\"display:none\"></div><object id=\"myExperience\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#64AAB2\" /><param name=\"width\" value=\"{{width}}\" /><param name=\"height\" value=\"{{height}}\" /><param name=\"playerID\" value=\"{{playerID}}\" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@playlistTabs\" value=\"{{playlistID}}\"; /><param name=\"@videoList\" value=\"{{playlistID}}\"; /><param name=\"@playlistCombo\" value=\"{{playlistID}}\"; /><param name='includeAPI' value='true' /><param name='templateReadyHandler' value='BCL.onTemplateReady' /><param name='templateErrorHandler' value='BCL.onTemplateError' /></object>";

  // Express: grabs the player data from the UI
  BCL.setPlayerData = function () {
    /*Hides any error messages from previous attempts*/
    $('#bc-error').addClass('hidden');

    /*Checks to see if there is an ID for the player, if not then it assigns a default 
    player depending on if it's a single video or playlist*/
   
    // set the videoID to the selected video
    if (!$('#bc-video').hasClass('ignore')) {
      BCL.playerData.videoID = $('#bc-video').val();
    } else {
      BCL.playerData.videoID = undefined; 
    }

    if (!$('#bc-playlist').hasClass('ignore')) {
      // set the playlistID to the selected playlist
      // FIXME should be split based on regex
      // TODO rename
      var IDS=$('#bc-playlist').val().split(" ").join(",").split(",");
      var newIDS=[];
      /*Goes through each value in the array and if it's not blank add's it to the list*/
      // TODO don't need this
      $.each(IDS, function(key,value) {
        if (value != "") {
         newIDS.push(value); 
        }
      });
      BCL.playerData.playlistID = newIDS.join(',');
    } else {
      BCL.playerData.playlistID= undefined;
    }
    
    BCL.playerData.playerID = $('#bc-player').val();
    if ((BCL.playerData.playerID == '' || BCL.playerData.playerID == undefined) && (BCL.playerData.playlistID == undefined || BCL.playerData.playlistID == "")) {
        BCL.playerData.playerID = $('#bc_default_player').val();
    } else if ((BCL.playerData.playerID == '' || BCL.playerData.playerID == undefined) && (BCL.playerData.videoID == undefined || BCL.playerData.videoID == "")) {
       BCL.playerData.playerID = $('#bc_default_player_playlist').val();
    }

    //If video reference box is checked
    if ($('#bc-video-ref').is(':checked') && !$('#bc-video-ref').hasClass('ignore')) {
      BCL.playerData.videoID = "ref:"+BCL.playerData.videoID;
      BCL.playerData.isRef = true;
    }

    //If playlist reference box is checked
    if ($('#bc-playlist-ref').is(':checked') && !$('#bc-playlist-ref').hasClass('ignore')) {
      BCL.playerData.playlistID= "ref:"+BCL.playerData.playlistID;
      BCL.playerData.isRef = true;
    } 

    if ($('#bc-height').val() != undefined && $('#bc-height').val() != '') {
      BCL.playerData.height = $('#bc-height').val();
    } else if ($('#bc_default_height').val() != '') {
      BCL.playerData.height=$('#bc_default_height').val();
    }

    if ($('#bc-width').val() != undefined && $('#bc-width').val() != '') {
      BCL.playerData.width = $('#bc-width').val();
    } else if ($('#bc_default_width').val() != '') {
      BCL.playerData.width=$('#bc_default_width').val();
    }

    BCL.addPlayer();
  }

  // Ignore the tab we are not on from any field updates
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
  }

  // Renders the preview player
  BCL.addPlayer = function () { 

    /*Remove all of the old HTML for the player and the old title and description*/
    $('#dynamic-bc-placeholder').closest('.preview-container').hide();
    $('#bc_title').html('');
    $('#bc_description').html('');
    
    var playerHTML;
    // set the playerID to the selected player
    // populate the player object template
    console.log(BCL.playerData);
    if ( BCL.playerData.videoID != '' && BCL.playerData.videoID != undefined) {
      //If a single video id is entered
      playerHTML = BCL.markup(BCL.singlePlayerTemplate, BCL.playerData);
    } else if (BCL.playerData.playlistID != '' && BCL.playerData.playlistID != undefined) {
      //If a playlist is loaded
      playerHTML = BCL.markup(BCL.playlistPlayerTemplate, BCL.playerData);
    }

    // inject the player code into the DOM
    //Check to see if we are in the media API then check to see what the player type is
    if (BCL.typeOfPlayer == 'playlist' && $('#tabs-api').length > 0) {
      $('#bc-video-search-playlist').find('#dynamic-bc-placeholder').html(playerHTML);
      BCL.dontDisplay = true;

      if ($('.see_all_playlists').length == 0) {
        $('#bc-video-search-playlist').before('<button class="see_all_playlists button">See all playlists</button>');
      }

      $('.see_all_playlists').bind('click',function() {
        BCL.dontDisplay = false;
        BCL.seeAllPlaylists();
        $('.see_all_playlists').remove();
      });
    } else {

      $('#dynamic-bc-placeholder').closest('.preview-container').show();
      $('#dynamic-bc-placeholder').html(playerHTML);

    }
    
    // instantiate the player
    brightcove.createExperiences();  
    /*onTemplateLoaded('myExperience');*/
  };

  // Called by Brightcove API if the player fails to load
  BCL.onTemplateError = function (event) {
    /*console.log(event);
    console.log(BCL.getErrorCode(event.code));*/
    $('#bc-error').html("An error has occured, please check to make sure that you have a valid video or playlist ID");
    $('#bc-error').removeClass('hidden');
  }

  // Called by the Brightcove API when the player has initialized
  BCL.onTemplateReady = function(event) {  
    BCL.player = brightcove.api.getExperience("myExperience");
    // get a reference to the video player
    BCL.videoPlayer = BCL.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    BCL.videoPlayer.getCurrentVideo(function(videoDTO) {
      BCL.currentVideo = videoDTO;
      $('#bc_title').html(BCL.currentVideo.displayName);
      $('#bc_description').html(BCL.currentVideo.shortDescription);
    });
  }

  // Inserts shortcode into the content and closes the dialog
  BCL.insertShortcode = function() {
    var isRef='', shortcode;

    if (BCL.playerData.isRef) {
      isRef="isRef='true'";
    }

    if (BCL.playerData.videoID != undefined && BCL.playerData.videoID != '') {
      var shortcode = '[brightcove videoID='+BCL.playerData.videoID+' '+isRef+' playerID='+BCL.playerData.playerID+' height='+BCL.playerData.height+' width='+BCL.playerData.width+']';
    } else if (BCL.playerData.playlistID != undefined) {
       var shortcode = '[brightcove playlistID='+BCL.playerData.playlistID+' '+isRef+' playerID='+BCL.playerData.playerID+' height='+BCL.playerData.height+' width='+BCL.playerData.width+']';
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

  // MAPI: Performs a search against the API
  BCL.mediaAPISearch = function() {
    $('#bc-video-search-video').html("<p> Searching...</p>");
    BCL.searchParams = $('#bc-search-field').val();

    BCL.token = $('#bc_api_key').val();
    /*Create URL that is called to search for videos*/
    var url= [
      "http://api.brightcove.com/services/library&command=search_videos",
      "&token=", encodeURIComponent(BCL.token),
      "&any=search_text:", encodeURIComponent(BCL.searchParams),
      "&any=custom_fields:", encodeURIComponent(BCL.searchParams),
      "&any=tag:",encodeURIComponent(BCL.searchParams),
      "&callback=",encodeURIComponent("BCL.displaySingleVideo")
    ].join("");

    BCMAPI.inject(url);
  };

  // MAPI: Loads all the playlists
  BCL.seeAllPlaylists = function() {
    $('#bc-video-search-playlist').html("<p> Loading...</p>");
    BCMAPI.token = $('#bc_api_key').val();
    // Make a call to the API requesting content
    // Note that a callback function is needed to handle the returned data
    
    /*Show loader*/
    /*Then in callback hide the loader*/
    BCMAPI.find('find_all_playlists',{ "callback" : "BCL.displayPlaylist"});
  };

  // MAPI: Called by the API response
  BCL.displayPlaylist = function (pResponse) {
    if (BCL.dontDisplay) return;

    BCL.typeOfPlayer='playlist';
    BCL.displayVideos(pResponse); 
  }

  // MAPI: Called by the API response
  BCL.displaySingleVideo = function (pResponse) {
    BCL.typeOfPlayer='single';
    BCL.displayVideos(pResponse);
  }

  BCL.displayVideos = function (pResponse) {
    var innerHTML="";
    console.log(pResponse.items.length);
    if (pResponse.items.length == 0)
    {
      innerHTML="<p> Sorry those search parameters did not return any results </p>";
      $('#bc-video-search-video').html(innerHTML);
    } else {
    for (var pVideo in pResponse.items) {
      var playlistOrVideo='video';

      if (pResponse.items[pVideo].videos != undefined) {
        playlistOrVideo='playlist';
      } 

      /*playlists: name, # of videos, last updated*/
      if (playlistOrVideo == 'playlist') {
        var lastModifiedDate = Number.MAX_VALUE;
        $.each(pResponse.items[pVideo].videos, function(key,value) {
          tempDate = value.lastModifiedDate;
          if (tempDate < lastModifiedDate) {
            lastModifiedDate = tempDate;
          }
        });

        var month = (new Date(parseInt(lastModifiedDate))).getDay();
        var day = (new Date(parseInt(lastModifiedDate))).getMonth();
        var year = (new Date(parseInt(lastModifiedDate))).getFullYear();
        lastModifiedDate ='<td class="title">'+month+'/'+day+'/'+year+'</td>';

        var numVideos=pResponse.items[pVideo].videos.length;
        
         var disable='';
         var disabled='';
        if (numVideos == 0) {
          lastModifiedDate ='<td class="title"></td>';
          disable='disable';
          var disabled='disabled=disabled';
        }
        numVideos='<td class="text-align-center title">'+numVideos+'</td>';


        var heading = '<table class="widefat"><thead><tr><th></th><th></th><th>Name</th><th>Number of videos</th><th>Last Updated</th></tr></thead>';
        if (pResponse.items[pVideo].videos.length > 0) {
          var imgSrc=pResponse.items[pVideo].videos[0].thumbnailURL;
        }
        var currentName="<td class='title'>"+BCL.constrain(pResponse.items[pVideo].name,25)+"</td>";
        var currentVid="<td><img class='pinkynail toggle' src='"+imgSrc+"'/></td>";
        
        innerHTML = innerHTML+"<tr data-videoID='"+pResponse.items[pVideo].id+"' title='"+pResponse.items[pVideo].name+"' class='"+disable+" media-item child-of-2 preloaded'><td><input "+disabled+" type='checkbox'/></td>"+currentVid+currentName+numVideos+lastModifiedDate+"</tr>";  

      } else {
        // Displaying a single video
        //videos: small thumbnail, name, duration, published date
        var currentName="<td class='title'>"+BCL.constrain(pResponse.items[pVideo].name,25)+"</td>";
        var imgSrc=pResponse.items[pVideo].thumbnailURL;
        var currentVid="<td><img class='pinkynail toggle' src='"+imgSrc+"'/></td>";
        
        var lengthMin = Math.floor(pResponse.items[pVideo].length/60000);
        var lengthSec = Math.floor((pResponse.items[pVideo].length%60000)/1000);
        if (lengthSec < 10)
        {
          lengthSec="0"+lengthSec;
        }
        var length ="<td class='title'>"+(lengthMin+":"+lengthSec)+"</td>";
        
        var date=new Date(parseInt(pResponse.items[pVideo].publishedDate));
        var month = date.getDay();
        var day = date.getMonth();
        var year = date.getFullYear();
        date='<td class="title">'+month+"/"+day+"/"+year+'</td>';

        
        var heading = '<table class="clearfix widefat"><thead><tr><th></th><th>Name</th><th>Duration</th><th>Published Date</th></tr></thead>';
        innerHTML = innerHTML+"<tr data-videoID='"+pResponse.items[pVideo].id+"' title='"+pResponse.items[pVideo].name+"' class='bc_video media-item child-of-2 preloaded'>"+currentVid+currentName+length+date+"</tr>";  
      }
    }

    innerHTML = heading + innerHTML +"</table>" ;

    if (BCL.typeOfPlayer == 'single') {
      $('#bc-video-search-video').html(innerHTML);
      $('.bc_video').bind('click', function() {
      BCL.setHTML($(this).data('videoid'));
      });
    }
    if (BCL.typeOfPlayer == 'playlist') {
      if ($('#playlist_preview').length == 0)
      {
        $('#bc-video-search-playlist').before("<button class='button' id='playlist_preview'>Preview Playlists </button>");
      }
      $('#playlist_preview').bind('click', BCL.getPlaylists);
      $('#bc-video-search-playlist').html(innerHTML);
    }
  }
  }

  // Gather the selected playlists and trigger a player update
  BCL.getPlaylists = function ()
  {
    var playlists = []
    $.each($('#bc-video-search-playlist tr'), function (key, value)
    {
      if ($(value).find('input').attr('checked'))
      {
        playlists.push($(value).data('videoid'));
      }
    });
    playlists=playlists.join(',');
    jQuery('#playlist_preview').remove();
    BCL.setHTML();
    BCL.playerData.playlistID=playlists;
    BCL.setPlayerDataAPI();

  }

  // MAPI: Updates the player preview and the fields below for overriding settings
  BCL.setHTML =function (videoId) {
    var innerHTML =  '<div id="dynamic-bc-placeholder"></div>';
    innerHTML += '<input class="block" type="text" id="bc-player" placeholder="Player ID" />';
    innerHTML += '<input class="block player_data_api" id="bc-width" type="text" placeholder="Width (optional)" />';
    innerHTML += '<input class="block player_data_api" type="text" id="bc-height" placeholder="Height (optional)" />';
    innerHTML += '<button class="shortcode_button">Insert Video </button>';
    
    if (BCL.typeOfPlayer == 'single') {
      $('#bc-video-search-video').html(innerHTML);
      BCL.playerData.videoID=videoId;
    } else {
      $('#bc-video-search-playlist').html(innerHTML);
      BCL.playerData.playlistID=videoId;
    } 

    $('.shortcode_button').bind('click', BCL.insertShortcode);
    $('.player_data_api').bind('change', BCL.setPlayerDataAPI);
    $('#bc-player').bind('change', BCL.changePlayer);
    BCL.setPlayerDataAPI();
  }

  // MAPI: Updates the player preview
  BCL.setPlayerDataAPI = function () {
    if (BCL.typeOfPlayer == 'single') {
      BCL.playerData = {  "playerID" : $('#bc_default_player').val(),
                        "width" : "480", //Fallback height and width
                        "height" : "270",
                        "videoID" : BCL.playerData.videoID,
                        "isRef"   : false};
    } else {
      BCL.playerData = {  "playerID" : $('#bc_default_player_playlist').val(),
                        "width" : "480", //Fallback height and width
                        "height" : "270",
                        "playlistID" : BCL.playerData.playlistID,
                        "isRef"   : false
                      };
    }
    
    //Sets the default height and with incase they aren't set
    if ($('#bc-width').val() != '') {
      BCL.playerData.width = $('#bc-width').val();
    } else if ($('#bc_default_width').val() != '') {
       BCL.playerData.width = $('#bc_default_width').val();
    }

    if ($('#bc-height').val() != '') {
      BCL.playerData.width = $('#bc-height').val();
    } else if ($('#bc_default_height').val() != '') {
       BCL.playerData.width = $('#bc_default_height').val();
    }
                   
    BCL.addPlayer();
  }

  // MAPI: Updates the player after the changing the overridden player ID
  BCL.changePlayer = function() {
    BCL.playerData.playerID = $('#bc-player').val();
    BCL.addPlayer();
  }

  ///////////////////////////////////  Helper Functions //////////////////////////////////////////
  BCL.constrain = function (str,n){
    if (str.length > n)
      return str.substr(0, n) + '&hellip;';

    return str; 
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
/////////////////////////////////////////////Document Ready//////////////////////////////////////

$(function() {
      //Sets up validation messages for the settings on the express version of the plugin
      $('#validate_settings').validate({ 
        messages:{
        bcHeight : "Please enter a valid height",
        bcWidth : "Please enter a valid width",
        bcPlayer : "Please enter a valid player number",
        }
      });
    //Sets up validation for the video so that if reference ID is not checked then it does not have to be a number
      $('#validate_video').validate({
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
    return (this.optional(element) || /^[^a-z\W][0-9,\s]*$/ig.test(value));
    }, "Please enter a single playlist ID or a list of IDs seperated by commas or spaces.");

    $.validator.addMethod("listOfRefIds", function(value, element) {
    return (this.optional(element) || /^[^\W][a-z0-9,\s_]*$/ig.test(value));
    }, "Please enter a single playlist ID or a list of IDs seperated by commas or spaces.");

    //Validates the list of playlist IDs
    $('#validate_playlist').validate({
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
      $('#validate_video').valid();
    });

    $('#bc-playlist-ref').bind('change',function() {
      $('#bc-playlist').removeClass('valid').removeClass('error');
      $('#validate_playlist').valid();
    });


    //Check to see if the default players are set if not return error

    $('.player-data').bind('change',BCL.setPlayerData);
    $('.shortcode_button').bind('click', BCL.insertShortcode);
    
    if ($('#defaults_not_set').data('defaultsset') ==  false) {
      $('.no-error').addClass('hidden');
      $('#defaults_not_set').removeClass('hidden');
    } else {
      //Check to see if the tabs on the express tab exist
      if ($('#tabs').length > 0) {
        $("#tabs").tabs();
        $('#tabs li a').bind('click', function() { BCL.ignoreOtherTab(); BCL.setPlayerData(); });
      }
      //Check to see if the media api tabs exist
      if ($('#tabs-api').length > 0) {
        $("#tabs-api").tabs();

      } //Bind search functionality to media API

      var search = function() { BCL.mediaAPISearch(); return false; }
      $('#bc_search').bind('click', search);
      $('#search_form').bind('submit', search);
      
      $('.playlist-tab-api').bind('click', BCL.seeAllPlaylists);
    }


  });

})(jQuery);


