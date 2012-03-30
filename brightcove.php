<?php
/**
 * @package Brightcove
 * @version 1.1
 */
/*
Plugin Name: Brightcove
Plugin URI: 
Description: Brightcove plugin
Author: Nancy Decker
Version: 1.1
Author URI: 
*/

require dirname( __FILE__ ) . '/admin/brightcove_admin.php';

/************************Upload Media Tab ***************************/

function brightcove_media_menu($tabs) {
  if (get_option('bc_api_key') != NULL or get_option('bc_api_key') != '') {
    $tabs['brightcove_api']='Brightcove'; 
  } else {
    $tabs['brightcove']='Brightcove';
  }
  return $tabs;
}

add_filter('media_upload_tabs', 'brightcove_media_menu');
add_action('media_upload_brightcove', 'brightcove_menu_handle');
add_action('media_upload_brightcove_api', 'brightcove_api_menu_handle');
$myStyleUrl = plugins_url('brightcove.css', __FILE__);
wp_register_style('myStyleSheets', $myStyleUrl);
wp_enqueue_style( 'myStyleSheets');
/*add_shortcode('brightcove','add_brightcove');*/

function brightcove_menu_handle() {
	return wp_iframe('bc_media_upload_form',$errors);
}

function brightcove_api_menu_handle() {
  return wp_iframe('bc_media_api_upload_form',$errors);
}

//Adds all the scripts nessesary for plugin to work
function add_all_scripts() {
	media_upload_header();
	add_brightcove_script();
	add_jquery_scripts();
	add_validation_scripts();
	add_dynamic_brightcove_api_script();
}

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

//global variables 

GLOBAL $playerID, $defaultHeight, $defaultWidth, 
$defaultIDPlaylist, $defaultHeightPlaylist, $defaultWidthPlaylist,
$defaultSet, $defaultSetErrorMessage, $defaultsSection;

//Player ID for single videos
$playerID=get_option('bc_player_id');
//Default height & width for single video players
$defaultHeight=get_option('bc_default_height');
if ($defaultHeight == '') {
  $defaultHeight='270';
}
$defaultWidth=get_option('bc_default_width');
if ($defaultWidth == '') {
  $defaultWidth='480';
}
//Player ID for playlists
$playerIDPlaylist=get_option('bc_player_id_playlist');
//Default height & width for playlist players
$defaultHeightPlaylist=get_option('bc_default_height_playlist');
if ($defaultHeightPlaylist == '') {
  $defaultHeightPlaylist='400';
}
$defaultWidthPlaylist=get_option('bc_default_width_playlist');
if ($defaultWidthPlaylist == '') {
  $defaultWidthPlaylist='940';
}
//Checks to see if both those variables are set
if ($playerID == '' || $playerID_playlist == '') {
  $defaultSet='false';
} else  {
  $defaultSet='true';
}

$defaultSetErrorMessage = "<div class='hidden error' id='defaults-not-set' data-defaultsSet='$defaultSet'>
    You have not set up your defaults for this plugin. Please go to the brightcove menu on the side panel of the admin screen.
  </div>";

$defaultsSection = 
	"<div class='defaults'>
	<input type='hidden' id='bc-default-player' name='bc-default-player' value='$playerID' >
	<input type='hidden' id='bc-default-width' name='bc-default-width' value='$defaultWidth' >
	<input type='hidden' id='bc-default-height' name='bc-default-height' value='$defaultHeight' >
	<input type='hidden' id='bc-default-player-playlist' name='bc-default-player-playlist' value='$playerIDPlaylist' >
	<input type='hidden' id='bc-default-width-playlist' name='bc-default-width-playlist' value='$defaultWidthPlaylist' >
	<input type='hidden' id='bc-default-height-playlist' name='bc-default-height-playlist' value='$defaultHeightPlaylist' >
	</div>";

function add_player_settings($playlistOrVideo) { 
	GLOBAL $defaultHeight, $defaultWidth, $defaultHeightPlaylist, $defaultWidthPlaylist, $playerID, $playerIDPlaylist;
	if ($playlistOrVideo == 'playlist') {
		$setting = '-playlist';
		$height = $defaultHeightPlaylist;
		$width = $defaultWidthPlaylist;
		$player = $playerIDPlaylist;
		$id='playlist-settings';
	} else {
		$setting = '';
		$height = $defaultHeight;
		$width = $defaultWidth;
		$player = $playerID;
		$id='video-settings';
	}
	?>
	<form id='validate_settings <?php echo $id; ?>'>
        <table>
          <tbody>
            <tr class='bc-player-row'>
            <th valign='top' scope='row' class='label'>
              <span class="alignleft"><label for="bcPlayer">Player:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input class='digits player-data' type='text' name='bcPlayer' id='bc-player<?echo $setting; ?>' placeholder='Default is <?php $player ?>'/>
            </td>
          </tr>
          <tr class='bc-height-row'>
            <th valign='top' scope='row' class='label'>
              <span class="alignleft"><label for="bcHeight">Height:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input class='digits player-data'  type='text' name='bcHeight' id='bc-height' placeholder='Default is  <?php echo $height; ?> px' />
            </td>
          </tr>
          <tr class='bc-width-row'>
            <th valign='top' scope='row' class='label'>
              <span class="alignleft"><label for="bcWidth">Width:</label></span>
              <span class="alignright"></span>
            </th>
            <td>
             <input class='digits player-data' type='text' name='bcWidth' id='bc-width' placeholder='Default is <?php echo $width; ?> px' />
            </td>
          </tr>
          </tbody>
        </table>
      </form> <?php
}

function bc_media_upload_form () {
	add_all_scripts();
?>
<div class="bc-container">
	<?php
		GLOBAL $defaultSetErrorMessage; 
		echo $defaultSetErrorMessage; 
		GLOBAL $defaultsSection;
		echo $defaultsSection;
	?>
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
	                    <input class='id-field player-data' placeholder='Video ID' aria-required="true" type='text' name='bcVideo' id='bc-video' placeholder='Video ID or URL'>
	                  </td>
	                </tr>
	                <tr>
	                  <th valign='top' scope='row' class='label'>
	                  </th>
	                  <td class='bc-check'>
	                     <input class='player-data alignleft' type='checkbox' name='bc-video-ref' id='bc-video-ref' />
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
		                   <input class='id-field player-data' type='text' name='bcPlaylist' id='bc-playlist' placeholder='Playlist ID(s) separated by commas or spaces' />
		                  </td>
		                </tr>
		                <tr>
		                  <th valign='top' scope='row' class='label'>
		                  </th>
		                  <td class='bc-check'>
		                   <input class='alignleft player-data' type='checkbox' name='bc-playlist-ref' id='bc-playlist-ref'/>
		                   <span class="alignleft"><label for='bc-playlist-ref'>These are reference IDs, not playlist IDs </label></span>
		                  </td>
		                </tr>
		              </tbody>
		            </table>
		          </form>
		        </div>
		      </div>
		    </div><!-- End of tabs --> 
<?php
	add_player_settings('playlist');
	add_player_settings('video');

?>
</div> <?php	
}

?>














