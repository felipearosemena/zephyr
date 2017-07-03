=== Disable XML-RPC Pingback ===
Contributors: samuelaguilera
Tags: xml-rpc, xml, rpc, pingback, ddos, firewall
Requires at least: 3.8.1
Tested up to: 4.4.1
Stable tag: 1.1
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Stops abuse of your site's XML-RPC by simply removing some methods used by attackers. While you can use the rest of XML-RPC methods.

== Description ==

Stops abuse of your site's XML-RPC by simply removing some methods used by attackers. While you can use the rest of XML-RPC methods.

This is more friendly than disabling totally XML-RPC, that it's needed by some plugins and apps (I.e. Mobile apps or some Jetpack's modules).

= Features =

Removes the following methods from XML-RPC interface.

* pingback.ping
* pingback.extensions.getPingbacks

Also removes X-Pingback from HTTP headers. This will hopefully stops some bots from trying to hit your xmlrpc.php file.

= Requirements =

* WordPress 3.8.1 or higher.
    	
== Installation ==

* Extract the zip file and just drop the contents in the <code>wp-content/plugins/</code> directory of your WordPress installation (or install it directly from your dashboard) and then activate the plugin from Plugins page.
* There's not options page, simply install and activate.
  
== Changelog ==

= 1.1 =

* Added code to remove X-Pingback from HTTP headers as suggested by user https://wordpress.org/support/topic/remove-x-pingback-http-header

= 1.0 =

* Initial release.
