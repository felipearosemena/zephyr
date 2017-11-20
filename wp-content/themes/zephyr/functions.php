<?php

/**
 * Include composer vendors, if it exists
 */
if ( file_exists( dirname( __FILE__ ) . '/lib/vendor/autoload.php' ) ) {
  require_once( dirname( __FILE__ ) . '/lib/vendor/autoload.php' );
}

/**
 * Set default constants
 */
if ( !defined( 'WP_DEBUG' ) ) {
  define( 'WP_DEBUG', false );
}



class App {
  public static $instance;
  public function __construct() {

    self::$instance = $this;

    /**
     * Instantiate app classes
     */
    new Z\CustomPostTypes();
    new Z\CustomTaxonomies();
    new Z\Enqueue();
    new Z\Media();
    new Z\Search();
    new Z\Setup();
    new Z\Social();
    new Z\Shortcodes();
    new Z\Twig();
    new Z\TinyMCE();
    new Z\Woocommerce();

    $this->rest = new Z\REST();

  }

  public static function get() {
    if (self::$instance === null) {
      self::$instance = new self();
    }
    return self::$instance;
  }
}

function app() {
  return App::get();
}

app();
