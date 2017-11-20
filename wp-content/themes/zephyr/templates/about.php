<?php
/**
 * Template Name: About
 *
 * @package  zephyr
 * @since    1.0.0
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

Timber::render('templates/about.twig', $context);
