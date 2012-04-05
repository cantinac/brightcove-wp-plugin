=== Brightcove ===
Contributors: brightcove
Tags: video, brightcove
Requires at least: 3.3.1
Tested up to: 3.3.1
Stable tag: trunk

An easy to use plugin that inserts Brightcove Video into your Wordpress site. 

== Description ==

This plugin allows for the easy insertion of Brightcove videos and playlists into your Wordpress site or blog. This plugin seamlessly integrates with the Wordpress Media Upload feature introduced in 3.3.1 allowing for easy insertion of video. 

If you do not have a API Read Token then videos can be inserted by entering Video IDs or Playlist IDs into the plugin. Options also exist to change the type of player displaying the video as well as the height and width of the player. 

If you do have an API read token this plugin allows you to see all of your videos, search for videos by short description, long description, name and custom fields as well as see all of your playlists. Media API users are presented with thumbnail images of the video to allow for easier selection.

Both versions feature live preview of the video to make sure you have the player and video you want before inserting it into your post or page. Options also exist to set up default players, height and width throughout the site to provide a consistent look. These defaults can also be overridden at the point of inserting the video if you so desire. 

Note that in order to use this plugin you must have a Brightcove account. Please visit <a href='http://www.brightcove.com'> Brightcove </a> to sign up. 
== Installation ==
<ol>
<li> Upload the bright cove file to the `/wp-content/plugins/` directory </li>
	<ol>
		<li> Alternative - Upload brightcove.zip via the zip uploader for wordpress plugins </li>
		<li> Alternative - Click install from searching within wordpress  plugin manager </li>
	<ol>
<li> Activate the plugin through the 'Plugins' menu in WordPress </li>
<li> Fill out Publisher ID, default video player ID and default playlist player ID in the Brightcove settings menu (left hand side on admin page) </li>
	<ol>
		<li> Optional - Fill out media api token to access media api </li>
	</ol>
<li> That's it!!! Videos and playlist can be added from the upload media button above pages and posts</li>
<ol>

== Frequently Asked Questions ==

= Where do I find my publisher ID? =

Log in to your <a href='"https://my.brightcove.com/"'>Brightcove Video Cloud account.</a>
To retrieve your Publisher ID, go to Home > Profile. It is located under the account name.

= Where do I get a video player ID from? =

Log in to your <a href='"https://my.brightcove.com/"'>Brightcove Video Cloud account.</a>

To retrieve the ID for a player:
<ul>
    <li>Open the Publishing tab</li>
    <li>Click a player</li>
    <li>Copy the Player ID under the player preview in the right hand panel.</li>
<ul>
= Where do I get a playlist player ID from? =

Log in to your <a href='"https://my.brightcove.com/"'>Brightcove Video Cloud account.</a>
To retrieve the ID for a player:
<ul>
    <li> Open the Publishing tab</li>
    <li>Click a player</li>
    <li>Copy the Player ID under the player preview in the right hand panel.</li>
<ul>

= Where do I get a video ID? =

Log in to your <a href='"https://my.brightcove.com/"'>Brightcove Video Cloud account.</a>
To retrieve the ID for a video:
<ul>
    <li>Open the Media tab</li>
    <li>Under Media Library on the far left hand side click All Videos or Recently Created</li>
    <li>Click on a video.</li>
    <li>In the video preview section on the right hand side copy Video ID.</li>
<ul>

= Where do I get a playlist ID? =

Log in to your <a href='"https://my.brightcove.com/"'>Brightcove Video Cloud account.</a>
To retrieve the ID for a playlist:
<ul>
    <li>Open the Media tab</li>
    <li>Under Playlists on the far left hand side click All Playlists or Favorites</li>
    <li>Click on a playlist.</li>
    <li>Playlist ID is listed in the top bar above the videos in the playlist. </li>
</ul>

= What's a API Read Token? Do I need one? =

For Video Cloud Professional and Video Cloud Enterprise Brightcove customers, the API Read Token is required for enhanced functionality such as searching of videos and playlists via the Brightcove Media API. To retrieve your API Read Token, go to Home > Account Settings > API Management. See this <a href=' http://support.brightcove.com/en/docs/managing-media-api-tokens'> support article </a> for detailed information on API Token management.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the directory of the stable readme.txt, so in this case, `/tags/4.3/screenshot-1.png` (or jpg, jpeg, gif)
2. This is the second screen shot

== Changelog ==

= 1.0 =
* Intial launch of plugin.


== Upgrade Notice ==






