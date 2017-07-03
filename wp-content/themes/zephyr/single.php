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
$context['share_post'] = new BW\SharePost();

$context['related'] = Timber::get_posts( BW\Utils::getRelatedPosts( $post->ID ) );
$context['author'] = new TimberUser($post->post_author);
$context['terms'] = get_the_terms( $post->ID, 'category' );

$template = post_password_required() ? 'single-password.twig' : 'single.twig';

Timber::render( $template, $context );