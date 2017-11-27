<?php

namespace Z;

use Timber;
use TimberMenu;
use TimberSite;
use Twig_Filter_Function;
use Twig_SimpleFunction;
use Kint;

class Twig extends TimberSite
{

  /**
   * Directory that holds the twig template files
   */
  public $templateDir = array(
    'src/views',
  );

  public function __construct()
  {
    add_filter( 'timber_context', array( &$this, 'add_to_context' ) );
    add_filter( 'get_twig', array( $this, 'get_twig__addFilters' ) );

    Timber::$dirname = $this->templateDir;

    parent::__construct();

  } /* __construct() */

  /**
   * Add elements to the array passed to all templates
   *
   * @since 1.0.0
   * @param (array) $context - The pre-existing information
   * @return array
   */
  public function add_to_context( $context )
  {

    $context['site']           = $this;
    $context['src_uri']        = get_stylesheet_directory_uri() . '/src/';
    $context['src_dir']        = get_stylesheet_directory() . '/src/';
    $context['wp_title_right'] = wp_title( '|', false, 'right' );

    $context['main_menu']     = new TimberMenu( 'main-nav' );
    $context['util_menu']     = new TimberMenu( 'util-nav' );
    $context['footer_menu']   = new TimberMenu( 'footer-nav' );
    $context['cart_url']      = wc()->cart->get_cart_url();
    $context['cart_path']     = '/' . get_page_uri( wc_get_page_id( 'cart' ) );;
    $context['shop_url']      = get_permalink( wc_get_page_id( 'shop' ) );
    $context['shop_path']     = '/' . get_page_uri( wc_get_page_id( 'shop' ) );
    $context['cart_totals']   = wc()->cart->get_cart_contents_count();

    if ( function_exists( 'get_fields' ) ) {
      $context['global_info']    = get_fields( 'options' );
    }

    return $context;
  }

  /**
   * Custom Twig Filters and Extensions
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   */

  public function get_twig__addFilters($twig)
  {

    $twig->addFilter('char_limit', new Twig_Filter_Function(array(&$this, 'filter_charLimit' )));
    $twig->addFilter('debug', new Twig_Filter_Function(array(&$this, 'filter_kintDebug' )));
    $twig->addFilter('file_get_contents', new Twig_Filter_Function(array(&$this, 'filter__file_get_contents' )));
    $twig->addFilter('link_vars', new Twig_Filter_Function(array(&$this, 'filter__link_vars' )));
    $twig->addFilter('first_item', new Twig_Filter_Function(array(&$this, 'filter__first_item' )));
    $twig->addFilter('set_global_product', new Twig_Filter_Function(array(&$this, 'filter__set_global_product' )));


    return $twig;

  } /* get_twig() */

  function filter__set_global_product( $post ) {

    global $product;

    if ( is_woocommerce() ) {
      $product = wc_get_product($post->ID);
    }

    return $product;
  }

  /**
   * Limits the character output of a string, adding elipsis if the result was trimmed.
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   */
  public function filter_charLimit( $string, $limit )
  {
    if(is_string($string)) {
      $len = strlen($string);
      return $len >= $limit ? substr($string, 0, $limit - $len) . '...' : $string;
    }
  }

  /**
   * Output value through the Kint debugger, fallback to var_dump if Kint is not available
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   */
  public function filter_kintDebug( $value )
  {
    return class_exists('Kint') ? Kint::dump($value) : var_dump($value);
  }

  /**
   *
   * Twig filter for php `file_get_contents` function
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   *
   */

  public function filter__file_get_contents( $url )
  {
    return @file_get_contents($url);
  }

  /**
   *
   * Twig filter to get internal/external link variables, as well as the target
   *
   * @param array $vars Array of variables to get the link from
   * @param string $vars['link_type'] Must be equal to "internal" or "external"
   * @param string $vars['link_internal']
   * @param string $vars['link_external']
   *
   * @return array Link object with the correct link and target
   * @return string array['href'] Link object href
   * @return string array['target'] Target for the link
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   *
   */

  public function filter__link_vars( $vars )
  {

    $type = $vars['link_type'];
    $internal = $vars['link_internal'];
    $external = $vars['link_external'];

    $link = array();

    if($type == 'internal') {
      $link['href'] = $internal;
      $link['target'] = '_self';
    } elseif ($type == 'external') {
      $link['href'] = $external;
      $link['target'] = '_blank';
    }

    return $link['href'] ? $link : false;

  }

  /**
   *
   * Get the first item in an array. Returns null if array is empty
   *
   * @param array $arr Array to get the item from
   *
   * @return (item/null) The first item in the array, or null if array it empty
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   *
   */

  public function filter__first_item( $arr )
  {

    return !empty($arr) ? $arr[0] : null;

  }
}
