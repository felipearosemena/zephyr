<?php

namespace BW;

use WP_REST_Server;
use WP_Error;
use WP_Query;
use Timber;
use TimberImage;
use WP_REST_Controller;
use WP_REST_Response;


class REST {

  public $nonce_key = 'wp_rest';
  public $rest_custom_post_types = array(
    'project' => 'projects'
  );

  public function __construct() {

    add_action( 'rest_api_init', array( &$this, 'register_routes' ));
    add_action( 'rest_api_init', array( &$this, 'register_fields' ));

    add_filter( 'wp_enqueue_scripts', array( &$this, 'localizeScripts' ) );
    add_filter( 'rest_project_query', array( &$this, 'posts_allow_custom_request_params' ), 99, 2 );

    // if on dev mode, please make sure to add `define( 'BW_DEV', true );` to the wp-config
    // file in order to test the rest API in the browser
    // otherwise, the rest api can be tested through the terminal
    if ( !defined( 'BW_DEV' ) || !BW_DEV ) {
      add_filter( 'rest_authentication_errors', array( &$this, 'validate_nonce' ));
    }


  }

  public function root()
  {
    return esc_url_raw( rest_url() );
  }

  public function localizeScripts()
  {
    wp_localize_script( 'public-script', 'Global', array(
      'api' => $this->root(),
      'api_namespace' => $this->api_namespace(),
      'nonce' => wp_create_nonce( $this->nonce_key ),
    ));
  }

  public function api_namespace()
  {
    return 'rest/v1';
  }

  public function validate_nonce()
  {

    // if(!isset($_SERVER['HTTP_X_WP_NONCE']) || !wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], $this->nonce_key)) {
    //   return new WP_Error( 'bw_invalid_nonce', 'Invalid nonce', array( 'status' => 400 ));
    // }

    return null;
  }

  public function posts_allow_custom_request_params( $args, $request ) {

      $args += array(
        'meta_key'     => $request['meta_key'],
        'meta_value'   => $request['meta_value'],
        'meta_query'   => $request['meta_query'],
        // 'project_type' => $request['project_type'],
      );

      return $args;

  }

  public function register_routes() {

    register_rest_route( $this->api_namespace(), '/cart', array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => array( &$this, 'get_cart' )
    ));

  }

  public function register_fields()
  {
    // register_rest_field('project', 'terms', [
    //     'get_callback' => array( &$this, 'get_project_terms' )
    // ]);
  }

  public function get_cart($params)
  {


    $args = array(
      'posts__in' => [],
      'posts_per_page' => -1
    );

    if(isset($params['page'])) {
      $args['paged'] = $params['page'];
    }

    $posts = [];
    $query = new WP_Query($args);
    $controller = new WP_REST_Controller();
    return $posts;

    foreach ( $query->get_posts() as $post ) {
       $data    = $controller->prepare_item_for_response( $post, $params );
       $posts[] = $controller->prepare_response_for_collection( $data );
    }

    $response = new WP_REST_Response($posts, 200);

    $response->header('X-WP-Total', $query->found_posts);
    $response->header('X-WP-TotalPages', $query->max_num_pages);

    return $response;

  }

  public function get_project_terms($object)
  {
    return wp_get_post_terms($object['id'], 'project_type');
  }

}
