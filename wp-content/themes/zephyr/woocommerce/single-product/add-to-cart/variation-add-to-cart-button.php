<?php
/**
 * Single variation cart button
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
?>

<div class="grid__item w-3-12 w-xxl-3-12">
  <?php
    /**
     * @since 3.0.0.
     */
    do_action( 'woocommerce_before_add_to_cart_quantity' );
  ?>
    <label class="tiny-text">Qty</label>
    <div for="quantity" class="select-wrapper">
      <select-quantity  name="quantity">
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
    :can-add="state.product.canAddToCart"
    :loading="form.isProcessing">
    <?php echo esc_html( $product->single_add_to_cart_text() ); ?>
  </add-to-cart>
  <input type="hidden" name="add-to-cart" value="<?php echo absint( $product->get_id() ); ?>" />
  <input type="hidden" name="product_id" value="<?php echo absint( $product->get_id() ); ?>" />
  <input type="hidden" name="variation_id" class="variation_id" value="0" />
</div>
