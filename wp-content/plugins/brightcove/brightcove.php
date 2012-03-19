<?php
/**
 * @package Brightcove
 * @version 0.1
 */
/*
Plugin Name: Brightcove
Plugin URI: 
Description: Brightcove plugin
Author: Nancy Decker
Version: 0.1
Author URI: 
*/

/************************Administrator Menu ***************************/

add_action('admin_menu', 'brightcove_menu');
add_action( 'admin_init', 'register_brightcove_settings' );

function brightcove_menu() {
add_menu_page(__('Brightcove Settings'), __('Brightcove'), 'edit_themes', 'brightcove_menu', 'brightcove_menu_render'); 
}

function brightcove_menu_render() {
  ?>

  <div class='wrap'>
    <h2>Brightcove Settings </h2>
    <form method='post' action='options.php'>
    <?php settings_fields( 'brightcove-settings-group' ); ?>
      <table class='form-table'> 
        <tbody>
          <tr valign="top">
            <th scope="row">
              <label for="bc_pub_id">Publisher ID</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_pub_id'); ?>' name="bc_pub_id" type="text" id="bc_pub_id" placeholder='Publisher ID for accessing the API' class="regular-text">
              <span class='description'>Publisher ID for accessing the API.</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_player_id">Default Player ID</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_player_id'); ?>' name="bc_player_id" type="text" id="bc_player_id" class="regular-text" placeholder='Default player ID'>
              <span class='description'>Default player ID for setting a custom player template across the site.</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="submit">
        <input type="submit" name="submit" id="submit" class="button-primary" value="Save Changes">
      </p>
    </form>
  </div>
  <?php
}

function register_brightcove_settings() { // whitelist options
  register_setting( 'brightcove-settings-group', 'bc_pub_id' );
  register_setting( 'brightcove-settings-group', 'bc_player_id' );
}

/************************Upload Media Tab ***************************/

function brightcove_media_menu($tabs) {
$tabs['brightcove']='Brightcove';
$tabs['brightcove_api']='Brightcove Media API';
return $tabs;
}

function brightcove_menu_handle() {
	return wp_iframe('bc_media_upload_form',$errors);
}

function brightcove_api_menu_handle() {
  return wp_iframe('bc_media_api_upload_form',$errors);
}

function bc_media_api_upload_form() {
media_upload_header();
add_brightcove_script();
add_api_brightcove_script();
add_dynamic_brightcove_api_script();
?>
<script src="/wp-content/plugins/brightcove/bc-mapi.js" type="text/javascript"></script>

<div class='outer_container'>
  <div class='bc_api_header'>
    <div class='alignleft'>
      <h1>Brightcove</h1>
    </div>
      <div class='alignright' id='bc_search'>
      <button class='button' onclick='BCL.mediaAPISearch()'>Search</button>
      <input type='text'>
    </div>
  </div>
  <div id='bc-video-search'></div>


<!--<script type="text/javascript">

BCMAPI.token = "pF-Nn_-cfM0eqJ4CgGPQ4dzsM7__X0IrdwmsHgnUoCsy_AOoyGND_Q..";
  // Make a call to the API requesting content
  // Note that a callback function is needed to handle the returned data
  BCMAPI.find("find_all_videos", { "callback" : "handle" });
  // Our callback loops through the returned videos, alerting their names
  function handle (pResponse) {
    var innerHTML;
    for (var pVideo in pResponse.items) {
      if (pVideo % 3 == 0)
      {
        innerHTML=innerHTML+'</div><div class="bc_row">';
      }
      var currentName="<h3>"+pResponse.items[pVideo].name+"</h3>"
      var currentVid="<img src='"+pResponse.items[pVideo].thumbnailURL+"'/>";
      innerHTML= innerHTML+"<div class='bc_video_thumb'>"+currentName+currentVid+"</div>";
    }
    document.getElementById("bc-video-search").innerHTML = innerHTML;
  }
</script>-->

</div>

<?php
}

