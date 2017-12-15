<?php
/**
 * Template Name: Plain
 *
 * @package  zephyr
 * @since    1.0.0
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['loading_screen'] = false;

Timber::render('page.twig', $context);
