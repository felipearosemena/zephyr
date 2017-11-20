<?php

namespace Z;
use Timber;
use TimberImage;

/**
 *
 * Shortcodes
 *
 * Custom Shortcodes
 *
 */

class Shortcodes
{

  public function __construct() {

    add_shortcode( 'lookbook-image', array( &$this, 'lookbookImage' ) );

  } /* __construct() */

  public function lookbookImage( $atts, $content = null )
  {

    if(!isset($atts['id'])) {
      return null;
    }

    $image   = new TimberImage($atts['id']);
    $related = [];

    if($image->featured_products) {
      $related = Timber::get_posts($image->get_field('featured_products'));
    }

    return Timber::compile('components/lookbook-image.twig', array(
      'related' => $related,
      'content' => $content
    ));

  }

}
