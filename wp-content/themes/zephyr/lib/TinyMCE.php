<?php

namespace BW;

/**
 *
 * TinyMce
 *
 * Custom TinyMCE buttons
 *
 */

class TinyMce
{

  public function __construct() {

    add_filter('mce_buttons_2', array( &$this, 'mce_buttons_2_enableStyleSelect' ));
    add_filter( 'tiny_mce_before_init', array( &$this, 'tiny_mce_before_init__addCustomClasses' ));

  } /* __construct() */

  /**
   * Enable the styleselect dropdown in the WYSIWYG
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   */

  public function mce_buttons_2_enableStyleSelect( $buttons )
  {

    array_unshift( $buttons, 'styleselect' );

    return $buttons;

  } /* mce_buttons_2_enableStyleSelect() */

  /**
   * Expose custom classes to be added into the WYSIWYG
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   */

  public function tiny_mce_before_init__addCustomClasses( $settings ) 
  {

    $style_formats = array(
        array(
            'title' => 'Button',
            'selector' => 'a',
            'classes' => 'btn',
        )
    );

    $settings['style_formats'] = json_encode( $style_formats );

    return $settings;

  }

}
