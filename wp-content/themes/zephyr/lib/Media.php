<?php

namespace Z;

use Timber;
use TimberImage;

class Media
{

  public function __construct()
  {

    add_filter( 'embed_oembed_html', array( &$this, 'embed_oembed_html__updateEmbeddedMarkup' ), 90, 3 );

    // update the markup for the gallery so it's not outputting inline styles
    add_filter( 'post_gallery', array( &$this, 'post_gallery__changeGalleryMarkup' ), 10, 3 );
    // Add Image Sizes
    add_action( 'init', array( &$this, 'init__addImagesSizes' ) );

  } /* __construct() */


  /**
   * Add Image Sizes
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @since 1.0.0
   *
   */

  public function init__addImagesSizes()
  {

    /**
     * Make sure to use semantic image size names
     * eg: 'hero', 'feature' as opposed to `500x400`, `400x300`
     *
     * This allows to change the image size declaration, without needing to change
     * the name in each template where the size used
     *
     * If the name contains 2 words in it, use '_' instead of '-' allows to reference the size using
     * dot notation in twig templates. eg: sizes.hero_full, instead of sizes['hero-full']
     *
     */

    add_image_size('hero_full', 1920);
    add_image_size('hero_md', 1280);
    add_image_size('hero_sm', 640);
    add_image_size('hero_sq', 960, 960);
    add_image_size('card', 320, 320, true);
    add_image_size('card_md', 460, 420, true);
    add_image_size('featured', 960, 540, true);

  } /* init__addImagesSizes() */

  /**
   *
   * Replace the default wp gallery markup, with a compiled Twig template
   *
   * @author Felipe Arosemena
   * @package Media.php
   * @since 1.0
   * @param
   * @return
   */

  public function post_gallery__changeGalleryMarkup( $output = '', $atts, $instance )
  {

    $images = array();
    $context = Timber::get_context();


    foreach (explode(',', $atts['ids']) as $id) {
      $images[] = new TimberImage($id);
    }

    $context['images'] = $images;
    $context['instance'] = $instance;

    return Timber::compile('includes/wp-gallery.twig', $context);

  } /* gallery_style__changeGalleryMarkup() */

  /**
   *
   * Update the markup outputted by WP oembed for videos
   *
   * @author  Felipe Arosemena <felipearosemena@gmail.com>
   * @package Media.php
   * @since 1.0
   */

  public function embed_oembed_html__updateEmbeddedMarkup($cache, $url, $attr)
  {

    $video_service = Video::getVideoService($url);

    if(!$video_service || is_admin()) {
      return $cache;
    }

    return '<div class="embed-wrapper">' . $cache . '</div>';

  }

}
