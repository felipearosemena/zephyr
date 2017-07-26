<?php

namespace Z;

class CustomTaxonomies
{

  // Place taxonomies here. Singular and plural will be used to auto generate labels. Labels and args will overwrite defaults.
  protected $taxonomies = [];

  // Default arguments to use for register_taxonomy
  protected $default_args = [
    'hierarchical'      => true,
    'show_ui'           => true,
    'show_admin_column' => true,
    'query_var'         => true
  ];

  public function __construct()
  {
    add_action( 'init', array( &$this, 'init__registerTaxonomies' ), 1 );
  } /* __construct() */


  /**
   * Generate and register post types defined in $posttypes
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package CustomTaxonomies.php
   */

  public function init__registerTaxonomies()
  {
    foreach ( $this->taxonomies as $slug => $options ) {
      $this->dynamicRegisterTaxonomy($slug, $options);
    }

  } /* init__registerTaxonomies() */


  /**
   * Register a taxonomy with minimal effort
   *
   * @author Felipe Arosemena <felipearosemena@gmail.com>
   * @package zephyr
   * @since 1.0.0
   * @param (string) $slug - The taxonomy slug
   * @param (array) $options - Arguments to overwrite defaults (accepts singular, plural, labels, args)
   * @return (object | WP_Error) The registered taxonomy object, or an error object
   */

  private function dynamicRegisterTaxonomy($slug, $options)
  {

    if ( empty( $options['singular'] ) ) {
      $singular = preg_replace( '%[-_]%', ' ', $slug );
      $singular = ucwords( $singular );
    } else {
      $singular = $options['singular'];
    }

    $plural = ( empty( $options['plural'] ) ) ? $singular.'s' : $options['plural'];

    $labels = array(
      'name'               => __( $plural ),
      'singular_name'      => __( $singular ),
      'menu_name'          => __( $plural ),
      'name_admin_bar'     => __( $singular ),
      'add_new'            => __( 'Add New', $singular ),
      'add_new_item'       => __( 'Add New '.$singular ),
      'add_or_remove_items'  => __( 'Add or remove ' . $plural ),
      'new_item'           => __( 'New '.$singular ),
      'edit_item'          => __( 'Edit '.$singular ),
      'update_item'        => __( 'Update '.$singular ),
      'view_item'          => __( 'View '.$singular ),
      'all_items'          => __( 'All '.$plural ),
      'separate_items_with_commas' => __( 'Separate ' . $plural . ' with commas' ),
      'choose_from_most_used'      => __( 'Choose from the most used ' . $plural ),
      'search_items'       => __( 'Search ' . $plural . '' ),
      'popular_items'      => __( 'Popular ' . $plural ),
      'parent_item_colon'  => __( 'Parent ' . $plural . ':' ),
      'not_found'          => __( 'No ' . $plural . ' found.' ),
    );

    if ( !empty( $options['labels'] ) ) {
      $labels = array_merge( $labels, $options['labels'] );
    }

    $args = $this->default_args;
    $args['labels'] = $labels;
    $args['rewrite'] = array( 'slug' => $slug );

    $object_type = isset( $options['object_type'] ) ? $options['object_type'] : '';

    if ( !empty( $options['args'] ) ) {
      $args = array_merge( $args, $options['args'] );
    }

    return register_taxonomy( $slug, $object_type, $args );

  } /* dynamicRegisterTaxonomy() */

}