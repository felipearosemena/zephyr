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
      new BW\CustomPostTypes();
      new BW\CustomTaxonomies();
      new BW\Enqueue();
      new BW\Media();
      new BW\Search();
      new BW\Setup();
      new BW\Social();
      new BW\Twig();
      new BW\TinyMCE();

      $this->rest = new BW\REST();

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