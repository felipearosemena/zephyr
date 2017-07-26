<?php

namespace Z;

use Timber;

class Utils
{

  /**
   * Utilize Wordpress's default oembed function to embed videos
   *
   * @author Felipe Arosemena
   * @package Utils.php
   * @since 1.0
   * @param $url, $width = 0, $height = 0, $post_id = 0
   * @return shortcode
   */

  public static function embed_video_url( $url, $width = 0, $height = 0, $post_id = 0 )
  {

    $wpembed = new WP_Embed();

    if ( !empty( $post_id ) ) {
      $wpembed->post_ID = $post_id;
    }

    $video_size = array(
      'width' => $width,
      'height' => $height,
    );

    return $wpembed->shortcode( $video_size, $url );

  } /* embed_video_url() */


  /**
   * Get a post from a given slug
   *
   * @package Post.php
   * @since 1.0
   * @param $slug = ''
   * @return $data
   */

  public static function getPagePostFromSlug( $slug = '', $type = '', $postType = null )
  {

    if ( empty( $slug ) ) {
      return;
    }

    if ( empty( $postType ) ) {
      $postType = 'page';
    }

    $page = get_page_by_path( $slug, OBJECT, $postType );

    if ( empty( $page ) ) {
      return false;
    }

    return $page;

  } /* getPageDataFromSlug() */

  /**
   * get page post based on the template name
   *
   * @author Felipe Arosemena
   * @package Utils.php
   * @since 1.0
   * @param $template = ''
   * @return $data
   */

  static public function getPageWithTemplate( $template = '' )
  {

    if ( empty($template) ) {
      return;
    }

    $query = new \WP_Query(array(
      'post_type'  => 'page',
      'meta_key'   => '_wp_page_template',
      'meta_value' => 'templates/' . $template . '.php'
    ));

    if ( $query->have_posts() ) {
      return $query->posts[0];
    } else {
      return null;
    }

  }/* getPageWithTemplate() */


  /**
   * split content into columns
   *
   * @package Post.php
   * @since 1.0
   * @param $content = the array of data to split into columns, $columns = max number of columns, $rows = max number of rows
   * @return $data
   */

  public static function splitDataIntoColumns( $content = array(), $maxColumns = 0, $maxRows = 0 )
  {

    // return if the content is empty
    if ( empty( $content ) ) {
      return;
    }

    $data = array();

    // default / init counters
    $column = 0;
    $i = 0;

    // get the content count
    $contentCount = count( $content );

    // echo $contentCount;

    if ( empty( $maxRows ) ) {
      $maxRows = 6;
    }

    if ( empty( $maxColumns ) ) {
      $maxColumns = 4;
    }

    // check our content and get the max number of rows per column
    if ( $contentCount > ( $maxRows * $maxColumns ) ) {
      $rows = ceil( $contentCount / $maxColumns );
    } else {
      $rows = $maxRows;
    }

    // go thru the number of columns
    // check if the column ( which is 0 initially ) is greater than the set number of columns required
    // and if i ( out content counter ) is less than the content count
    while ( $column < $maxColumns && $i < $contentCount ) {
      // get the data based on our i counter
      $data[$column][] = $content[$i];

      // increment i before anything else
      $i++;


      // then we do some checking to increase the columns

      // check if i % number of rows is 0
      // we're setting a max number of rows per column depending on the content

      // we also check our i counter if it is 0
      // if it is, we don't want to increase the column because it is the first iteration

      if ( $i % $rows === 0 && $i != 0 ) {
        $column++;
      }
    }

    return $data;

  } /* splitDataIntoColumns() */



