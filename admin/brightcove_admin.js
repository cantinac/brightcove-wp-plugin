jQuery(document).ready(function() {

	var dataSet = jQuery('#dataSet');
	var defaultPlayer = jQuery(dataSet).data('defaultplayer');
	var defaultPlayerPlaylist = jQuery(dataSet).data('defaultplayerplaylist');
	var publisherID = jQuery(dataSet).data('publisherid');

	if ( defaultPlayer == '' || defaultPlayerPlaylist == '' || publisherID == '') {
		//Adds an error message to the administrator page
		jQuery('#brightcove_menu').prepend('<div class="error"><p> Please make sure that Publisher ID, Player ID and Player ID playlist are filled out </p> </div>');
		//Highlights the field that is not filled in
		if (defaultPlayer == '') {
			jQuery('.required-settings tr:nth-child(2)').addClass('not-filled');
		}
		if (defaultPlayerPlaylist == '') {
			jQuery('.required-settings tr:nth-child(3)').addClass('not-filled');
		}
		if (publisherID == ''){
			jQuery('.required-settings tr:nth-child(1)').addClass('not-filled');
		}
	}
	//Fix for IE for placeholder
  	jQuery(":input[placeholder]").placeholder();
	jQuery('#brightcove_menu').validate();
});