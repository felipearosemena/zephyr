<?php

namespace Z;

class Woocommerce
{

  public function __construct()
  {

    add_filter( 'woocommerce_product_single_add_to_cart_text', array( &$this, 'woocommerce_product_single_add_to_cart_text' ) );


  } /* __construct() */


  public function woocommerce_product_single_add_to_cart_text()
  {
    return 'Buy me';
  }

}
