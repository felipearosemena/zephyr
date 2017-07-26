<?php

namespace Z;

class Search
{

  public function __construct()
  {
    add_filter( 'relevanssi_excerpt_content', array( &$this, 'relevanssi_excerpt_content__addCustomFields' ), 10, 3 );
  } /* __construct() */


  /**
   * Add custom fields to the relevanssi exerpt to print on the front end
   *
   * Make sure to use post_excerpt when pulling the excerpt for search results
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   * @param (string)  $content, $post, $query  - Description
   * @return (object) Description
   */

  public function relevanssi_excerpt_content__addCustomFields( $content, $post, $query )
  {

    if ( !$post || !$post->ID ) {
      return $content;
    }

    if ( empty( $content ) ) {
      $content = '';
    }

    $postID = $post->ID;

    // the fields to check content from
    $fields = array(
      'general_excerpt',
      'general_shortexcerpt',
    );

    foreach ( $fields as $key => $value ) {
      $field = get_field( $value, $postID );

      if ( $field ) {
        $content .= $field;
      }
    }

    return $content;

  } /* relevanssi_excerpt_content__addCustomFields() */

}
