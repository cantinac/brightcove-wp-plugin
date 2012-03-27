jQuery(document).ready(function() {

	var dataSet = jQuery('#dataSet');
	var defaultPlayer = jQuery(dataSet).data('defaultplayer');
	var defaultPlayerPlaylist = jQuery(dataSet).data('defaultplayerplaylist');
	var publisherID = jQuery(dataSet).data('publisherid');

	if ( defaultPlayer == '' || defaultPlayerPlaylist == '' || publisherID == '') {
		//Adds an error message to the administrator page
		jQuery('.required').prepend('<div class="error"> Please make sure that Publisher ID, Player ID and Player ID playlist are filled out </div>');
		//Highlights the field that is not filled in
		if (defaultPlayer == '') {
			jQuery('.required tr:nth-child(2)').addClass('not-filled');
		}
		if (defaultPlayerPlaylist == '') {
			jQuery('.required tr:nth-child(3)').addClass('not-filled');
		}
		if (publisherID == ''){
			jQuery('.required tr:nth-child(1)').addClass('not-filled');
		}
	}

});