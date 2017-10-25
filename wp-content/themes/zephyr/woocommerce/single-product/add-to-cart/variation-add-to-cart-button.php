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

    <div class="select-wrapper">
      <select name="quantity">
        <?php
        for ($i=1; $i < 7; $i++) {
          echo '<option value=' . $i . '>' . $i . '</option>';
        }
        ?>
      </select>
    </div>

  <?php
    /**
     * @since 3.0.0.
     */
    do_action( 'woocommerce_after_add_to_cart_quantity' );
  ?>
</div>

<div class="grid__item w-4-12 w-xxl-3-12">
  <add-to-cart
    :can-add="state.product.canAddToCart"
    :loading="form.isProcessing">
    <?php echo esc_html( $product->single_add_to_cart_text() ); ?>
  </add-to-cart>
  <input type="hidden" name="add-to-cart" value="<?php echo absint( $product->get_id() ); ?>" />
  <input type="hidden" name="product_id" value="<?php echo absint( $product->get_id() ); ?>" />
  <input type="hidden" name="variation_id" class="variation_id" value="0" />
</div>
