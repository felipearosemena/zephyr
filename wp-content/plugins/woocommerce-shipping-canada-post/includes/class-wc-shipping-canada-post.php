<?php
/**
 * WC_Shipping_Canada_Post class.
 *
 * @extends WC_Shipping_Method
 */
class WC_Shipping_Canada_Post extends WC_Shipping_Method {
	private $endpoints   = array(
		'development' => 'https://ct.soa-gw.canadapost.ca/rs/ship/price',
		'production'  => 'https://soa-gw.canadapost.ca/rs/ship/price'
	);

	private $platform_id = '0008218084';
	private $found_rates;
	private $services    = array();

	private $ca_additional_liability_coverage = '2.20';
	private $ca_registered                    = '9.00';
	private $int_registered                   = '17.00';

	private $lettermail_boxes;

	private $ca_lettermail_boxes = array(
		'standard' => array(
			'name'   => 'Standard Lettermail',
			'length' => '24.5',
			'width'  => '15.6',
			'height' => '0.5',
			'weight' => '0.05',
			'costs'  => array(
				'0.03' => '0.85',
				'0.05' => '1.20'
			)
		),
		'medium' => array(
			'name'   => 'Medium Lettermail',
			'length' => '23.5',
			'width'  => '16.5',
			'height' => '0.5',
			'weight' => '0.05',
			'costs'  => array(
				'0.03' => '0.85',
				'0.05' => '1.20'
			)
		),
		'non-standard' => array(
			'name'   => 'Non-standard Lettermail',
			'length' => '38',
			'width'  => '27',
			'height' => '2',
			'weight' => '0.5',
			'costs'  => array(
				'0.1' => '1.80',
				'0.2' => '2.95',
				'0.3' => '4.10',
				'0.4' => '4.70',
				'0.5' => '5.05'
			)
		)
	);

	private $us_lettermail_boxes = array(
		'standard'  => array(
			'name'   => 'Standard USA Letter-post',
			'length' => '24.5',
			'width'  => '15.6',
			'height' => '0.5',
			'weight' => '0.05',
			'costs'  => array(
				'0.03' => '1.20',
				'0.05' => '1.80'
			)
		),
		'medium' => array(
			'name'   => 'Medium USA Letter-post',
			'length' => '23.5',
			'width'  => '16.5',
			'height' => '0.5',
			'weight' => '0.05',
			'costs'  => array(
				'0.03' => '1.20',
				'0.05' => '1.80'
			)
		),
		'non-standard' => array(
			'name'   => 'Non-standard USA Letter-post',
			'length' => '38',
			'width'  => '27',
			'height' => '2',
			'weight' => '0.5',
			'costs'  => array(
				'0.1' => '2.95',
				'0.2' => '5.15',
				'0.5' => '10.30'
			)
		)
	);

	private $int_lettermail_boxes = array(
		'standard' => array(
			'name'   => 'Standard International Letter-post',
			'length' => '24.5',
			'width'  => '15.6',
			'height' => '0.5',
			'weight' => '0.05',
			'costs'  => array(
				'0.03' => '2.50',
				'0.05' => '3.60'
			)
		),
		'medium' => array(
			'name'   => 'Medium International Letter-post',
			'length' => '23.5',
			'width'  => '16.5',
			'height' => '0.5',
			'weight' => '0.05',
			'costs'  => array(
				'0.03' => '2.50',
				'0.05' => '3.60'
			)
		),
		'non-standard' => array(
			'name'   => 'Non-standard International Letter-post',
			'length' => '38',
			'width'  => '27',
			'height' => '2',
			'weight' => '0.5',
			'costs'  => array(
				'0.1' => '5.90',
				'0.2' => '10.30',
				'0.5' => '20.60'
			)
		)
	);
	/**
	 * __construct function.
	 *
	 * @access public
	 * @return void
	 */
	public function __construct( $instance_id = 0 ) {

		$this->services = array(
			'DOM.RP'         => __( 'Regular Parcel', 'woocommerce-shipping-canada-post' ),
			'DOM.EP'         => __( 'Expedited Parcel', 'woocommerce-shipping-canada-post' ),
			'DOM.XP'         => __( 'Xpresspost', 'woocommerce-shipping-canada-post' ),
			'DOM.PC'         => __( 'Priority', 'woocommerce-shipping-canada-post' ),
			'DOM.LIB'        => __( 'Library Books', 'woocommerce-shipping-canada-post' ),
			'USA.EP'         => __( 'Expedited Parcel USA', 'woocommerce-shipping-canada-post' ),
			'USA.TP'         => __( 'Tracked Packet USA', 'woocommerce-shipping-canada-post' ),
			'USA.TP.LVM'     => __( 'Tracked Packet USA (LVM)', 'woocommerce-shipping-canada-post' ),
			'USA.PW.ENV'     => __( 'Priority Worldwide Envelope USA', 'woocommerce-shipping-canada-post' ),
			'USA.PW.PAK'     => __( 'Priority Worldwide pak USA', 'woocommerce-shipping-canada-post' ),
			'USA.PW.PARCEL'  => __( 'Priority Worldwide Parcel USA', 'woocommerce-shipping-canada-post' ),
			'USA.SP.AIR'     => __( 'Small Packet USA Air', 'woocommerce-shipping-canada-post' ),
			'USA.SP.AIR.LVM' => __( 'Small Packet USA Air (LVM)', 'woocommerce-shipping-canada-post' ),
			'USA.SP.AIR.LVM' => __( 'Tracked Packet USA (LVM)', 'woocommerce-shipping-canada-post' ),
			'USA.SP.SURF'    => __( 'Small Packet USA Surface', 'woocommerce-shipping-canada-post' ),
			'USA.XP'         => __( 'Xpresspost USA', 'woocommerce-shipping-canada-post' ),
			'INT.XP'         => __( 'Xpresspost International', 'woocommerce-shipping-canada-post' ),
			'INT.TP'         => __( 'International Tracked Packet', 'woocommerce-shipping-canada-post' ),
			'INT.IP.AIR'     => __( 'International Parcel Air', 'woocommerce-shipping-canada-post' ),
			'INT.IP.SURF'    => __( 'International Parcel Surface', 'woocommerce-shipping-canada-post' ),
			'INT.PW.ENV'     => __( 'Priority Worldwide Envelope International', 'woocommerce-shipping-canada-post' ),
			'INT.PW.PAK'     => __( 'Priority Worldwide pak International', 'woocommerce-shipping-canada-post' ),
			'INT.PW.PARCEL'  => __( 'Priority Worldwide parcel International', 'woocommerce-shipping-canada-post' ),
			'INT.SP.AIR'     => __( 'Small Packet International Air', 'woocommerce-shipping-canada-post' ),
			'INT.SP.SURF'    => __( 'Small Packet International Surface', 'woocommerce-shipping-canada-post' )
		);
		$this->instance_id        = absint( $instance_id );
		$this->id                 = 'canada_post';
		$this->method_title       = __( 'Canada Post', 'woocommerce-shipping-canada-post' );
		$this->method_description = __( 'The Canada Post extension obtains rates dynamically from the Canada Post API during cart/checkout.', 'woocommerce-shipping-canada-post' );
		$this->supports           = array(
			'shipping-zones',
			'instance-settings',
			'settings',
		);

		// filter the lettermail boxes to allow actors to alter prices, dimension, add taxes, etc.
		$this->ca_lettermail_boxes  = apply_filters( 'wc_shipping_canada_post_ca_lettermail_boxes', $this->ca_lettermail_boxes );
		$this->us_lettermail_boxes  = apply_filters( 'wc_shipping_canada_post_us_lettermail_boxes', $this->us_lettermail_boxes );
		$this->int_lettermail_boxes = apply_filters( 'wc_shipping_canada_post_int_lettermail_boxes', $this->int_lettermail_boxes );

		$this->init();
	}

