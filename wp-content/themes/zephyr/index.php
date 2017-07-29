<?php
/**
 * The main template file
 *
 * @package  zephyr
 * @since    1.0.0
 */

global $wp_query;

use Z\Utils;

$context = Timber::get_context();
$context['posts'] = Timber::get_posts(Utils::getListingQueryArgs());
$context['post']  = new TimberPost(get_option('page_for_posts', true));
$context['taxonomies'] = Utils::getListingTaxonomies(array(
  'category' => 'category_name'
));

$context['query_vars'] = $wp_query->query_vars;

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination'] = Timber::get_pagination();

Timber::render('index.twig', $context);
