<?php

namespace Z;

class Woocommerce
{

  public function __construct()
  {

    add_filter( 'woocommerce_product_single_add_to_cart_text', array( &$this, 'woocommerce_product_single_add_to_cart_text' ) );
    add_action( 'woocommerce_after_single_product', array( &$this, 'woocommerce_after_single_product' ) );


  } /* __construct() */


  public function woocommerce_product_single_add_to_cart_text()
  {
    return 'Buy me';
  }

  public function woocommerce_after_single_product()
  {
    echo '<p class="mt-2 mb-0 small-text">' . get_field('single_product_bottom_message', 'option'). '</p>';
  }

}
