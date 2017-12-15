<?php
/**
 * Email Footer
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-footer.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates/Emails
 * @version     2.3.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
															</div>
														</td>
													</tr>
												</table>
												<!-- End Content -->
											</td>
										</tr>
									</table>
									<!-- End Body -->
								</td>
							</tr>
							<tr>
								<td align="center" valign="top">
									<!-- Footer -->
									<table border="0" cellpadding="10" cellspacing="0" width="600" id="template_footer">
										<tr>
											<td valign="top">
                        <table border="0" cellpadding="10" cellspacing="0" width="100%">
                          <?php if( $footer_text = get_option( 'woocommerce_email_footer_text' ) ) : ?>
                            <tr>
                              <td colspan="2" valign="middle" id="credit">
                                <?php echo wpautop( wp_kses_post( wptexturize( apply_filters( 'woocommerce_email_footer_text', $footer_text ) ) ) ); ?>
                              </td>
                            </tr>
                          <?php endif; ?>
                          <tr>
                            <td colspan="2" valign="middle" id="footer-logo">
                              <p id="footer-logo-p">
                                <img id="footer-logo-img" src="<?php echo get_stylesheet_directory_uri() . '/src/images/zephyr-icon.png'; ?>" alt="<?php echo get_bloginfo( 'name', 'display' ); ?>" width="70" height="117" />
                              </p>
														</td>
                          </tr>
												</table>
											</td>
										</tr>
									</table>
									<!-- End Footer -->
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>
