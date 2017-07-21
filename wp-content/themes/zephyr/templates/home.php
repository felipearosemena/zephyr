<?php
/**
 * Template Name: Home
 *
 * @package  zephyr
 * @since    1.0.0
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['terms'] = Timber::get_terms('product_cat');

Timber::render('templates/home.twig', $context);
