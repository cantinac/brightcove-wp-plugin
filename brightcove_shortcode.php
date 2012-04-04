<?php

add_shortcode('brightcove','add_brightcove');

function add_brightcove($atts) {
add_brightcove_script();
isset($atts['playerid']) ? $playerId=($atts['playerid']): $playerId=get_option('bc_player_id');

$html;

$html = '<div style="display:none"></div>
<object id="<?php echo rand() ?>" class="BrightcoveExperience">
  <param name="bgcolor" value="#FFFFFF" />
  <param name="width" value="' . $atts['width'] . '" />
  <param name="height" value="'. $atts['height'] .'" />
  <param name="playerID" value="'. $playerId .'" />
  <!--<param name="playerKey" value="AQ~~,AAAAipOT-Hk~,_eG7BsSTB2xUL0C9k36uPnnnkgJfJRPS" />-->
  <param name="isVid" value="true" />
  <param name="isUI" value="true" />
  <param name="dynamicStreaming" value="true" />';

 
  if ($atts['videoid'] != NULL && $atts['isref'] == NULL)
  { 
    $html = $html . '<param name="@videoPlayer" value="'.$atts['videoid'].'" />';
  } 
  if ($atts['videoid'] != NULL && $atts['isref'] != NULL)
  { 
    $html = $html . '<param name="@videoPlayer" value="ref:'.$atts['videoid'].'" />';
 }
  if ($atts['playlistid'] != NULL && $atts['isref'] == NULL)
  { 
    $html = $html . '<param name="@playlistTabs" value="'.$atts['playlistid'].'" />';
    $html = $html . '<param name="@videoList" value="'.$atts['playlistid'].'" />';
    $html = $html . '<param name="@playlistCombo" value="'.$atts['playlistid'].'" />';
  } 
  if ($atts['playlistid'] != NULL && $atts['isref'] != NULL)
  { 
    $html = $html . '<param name="@playlistTabs" value="ref:'.$atts['playlistid'].'" />';
    $html = $html . '<param name="@videoList" value="ref:'. $atts['playlistid'].' />';
    $html = $html . '<param name="@playlistCombo" value="ref:'.$atts['playlistid'].'" />';
 }

$html = $html . '</object>';

return $html;
}


