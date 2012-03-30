<?php 
/*var_dump('Something here');*/
add_action('admin_menu', 'brightcove_menu');
add_action( 'admin_init', 'register_brightcove_settings' );

function brightcove_menu() {
wp_deregister_script( 'brightcove__menu_script' );
wp_register_script( 'brightcove_menu_script', '/wp-content/plugins/brightcove/admin/brightcove_admin.js');
wp_enqueue_script( 'brightcove_menu_script' );

wp_register_style( 'brightcove_menu_style', '/wp-content/plugins/brightcove/admin/brightcove_admin.css');
wp_enqueue_style( 'brightcove_menu_style' );
add_menu_page(__('Brightcove Settings'), __('Brightcove'), 'edit_themes', 'brightcove_menu', 'brightcove_menu_render', WP_PLUGIN_URL.'/brightcove/admin/bc_icon.png'); 

  wp_deregister_script('jQueryValidate');
  wp_register_script( 'jQueryValidate', '/wp-content/plugins/brightcove/jQueryValidation/jquery.validate.min.js');
  wp_enqueue_script( 'jQueryValidate' );

  wp_deregister_script('jQueryValidateAddional');
  wp_register_script( 'jQueryValidateAddional', '/wp-content/plugins/brightcove/jQueryValidation/additional-methods.min.js');
  wp_enqueue_script( 'jQueryValidateAddional');
}

function brightcove_menu_render() {
$playerID = get_option('bc_player_id');
$playerID_playlist = get_option('bc_player_id_playlist'); 
$publisherID = get_option('bc_pub_id');
?>
<input id='dataSet' type='hidden' data-defaultPlayer="<?php echo $playerID; ?>" data-defaultPlayerPlaylist="<?php echo $playerID_playlist; ?>" data-publisherID="<?php echo $publisherID; ?>"/>
  <div class='wrap'>
    <h2>Brightcove Settings </h2>
    <form id='brightcove_menu' method='post' action='options.php'>
    <?php settings_fields( 'brightcove-settings-group' ); ?>
      <h3> Required Settings </h3>
      <table class='required form-table'> 
        <tbody>
         <tr valign="top">
          <th scope="row">
            <label for="bc_pub_id">Publisher ID</label>
          </th>
          <td>
            <input class='number regular-text required' value = "<?php echo $publisherID; ?>" name="bc_pub_id" type="text" id="bc_pub_id" placeholder='Publisher ID for accessing the API' class="regular-text">
            <span class='description'>Publisher ID for accessing the API.</span>
          </td>
        </tr>
         <tr valign="top">
            <th scope="row">
              <label for="bc_player_id">Default Player ID - Single Video</label>
            </th>
            <td>
              <input value ="<?php echo $playerID; ?>" name="bc_player_id" type="text" id="bc_player_id" class="required regular-text number" placeholder='Default player ID'>
              <span class='description'>Default player ID for setting a custom player template across the site.</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_player_id_playlist">Default Player ID - Playlist</label>
            </th>
            <td>
              <input value ="<?php echo $playerID_playlist; ?>"  name="bc_player_id_playlist" type="text" id="bc_player_id_playlist" class="required number regular-text" placeholder='Default player ID for Playlists'>
              <span class='description'>Default player ID for setting a custom player template across the site for playlists.</span>
            </td>
          </tr>
        </tbody>
      </table>
      <h3> Required Only for Accessing Media API, not required for express users </h3>
      <table class='form-table'> 
        <tbody>
          <tr valign="top">
            <th scope="row">
              <label for="bc_api_key">API Read Key</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_api_key'); ?>' name="bc_api_key" type="text" id="bc_api_key" placeholder='API Key' class="regular-text">
              <span class='description'>Media API Key</span>
            </td>
          </tr>
        </tbody>
      </table>
      <h3> Optional Settings </h3>
      <table class='form-table'> 
        <tbody>
          <tr valign="top">
            <th scope="row">
              <label for="bc_default_height">Default Player Height </label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_default_height'); ?>' name="bc_default_height" type="text" id="bc_default_height" class="number regular-text" placeholder='Default player height'>
              <span class='description'>Default height for video players</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_default_width">Default Player Width</label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_default_width'); ?>' name="bc_default_width" type="text" id="bc_default_width" class="number regular-text" placeholder='Default player width'>
              <span class='description'>Default width for video players</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_default_height">Default Playlist Player Height </label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_default_height_playlist'); ?>' name="bc_default_height_playlist" type="text" id="bc_default_height_playlist" class="number regular-text" placeholder='Default playlist player height'>
              <span class='description'>Default height for playlist players</span>
            </td>
          </tr>
          <tr valign="top">
            <th scope="row">
              <label for="bc_default_width_playlist">Default Playlist Player Width </label>
            </th>
            <td>
              <input value = '<? echo get_option('bc_default_width_playlist'); ?>' name="bc_default_width_playlist" type="text" id="bc_default_width_playlist" class="number regular-text" placeholder='Default playlist player width'>
              <span class='description'>Default width for playlist players</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="submit">
        <input type="submit" name="submit" id="submit" class="button-primary" value="Save Changes">
      </p>
    </form>

    <div class="brightcove-settings-help">
      <h2>Getting Your Brightcove Settings</h2>
      <p>Each of the following settings can be retrieved by <a href="https://my.brightcove.com/" target="_blank">logging in to your Brightcove Video Cloud account</a>.</p>

      <h3>Publisher ID</h3>
      <p>To retrieve your Publisher ID, go to <strong>Home &gt; Profile</strong>. It is located under the account name.</p>

      <h3>Player ID(s)</h3>
      <p>To retrieve the ID for a player:
        <ol>
          <li>Open the <strong>Publishing</strong> tab</li>
          <li>Click a player</li>
          <li>Copy the <strong>Player ID</strong> under the player preview in the right hand panel.</li>
        </ol>
      </p>

      <h3>API Read Key</h3>
      <p>For Video Cloud Professional and Video Cloud Enterprise Brightcove customers, the API Read Key is required for enhanced functionality such as searching of videos and playlists via the Brightcove Media API. To retrieve your API Read Key, go to <strong>Home &gt; Account Settings &gt; API Management</strong>. See <a href="http://support.brightcove.com/en/docs/managing-media-api-tokens" target="_blank">this support article</a> for detailed information on API Key management.</p>
    </div>

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
  register_setting( 'brightcove-settings-group', 'bc_default_height_playlist' );
  register_setting( 'brightcove-settings-group', 'bc_default_width_playlist' );
}