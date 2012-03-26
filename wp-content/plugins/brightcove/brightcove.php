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
              <label for="bc_api_key">API Read Key</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_api_key'); ?>' name="bc_api_key" type="text" id="bc_api_key" placeholder='API Key' class="regular-text">
              <span class='description'>Media API Key</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_player_id">Default Player ID - Single Video</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_player_id'); ?>' name="bc_player_id" type="text" id="bc_player_id" class="regular-text" placeholder='Default player ID'>
              <span class='description'>Default player ID for setting a custom player template across the site.</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_player_id_playlist">Default Player ID - Playlist</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_player_id_playlist'); ?>' name="bc_player_id_playlist" type="text" id="bc_player_id_playlist" class="regular-text" placeholder='Default player ID for Playlists'>
              <span class='description'>Default player ID for setting a custom player template across the site for playlists.</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_default_height">Default Player Height </label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_default_height'); ?>' name="bc_default_height" type="text" id="bc_default_height" class="regular-text" placeholder='Default player height'>
              <span class='description'>Default height for video players</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_default_width">Default Player Width</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_default_width'); ?>' name="bc_default_width" type="text" id="bc_default_width" class="regular-text" placeholder='Default player width'>
              <span class='description'>Default width for video players</span>
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
  register_setting( 'brightcove-settings-group', 'bc_player_id_playlist' );
  register_setting( 'brightcove-settings-group', 'bc_api_key' );
  register_setting( 'brightcove-settings-group', 'bc_default_height' );
  register_setting( 'brightcove-settings-group', 'bc_default_width' );
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
add_jquery_scripts();
add_dynamic_brightcove_api_script();
$playerID=get_option('bc_player_id');
$apiKey=get_option('bc_api_key');
$playerID_playlist=get_option('bc_player_id_playlist');
if ($playerID == '' || $playerID_playlist == '') {
  $defaultSet='false';
} else  {
  $defaultSet='true';
}
?>
<script src="/wp-content/plugins/brightcove/bc-mapi.js" type="text/javascript"></script>
<div class='hidden error' id='defaults_not_set' data-defaultsSet='<?php echo $defaultSet; ?>'>
  You have not set up your defaults for this plugin. Please go to the brightcove menu on the side panel of the admin screen.
</div>
<div class='no-error'>
  <div class='outer_container' >
    <input type='hidden' id='bc_api_key' name='bc_api_key' value='<?php echo $apiKey; ?>' >
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
        <table>
          <tbody>
            <tr>
              <th valign='top' scope='row' class='label' style='width:130px;'>
                <span class="alignleft"><label for="bc-video">Video:</label></span>
                <span class="alignright"></span>
              </th>
              <td>
                <input placeholder='Video ID or URL' aria-required="true" type='text' name='bc-video' id='bc-video' placeholder='Video ID or URL' onchange="BCL.setPlayerData()">
              </td>
            </tr>
            <tr>
              <th valign='top' scope='row' class='label' style='width:130px;'>
              </th>
              <td class='bc-check'>
                 <input class='alignleft'type='checkbox' name='bc-video-ref' id='bc-video-ref' onchange="BCL.setPlayerData()"/>
                 <span class="alignleft"><label for='bc-video-ref'>This is a reference ID, not a video ID </label></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class='tab playlist-tab' id='tabs-2'>
     <div class='media-item no-border'>
        <table> 
          <tbody>
            <tr>
              <th valign='top' scope='row' class='label' style='width:130px;'>
                <span class="alignleft"><label for="bc-playlist">Playlist:</label></span>
                <span class="alignright"></span>
              </th>
              <td>
               <input type='text' name='bc-playlist' id='bc-playlist' placeholder='Playlist ID(s)' onchange="BCL.setPlayerData()"/>
              </td>
            </tr>
            <tr>
              <th valign='top' scope='row' class='label' style='width:130px;'>
              </th>
              <td class='bc-check'>
               <input class='alignleft' type='checkbox' name='bc-playlist-ref' id='bc-playlist-ref' onchange="BCL.setPlayerData()"/>
               <span class="alignleft"><label for='bc-playlist-ref'>These are reference IDs, not playlist IDs </label></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

      <div class='media-item'>
        <input type='hidden' id='bc_default_player' name='bc_default_player' value='<?php echo $playerID; ?>' >
        <input type='hidden' id='bc_default_player_playlist' name='bc_default_player_playlist' value='<?php echo $playerID_playlist; ?>' >
        <input type='hidden' id='bc_default_height' name='bc_default_height' value='<?php echo $defaultHeight; ?>' >
        <input type='hidden' id='bc_default_width' name='bc_default_width' value='<?php echo $defaultWidth; ?>' >

        <table>
          <tbody>
            <tr class='bc-player-row'>
            <th valign='top' scope='row' class='label' style='width:130px;'>
              <span class="alignleft"><label for="bc-player">Player:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input type='text' name='bc-player' id='bc-player' placeholder='Player ID (optional)' onchange="BCL.setPlayerData()" />
            </td>
          </tr>
          <tr class='bc-height-row'>
            <th valign='top' scope='row' class='label' style='width:130px;'>
              <span class="alignleft"><label for="bc-height">Height:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input type='text' name='bc-height' id='bc-height' placeholder='Height (optional)' onchange="BCL.setPlayerData()" />
            </td>
          </tr>
          <tr class='bc-width-row'>
            <th valign='top' scope='row' class='label' style='width:130px;'>
              <span class="alignleft"><label for="bc-width">Width:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input type='text' name='bc-width' id='bc-width' placeholder='Width (optional)' onchange="BCL.setPlayerData()" />
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    

      <div class='media-item no-border'>
        <button class='aligncenter button' onclick="BCL.insertShortcode()" />Insert Shortcode</button>
      </div>

      <div class='media-item no-border'>
        <div id='bc-error' class='hidden error'></div>
      </div>

      <div class='media-item no-border'>
       <table>
         <tbody>
          <tr>
            <td>
              <div class='alignleft player-preview'>
                  <p> Video Preview: </p>
                  <div id="dynamic-bc-placeholder"> </div>
              </div>
              <div class='alignleft'>
                <h1 id='bc_title'></h1>
                <p id='bc_description'></p>
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

function add_jquery_scripts()
{
   wp_deregister_script('jQuery');
  wp_register_script( 'jQuery', '/wp-content/plugins/brightcove/jQueryUI/js/jquery-1.7.1.min.js');
  wp_enqueue_script( 'jQuery' );

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