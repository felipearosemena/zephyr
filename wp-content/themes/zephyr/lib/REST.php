<?php

namespace Z;

use WP_REST_Server;
use WP_Error;
use WP_Query;
use Timber;
use TimberImage;
use WP_REST_Posts_Controller;
use WC_REST_Products_Controller;
use WP_REST_Response;
use WC_Product_Variable;
use WC_Data_Store;


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

    add_filter( 'rest_product_collection_params', array( &$this, 'add_rest_orderby_params' ), 10, 1 );

    // if on dev mode, please make sure to add `define( 'Z_DEV', true );` to the wp-config
    // file in order to test the rest API in the browser
    // otherwise, the rest api can be tested through the terminal
    if ( !defined( 'Z_DEV' ) || !Z_DEV ) {
      add_filter( 'rest_authentication_errors', array( &$this, 'validate_nonce' ));
    }


  }

  public function root()
  {
    return esc_url_raw( rest_url() );
  }

  public function localizeScripts()
  {
    date_default_timezone_set('EST');
    wp_localize_script( 'public-script', 'Global', array(
      'api' => $this->root(),
      'api_namespace' => $this->api_namespace(),
      'nonce' => $this->getNonce(),
      'nonce_date' => date('l jS \of F Y h:i:s A')
    ));
  }

  public function getNonce()
  {
    return wp_create_nonce( $this->nonce_key );
  }

  public function api_namespace()
  {
    return 'rest/v1';
  }

  public function validate_nonce()
  {
    if(!isset($_SERVER['HTTP_X_WP_NONCE']) || !wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], $this->nonce_key)) {
      return new WP_Error( 'Z_invalid_nonce', 'Invalid nonce', array( 'status' => 400 ));
    }

    return null;
  }

  public function add_rest_orderby_params( $params )
  {
    $params['orderby']['enum'][] = 'menu_order';

    return $params;
  }

  public function posts_allow_custom_request_params( $args, $request ) {

      $args += array(
        'meta_key'     => $request['meta_key'],
        'meta_value'   => $request['meta_value'],
        'meta_query'   => $request['meta_query'],
      );

      return $args;

  }

  public function register_routes() {

    register_rest_route( $this->api_namespace(), '/cart/add/(?P<id>\d+)', array(
      'methods' => WP_REST_Server::EDITABLE,
      'callback' => array( &$this, 'add_to_cart' ),
      'args' => array(
        'id' => array(
          'validate_callback' => function($param, $request, $key) {
            return is_numeric($param);
          }
        )
      )
    ));

    register_rest_route( $this->api_namespace(), '/cart/set_quantity/(?P<key>\S+)/(?P<qty>\d+)', array(
      'methods' => WP_REST_Server::EDITABLE,
      'callback' => array( &$this, 'set_quantity' )
    ));

    register_rest_route( $this->api_namespace(), '/cart/remove/(?P<key>\S+)', array(
      'methods' => WP_REST_Server::EDITABLE,
      'callback' => array( &$this, 'remove_from_cart' ),
    ));

    register_rest_route( $this->api_namespace(), '/cart', array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => array( &$this, 'get_cart' )
    ));

    register_rest_route( $this->api_namespace(), '/notices', array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => array( &$this, 'get_notices' )
    ));

  }

  public function register_fields()
  {
    register_rest_field('product', 'variations', [
      'get_callback' => array( &$this, 'get_product_variations' )
    ]);

    register_rest_field('product', 'fields', [
      'get_callback' => array( &$this, 'get_product_fields' )
    ]);

    register_rest_field('product', 'path', [
      'get_callback' => array( &$this, 'get_product_path' )
    ]);

    register_rest_field('product', 'thumbnail', [
      'get_callback' => array( &$this, 'get_product_thumbnail' )
    ]);

    register_rest_field('product', 'price', [
      'get_callback' => array( &$this, 'get_product_price' )
    ]);

    register_rest_field('product', 'product_cat', [
      'get_callback' => array( &$this, 'get_product_cat' )
    ]);

    register_rest_field('product', 'product_tag', [
      'get_callback' => array( &$this, 'get_product_tag' )
    ]);
  }

  /**
    * Find matching product variation
    *
    * @param WC_Product $product
    * @param array $attributes
    * @return int Matching variation ID or 0.
    */
  public function find_matching_product_variation($product_id, $attributes) {

    $product = wc_get_product($product_id);

    foreach( $attributes as $key => $value ) {
        if( strpos( $key, 'attribute_' ) === 0 ) {
            continue;
        }

        unset( $attributes[ $key ] );
        $attributes[ sprintf( 'attribute_%s', $key ) ] = $value;
    }

    if( class_exists('WC_Data_Store') ) {

        $data_store = WC_Data_Store::load( 'product' );
        return $data_store->find_matching_product_variation( $product, $attributes );

    } else {

        return $product->get_matching_variation( $attributes );

    }

  }

  public function add_to_cart($params)
  {

    if(isset($params['variations'])) {
      $variation_id = $this->find_matching_product_variation($params['id'], $params['variations']);
    } else {
      $variation_id = false;
    }

    return $this->cartPostResponse(wc()->cart->add_to_cart($params['id'], $params['quantity'], $variation_id, $params['variations']));

  }

  public function remove_from_cart($params)
  {

    return $this->cartPostResponse(wc()->cart->remove_cart_item($params['key']));

  }

  public function set_quantity($params)
  {

    $original_quantity = wc()->cart->cart_contents[$params['key']]['quantity'];
    wc()->cart->set_quantity($params['key'], $params['qty']);
    $valid = wc()->cart->check_cart_items();

    if(!$valid) {
      wc()->cart->set_quantity($params['key'], $original_quantity);
    }

    return $this->cartPostResponse($valid);

  }

  public function cartPostResponse($content)
  {

    $response = new WP_REST_Response($content, 200);
    $response->header('nonce', $this->getNonce());

    return $response;
  }

  public function get_cart($params)
  {

    $product_ids = [];

    $cart = wc()->cart;
    $cart->count = $cart->get_cart_contents_count();
    $cart->cart_subtotal = $cart->get_subtotal();

    return $this->cartPostResponse($cart);

  }

  public function get_notices()
  {
    $response = new WP_REST_Response(wc_get_notices(), 200);
    wc_clear_notices();
    return $response;
  }

  public function get_product_variations($object)
  {
    $product = new WC_Product_Variable( $object['id'] );
    return $product->get_variation_attributes();
  }

  public function get_product_fields($object)
  {
    return get_fields($object['id']);
  }

  public function get_product_path($object)
  {
    return str_replace( home_url(), '', get_permalink($object['id']) );
  }

  public function get_product_price($object)
  {
    $product = wc_get_product($object['id']);
    return $product->get_price_html();
  }

  public function get_product_thumbnail($object)
  {

    $image = new TimberImage($object['featured_media']);
    $sizes = $image->sizes;

    foreach ($sizes as $size => &$value) {
      $value['src'] = $image->src($size);
    }

    return array(
      'id'    => $image->ID,
      'title' => $image->title(),
      'alt'   => $image->alt(),
      'src'   => $image->src(),
      'sizes' => $sizes
    );

  }

  public function get_product_cat($object)
  {
    return wp_get_post_terms($object['id'], 'product_cat');
  }

  public function get_product_tag($object)
  {
    return wp_get_post_terms($object['id'], 'product_tag');
  }

}
