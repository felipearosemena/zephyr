<?php
/**
 * Search results page
 *
 * @package  zephyr
 * @since    1.0.0
 */

$context = Timber::get_context(); 

$context['title'] = 'Search results for "'. get_search_query(). '"';
$context['query'] = get_search_query();
$context['posts'] = Timber::get_posts();

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination']      = Timber::get_pagination();

Timber::render('search.twig', $context);
