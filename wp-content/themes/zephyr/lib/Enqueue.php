<?php

namespace BW;

class Enqueue
{
  protected $dev = false;


  public function __construct()
  {
    // Is Dev?
    $this->dev = ( defined( 'WP_DEBUG' ) ) ? WP_DEBUG : false;

    // Editor styles
    add_action( 'init', array( &$this, 'init__addEditorStyle' ) );

    // Scripts and styles
    add_action( 'wp_enqueue_scripts', array( &$this, 'wp_enqueue_scripts__enqueueScripts' ) );
    add_action( 'wp_enqueue_scripts', array( &$this, 'wp_enqueue_styles__enqueueStyles' ) );

    add_action( 'wp_enqueue_scripts', array( &$this, 'wp_enqueue_scripts__woocommerce_script_cleaner' ), 99 );

  } /* __construct() */

  /**
   * Manage WooCommerce styles and scripts.
   */
  public function wp_enqueue_scripts__woocommerce_script_cleaner() {

    // Remove the generator tag
    remove_action( 'wp_head', array( $GLOBALS['woocommerce'], 'generator' ) );

    wp_dequeue_style( 'woocommerce-general');
    wp_dequeue_style( 'woocommerce-layout' );
    wp_dequeue_style( 'woocommerce_frontend_styles' );
    wp_dequeue_style( 'woocommerce-smallscreen' );
    wp_dequeue_style( 'woocommerce_fancybox_styles' );
    wp_dequeue_style( 'woocommerce_chosen_styles' );
    wp_dequeue_style( 'woocommerce_prettyPhoto_css' );

    wp_dequeue_script( 'wc-add-payment-method' );
    wp_dequeue_script( 'wc-lost-password' );
    wp_dequeue_script( 'wc_price_slider' );
    wp_dequeue_script( 'wc-single-product' );
    wp_dequeue_script( 'wc-add-to-cart' );
    wp_dequeue_script( 'wc-cart-fragments' );
    wp_dequeue_script( 'wc-credit-card-form' );
    wp_dequeue_script( 'wc-add-to-cart-variation' );
    wp_dequeue_script( 'wc-single-product' );
    wp_dequeue_script( 'wc-cart' );
    wp_dequeue_script( 'wc-chosen' );
    wp_dequeue_script( 'prettyPhoto' );
    wp_dequeue_script( 'prettyPhoto-init' );
    wp_dequeue_script( 'jquery' );
    wp_dequeue_script( 'jquery-blockui' );
    wp_dequeue_script( 'jquery-placeholder' );
    wp_dequeue_script( 'jquery-payment' );
    wp_dequeue_script( 'fancybox' );
    wp_dequeue_script( 'jqueryui' );
    wp_dequeue_script( 'wc-checkout' );
    wp_dequeue_script( 'woocommerce' );
    wp_dequeue_script( 'woocommerce_stripe' );
    wp_dequeue_script( 'woocommerce_stripe_apple_pay' );

    if(is_page_template('templates/dashboard.php')) {
    };
  }

  /**
   * Enqueue public JS
   *
   * @return null
   */
  public function wp_enqueue_scripts__enqueueScripts()
  {
    if ($this->isLoginOrAdminPage()) {
      return;
    }

    $script_name = $this->dev ? 'public.js' : 'public.min.js';

    wp_enqueue_script( 'public-script', $this->themeSrc('/dist/scripts/' . $script_name) , null, null, true );
    wp_enqueue_script( 'modernizr', $this->themeSrc('/dist/scripts/vendor/modernizr-custom.js'), null, null, false);

  } /* wp_enqueue_scripts__enqueueScripts() */

 
  /**
   * Enqueue public CSS
   *
   * @return null
   */
  public function wp_enqueue_styles__enqueueStyles()
  {
    if ($this->isLoginOrAdminPage()) {
      return;
    }

    $stylesheet_name = $this->dev ? 'public.css' : 'public.min.css';

    wp_enqueue_style( 'mainstyles', $this->themeSrc('/dist/styles/' . $stylesheet_name));

  } /* wp_enqueue_styles__enqueueStyles() */


  /**
   * Add editor style
   *
   * @return null
   */
  
  public function init__addEditorStyle()
  {

    if ($this->isLoginOrAdminPage()) {
      add_editor_style( 'editor-style.css' );
    }

  } /* init__addEditorStyle() */

  /**
   * Determine if the current page is either an admin screen or the login page
   *
   * @return boolean
   */
  protected function isLoginOrAdminPage()
  {
    global $pagenow;

    return ( is_admin() || $pagenow == 'wp-login.php' ) ? true : false;
  }

  /**
   *
   * Prepend a source path with the stylesheet directory uri
   *
   * @return string - Full URI to the source provided
   */
  private function themeSrc($src)
  {
    return get_stylesheet_directory_uri() . $src;
  }
}
