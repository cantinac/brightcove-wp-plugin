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


require dirname( __FILE__ ) . '/admin/brightcove_admin.php';


/************************Upload Media Tab ***************************/

function brightcove_media_menu($tabs) {

if (get_option('bc_api_key') != NULL or get_option('bc_api_key') != '') {
 $tabs['brightcove_api']='Brightcove Media API'; 
} else {
  $tabs['brightcove']='Brightcove';
}
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
add_jquery_scripts();
add_validation_scripts();
add_dynamic_brightcove_api_script();
$playerID=get_option('bc_player_id');
$playerID_playlist=get_option('bc_player_id_playlist');
$publisherID=get_option('bc_pub_id');
$apiKey=get_option('bc_api_key');

if ($playerID == '' || $playerID_playlist == '' || $publisherID  == '') {
  $defaultSet='false';
} else  {
  $defaultSet='true';
}
?>
<script src="/wp-content/plugins/brightcove/bc-mapi.js" type="text/javascript"></script>
<div class='hidden error' id='defaults_not_set' data-defaultsSet='<?php echo $defaultSet; ?>'>
  You have not set up your defaults for this plugin. Please click on the link to set your defaults.
  <a target="_top" href="admin.php?page=brightcove_menu">Brightcove Settings</a>
</div>
<div id='bc-error' class='hidden error'></div>
  <div class='no-error'>
    <div class='outer_container' >
      <input type='hidden' id='bc_api_key' name='bc_api_key' value='<?php echo $apiKey; ?>' >
       <input type='hidden' id='bc_default_height' name='bc_default_height' value='<?php echo $defaultHeight; ?>' >
        <input type='hidden' id='bc_default_width' name='bc_default_width' value='<?php echo $defaultWidth; ?>' >
          <input type='hidden' id='bc_default_thumbnail' value='<?php echo dirname( __FILE__ ).'/admin/brightcove.png';?>' >

      <div id='tabs-api'>
        <ul>
          <li ><a class='video-tab-api' href="#tabs-1">Videos</a></li>
          <li><a class='playlist-tab-api' href="#tabs-2">Playlists</a></li>
        </ul>
        <div id='tabs-1'>
          <button class='button' id='bc_search'>Search</button>
          <div class='alignright'>
            <input id='bc-search-field' type='text'>
            <input type='hidden' id='bc_default_player' name='bc_default_player' value='<?php echo $playerID; ?>' >
          </div>
          <div class='bc-video-search clearfix' id='bc-video-search-video'></div>

        </div>
        <div id='tabs-2'>
          <input type='hidden' id='bc_default_player_playlist' name='bc_default_player_playlist' value='<?php echo $playerID_playlist; ?>' >
          <div class='bc-video-search clearfix' id='bc-video-search-playlist'></div>
        </div>
      </div>
    </div>
  </div>
<?php
}

