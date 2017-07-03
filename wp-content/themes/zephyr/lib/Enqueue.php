<?php

namespace BW;

class Enqueue
{
  protected $dev = false;


  public function __construct()
  {
    // Is Dev?
    $this->dev = ( defined( 'BW_DEV' ) ) ? BW_DEV : false;

    // Editor styles
    add_action( 'init', array( &$this, 'init__addEditorStyle' ) );

    // Scripts and styles
    add_action( 'wp_enqueue_scripts', array( &$this, 'wp_enqueue_scripts__enqueueScripts' ) );
    add_action( 'wp_enqueue_scripts', array( &$this, 'wp_enqueue_styles__enqueueStyles' ) );

  } /* __construct() */

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
