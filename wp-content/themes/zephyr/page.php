<?php
/**
 * The template for displaying all pages.
 *
 * @package  zephyr
 * @since    1.0.0
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$template = 'page.twig';

if(is_checkout() && !is_wc_endpoint_url( 'order-received' )) {
  $template = 'page-checkout.twig';
}

Timber::render( $template, $context );