/*Controls the tab of the media upload form*/
function bc_media_upload_form() { 
media_upload_header();
add_brightcove_script();
add_api_brightcove_script();
add_dynamic_brightcove_api_script();

/*Gets the default player set in the admin settings*/
$playerID=get_option('bc_player_id');
?>

<form enctype='multipart/form-data' class='media-upload-form' id='bc-form'>
  <div id='media-items'>
    <div class='media-item'>
    <input type='hidden' id='bc_default_player' name='bc_default_player' value='<?php echo $playerID; ?>' >
    	<table class='describe'>
        <tbody>
    		  <tr>
            <th valign='top' scope='row' class='label' style='width:130px;'>
              <span class="alignleft"><label for="bc-video">Video:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input placeholder='Video ID or URL' aria-required="true" type='text' name='bc-video' id='bc-video' placeholder='Video ID or URL' onchange="BCL.addPlayer()">
            </td>
          </tr>
          <tr>
            <th valign='top' scope='row' class='label' style='width:130px;'>
            </th>
            <td class='bc-check'>
             <input class='alignleft'type='checkbox' name='bc-video-ref' id='bc-video-ref' onchange="BCL.addPlayer()"/>
             <span class="alignleft"><label for='bc-video-ref'>This is a reference ID, not a video ID </label></span>
            </td>
          </tr>
          <tr>
            <th valign='top' scope='row' class='label' style='width:130px;'>
            </th>
            <td>
             <div class='alignleft'></div><div class='aligncenter'>or</div><div class='alignright'></div>
            </td>
          </tr>
          <tr>
            <th valign='top' scope='row' class='label' style='width:130px;'>
              <span class="alignleft"><label for="bc-playlist">Playlist:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input type='text' name='bc-playlist' id='bc-playlist' placeholder='Playlist ID(s)' onchange="BCL.addPlayer()"/>
            </td>
          </tr>
          <tr>
            <th valign='top' scope='row' class='label' style='width:130px;'>
            </th>
            <td class='bc-check'>
             <input class='alignleft' type='checkbox' name='bc-playlist-ref' id='bc-playlist-ref' onchange="BCL.addPlayer()"/>
             <span class="alignleft"><label for='bc-playlist-ref'>These are reference IDs, not playlist IDs </label></span>
            </td>
          </tr>
          <tr class='bc-player-row'>
          <th valign='top' scope='row' class='label' style='width:130px;'>
            <span class="alignleft"><label for="bc-player">Player:</label></span>
            <span class="alignright"></span>
          </th>
          <td>
           <input type='text' name='bc-player' id='bc-player' placeholder='Player ID (optional)' onchange="BCL.addPlayer()" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class='media-item no-border'>
      <button class='aligncenter button' onclick="BCL.insertShortcode()" />Insert Shortcode</button>
    </div>
    <div class='media-item no-border'>
      <div class='bc-error describe'>The video could not be loaded:video ID could not be found</div>
    </div>
    <div class='media-item no-border'>
     <table class='describe'>
       <tbody>
        <tr>
          <td>
            <div class='alignleft player-preview'>
                <p> Player Preview: </p>
                <div id="dynamic-bc-placeholder"> </div>
            </div>
            <div class='alignleft'>
              <h1> Title </h1>
              <p> Description</p>
            </div>
          </td>
        </tr>
        <tbody>
      </table>
    </div>
  </div>  
</form>
	<?php
}

add_filter('media_upload_tabs', 'brightcove_media_menu');
add_action('media_upload_brightcove', 'brightcove_menu_handle');
add_action('media_upload_brightcove_api', 'brightcove_api_menu_handle');


 $myStyleUrl = plugins_url('brightcove.css', __FILE__);
 wp_register_style('myStyleSheets', $myStyleUrl);
 wp_enqueue_style( 'myStyleSheets');

add_shortcode('brightcove','add_brightcove');

function add_brightcove_script() {	
wp_deregister_script( 'brightcove_script' );
wp_register_script( 'brightcove_script', 'http://admin.brightcove.com/js/BrightcoveExperiences.js');
wp_enqueue_script( 'brightcove_script' );
}

function add_api_brightcove_script() {	
wp_deregister_script( 'api_brightcove_script' );
wp_register_script( 'api_brightcove_script', 'http://admin.brightcove.com/js/APIModules_all.js');
wp_enqueue_script( 'api_brightcove_script' );
}

function add_dynamic_brightcove_api_script() {	
wp_deregister_script( 'dynamic_brightcove_script' );
wp_register_script( 'dynamic_brightcove_script', '/wp-content/plugins/brightcove/dynamic_brightcove.js');
wp_enqueue_script( 'dynamic_brightcove_script' );
}

function add_brightcove($atts) {
add_brightcove_script();
isset($atts['playerid']) ? $playerId=($atts['playerid']): $playerId='1191338931001';
?>
<!-- Start of Brightcove Player -->

<div style="display:none">
</div>

<object id="myExperience" class="BrightcoveExperience">
  <param name="bgcolor" value="#FFFFFF" />
  <param name="width" value="640" />
  <param name="height" value="360" />
  <param name="playerID" value="<?php echo $playerId; ?>" />
  <!--<param name="playerKey" value="AQ~~,AAAAipOT-Hk~,_eG7BsSTB2xUL0C9k36uPnnnkgJfJRPS" />-->
  <param name="isVid" value="true" />
  <param name="dynamicStreaming" value="true" />
    
   <?php 
   if ($atts['videoid'] != NULL && $atts['isref'] == NULL)
   { ?>
   	<param name="@videoPlayer" value="<?php echo $atts['videoid']; ?>" />
   <?php } 
   if ($atts['videoid'] != NULL && $atts['isref'] != NULL)
   { ?>
   	<param name="@videoPlayer" value="ref:<?php echo $atts['videoid']; ?>" />
   <?php }
   if ($atts['playlistid'] != NULL && $atts['isref'] == NULL)
   { ?>
   	<param name="@playlistTabs" value="<?php echo $atts['playlistid']; ?>" />
   <?php } 
   if ($atts['playlistid'] != NULL && $atts['isref'] != NULL)
   { ?>
   	<param name="@playistTabs" value="ref:<?php echo $atts['playlistid']; ?>" />
   <?php }
	?>


  
</object>

<!-- 
This script tag will cause the Brightcove Players defined above it to be created as soon
as the line is read by the browser. If you wish to have the player instantiated only after
the rest of the HTML is processed and the page load is complete, remove the line.
-->
<!--<script type="text/javascript">brightcove.createExperiences();</script>-->

<!-- End of Brightcove Player -->	



<?php

}


















    









?>