/*Controls the tab of the media upload form*/
function bc_media_upload_form() { 
media_upload_header();
add_brightcove_script();
add_jquery_scripts();
add_validation_scripts();
add_dynamic_brightcove_api_script();

/*Gets the default player set in the admin settings*/
$playerID=get_option('bc_player_id');
$defaultHeight=get_option('bc_default_height');
$defaultWidth=get_option('bc_default_width');
$playerID_playlist=get_option('bc_player_id_playlist');

if ($playerID == '' || $playerID_playlist == '') {
  $defaultSet='false';
} else  {
  $defaultSet='true';
}
?>
<div class='hidden error' id='defaults_not_set' data-defaultsSet='<?php echo $defaultSet; ?>'>
  You have not set up your defaults for this plugin. Please go to the brightcove menu on the side panel of the admin screen.
</div>
<div class='no-error'>
  <div id='tabs'>
    <ul>
      <li ><a class='video-tab' href="#tabs-1">Videos</a></li>
      <li><a class='playlist-tab' href="#tabs-2">Playlists</a></li>
    </ul>

    <div class='tab video-tab' id='tabs-1'>
      <div class='media-item no-border'>
        <form id='validate_video'>
          <table>
            <tbody>
              <tr>
                <th valign='top' scope='row' class='label'>
                  <span class="alignleft"><label for="bc-video">Video:</label></span>
                  <span class="alignright"></span>
                </th>
                <td>
                  <input class='id-field' placeholder='Video ID' aria-required="true" type='text' name='bcVideo' id='bc-video' placeholder='Video ID or URL' onblur="BCL.setPlayerData()">
                </td>
              </tr>
              <tr>
                <th valign='top' scope='row' class='label'>
                </th>
                <td class='bc-check'>
                   <input class='alignleft' type='checkbox' name='bc-video-ref' id='bc-video-ref' onblur="BCL.setPlayerData()"/>
                   <span class="alignleft"><label for='bc-video-ref'>This is a reference ID, not a video ID </label></span>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
    <div class='tab playlist-tab' id='tabs-2'>
     <div class='media-item no-border'>
        <form id='validate_playlist'>
          <table> 
            <tbody>
              <tr>
                <th valign='top' scope='row' class='label' >
                  <span class="alignleft"><label for="bcPlaylist">Playlist:</label></span>
                  <span class="alignright"></span>
                </th>
                <td>
                 <input class='id-field' type='text' name='bcPlaylist' id='bc-playlist' placeholder='Playlist ID(s) seperated by commas' onblur="BCL.setPlayerData()"/>
                </td>
              </tr>
              <tr>
                <th valign='top' scope='row' class='label'>
                </th>
                <td class='bc-check'>
                 <input class='alignleft' type='checkbox' name='bc-playlist-ref' id='bc-playlist-ref' onblur="BCL.setPlayerData()"/>
                 <span class="alignleft"><label for='bc-playlist-ref'>These are reference IDs, not playlist IDs </label></span>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  </div>

      <div class='media-item'>
        <input type='hidden' id='bc_default_player' name='bc_default_player' value='<?php echo $playerID; ?>' >
        <input type='hidden' id='bc_default_player_playlist' name='bc_default_player_playlist' value='<?php echo $playerID_playlist; ?>' >
        <input type='hidden' id='bc_default_height' name='bc_default_height' value='<?php echo $defaultHeight; ?>' >
        <input type='hidden' id='bc_default_width' name='bc_default_width' value='<?php echo $defaultWidth; ?>' >
        <form id='validate_settings'>
          <table>
            <tbody>
              <tr class='bc-player-row'>
              <th valign='top' scope='row' class='label'>
                <span class="alignleft"><label for="bcPlayer">Player:</label></span>
                <span class="alignright"></span>
              </th>
              <td>
               <input class='digits' type='text' name='bcPlayer' id='bc-player' placeholder='Player ID (optional)' onblur="BCL.setPlayerData()" />
              </td>
            </tr>
            <tr class='bc-height-row'>
              <th valign='top' scope='row' class='label'>
                <span class="alignleft"><label for="bcHeight">Height:</label></span>
                <span class="alignright"></span>
              </th>
              <td>
               <input class='digits'  type='text' name='bcHeight' id='bc-height' placeholder='Height (optional)' onblur="BCL.setPlayerData()" />
              </td>
            </tr>
            <tr class='bc-width-row'>
              <th valign='top' scope='row' class='label'>
                <span class="alignleft"><label for="bcWidth">Width:</label></span>
                <span class="alignright"></span>
              </th>
              <td>
               <input class='digits' type='text' name='bcWidth' id='bc-width' placeholder='Width (optional)' onblur="BCL.setPlayerData()" />
              </td>
            </tr>
            </tbody>
          </table>
        </form>
      </div>

    

      <div class='media-item no-border'>
        <button class='aligncenter button' onclick="BCL.insertShortcode()" />Insert Shortcode</button>
      </div>

      <div class='media-item no-border'>
        <div id='bc-error' class='hidden error'></div>
      </div>

      <div class='media-item no-border player-preview'>
       <table>
         <tbody>
          <tr>
            <td>
              <div class='alignleft'>
                  <h3 id='bc_title'></h3>
                  <p id='bc_description'></p>
                  <p> Video Preview: </p>
                  <div id="dynamic-bc-placeholder"> </div>
              </div>
              <div class='alignleft'>
              </div>
            </td>
          </tr>
          <tbody>
        </table>
      </div>
</div>

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

function add_validation_scripts()
{
  wp_deregister_script('jQueryValidate');
  wp_register_script( 'jQueryValidate', '/wp-content/plugins/brightcove/jQueryValidation/jquery.validate.min.js');
  wp_enqueue_script( 'jQueryValidate' );

  wp_deregister_script('jQueryValidateAddional');
  wp_register_script( 'jQueryValidateAddional', '/wp-content/plugins/brightcove/jQueryValidation/additional-methods.min.js');
  wp_enqueue_script( 'jQueryValidateAddional' );
}

function add_jquery_scripts()
{/*
  wp_deregister_script('jQuery');
  wp_register_script( 'jQuery', '/wp-content/plugins/brightcove/jQueryUI/js/jquery-1.7.1.min.js');
  wp_enqueue_script( 'jQuery' );*/

  wp_deregister_script('jQueryUI');
  wp_register_script( 'jQueryUI', '/wp-content/plugins/brightcove/jQueryUI/js/jquery-ui-1.8.18.custom.min.js');
  wp_enqueue_script( 'jQueryUI' );

  wp_register_style('jQueryStyle', '/wp-content/plugins/brightcove/jQueryUI/css/smoothness/jquery-ui-1.8.18.custom.css');
  wp_enqueue_style( 'jQueryStyle');
}
/*
function add_api_brightcove_script() {	
wp_deregister_script( 'api_brightcove_script' );
wp_register_script( 'api_brightcove_script', 'http://admin.brightcove.com/js/APIModules_all.js');
wp_enqueue_script( 'api_brightcove_script' );
}*/

function add_dynamic_brightcove_api_script() {	
wp_deregister_script( 'dynamic_brightcove_script' );
wp_register_script( 'dynamic_brightcove_script', '/wp-content/plugins/brightcove/dynamic_brightcove.js');
wp_enqueue_script( 'dynamic_brightcove_script' );
}

function add_brightcove($atts) {
add_brightcove_script();
isset($atts['playerid']) ? $playerId=($atts['playerid']): $playerId=get_option('bc_player_id');
?>
<!-- Start of Brightcove Player -->

<div style="display:none">
</div>

<object id="myExperience" class="BrightcoveExperience">
  <param name="bgcolor" value="#FFFFFF" />
  <param name="width" value="<?php echo $atts['width']; ?>" />
  <param name="height" value="<?php echo $atts['height']; ?>" />
  <param name="playerID" value="<?php echo $playerId; ?>" />
  <!--<param name="playerKey" value="AQ~~,AAAAipOT-Hk~,_eG7BsSTB2xUL0C9k36uPnnnkgJfJRPS" />-->
  <param name="isVid" value="true" />
  <param name="isUI" value="true" />
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
    <param name="@videoList" value="<?php echo $atts['playlistid']; ?>" />
    <param name="@playlistCombo" value="<?php echo $atts['playlistid']; ?>" />
   <?php } 
   if ($atts['playlistid'] != NULL && $atts['isref'] != NULL)
   { ?>
    <param name="@playlistTabs" value="ref:<?php echo $atts['playlistid']; ?>" />
    <param name="@videoList" value="ref:<?php echo $atts['playlistid']; ?>" />
    <param name="@playlistCombo" value="ref:<?php echo $atts['playlistid']; ?>" />
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