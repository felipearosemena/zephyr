<?php

namespace Z;

/**
 *
 * Social
 *
 * Open graph and related configurations for post sharing content
 *
 */


class Social
{

  public function __construct()
  {

    // Add filter to globally pull images from featured images
    add_filter( 'wpseo_opengraph', array( &$this, 'wpseo_opengraph__updateOGImage' ) );
  } /* __construct() */


  /**
   * Update the open graph image for the Yoast plugin
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   */

  public function wpseo_opengraph__updateOGImage() {

    global $post;

    if(!isset($post->ID)) {
      return;
    }

    $default_og_image = get_field('default_og_image', 'options');

    if($default_og_image['url']) {
      $GLOBALS['wpseo_og']->options['og_default_image'] = $default_og_image['url'];
    }

  }
}
