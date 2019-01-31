<?php

namespace Z;

class Woocommerce
{

  public function __construct()
  {

    add_filter( 'woocommerce_product_single_add_to_cart_text', array( &$this, 'woocommerce_product_single_add_to_cart_text' ) );
    add_filter( 'woocommerce_default_address_fields', array( &$this, 'woocommerce_default_address_fields' ) );
    add_action( 'woocommerce_after_single_product', array( &$this, 'woocommerce_after_single_product' ) );
    add_filter( 'woocommerce_thankyou_order_received_text', array( &$this, 'woocommerce_thankyou_order_received_text' ) , 10, 2 );
    add_filter( 'woocommerce_checkout_fields', array( &$this, 'woocommerce_checkout_fields' ) , 10, 2 );
    add_filter( 'the_title', array( &$this, 'woocommerce_update_title' ), 10, 2 );
    add_action( 'wp_head', array( &$this, 'redirect_cart'));

  } /* __construct() */


  public function woocommerce_product_single_add_to_cart_text()
  {
    return 'Buy me';
  }

  public function woocommerce_after_single_product()
  {
    echo '<p class="mt-15 mb-0 small-text">' . get_field('single_product_bottom_message', 'option'). '</p>';
  }


  public function woocommerce_checkout_fields( $fields ) {
    unset($fields['billing']['billing_company']);
    unset($fields['order']['order_comments']);

    return $fields;
  }

  public function woocommerce_default_address_fields($fields)
  {

    $fields['address_2']['placeholder'] = 'Apartment, unit, etc';

    return $fields;
  }

  public function woocommerce_update_title($title, $id)
  {

    // Change title for order received page
    if ( is_order_received_page() && get_the_ID() === $id ) {

      global $wp;

      $order_id  = apply_filters( 'woocommerce_thankyou_order_id', absint( $wp->query_vars['order-received'] ) );
      $order_key = apply_filters( 'woocommerce_thankyou_order_key', empty( $_GET['key'] ) ? '' : wc_clean( $_GET['key'] ) );


      if ( $order_id > 0 ) {
        $order = wc_get_order( $order_id );

        if ( $order->get_order_key() != $order_key ) {
          unset( $order );
        }
      }
      if ( isset ( $order ) ) {
        $title = sprintf( "Thank you, %s!", esc_html( $order->get_billing_first_name() ) );
      }

    }

    return $title;

  }

  public function woocommerce_thankyou_order_received_text( $text, $order )
  {
    return 'Your transaction has been completed and a receipt for your purchase has been emailed to you.';
  }

  public function redirect_cart()
  {
    if(is_cart()) {
      wp_redirect('/');
    }
  }

}