	/**
	 * is_available function.
	 *
	 * @param array $package
	 * @return bool
	 */
	public function is_available( $package ) {
		if ( empty( $package['destination']['country'] ) ) {
			return false;
		}

		return apply_filters( 'woocommerce_shipping_' . $this->id . '_is_available', true, $package );
	}

	/**
	 * Initialize settings
	 *
	 * @version 2.5.0
	 * @since 2.5.0
	 * @return void
	 */
	private function set_settings() {
		// Define user set variables
		$this->title               = $this->get_option( 'title', $this->method_title );
		$this->origin              = $this->get_option( 'origin', '' );
		$this->packing_method      = $this->get_option( 'packing_method', 'per_item' );
		$this->boxes               = $this->get_option( 'boxes', array() );
		$this->custom_services     = $this->get_option( 'services', array() );
		$this->offer_rates         = $this->get_option( 'offer_rates', 'all' );
		$this->quote_type          = $this->get_option( 'quote_type', 'commercial' );
		$this->use_cost            = $this->get_option( 'use_cost', 'due' );
		$this->lettermail          = $this->get_option( 'lettermail', array() );
		$this->debug               = ( ( $bool = $this->get_option( 'debug' ) ) && $bool === 'yes' );
		$this->options             = $this->get_option( 'options', array() );
		$this->show_delivery_time  = ( ( $bool = $this->get_option( 'show_delivery_time' ) ) && $bool === 'yes' );
		$this->delivery_time_delay = $this->get_option( 'delivery_time_delay', 1 );

		// Get merchant credentials
		$this->customer_number = get_option( 'wc_canada_post_customer_number' );
		$this->username        = get_option( 'wc_canada_post_merchant_username' );
		$this->password        = get_option( 'wc_canada_post_merchant_password' );
		$this->contract_id     = get_option( 'wc_canada_post_contract_number' );
		$this->endpoint        = $this->endpoints['production'];

		// Used for weight based packing only
		$this->max_weight = $this->get_option( 'max_weight', '30' );
	}

