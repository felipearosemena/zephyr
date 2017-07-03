<?php

/**
 * Template Name: Team
 *
 * @package  zephyr
 * @since    1.0.0
 */

global $wp_query;

$context = Timber::get_context();
$context['post']  = new TimberPost();

$taxonomies = ['department'];

$args = BW\Utils::getListingQueryArgs(array(
  'post_type' => 'team',
  'posts_per_page' => 2
), $taxonomies);

$context['posts'] = Timber::get_posts($args);
$context['taxonomies'] = BW\Utils::getListingTaxonomies($taxonomies);
$context['query_vars'] = $wp_query->query_vars;

Timber::render('index.twig', $context);