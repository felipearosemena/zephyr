<?php
/**
 * The Template for displaying all single posts
 *
 * @package  zephyr
 * @since    1.0.0
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['share_post'] = new Z\SharePost();

$template = post_password_required() ?
  'single-password.twig' :
  [ 'single-' . $post->post_type . '.twig', 'single.twig' ];

Timber::render( $template, $context );
