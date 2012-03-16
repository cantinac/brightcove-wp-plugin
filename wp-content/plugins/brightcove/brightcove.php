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
		<input type='checkbox' name='bc-video-id' id='bc-video-id' /><label for='bc-video-id'>This is a reference ID, not a video ID </label>

		<label for='bc-playlist'> Playlist:</label> <input type='text' name='bc-playlist' id='bc-playlist' placeholder='Playlist ID(s)' />
		<input type='checkbox' name='bc-playlist-id' id='bc-playlist-id' /><label for='bc-playlist-id'>These are reference IDs, not playlist IDs</label>

		<label for='bc-player'>Player:</label> <input type='text' name='bc-player' id='bc-player' placeholder='Player ID (optional)' />

		<input type='submit' name='bc-submit' id='bc-submit' value='Insert Player'> 
		</div>
	</form>

	<script>
	jQuery(document).ready(function() {
	
	jQuery('#bc-submit').click(function(){
		
	  	var allVals = [];
		var htmlcode;
		// console.log(pagelist);
	htmlcode = '[something]';
	  window.send_to_editor(htmlcode);
	  return false;
	 });

	});
	</script>
	<?php
}

add_filter('media_upload_tabs', 'brightcove_media_menu');
add_action('media_upload_brightcove', 'brightcove_menu_handle');

 $myStyleUrl = plugins_url('brightcove.css', __FILE__);
 wp_register_style('myStyleSheets', $myStyleUrl);
 wp_enqueue_style( 'myStyleSheets');

    


?>