<?php

if (!class_exists('Timber')){
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}

$context = Timber::get_context();

if (is_singular('product')) {

  $context['post']    = Timber::get_post();
  $product            = wc_get_product( $context['post']->ID );
  $context['product'] = $product;

  Timber::render('single-product.twig', $context);

} else {

  if ( is_product_category() ) {
    $context['title'] = single_term_title('', false);
  }

  Timber::render('templates/shop.twig', $context);

}