	/**
	 * init function.
	 *
	 * @access public
	 * @return void
	 */
	private function init() {
		// Load the settings.
		$this->init_form_fields();
		$this->set_settings();

		add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'process_admin_options' ) );
		add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'clear_transients' ) );
	}

	/**
	 * Process settings on save
	 *
	 * @access public
	 * @since 2.5.0
	 * @version 2.5.0
	 * @return void
	 */
	public function process_admin_options() {
		parent::process_admin_options();

		$this->set_settings();
	}

	/**
	 * Output a message or error
	 * @param  string $message
	 * @param  string $type
	 */
	public function debug( $message, $type = 'notice' ) {
		if ( $this->debug || ( current_user_can( 'manage_options' ) && 'error' === $type ) ) {
			wc_add_notice( $message, $type );
		}
	}

	/**
	 * Handle CP registration
	 */
	public function revoke_registration() {
		if ( ! empty( $_GET['disconnect_canada_post'] ) ) {
			update_option( 'wc_canada_post_customer_number', '' );
			update_option( 'wc_canada_post_contract_number', '' );
			update_option( 'wc_canada_post_merchant_username', '' );
			update_option( 'wc_canada_post_merchant_password', '' );
		}
	}

	/**
	 * admin_options function.
	 *
	 * @access public
	 * @return void
	 */
	public function admin_options() {
		if ( isset( $_GET['tab'] ) && 'shipping' === $_GET['tab'] && isset( $_GET['section'] ) && 'canada_post' === $_GET['section'] ) {
			// Handle registration
			$this->revoke_registration();

			if ( get_option( 'wc_canada_post_customer_number' ) ) {
				echo wpautop( sprintf( __( 'The account <code>%s</code> is currently connected - to disconnect this account <a href="%s">click here</a>.', 'woocommerce-shipping-canada-post' ), get_option( 'wc_canada_post_customer_number' ), esc_url( add_query_arg( 'disconnect_canada_post', 'true' ) ) ) );
			}
		}

		parent::admin_options();
	}

	/**
	 * generate_services_html function.
	 *
	 * @access public
	 * @return void
	 */
	public function generate_services_html() {
		ob_start();
		?>
		<tr valign="top" id="service_options">
			<th scope="row" class="titledesc"><?php _e( 'Services', 'woocommerce-shipping-canada-post' ); ?></th>
			<td class="forminp">
				<table class="canada_post_services widefat">
					<thead>
						<th class="sort">&nbsp;</th>
						<th><?php _e( 'Service Code', 'woocommerce-shipping-canada-post' ); ?></th>
						<th><?php _e( 'Name', 'woocommerce-shipping-canada-post' ); ?></th>
						<th><?php _e( 'Enabled', 'woocommerce-shipping-canada-post' ); ?></th>
						<th><?php echo sprintf( __( 'Price Adjustment (%s)', 'woocommerce-shipping-canada-post' ), get_woocommerce_currency_symbol() ); ?></th>
						<th><?php _e( 'Price Adjustment (%)', 'woocommerce-shipping-canada-post' ); ?></th>
					</thead>
					<tbody>
						<?php
							$sort = 0;
							$this->ordered_services = array();

							foreach ( $this->services as $code => $name ) {

								if ( isset( $this->custom_services[ $code ]['order'] ) ) {
									$sort = $this->custom_services[ $code ]['order'];
								}

								while ( isset( $this->ordered_services[ $sort ] ) )
									$sort++;

								$this->ordered_services[ $sort ] = array( $code, $name );

								$sort++;
							}

							ksort( $this->ordered_services );

							foreach ( $this->ordered_services as $value ) {
								$code = $value[0];
								$name = $value[1];
								?>
								<tr>
									<td class="sort"><input type="hidden" class="order" name="canada_post_service[<?php echo $code; ?>][order]" value="<?php echo isset( $this->custom_services[ $code ]['order'] ) ? $this->custom_services[ $code ]['order'] : ''; ?>" /></td>
									<td><strong><?php echo $code; ?></strong></td>
									<td><input type="text" name="canada_post_service[<?php echo $code; ?>][name]" placeholder="<?php echo $name; ?>" value="<?php echo isset( $this->custom_services[ $code ]['name'] ) ? $this->custom_services[ $code ]['name'] : ''; ?>" size="50" /></td>
									<td><input type="checkbox" name="canada_post_service[<?php echo $code; ?>][enabled]" <?php checked( ( ! isset( $this->custom_services[ $code ]['enabled'] ) || ! empty( $this->custom_services[ $code ]['enabled'] ) ), true ); ?> /></td>
									<td><input type="text" name="canada_post_service[<?php echo $code; ?>][adjustment]" placeholder="N/A" value="<?php echo isset( $this->custom_services[ $code ]['adjustment'] ) ? $this->custom_services[ $code ]['adjustment'] : ''; ?>" size="4" /></td>
									<td><input type="text" name="canada_post_service[<?php echo $code; ?>][adjustment_percent]" placeholder="N/A" value="<?php echo isset( $this->custom_services[ $code ]['adjustment_percent'] ) ? $this->custom_services[ $code ]['adjustment_percent'] : ''; ?>" size="4" /></td>
								</tr>
								<?php
							}
						?>
					</tbody>
				</table>
			</td>
		</tr>
		<?php
		return ob_get_clean();
	}

	/**
	 * generate_box_packing_html function.
	 *
	 * @access public
	 * @return void
	 */
	public function generate_box_packing_html() {
		ob_start();
		?>
		<tr valign="top" id="packing_options">
			<th scope="row" class="titledesc"><?php _e( 'Box Sizes', 'woocommerce-shipping-canada-post' ); ?></th>
			<td class="forminp">
				<style type="text/css">
					.canada_post_boxes td, .canada_post_services td {
						vertical-align: middle;
							padding: 4px 7px;
					}
					.canada_post_boxes th, .canada_post_services th {
						padding: 9px 7px;
					}
					.canada_post_boxes td input {
						margin-right: 4px;
					}
					.canada_post_boxes .check-column {
						vertical-align: middle;
						text-align: left;
						padding: 0 7px;
					}
					.canada_post_boxes .help_tip {
						float: none !important;
						margin-right: 24px !important;
					}
					.canada_post_services th.sort {
						width: 16px;
					}
					.canada_post_services td.sort {
						cursor: move;
						width: 16px;
						padding: 0 16px;
						cursor: move;
						background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAHUlEQVQYV2O8f//+fwY8gJGgAny6QXKETRgEVgAAXxAVsa5Xr3QAAAAASUVORK5CYII=) no-repeat center;
					}
				</style>
				<table class="canada_post_boxes widefat">
					<thead>
						<tr>
							<th class="check-column"><input type="checkbox" /></th>
							<th><?php _e( 'Name', 'woocommerce-shipping-canada-post' ); ?></th>
							<th><?php _e( 'Outer Length', 'woocommerce-shipping-canada-post' ); ?></th>
							<th><?php _e( 'Outer Width', 'woocommerce-shipping-canada-post' ); ?></th>
							<th><?php _e( 'Outer Height', 'woocommerce-shipping-canada-post' ); ?></th>
							<th><?php _e( 'Inner Length', 'woocommerce-shipping-canada-post' ); ?></th>
							<th><?php _e( 'Inner Width', 'woocommerce-shipping-canada-post' ); ?></th>
							<th><?php _e( 'Inner Height', 'woocommerce-shipping-canada-post' ); ?></th>
							<th>
								<?php _e( 'Weight of Box', 'woocommerce-shipping-canada-post' ); ?>
								<img class="help_tip" width="16" height="16" data-tip="<?php _e( 'Weight of the actual box and will be added to the weight of the contents. This will increase the cost of shipping.', 'woocommerce-shipping-canada-post' ); ?>" src="<?php echo esc_url( WC()->plugin_url() . '/assets/images/help.png' ); ?>" />
							</th>
							<th>
								<?php _e( 'Max Weight', 'woocommerce-shipping-canada-post' ); ?>
								<img class="help_tip" width="16" height="16" data-tip="<?php _e( 'Maximum weight your box can hold. This includes contents weight and box weight.', 'woocommerce-shipping-canada-post' ); ?>" src="<?php echo esc_url( WC()->plugin_url() . '/assets/images/help.png' ); ?>" />
							</th>
						</tr>
					</thead>
					<tfoot>
						<tr>
							<th colspan="3">
								<a href="#" class="button plus insert"><?php _e( 'Add Box', 'woocommerce-shipping-canada-post' ); ?></a>
								<a href="#" class="button minus remove"><?php _e( 'Remove selected box(es)', 'woocommerce-shipping-canada-post' ); ?></a>
							</th>
							<th colspan="7">
								<small class="description"><?php _e( 'Items will be packed into these boxes depending based on item dimensions and volume. Outer dimensions will be passed to Canada Post, whereas inner dimensions will be used for packing. Items not fitting into boxes will be packed individually.', 'woocommerce-shipping-canada-post' ); ?></small>
							</th>
						</tr>
					</tfoot>
					<tbody id="rates">
						<?php
							if ( $this->boxes ) {
								foreach ( $this->boxes as $key => $box ) {
									?>
									<tr>
										<td class="check-column"><input type="checkbox" /></td>
										<td><input type="text" size="10" name="boxes_name[<?php echo $key; ?>]" value="<?php echo isset( $box['name'] ) ? esc_attr( $box['name'] ) : ''; ?>" /></td>
										<td><input type="text" size="5" name="boxes_outer_length[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['outer_length'] ); ?>" />cm</td>
										<td><input type="text" size="5" name="boxes_outer_width[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['outer_width'] ); ?>" />cm</td>
										<td><input type="text" size="5" name="boxes_outer_height[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['outer_height'] ); ?>" />cm</td>
										<td><input type="text" size="5" name="boxes_inner_length[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['inner_length'] ); ?>" />cm</td>
										<td><input type="text" size="5" name="boxes_inner_width[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['inner_width'] ); ?>" />cm</td>
										<td><input type="text" size="5" name="boxes_inner_height[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['inner_height'] ); ?>" />cm</td>
										<td><input type="text" size="5" name="boxes_box_weight[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['box_weight'] ); ?>" />kg</td>
										<td><input type="text" size="5" name="boxes_max_weight[<?php echo $key; ?>]" value="<?php echo esc_attr( $box['max_weight'] ); ?>" />kg</td>
									</tr>
									<?php
								}
							}
						?>
					</tbody>
				</table>
				<script type="text/javascript">

					jQuery(window).load(function(){

						jQuery('#woocommerce_canada_post_packing_method').change(function(){

							if ( jQuery(this).val() == 'box_packing' )
								jQuery('#packing_options').show();
							else
								jQuery('#packing_options').hide();

							if ( jQuery(this).val() == 'weight' )
								jQuery('#woocommerce_canada_post_max_weight').closest('tr').show();
							else
								jQuery('#woocommerce_canada_post_max_weight').closest('tr').hide();

						}).change();

						jQuery('#woocommerce_canada_post_show_delivery_time').change(function(){

							if ( jQuery(this).is(':checked') )
								jQuery('#woocommerce_canada_post_delivery_time_delay').closest('tr').show();
							else
								jQuery('#woocommerce_canada_post_delivery_time_delay').closest('tr').hide();

						}).change();

						jQuery('.canada_post_boxes .insert').click( function() {
							var $tbody = jQuery('.canada_post_boxes').find('tbody');
							var size = $tbody.find('tr').size();
							var code = '<tr class="new">\
									<td class="check-column"><input type="checkbox" /></td>\
									<td><input type="text" size="10" name="boxes_name[' + size + ']" /></td>\
									<td><input type="text" size="5" name="boxes_outer_length[' + size + ']" />cm</td>\
									<td><input type="text" size="5" name="boxes_outer_width[' + size + ']" />cm</td>\
									<td><input type="text" size="5" name="boxes_outer_height[' + size + ']" />cm</td>\
									<td><input type="text" size="5" name="boxes_inner_length[' + size + ']" />cm</td>\
									<td><input type="text" size="5" name="boxes_inner_width[' + size + ']" />cm</td>\
									<td><input type="text" size="5" name="boxes_inner_height[' + size + ']" />cm</td>\
									<td><input type="text" size="5" name="boxes_box_weight[' + size + ']" />kg</td>\
									<td><input type="text" size="5" name="boxes_max_weight[' + size + ']" />kg</td>\
								</tr>';

							$tbody.append( code );

							return false;
						} );

						jQuery('.canada_post_boxes .remove').click(function() {
							var $tbody = jQuery('.canada_post_boxes').find('tbody');

							$tbody.find('.check-column input:checked').each(function() {
								jQuery(this).closest('tr').hide().find('input').val('');
							});

							return false;
						});

						// Ordering
						jQuery('.canada_post_services tbody').sortable({
							items:'tr',
							cursor:'move',
							axis:'y',
							handle: '.sort',
							scrollSensitivity:40,
							forcePlaceholderSize: true,
							helper: 'clone',
							opacity: 0.65,
							placeholder: 'wc-metabox-sortable-placeholder',
							start:function(event,ui){
								ui.item.css('background-color','#f6f6f6');
							},
							stop:function(event,ui){
								ui.item.removeAttr('style');
								canada_post_services_row_indexes();
							}
						});

						function canada_post_services_row_indexes() {
							jQuery('.canada_post_services tbody tr').each(function(index, el){
								jQuery('input.order', el).val( parseInt( jQuery(el).index('.canada_post_services tr') ) );
							});
						};

					});

				</script>
			</td>
		</tr>
		<?php
		return ob_get_clean();
	}

	/**
	 * validate_box_packing_field function.
	 *
	 * @access public
	 * @param mixed $key
	 * @return void
	 */
	public function validate_box_packing_field( $key ) {
		$boxes_name         = isset( $_POST['boxes_name'] ) ? $_POST['boxes_name'] : array();
		$boxes_outer_length = isset( $_POST['boxes_outer_length'] ) ? $_POST['boxes_outer_length'] : array();
		$boxes_outer_width  = isset( $_POST['boxes_outer_width'] ) ? $_POST['boxes_outer_width']  : array();
		$boxes_outer_height = isset( $_POST['boxes_outer_height'] ) ? $_POST['boxes_outer_height'] : array();
		$boxes_inner_length = isset( $_POST['boxes_inner_length'] ) ? $_POST['boxes_inner_length'] : array();
		$boxes_inner_width  = isset( $_POST['boxes_inner_width'] ) ? $_POST['boxes_inner_width'] : array();
		$boxes_inner_height = isset( $_POST['boxes_inner_height'] ) ? $_POST['boxes_inner_height'] : array();
		$boxes_box_weight   = isset( $_POST['boxes_box_weight'] ) ? $_POST['boxes_box_weight'] : array();
		$boxes_max_weight   = isset( $_POST['boxes_max_weight'] ) ? $_POST['boxes_max_weight'] : array();

		$boxes = array();

		for ( $i = 0; $i < sizeof( $boxes_outer_length ); $i ++ ) {

			if ( $boxes_outer_length[ $i ] && $boxes_outer_width[ $i ] && $boxes_outer_height[ $i ] && $boxes_inner_length[ $i ] && $boxes_inner_width[ $i ] && $boxes_inner_height[ $i ] ) {

				$boxes[] = array(
					'name'         => wc_clean( $boxes_name[ $i ] ),
					'outer_length' => floatval( $boxes_outer_length[ $i ] ),
					'outer_width'  => floatval( $boxes_outer_width[ $i ] ),
					'outer_height' => floatval( $boxes_outer_height[ $i ] ),
					'inner_length' => floatval( $boxes_inner_length[ $i ] ),
					'inner_width'  => floatval( $boxes_inner_width[ $i ] ),
					'inner_height' => floatval( $boxes_inner_height[ $i ] ),
					'box_weight'   => floatval( $boxes_box_weight[ $i ] ),
					'max_weight'   => floatval( $boxes_max_weight[ $i ] ),
				);

			}

		}

		return $boxes;
	}

	/**
	 * validate_services_field function.
	 *
	 * @access public
	 * @param mixed $key
	 * @return void
	 */
	public function validate_services_field( $key ) {
		$services         = array();
		$posted_services  = $_POST['canada_post_service'];

		foreach ( $posted_services as $code => $settings ) {

			$services[ $code ] = array(
				'name'               => wc_clean( $settings['name'] ),
				'order'              => wc_clean( $settings['order'] ),
				'enabled'            => isset( $settings['enabled'] ) ? true : false,
				'adjustment'         => wc_clean( $settings['adjustment'] ),
				'adjustment_percent' => str_replace( '%', '', wc_clean( $settings['adjustment_percent'] ) )
			);

		}

		return $services;
	}

	/**
	 * clear_transients function.
	 *
	 * @access public
	 * @return void
	 */
	public function clear_transients() {
		global $wpdb;

		$wpdb->query( "DELETE FROM `$wpdb->options` WHERE `option_name` LIKE ('_transient_cp_quote_%') OR `option_name` LIKE ('_transient_timeout_cp_quote_%')" );
	}

	/**
	 * init_form_fields function.
	 *
	 * @access public
	 * @return void
	 */
	public function init_form_fields() {
		$this->instance_form_fields  = array(
			'title'            => array(
				'title'           => __( 'Method Title', 'woocommerce-shipping-canada-post' ),
				'type'            => 'text',
				'description'     => __( 'This controls the title which the user sees during checkout.', 'woocommerce-shipping-canada-post' ),
				'default'         => __( 'Canada Post', 'woocommerce-shipping-canada-post' ),
				'desc_tip'        => true
			),
			'origin'           => array(
				'title'           => __( 'Origin Postcode', 'woocommerce-shipping-canada-post' ),
				'type'            => 'text',
				'description'     => __( 'Enter the postcode for the <strong>sender</strong>.', 'woocommerce-shipping-canada-post' ),
				'default'         => '',
				'desc_tip'        => true
			),
			'quote_type'  => array(
				'title'           => __( 'Quote Type', 'woocommerce-shipping-canada-post' ),
				'type'            => 'select',
				'default'         => '',
				'options'         => array(
					'commercial'     => __( 'Commercial - Discounted customer or VentureOne member rates.', 'woocommerce-shipping-canada-post' ),
					'counter'        => __( 'Counter -  Regular price paid by consumers.', 'woocommerce-shipping-canada-post' ),
				),
			),
			'use_cost' => array(
				'title'           => __( 'Rate Cost', 'woocommerce-shipping-canada-post' ),
				'type'            => 'select',
				'default'         => 'due',
				'options'         => array(
					'due'         => __( 'Use "Due" cost - cost after taxes', 'woocommerce-shipping-canada-post' ),
					'base'        => __( 'Use "Base" cost - base cost for the rate', 'woocommerce-shipping-canada-post' ),
				),
			),
			'lettermail'  => array(
				'title'           => __( 'Lettermail Rates', 'woocommerce-shipping-canada-post' ),
				'type' => 'multiselect',
					'class' => 'chosen_select',
					'css' => 'width: 450px;',
					'default' => '',
				'description'     => __( 'Lettermail rates are hardcoded into the plugin as they are not part of the API.', 'woocommerce-shipping-canada-post' ),
				'options'         => array(
					'standard'   => __( 'Standard Lettermail', 'woocommerce-shipping-canada-post' ),
					'registered' => __( 'Registered Lettermail', 'woocommerce-shipping-canada-post' )
				),
				'desc_tip'        => true
			),
			'options' => array(
					'title' => __( 'Additional Options', 'woothemes' ),
					'type' => 'multiselect',
					'class' => 'chosen_select',
					'css' => 'width: 450px;',
					'default' => '',
					'options' => array(
						'COV'  => __( 'Coverage', 'woocommerce-shipping-canada-post' ),
						'PA18' => __( 'Proof of Age Required', 'woocommerce-shipping-canada-post' ),
						'SO'   => __( 'Signature', 'woocommerce-shipping-canada-post' )
					),
					'description'     => __( 'Additional options affect all rates.', 'woocommerce-shipping-canada-post' ),
					'desc_tip'        => true
			),
			'show_delivery_time'      => array(
				'title'           => __( 'Delivery time', 'woocommerce-shipping-canada-post' ),
				'label'           => __( 'Show estimated delivery time next to rate name.', 'woocommerce-shipping-canada-post' ),
				'type'            => 'checkbox',
				'default'         => 'no',
				'description'     => __( 'Rates will be labelled, for example, Rate Name - approx. 2 days.', 'woocommerce-shipping-canada-post' )
			),
			'delivery_time_delay'  => array(
				'title'           => __( 'Delivery Delay', 'woocommerce-shipping-canada-post' ),
				'type'            => 'text',
				'default'         => '1',
				'description'     => __( 'If showing delivery time, allow for a delay. e.g. a delay of 1 day for a method which ships in 2 days would be labelled: approx. 2-3 days', 'woocommerce-shipping-canada-post' ),
				'desc_tip'        => true
			),
			'packing_method'  => array(
				'title'           => __( 'Parcel Packing Method', 'woocommerce-shipping-canada-post' ),
				'type'            => 'select',
				'default'         => '',
				'class'           => 'packing_method',
				'options'         => array(
					'per_item'       => __( 'Default: Pack items individually', 'woocommerce-shipping-canada-post' ),
					'weight'         => __( 'Weight of all items', 'woocommerce-shipping-canada-post' ),
					'box_packing'    => __( 'Recommended: Pack into boxes with weights and dimensions', 'woocommerce-shipping-canada-post' ),
				),
			),
			'max_weight'  => array(
				'title'           => __( 'Maximum weight', 'woocommerce-shipping-canada-post' ),
				'type'            => 'text',
				'default'         => '30',
				'description'     => __('Maximum weight per package.', 'woocommerce-shipping-canada-post'),
			),
			'boxes'  => array(
				'type'            => 'box_packing'
			),
			'offer_rates'   => array(
				'title'           => __( 'Offer Rates', 'woocommerce-shipping-canada-post' ),
				'type'            => 'select',
				'description'     => '',
				'default'         => 'all',
				'options'         => array(
					'all'         => __( 'Offer the customer all returned rates', 'woocommerce-shipping-canada-post' ),
					'cheapest'    => __( 'Offer the customer the cheapest rate only, anonymously', 'woocommerce-shipping-canada-post' ),
				),
			),
			'services'  => array(
				'type'            => 'services'
			),
		);

		$this->form_fields  = array(
			'debug'      => array(
				'title'           => __( 'Debug Mode', 'woocommerce-shipping-canada-post' ),
				'label'           => __( 'Enable debug mode', 'woocommerce-shipping-canada-post' ),
				'type'            => 'checkbox',
				'default'         => 'no',
				'description'     => __( 'Enable debug mode to show debugging information on the cart/checkout.', 'woocommerce-shipping-canada-post' )
			),
		);
	}

	/**
	 * calculate_shipping function.
	 *
	 * @access public
	 * @param mixed $package
	 * @return void
	 */
	public function calculate_shipping( $package = array() ) {
		$this->rates      = array();
		$headers          = $this->get_request_header();
		$package_requests = $this->get_package_requests( $package );

		libxml_use_internal_errors( true );

		$this->debug( 'Canada Post is in Development mode or WP DEBUG is on - note, returned services may not match those set in settings. Production mode will not have this problem. To hide these messages, turn off debug mode in the settings.' );

		if ( $package_requests ) {

			foreach ( $package_requests as $key => $package_request ) {

				$request  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
				$request .= '<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate">' . "\n";
				$request .= $package_request;
				$request .= $this->get_request( $package );
				$request .= '</mailing-scenario>' . "\n";

				$transient       = 'cp_quote_' . md5( $request );
				$cached_response = get_transient( $transient );

				if ( $cached_response !== false ) {

					$response = $cached_response;

					$this->debug( 'Canada Post CACHED REQUEST: <pre>' . print_r( htmlspecialchars( $request ), true ) . '</pre>' );
					$this->debug( 'Canada Post CACHED RESPONSE: <pre>' . print_r( htmlspecialchars( $response ), true ) . '</pre>' );

				} else {

					$response = wp_remote_post( $this->endpoint,
						array(
							'method'           => 'POST',
							'timeout'          => 70,
							'sslverify'        => 0,
							'headers'          => $headers,
							'body'             => $request
						)
					);

					if ( is_wp_error( $response ) ) {
						$this->debug( $response->get_error_message(), 'error' );
					} else {
						$response = wp_remote_retrieve_body( $response );

						// Store result in case the request is made again
						if ( ! empty( $response ) ) {
							set_transient( $transient, $response, YEAR_IN_SECONDS );
						} else {
							$response = '';
						}

						$this->debug( 'Canada Post REQUEST: <pre>' . print_r( htmlspecialchars( $request ), true ) . '</pre>' );
						$this->debug( 'Canada Post RESPONSE: <pre>' . print_r( htmlspecialchars( $response ), true ) . '</pre>' );
					}
				}

				$xml = simplexml_load_string( '<root>' . preg_replace('/<\?xml.*\?>/','', $response ) . '</root>' );

				if ( ! $xml ) {
					$this->debug( 'Failed loading XML', 'error' );
				}

				if ( $xml && $xml->{'price-quotes'} ) {
					$price_quotes = $xml->{'price-quotes'}->children( 'http://www.canadapost.ca/ws/ship/rate' );

					if ( $price_quotes->{'price-quote'} ) {
						foreach ( $price_quotes as $quote ) {

							$rate_code = strval( $quote->{'service-code'} );
							$rate_id   = $this->id . ':' . $rate_code;
							$rate_cost = (float) $quote->{'price-details'}->{$this->use_cost};

							// Add any adjustments
							if ( 'base' == $this->use_cost ) {
								$adjustments = (array) $quote->{'price-details'}->{'adjustments'};
								if ( $adjustments ) {
									foreach ( $adjustments as $adjustment ) {
										$adjustment = (array) $adjustment;
										if ( ! empty( $adjustment['adjustment-cost'] ) ) {
											$rate_cost += $adjustment['adjustment-cost'];
										}
									}
								}
							}

							if ( ! empty( $this->services[ $rate_code ] ) ) {
								$rate_name = (string) $this->services[ $rate_code ];
							} else {
								$rate_name = (string) $quote->{'service-name'};
							}

							// Get time
							if ( $this->show_delivery_time ) {
								$transmit_time = $quote->{'service-standard'}->{'expected-transit-time'};

								if ( $transmit_time ) {
									if ( $this->delivery_time_delay ) {
										$rate_name = $rate_name . ' - ' . sprintf( __( 'approx. %d&ndash;%d days', 'woocommerce-shipping-canada-post' ), $transmit_time, $transmit_time+$this->delivery_time_delay );
									} else {
										$rate_name = $rate_name . ' - ' . sprintf( _n( 'approx. %d day', 'approx. %d days', $transmit_time, 'woocommerce-shipping-canada-post' ), $transmit_time );
									}
								}
							}

							$this->prepare_rate( $rate_code, $rate_id, $rate_name, $rate_cost );
						}
					}
				} else {
					// No rates
					$this->debug( 'Invalid request. Ensure a valid shipping destination has been chosen on the cart/checkout page.', 'error' );
				}
			}
		}

		// Ensure rates were found for all packages
		if ( $this->found_rates ) {
			foreach ( $this->found_rates as $key => $value ) {
				if ( $value['packages'] < sizeof( $package_requests ) )
					unset( $this->found_rates[ $key ] );
			}
		}

		if ( ! empty( $this->lettermail ) ) {
			if ( in_array( 'standard', $this->lettermail ) ) {
				$lettermail_rate = $this->calculate_lettermail_rate( $package );
				if ( $lettermail_rate )
					$this->found_rates[ $lettermail_rate['id'] ] = $lettermail_rate;
			}
			if ( in_array( 'registered', $this->lettermail ) ) {
				$lettermail_rate = $this->calculate_lettermail_rate( $package, true );
				if ( $lettermail_rate )
					$this->found_rates[ $lettermail_rate['id'] ] = $lettermail_rate;
			}
		}

		// Add rates
		if ( $this->found_rates ) {

			if ( $this->offer_rates == 'all' ) {

				uasort( $this->found_rates, array( $this, 'sort_rates' ) );

				foreach ( $this->found_rates as $key => $rate ) {
					$this->add_rate( $rate );
				}

			} else {

				$cheapest_rate = '';

				foreach ( $this->found_rates as $key => $rate ) {
					if ( ! $cheapest_rate || $cheapest_rate['cost'] > $rate['cost'] )
						$cheapest_rate = $rate;
				}

				$cheapest_rate['label'] = $this->title;

				$this->add_rate( $cheapest_rate );

			}
		}
	}

	/**
	 * Calculate lettermail rates
	 * @param  array $package
	 * @return array
	 */
	public function calculate_lettermail_rate( $package, $registered = false ) {
		$this->debug( 'Calculating Lettermail Rates' );

		$lettermail_cost = 0;

		if ( ! class_exists( 'WC_Boxpack' ) )
			include_once 'box-packer/class-wc-boxpack.php';

		$boxpack  = new WC_Boxpack();

		if( $package['destination']['country'] == 'CA' ) {
			$this->lettermail_boxes = $this->ca_lettermail_boxes;
		} elseif ($package['destination']['country'] == 'US' ) {
			$this->lettermail_boxes = $this->us_lettermail_boxes;
		} else {
			$this->lettermail_boxes = $this->int_lettermail_boxes;
		}

		// Define boxes
		foreach ( $this->lettermail_boxes as $service_code => $box ) {

			$newbox = $boxpack->add_box( $box['length'], $box['width'], $box['height'] );
			$newbox->set_max_weight( $box['weight'] );
			$newbox->set_id( $service_code );

			$this->debug( 'Adding box: ' . $service_code . ' ' . $box['name'] . ' - ' . $box['length'] . 'x' . $box['width'] . 'x' . $box['height'] );
		}

		// Add items
		foreach ( $package['contents'] as $item_id => $values ) {

			if ( ! $values['data']->needs_shipping() )
				continue;

			if ( $values['data']->get_length() && $values['data']->get_height() && $values['data']->get_width() && $values['data']->get_weight() ) {

				$dimensions = array( $values['data']->get_length(), $values['data']->get_height(), $values['data']->get_width() );

			} else {
				if ( function_exists( 'wc_add_notice' ) ) {
					wc_add_notice( sprintf( __( 'Product # is missing dimensions! Using 1x1x1.', 'woocommerce-shipping-canada-post' ), $item_id ), 'error' );
				} else {
					WC()->add_error( sprintf( __( 'Product # is missing dimensions! Using 1x1x1.', 'woocommerce-shipping-canada-post' ), $item_id ) );
				}

				$dimensions = array( 1, 1, 1 );
			}

			for ( $i = 0; $i < $values['quantity']; $i ++ ) {
				$boxpack->add_item(
					wc_get_dimension( $dimensions[2], 'cm' ),
					wc_get_dimension( $dimensions[1], 'cm' ),
					wc_get_dimension( $dimensions[0], 'cm' ),
					wc_get_weight( $values['data']->get_weight(), 'kg' ),
					$values['data']->get_price()
				);
			}
		}

		// Pack it
		$boxpack->pack();

		// Get packages
		$flat_packages = $boxpack->get_packages();

		if ( $flat_packages ) {
			foreach ( $flat_packages as $flat_package ) {
				if ( isset( $this->lettermail_boxes[ $flat_package->id ] ) ) {

					$this->debug( 'Packed ' . $flat_package->id );

					$this_box = $this->lettermail_boxes[ $flat_package->id ];
					$costs    = $this_box['costs'];

					foreach ( $costs as $weight => $cost ) {
						if ( $flat_package->weight <= $weight ) {
							$lettermail_cost += $cost;
							break;
						}
					}

					if ( isset( $this->options['COV'] ) && $package['destination']['country'] == 'CA' ) {
						$lettermail_cost += $this->ca_additional_liability_coverage * min( round( $this_box['value'] / 100, 2 ), 50 );
					}

					if ( $registered && $package['destination']['country'] == 'CA') {
						$lettermail_cost += $this->ca_registered;
					} elseif ( $registered ) {
						$lettermail_cost += $this->int_registered;
					}

				} else {
					return; // no match
				}
			}

			return array(
				'id' 	=> $this->id . ':' . ( $registered ? 'registered_' : '' ) . 'lettermail',
				'label' => __( 'Lettermail&trade;', 'woocommerce-shipping-canada-post' ) . ( $registered ? ' (' . __( 'Registered', 'woocommerce-shipping-canada-post' ) . ')' : '' ),
				'cost' 	=> $lettermail_cost,
				'sort'  => -1
			);
		}
	}

	/**
	 * prepare_rate function.
	 *
	 * @access private
	 * @param mixed $rate_code
	 * @param mixed $rate_id
	 * @param mixed $rate_name
	 * @param mixed $rate_cost
	 * @return void
	 */
	private function prepare_rate( $rate_code, $rate_id, $rate_name, $rate_cost ) {

		// Name adjustment
		if ( ! empty( $this->custom_services[ $rate_code ]['name'] ) )
			$rate_name = $this->custom_services[ $rate_code ]['name'];

		// Cost adjustment %
		if ( ! empty( $this->custom_services[ $rate_code ]['adjustment_percent'] ) ) {
			$sign = substr( $this->custom_services[ $rate_code ]['adjustment_percent'], 0, 1 );

			if ( $sign == '-' ) {
				$rate_cost = $rate_cost - ( $rate_cost * ( floatval( substr( $this->custom_services[ $rate_code ]['adjustment_percent'], 1 ) ) / 100 ) );
			} else {
				$rate_cost = $rate_cost + ( $rate_cost * ( floatval( $this->custom_services[ $rate_code ]['adjustment_percent'] ) / 100 ) );
			}

			if ( $rate_cost < 0 )
				$rate_cost = 0;
		}

		// Cost adjustment
		if ( ! empty( $this->custom_services[ $rate_code ]['adjustment'] ) ) {
			$sign = substr( $this->custom_services[ $rate_code ]['adjustment'], 0, 1 );

			if ( $sign == '-' ) {
				$rate_cost = $rate_cost - floatval( substr( $this->custom_services[ $rate_code ]['adjustment'], 1 ) );
			} else {
				$rate_cost = $rate_cost + floatval( $this->custom_services[ $rate_code ]['adjustment'] );
			}

			if ( $rate_cost < 0 )
				$rate_cost = 0;
		}

		// Enabled check
		if ( isset( $this->custom_services[ $rate_code ] ) && empty( $this->custom_services[ $rate_code ]['enabled'] ) )
			return;

		// Merging
		if ( isset( $this->found_rates[ $rate_id ] ) ) {
			$rate_cost = $rate_cost + $this->found_rates[ $rate_id ]['cost'];
			$packages  = 1 + $this->found_rates[ $rate_id ]['packages'];
		} else {
			$packages = 1;
		}

		// Sort
		if ( isset( $this->custom_services[ $rate_code ]['order'] ) ) {
			$sort = $this->custom_services[ $rate_code ]['order'];
		} else {
			$sort = 999;
		}

		$this->found_rates[ $rate_id ] = array(
			'id'       => $rate_id,
			'label'    => $rate_name,
			'cost'     => $rate_cost,
			'sort'     => $sort,
			'packages' => $packages
		);
	}

	/**
	 * sort_rates function.
	 *
	 * @access public
	 * @param mixed $a
	 * @param mixed $b
	 * @return void
	 */
	public function sort_rates( $a, $b ) {
		if ( $a['sort'] == $b['sort'] ) return 0;
		return ( $a['sort'] < $b['sort'] ) ? -1 : 1;
	}

	/**
	 * get_request_header function.
	 *
	 * @access private
	 * @return void
	 */
	private function get_request_header() {
	   return array(
			'Accept'          => 'application/vnd.cpc.ship.rate+xml',
			'Content-Type'    => 'application/vnd.cpc.ship.rate+xml',
			'Authorization'   => 'Basic ' . base64_encode( $this->username . ':' . $this->password ),
			'Accept-language' => 'en-CA',
			'Platform-id'     => $this->platform_id
		);
	}

	/**
	 * get_request function.
	 *
	 * @access private
	 * @param mixed $package
	 * @return void
	 */
	private function get_request( $package ) {

		$request  = '	<origin-postal-code>' . apply_filters( 'wc_shipping_canada_post_origin', str_replace( ' ', '', strtoupper( $this->origin ) ), $package, $this ) . '</origin-postal-code>' . "\n";

		if ( $this->quote_type == 'counter' ) {
			$request .= '	<quote-type>' . $this->quote_type . '</quote-type>' . "\n";
		} else {
			$request .= '	<customer-number>' . $this->customer_number . '</customer-number>' . "\n";

			if ( $this->contract_id ) {
				$request .= '	<contract-id>' . $this->contract_id . '</contract-id>' . "\n";
			}
		}

		$request .= '	<destination>' . "\n";

		// The destination
		switch ( $package['destination']['country'] ) {
			case "CA" :
				$request .= '		<domestic>' . "\n";
				$request .= '			<postal-code>' . str_replace( ' ', '', strtoupper( $package['destination']['postcode'] ) ) . '</postal-code>' . "\n";
				$request .= '		</domestic>' . "\n";
			break;
			case "US" :
				$request .= '		<united-states>' . "\n";
				$request .= '			<zip-code>' . str_replace( ' ', '', strtoupper( $package['destination']['postcode'] ) ) . '</zip-code>' . "\n";
				$request .= '		</united-states>' . "\n";
			break;
			default :
				$request .= '		<international>' . "\n";
				$request .= '			<country-code>' . $package['destination']['country'] . '</country-code>' . "\n";
				$request .= '		</international>' . "\n";
			break;
		}

		$request .= '	</destination>' . "\n";
		// End destination

		return $request;
	}

	/**
	 * get_request function.
	 *
	 * @access private
	 * @return void
	 */
	private function get_package_requests( $package ) {

		// Choose selected packing
		switch ( $this->packing_method ) {
			case 'weight' :
				$requests = $this->weight_only_shipping( $package );
			break;
			case 'box_packing' :
				$requests = $this->box_shipping( $package );
			break;
			case 'per_item' :
			default :
				$requests = $this->per_item_shipping( $package );
			break;
		}

		return $requests;
	}

	/**
	 * per_item_shipping function.
	 *
	 * @access private
	 * @param mixed $package
	 * @return void
	 */
	private function per_item_shipping( $package ) {
		$requests = array();

		// Get weight of order
		foreach ( $package['contents'] as $item_id => $values ) {

			if ( ! $values['data']->needs_shipping() ) {
				$this->debug( sprintf( __( 'Product #%d is virtual. Skipping.', 'woocommerce-shipping-canada-post' ), $item_id ), 'error' );
				continue;
			}

			if ( ! $values['data']->get_weight() ) {
				$this->debug( sprintf( __( 'Product #%d is missing weight. Aborting.', 'woocommerce-shipping-canada-post' ), $item_id ), 'error' );
				return;
			}

			$weight = round( wc_get_weight( $values['data']->get_weight(), 'kg' ), 3 );
			// See issue #21.
			if ( $weight < 0.01 ) {
				$weight = 0.01;
			}

			$parcel  = '<parcel-characteristics>' . "\n";
			$parcel .= '	<weight>' . $weight . '</weight>' . "\n";

			if ( $values['data']->get_length() && $values['data']->get_height() && $values['data']->get_width() ) {

				$dimensions = array( $values['data']->get_length(), $values['data']->get_height(), $values['data']->get_width() );

				sort( $dimensions );

				$parcel .= '	<dimensions>' . "\n";
				$parcel .= '		<height>' . round( wc_get_dimension( $dimensions[0], 'cm' ), 1 ) . '</height>' . "\n";
				$parcel .= '		<width>' . round( wc_get_dimension( $dimensions[1], 'cm' ), 1 ) . '</width>' . "\n";
				$parcel .= '		<length>' . round( wc_get_dimension( $dimensions[2], 'cm' ), 1 ) . '</length>' . "\n";
				$parcel .= '	</dimensions>' . "\n";
			}

			$parcel .= '</parcel-characteristics>' . "\n";

			// Package options
			if ( ! empty( $this->options ) ) {
				$option_request = '';
				foreach ( $this->options as $option ) {
					if ( $package['destination']['country'] !== 'CA' && 'PA18' === $option ) {
						continue;
					}
					$option_request .= '		<option>' . "\n";
					$option_request .= '			<option-code>' . $option . '</option-code>' . "\n";
					if ( $option == 'COV' ) {
						$option_request .= '			<option-amount>' . round( $values['data']->get_price(), 2 ) . '</option-amount>' . "\n";
					}
					$option_request .= '		</option>' . "\n";
				}
				if ( $option_request ) {
					$parcel .= '<options>' . "\n" . $option_request . '</options>' . "\n";
				}
			}

			for ( $i = 0; $i < $values['quantity']; $i ++ ) {
				$requests[] = $parcel;
			}
		}

		return $requests;
	}

	/**
	 * weight_only_shipping function.
	 *
	 * @access private
	 * @param mixed $package
	 * @return void
	 */
	private function weight_only_shipping( $package ) {
		$requests = array();
		$weight   = 0;
		$value    = 0;

		// Get weight of order
		foreach ( $package['contents'] as $item_id => $values ) {

			if ( ! $values['data']->needs_shipping() ) {
				$this->debug( sprintf( __( 'Product #%d is missing virtual. Aborting.', 'woocommerce-shipping-canada-post' ), $item_id ), 'error' );
				continue;
			}

			if ( ! $values['data']->get_weight() ) {
				$this->debug( sprintf( __( 'Product #%d is missing weight. Aborting.', 'woocommerce-shipping-canada-post' ), $item_id ), 'error' );
				return;
			}

			$weight += wc_get_weight( $values['data']->get_weight(), 'kg' ) * $values['quantity'];
			$value  += $values['data']->get_price() * $values['quantity'];
		}

		// Package options
		$options_request = '';

		// Package options
		if ( ! empty( $this->options ) ) {
			$option_request = '';
			foreach ( $this->options as $option ) {
				if ( $package['destination']['country'] !== 'CA' && 'PA18' === $option ) {
					continue;
				}
				$option_request .= '		<option>' . "\n";
				$option_request .= '			<option-code>' . $option . '</option-code>' . "\n";
				if ( $option == 'COV' ) {
					$option_request .= '			<option-amount>' . $value . '</option-amount>' . "\n";
				}
				$option_request .= '		</option>' . "\n";
			}
			if ( $option_request ) {
				$options_request .= '<options>' . "\n" . $option_request . '</options>' . "\n";
			}
		}

		if ( $weight > $this->max_weight ) {
			$this->debug( __( 'Package is too heavy. Splitting.', 'woocommerce-shipping-canada-post' ), 'error' );

			for ( $i = 0; $i < ( $weight / $this->max_weight ); $i ++ ) {
				$request  = '<parcel-characteristics>' . "\n";
				$request .= '	<weight>' . round( $this->max_weight, 3 ) . '</weight>' . "\n";
				$request .= '</parcel-characteristics>' . "\n";
				$request .= $options_request;
				$requests[] = $request;
			}

			if ( ( $weight % $this->max_weight ) ) {
				$request  = '<parcel-characteristics>' . "\n";
				$request .= '	<weight>' . round( $weight % $this->max_weight, 3 ) . '</weight>' . "\n";
				$request .= '</parcel-characteristics>' . "\n";
				$request .= $options_request;
				$requests[] = $request;
			}
		} else {
			$request  = '<parcel-characteristics>' . "\n";
			$request .= '	<weight>' . round( $weight, 3 ) . '</weight>' . "\n";
			$request .= '</parcel-characteristics>' . "\n";
			$request .= $options_request;
			$requests[] = $request;
		}

		return $requests;
	}

	/**
	 * box_shipping function.
	 *
	 * @access private
	 * @param mixed $package
	 * @return void
	 */
	private function box_shipping( $package ) {
		$requests = array();

		if ( ! class_exists( 'WC_Boxpack' ) )
			include_once 'box-packer/class-wc-boxpack.php';

		$boxpack = new WC_Boxpack();

		// Define boxes
		foreach ( $this->boxes as $box ) {

			$newbox = $boxpack->add_box( $box['outer_length'], $box['outer_width'], $box['outer_height'], $box['box_weight'] );

			$newbox->set_inner_dimensions( $box['inner_length'], $box['inner_width'], $box['inner_height'] );

			if ( $box['max_weight'] )
				$newbox->set_max_weight( $box['max_weight'] );

			if ( $box['name'] )
				$newbox->set_id( $box['name'] );
		}

		// Add items
		foreach ( $package['contents'] as $item_id => $values ) {

			if ( ! $values['data']->needs_shipping() ) {
				$this->debug( sprintf( __( 'Product #%d is virtual. Skipping.', 'woocommerce-shipping-canada-post' ), $item_id ) );
				continue;
			}

			if ( $values['data']->get_length() && $values['data']->get_height() && $values['data']->get_width() && $values['data']->get_weight() ) {

				$dimensions = array( $values['data']->get_length(), $values['data']->get_height(), $values['data']->get_width() );

				for ( $i = 0; $i < $values['quantity']; $i ++ ) {
					$boxpack->add_item(
						wc_get_dimension( $dimensions[2], 'cm' ),
						wc_get_dimension( $dimensions[1], 'cm' ),
						wc_get_dimension( $dimensions[0], 'cm' ),
						wc_get_weight( $values['data']->get_weight(), 'kg' ),
						$values['data']->get_price()
					);
				}

			} else {
				wc_add_notice( sprintf( __( 'Product # is missing dimensions. Aborting.', 'woocommerce-shipping-canada-post' ), $item_id ), 'error' );

				return;
			}
		}

		// Pack it
		$boxpack->pack();

		// Get packages
		$flat_packages = $boxpack->get_packages();

		foreach ( $flat_packages as $flat_package ) {

			$dimensions = array( $flat_package->length, $flat_package->width, $flat_package->height );

			sort( $dimensions );

			$weight = round( $flat_package->weight, 3 );
			// See issue #21.
			if ( $weight < 0.01 ) {
				$weight = 0.01;
			}

			$request  = '<parcel-characteristics>' . "\n";
			$request .= '	<weight>' . $weight . '</weight>' . "\n";
			$request .= '	<dimensions>' . "\n";
			$request .= '		<height>' . round( $dimensions[0], 1 ) . '</height>' . "\n";
			$request .= '		<width>' . round( $dimensions[1], 1 ) . '</width>' . "\n";
			$request .= '		<length>' . round( $dimensions[2], 1 ) . '</length>' . "\n";
			$request .= '	</dimensions>' . "\n";
			$request .= '</parcel-characteristics>' . "\n";

			// Package options
			if ( ! empty( $this->options ) ) {
				$option_request = '';
				foreach ( $this->options as $option ) {
					if ( $package['destination']['country'] !== 'CA' && 'PA18' === $option ) {
						continue;
					}
					$option_request .= '		<option>' . "\n";
					$option_request .= '			<option-code>' . $option . '</option-code>' . "\n";
					if ( $option == 'COV' ) {
						$option_request .= '			<option-amount>' . $flat_package->value . '</option-amount>' . "\n";
					}
					$option_request .= '		</option>' . "\n";
				}
				if ( $option_request ) {
					$request .= '<options>' . "\n" . $option_request . '</options>' . "\n";
				}
			}

			$requests[] = $request;
		}

		return $requests;
	}

}
