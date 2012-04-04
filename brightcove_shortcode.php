<?php

add_shortcode('brightcove','add_brightcove');

function add_brightcove($atts) {
add_brightcove_script();
isset($atts['playerid']) ? $playerId=($atts['playerid']): $playerId=get_option('bc_player_id');
?>
<div style="display:none"></div>
<object id="<?php echo rand() ?>" class="BrightcoveExperience">
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
<?php

}


