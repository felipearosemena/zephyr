<?php
/**
 * Variable product add to cart
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/add-to-cart/variable.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see   https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 3.0.0
 */
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

global $product;

$attribute_keys = array_keys( $attributes );

do_action( 'woocommerce_before_add_to_cart_form' ); ?>

<single-product-form :product="state.product" :refs="$refs">

  <?php do_action( 'woocommerce_before_variations_form' ); ?>

  <?php if ( empty( $available_variations ) && false !== $available_variations ) : ?>
    <p class="stock out-of-stock"><?php _e( 'This product is currently out of stock and unavailable.', 'woocommerce' ); ?></p>
  <?php else : ?>

    <div class="grid">
      <?php foreach ( $attributes as $attribute_name => $options ) : ?>
        <div class="grid__item w-4-12">
          <label for="<?php echo sanitize_title( $attribute_name ); ?>" class="sr-only"><?php echo wc_attribute_label( $attribute_name ); ?></label>

          <div class="select-wrapper">
            <?php
            $selected = isset( $_REQUEST[ 'attribute_' . sanitize_title( $attribute_name ) ] ) ?
            wc_clean( stripslashes( urldecode( $_REQUEST[ 'attribute_' . sanitize_title( $attribute_name ) ] ) ) ) :
            $product->get_variation_default_attribute( $attribute_name );
            wc_dropdown_variation_attribute_options( array(
              'options' => $options,
              'attribute' => $attribute_name,
              'product' => $product,
              'selected' => $selected,
              'show_option_none' => wc_attribute_label( $attribute_name )
            ));
            ?>
          </div>
        </div>
      <?php endforeach;?>

      <?php do_action( 'woocommerce_before_add_to_cart_button' ); ?>

      <?php
      /**
      * woocommerce_before_single_variation Hook.
      */
      do_action( 'woocommerce_before_single_variation' );

      /**
      * woocommerce_single_variation hook. Used to output the cart button and placeholder for variation data.
      * @since 2.4.0
      * @hooked woocommerce_single_variation - 10 Empty div for variation data.
      * @hooked woocommerce_single_variation_add_to_cart_button - 20 Qty and cart button.
      */
      do_action( 'woocommerce_single_variation' );

      /**
      * woocommerce_after_single_variation Hook.
      */
      do_action( 'woocommerce_after_single_variation' );
      ?>

      <?php do_action( 'woocommerce_after_add_to_cart_button' ); ?>
    </div>
  <?php endif; ?>

  <?php do_action( 'woocommerce_after_variations_form' ); ?>
</single-product-form>

<?php
do_action( 'woocommerce_after_add_to_cart_form' );
