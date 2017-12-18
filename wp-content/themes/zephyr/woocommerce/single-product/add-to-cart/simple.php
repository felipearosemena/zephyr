<?php
/**
 * Simple product add to cart
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/add-to-cart/simple.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see       https://docs.woocommerce.com/document/template-structure/
 * @author    WooThemes
 * @package   WooCommerce/Templates
 * @version     3.0.0
 */
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

global $product;

if ( ! $product->is_purchasable() ) {
  return;
}

echo wc_get_stock_html( $product );


if ( $product->is_in_stock() ) : ?>

  <?php do_action( 'woocommerce_before_add_to_cart_form' ); ?>

  <single-product-form :product="state.product" :refs="$refs">

    <div slot-scope="form">
      <div class="grid grid--flex justify-center">
        <div class="grid__item w-4-12 w-xxl-2-12">
          <?php
          /**
          * @since 2.1.0.
          */
          do_action( 'woocommerce_before_add_to_cart_button' );

          /**
          * @since 3.0.0.
          */
          do_action( 'woocommerce_before_add_to_cart_quantity' );

          ?>

          <label class="tiny-text">Qty</label>
          <div for="quantity" class="select-wrapper">
            <select-quantity name="quantity">
            </select-quantity>
          </div>

          <?php
          /**
          * @since 3.0.0.
          */
          do_action( 'woocommerce_after_add_to_cart_quantity' );
          ?>
        </div>
        <div class="grid__item w-5-12 w-xxl-3-12 align-bottom">
          <add-to-cart
            :can-add="true"
            :loading="form.isProcessing"
            name="add-to-cart"
            value="<?php echo esc_attr( $product->get_id() ); ?>">
            <?php echo esc_html( $product->single_add_to_cart_text() ); ?>
          </add-to-cart>
        </div>
      </div>
    </div>

    <?php
      /**
       * @since 2.1.0.
       */
      do_action( 'woocommerce_after_add_to_cart_button' );
    ?>
  </single-product-form>

  <?php do_action( 'woocommerce_after_add_to_cart_form' ); ?>

<?php endif; ?>