  /**
   * Transform an array to a url with query parameters
   * starting from a given base url.
   *
   * @param (string) $base_url - base url to build from
   * @param (array) $url_args - arguments to use to build url query
   * @return (string) new url with query parameters
   */
  static public function arrayToUrl( $baseUrl, $urlArgs = array() )
  {

    $args = array();

    if ( !empty( $urlArgs ) )
    {

      foreach($urlArgs as $key => $arg)
      {
        if ($arg)
          $args[] = $key .'='. $arg;
      }

    }

    $args = implode('&',$args);
    $baseUrl .= (strpos($baseUrl,'?') === false) ? '?' : '&';

    return $baseUrl . $args;

  }/* arrayToUrl() */

  
  /**
   * Get Listing Query Arguments
   *
   * Adds search and taxonomy parameters based the on URL's GET parameters.
   * To be used in custom page templates that display custom post type listings.
   *
   * When doing a search query, GET['s'] will only work for 'post' post types, not for CPT. Instead
   * try to use GET['search'] and use this function, which will get that parameters and convert it to
   * GET['s'] for you.
   *
   * @param (array) $args WP_Query arguments
   * @param (array) $taxonmies List of taxonomy names that you want to factor into the arguments
   * @return $array WP_Query parameters with the added filter parameters.
   */

  public static function getListingQueryArgs( $args = array(), $taxonomies = false )
  { 

    $query_vars = array();

    $paged = get_query_var('paged');

    if(isset($paged)) {
      $args['paged'] = $query_vars['paged'] = $paged;
    }

    if(isset($_GET['search'])) {
      $args['s'] = $query_vars['search'] = $_GET['search'];
    }

    $category_name = get_query_var('category_name');
    if(isset($category_name)) {
      $args['category_name'] = $query_vars['category_name'] = $category_name;
    }

    $tag_name = get_query_var('tag');
    if(isset($tag_name)) {
      $args['tag'] = $query_vars['tag'] = $tag_name;
    }

    if(!empty($taxonomies)) {
      $tax_query = array(
        'relation' => 'AND'
      );

      foreach ($taxonomies as $taxonomy) {
        $query_var = get_query_var($taxonomy);

        if(!empty($query_var)) {
          $tax_query[] = array(
            'taxonomy' => $taxonomy,
            'field' => 'slug',
            'terms' => [$query_var]
          );
        }

        $query_vars[$taxonomy] = $query_var;
      }

      $args['tax_query'] = $tax_query;
    }

    $args['query_vars'] = $query_vars;

    return $args;

  }

  /**
   * 
   * Gets an array of taxonomies with it's corresponding terms and it's own terms object
   *
   * @author Felipe Arosemena (felipearosemena@gmail.com)
   * @param  array  $taxonomies Array of taxonomies to retrieve. This array can be a simple list of taxonomy slugs: 
   * 
   * array('tax-1', 'tax-2')
   * 
   * in which case the $query_key will be the taxonomy slug passed. 
   * 
   * You can also pass a an associative array:
   * 
   * array(
   *   'tax-1' => 'query-key-1',
   *   'tax-2' => 'query-key-2'
   * )
   *
   * You will need to use the associative array option when dealing with the 'category' taxonomy, for which wordpress
   * only recognizes GET parameters if you use 'category_name', not 'category'.
   * 
   * @return array Array of taxonomies containing it's tax object, terms, and query key to be used in GET queries
   * 
   */
  static public function getListingTaxonomies($taxonomies = array())
  {

    $arr = array();

    foreach($taxonomies as $tax => $query_key) {

      if($tax === 0) {
        $tax = $query_key;
      }

      $arr[$tax] = array(
        'query_key' => $query_key,
        'taxonomy' => get_taxonomy($tax),
        'terms' => Timber::get_terms($tax)
      );
    }

    return  $arr;
  }

  /**
   *
   * Gets related posts and gets random ones if less than 3 selected
   *
   * @param (int) Post ID of current post
   * @return (array) Array of posts
   */
  static public function getRelatedPosts( $id )
  {

    $default_count = 3;
    $posts = get_field( 'related_posts', $id );

    if(empty($posts)) {

      $args = array(
        'posts_per_page' => $default_count,
        'post_type'      => 'post',
        'post__not_in'   => [ $id ]
      );

      $posts = get_posts( $args );
    }

    return $posts;

  }


  /**
   *
   * Outputs to JS console for 
   * debugging
   *
   */
  
  static public function log($var)
  {
    $script = '<script>console.debug(' . json_encode($var) . ');</script>';
    if(function_exists('add_action')) {
      add_action('wp_print_footer_scripts',function() use($script) {
        echo $script;
      }, 9999);
      add_action('admin_print_footer_scripts',function() use($script) {
        echo $script;
      }, 9999);
    }else {
      echo $script;
    }

  }/* log() */
}
