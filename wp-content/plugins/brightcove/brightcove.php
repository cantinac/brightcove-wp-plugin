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

function brightcove_media_menu($tabs) {
$tabs['brightcove']='Brightcove';
return $tabs;
}

function brightcove_menu_handle() {
	/*add_filter('htmledit_pre', '<p>Something</p>');*/
	return wp_iframe('bc_media_upload_form',$errors);
}

function bc_media_upload_form() { 
media_upload_header();
/*apply_filter('the_editor_content', '<p>Something</p>')*/
?>
	<form id='bc-video-form' class='media-upload-form type-form validate' method='post' enctype='multipart/form-data'>
	<div id='media-items'>
		<label for='bc-video'>Video:</label> <input type='text' name='bc-video' id='bc-video' placeholder='Video ID or URL'/>
		<input type='checkbox' name='bc-video-ref' id='bc-video-ref'/><label for='bc-video-ref'>This is a reference ID, not a video ID </label>

		<label for='bc-playlist'> Playlist:</label> <input type='text' name='bc-playlist' id='bc-playlist' placeholder='Playlist ID(s)' />
		<input type='checkbox' name='bc-playlist-ref' id='bc-playlist-ref'/><label for='bc-playlist-ref'>These are reference IDs, not playlist IDs</label>

		<label for='bc-player'>Player:</label> <input type='text' name='bc-player' id='bc-player' placeholder='Player ID (optional)' />

		<input type='submit' name='bc-submit' id='bc-submit' value='Insert Player'> 
		</div>
	</form>

	
<script language="JavaScript" type="text/javascript" 
        src="http://admin.brightcove.com/js/BrightcoveExperiences.js">
</script>
<script language="JavaScript" type="text/javascript" 
        src="http://admin.brightcove.com/js/APIModules_all.js">
</script>

<div id="placeHolder" style="background-color:#64AAB2;width:485px;height:270px;text-align: center;padding:5px;">

<button onclick="BCL.addPlayer()" />Test Player</button>






	<?php
}





add_filter('media_upload_tabs', 'brightcove_media_menu');
add_action('media_upload_brightcove', 'brightcove_menu_handle');

 $myStyleUrl = plugins_url('brightcove.css', __FILE__);
 wp_register_style('myStyleSheets', $myStyleUrl);
 wp_enqueue_style( 'myStyleSheets');

add_shortcode('brightcove','add_brightcove');


function add_brightcove_script() {	
wp_deregister_script( 'brightcove_script' );
wp_register_script( 'brightcove_script', 'http://admin.brightcove.com/js/BrightcoveExperiences.js');
wp_enqueue_script( 'brightcove_script' );
}


wp_deregister_script( 'dynamic_brightcove_script' );
wp_register_script( 'dynamic_brightcove_script', '/wp-content/plugins/brightcove/dynamic_brightcove.js');
wp_enqueue_script( 'dynamic_brightcove_script' );




function add_brightcove($atts)
{
var_dump($atts);
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