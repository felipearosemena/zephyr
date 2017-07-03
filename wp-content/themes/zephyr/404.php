<?php
/**
 * The template for displaying 404 pages (Not Found)
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package  zephyr
 * @since    1.0.0
 */

$context = Timber::get_context();
Timber::render( '404.twig', $context );
