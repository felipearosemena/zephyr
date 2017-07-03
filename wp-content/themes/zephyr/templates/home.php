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

Timber::render('templates/home.twig', $context);
