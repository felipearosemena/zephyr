<?php

if (!class_exists('Timber')){
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}

global $wp_query;

$context = Timber::get_context();

if (is_singular('product')) {

  $post               = Timber::get_post();
  $context['post']    = $post;
  $product            = wc_get_product( $context['post']->ID );
  $context['product'] = $product;
  $context['term']    = $post->get_terms('product_cat')[0];

  Timber::render('single-product.twig', $context);

} else {
  $posts = Timber::get_posts();
  $context['products'] = $posts;
  $context['query'] = $wp_query;

  $context['post'] = Timber::get_post(get_option('woocommerce_shop_page_id'));

  if ( is_product_category() ) {

    $queried_object = get_queried_object();
    $term_id = $queried_object->term_id;
    $context['category'] = get_term( $term_id, 'product_cat' );
    $context['title'] = single_term_title('', false);

    $context['hero_link_label'] = 'View the full collection';
    $context['hero_link'] = "/shop";

  }

  Timber::render('templates/shop.twig', $context);

}
