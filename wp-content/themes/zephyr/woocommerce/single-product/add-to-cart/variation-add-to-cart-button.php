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

<div class="grid__item w-3-12">
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

<div class="grid__item w-5-12">
  <button
    type="submit"
    class="btn btn--body btn--full"
    v-bind:class="{
      'is-disabled' : !state.product.canAddToCart,
      'shake' : state.product.canAddToCart
    }"
    ref="submit"><?php echo esc_html( $product->single_add_to_cart_text() ); ?></button>
  <input type="hidden" name="add-to-cart" value="<?php echo absint( $product->get_id() ); ?>" />
  <input type="hidden" name="product_id" value="<?php echo absint( $product->get_id() ); ?>" />
  <input type="hidden" name="variation_id" class="variation_id" value="0" />
</div>
