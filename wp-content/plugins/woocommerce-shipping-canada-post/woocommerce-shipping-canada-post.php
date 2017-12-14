<?php
/**
 * Plugin Name: WooCommerce Canada Post Shipping
 * Plugin URI: https://woocommerce.com/products/canada-post-shipping-method/
 * Description: Obtain shipping rates dynamically via the Canada Post API for your orders.
 * Version: 2.5.3
 * Author: WooCommerce
 * Author URI: https://woocommerce.com
 *
 * Copyright: 2009-2017 WooCommerce.
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * Woo: 18623:ac029cdf3daba20b20c7b9be7dc00e0e
 */

/**
 * Required functions
 */
if ( ! function_exists( 'woothemes_queue_update' ) )
	require_once( 'woo-includes/woo-functions.php' );

/**
 * Plugin updates
 */
woothemes_queue_update( plugin_basename( __FILE__ ), 'ac029cdf3daba20b20c7b9be7dc00e0e', '18623' );

/**
 * Plugin activation check
 */
function wc_canada_post_activation_check() {
	if ( ! function_exists( 'simplexml_load_string' ) ) {
		wp_die( "Sorry, but you can't run this plugin, it requires the SimpleXML library installed on your server/hosting to function." );
	}
}

register_activation_hook( __FILE__, 'wc_canada_post_activation_check' );

class WC_Shipping_Canada_Post_Init {
	/**
	 * Plugin's version.
	 *
	 * @since 2.5.0
	 *
	 * @var string
	 */
	public $version = '2.5.3';

	/** @var object Class Instance */
	private static $instance;

	/**
	 * Get the class instance
	 */
	public static function get_instance() {
		return null === self::$instance ? ( self::$instance = new self ) : self::$instance;
	}

	/**
	 * Initialize the plugin's public actions
	 */
	public function __construct() {
		if ( class_exists( 'WC_Shipping_Method' ) ) {
			define( 'WC_CANADA_POST_REGISTRATION_ENDPOINT', 'https://woocommerce.com/wc-api/canada_post_registration' );

			add_action( 'admin_init', array( $this, 'maybe_install' ), 5 );
			add_action( 'init', array( $this, 'load_textdomain' ) );
			add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'plugin_links' ) );
			add_action( 'woocommerce_shipping_init', array( $this, 'includes' ) );
			add_filter( 'woocommerce_shipping_methods', array( $this, 'add_method' ) );
			add_action( 'admin_notices', array( $this, 'connect_canada_post' ) );
			add_action( 'woocommerce_api_canada_post_return', array( $this, 'wc_canada_post_api_canada_post_return' ) );
			add_action( 'admin_notices', array( $this, 'environment_check' ) );
			add_action( 'admin_notices', array( $this, 'upgrade_notice' ) );
			add_action( 'wp_ajax_canada_post_dismiss_upgrade_notice', array( $this, 'dismiss_upgrade_notice' ) );
		} else {
			add_action( 'admin_notices', array( $this, 'wc_deactivated' ) );
		}
	}

	/**
	 * Environment check.
	 *
	 * @access public
	 * @return void
	 */
	public function environment_check() {
		if ( version_compare( WC_VERSION, '2.6.0', '<' ) ) {
			return;
		}

		$general_setting = add_query_arg(
			array(
				'page' => 'wc-settings',
				'tab'  => 'general',
			),
			admin_url( 'admin.php' )
		);

		if ( 'CAD' !== get_woocommerce_currency() ) {
			printf(
				'<div class="error"><p>%s</p></div>',
				wp_kses( sprintf( __( 'Canada Post requires that the <a href="%s">currency</a> is set to Canadian Dollars.', 'woocommerce-shipping-canada-post' ), esc_url( $general_setting ) ), array( 'a' => array( 'href' => array() ) ) )
			);
		}

		if ( 'CA' !== WC()->countries->get_base_country() ) {
			printf(
				'<div class="error"><p>%s</p></div>',
				wp_kses( sprintf( __( 'Canada Post requires that the <a href="%s">base country/region</a> is set to Canada.', 'woocommerce-shipping-canada-post' ), esc_url( $general_setting ) ), array( 'a' => array( 'href' => array() ) ) )
			);
		}
	}

	/**
	 * Connects to Canada Post
	 *
	 * @version 2.5.3
	 */
	public function connect_canada_post() {
		/**
		 * If shipping is disabled, no need to prompt for connection.
		 *
		 * @see https://github.com/woocommerce/woocommerce-shipping-canada-post/issues/44
		 */
		if ( 'disabled' === get_option( 'woocommerce_ship_to_countries' ) ) {
			return;
		}

		if ( empty( $_GET['token-id'] ) && empty( $_GET['registration-status'] ) && ! get_option( 'wc_canada_post_customer_number' ) ) {
			?>
			<div id="message" class="updated woocommerce-message">
				<p><strong><?php _e( 'Connect your Canada Post Account', 'woocommerce-shipping-canada-post' ); ?></strong> &ndash; <?php _e( 'Before you can start using Canada Post you need to register for an account, or connect an existing one.', 'woocommerce-shipping-canada-post' ); ?></p>
				<p class="submit"><a href="<?php echo esc_url( add_query_arg( 'return_url', WC()->api_request_url( 'canada_post_return' ), WC_CANADA_POST_REGISTRATION_ENDPOINT ) ); ?>" class="wc-update-now button-primary"><?php _e( 'Register/Connect', 'woocommerce-shipping-canada-post' ); ?></a></p>
			</div>
			<?php
		}
	}

	/**
	 * When returning from CP, redirect to settings
	 */
	public function wc_canada_post_api_canada_post_return() {
		if ( isset( $_GET['token-id'] ) && isset( $_GET['registration-status'] ) ) {
			switch ( $_GET['registration-status'] ) {
				case 'CANCELLED' :
					wp_die( __( 'The Canada Post extension will be unable to get quotes on your behalf until you accept the terms and conditons.', 'woocommerce-shipping-canada-post' ) );
				break;
				case 'SUCCESS' :
					// Get details
					$details = wp_remote_get(
						add_query_arg( 'token', sanitize_text_field( $_GET['token-id'] ), WC_CANADA_POST_REGISTRATION_ENDPOINT ),
						array(
							'method'      => 'GET',
							'timeout'     => 45,
							'redirection' => 5,
							'httpversion' => '1.0',
							'blocking'    => true,
							'headers'     => array( 'user-agent' => 'WCAPI/1.0.0' ),
							'cookies'     => array(),
							'sslverify'   => false
						)
					);
					$details = (array) json_decode( $details['body'] );

					if ( ! empty( $details['customer-number'] ) ) {

						update_option( 'wc_canada_post_customer_number', sanitize_text_field( $details['customer-number'] ) );
						update_option( 'wc_canada_post_contract_number', sanitize_text_field( $details['contract-number'] ) );
						update_option( 'wc_canada_post_merchant_username', sanitize_text_field( $details['merchant-username'] ) );
						update_option( 'wc_canada_post_merchant_password', sanitize_text_field( $details['merchant-password'] ) );

					} else {
						wp_die( __( 'Unable to get merchant info - please try again later.', 'woocommerce-shipping-canada-post' ) );
					}
				break;
				default :
					wp_die( __( 'Unable to get registration token - please try again later.', 'woocommerce-shipping-canada-post' ) );
				break;
			}

			wp_safe_redirect( admin_url( 'admin.php?page=wc-settings&tab=shipping&section=canada_post' ) );
			exit;
		}

		wp_die( __( 'Invalid Response', 'woocommerce-shipping-canada-post' ) );
	}

	/**
	 * woocommerce_init_shipping_table_rate function.
	 *
	 * @access public
	 * @since 2.5.0
	 * @version 2.5.0
	 * @return void
	 */
	public function includes() {
		if ( version_compare( WC_VERSION, '2.6.0', '<' ) ) {
			include_once( dirname( __FILE__ ) . '/includes/class-wc-shipping-canada-post-deprecated.php' );
		} else {
			include_once( dirname( __FILE__ ) . '/includes/class-wc-shipping-canada-post.php' );
		}
	}

	/**
	 * Add Canada Post shipping method to WC
	 *
	 * @access public
	 * @param mixed $methods
	 * @return void
	 */
	public function add_method( $methods ) {
		if ( version_compare( WC_VERSION, '2.6.0', '<' ) ) {
			$methods[] = 'WC_Shipping_Canada_Post';
		} else {
			$methods['canada_post'] = 'WC_Shipping_Canada_Post';
		}

		return $methods;
	}

	/**
	 * Localisation
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'woocommerce-shipping-canada-post', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Plugin page links
	 */
	public function plugin_links( $links ) {
		if ( version_compare( WC()->version, '2.6', '>=' ) ) {
			$settings_link = admin_url( 'admin.php?page=wc-settings&tab=shipping&section=canada_post' );
		} else {
			$settings_link = admin_url( 'admin.php?page=wc-settings&tab=shipping&section=wc_shipping_canada_post' );
		}

		$plugin_links = array(
			'<a href="' . $settings_link . '">' . __( 'Settings', 'woocommerce-shipping-canada-post' ) . '</a>',
			'<a href="https://woocommerce.com/my-account/tickets">' . __( 'Support', 'woocommerce-shipping-canada-post' ) . '</a>',
			'<a href="https://docs.woocommerce.com/document/canada-post/">' . __( 'Docs', 'woocommerce-shipping-canada-post' ) . '</a>',
		);

		return array_merge( $plugin_links, $links );
	}

	/**
	 * WooCommerce not installed notice
	 */
	public function wc_deactivated() {
		echo '<div class="error"><p>' . sprintf( __( 'WooCommerce Canada Post Shipping requires %s to be installed and active.', 'woocommerce-shipping-canada-post' ), '<a href="https://woocommerce.com" target="_blank">WooCommerce</a>' ) . '</p></div>';
	}

	/**
	 * Checks the plugin version
	 *
	 * @access public
	 * @since 2.5.0
	 * @version 2.5.0
	 * @return bool
	 */
	public function maybe_install() {
		// only need to do this for versions less than 2.5.0 to migrate
		// settings to shipping zone instance
		$doing_ajax = defined( 'DOING_AJAX' ) && DOING_AJAX;
		if ( ! $doing_ajax
		     && ! defined( 'IFRAME_REQUEST' )
		     && version_compare( WC_VERSION, '2.6.0', '>=' )
		     && version_compare( get_option( 'wc_canada_post_version' ), '2.5.0', '<' ) ) {

			$this->install();

		}

		return true;
	}

	/**
	 * Update/migration script
	 *
	 * @since 2.5.0
	 * @version 2.5.0
	 * @access public
	 * @return bool
	 */
	public function install() {
		// get all saved settings and cache it
		$canada_post_settings = get_option( 'woocommerce_canada_post_settings', false );

		// settings exists
		if ( $canada_post_settings ) {
			global $wpdb;

			// unset un-needed settings
			unset( $canada_post_settings['enabled'] );
			unset( $canada_post_settings['availability'] );
			unset( $canada_post_settings['countries'] );

			// first add it to the "rest of the world" zone when no Canada Post
			// instance.
			if ( ! $this->is_zone_has_canada_post( 0 ) ) {
				$wpdb->query( $wpdb->prepare( "INSERT INTO {$wpdb->prefix}woocommerce_shipping_zone_methods ( zone_id, method_id, method_order, is_enabled ) VALUES ( %d, %s, %d, %d )", 0, 'canada_post', 1, 1 ) );
				// add settings to the newly created instance to options table
				$instance = $wpdb->insert_id;
				add_option( 'woocommerce_canada_post_' . $instance . '_settings', $canada_post_settings );
			}
			update_option( 'woocommerce_canada_post_show_upgrade_notice', 'yes' );
		}
		update_option( 'wc_canada_post_version', $this->version );
	}

	/**
	 * Show the user a notice for plugin updates
	 *
	 * @since 2.5.0
	 */
	public function upgrade_notice() {
		$show_notice = get_option( 'woocommerce_canada_post_show_upgrade_notice' );

		if ( 'yes' !== $show_notice ) {
			return;
		}

		$query_args = array( 'page' => 'wc-settings', 'tab' => 'shipping' );
		$zones_admin_url = add_query_arg( $query_args, get_admin_url() . 'admin.php' );
		?>
		<div class="notice notice-success is-dismissible wc-canada-post-notice">
			<p><?php echo sprintf( __( 'Canada Post now supports shipping zones. The zone settings were added to a new Canada Post method on the "Rest of the World" Zone. See the zones %shere%s ', 'woocommerce-shipping-canada-post' ),'<a href="' .$zones_admin_url. '">','</a>' ); ?></p>
		</div>

		<script type="application/javascript">
			jQuery( '.notice.wc-canada-post-notice' ).on( 'click', '.notice-dismiss', function () {
				wp.ajax.post('canada_post_dismiss_upgrade_notice');
			});
		</script>
		<?php
	}

	/**
	 * Turn of the dismisable upgrade notice.
	 * @since 2.5.0
	 */
	public function dismiss_upgrade_notice() {
		update_option( 'woocommerce_canada_post_show_upgrade_notice', 'no' );
	}

	/**
	 * Helper method to check whether given zone_id has Canada Post method instance.
	 *
	 * @since 2.5.0
	 *
	 * @param int $zone_id Zone ID
	 *
	 * @return bool True if given zone_id has canada_post method instance
	 */
	public function is_zone_has_canada_post( $zone_id ) {
		global $wpdb;

		return (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(instance_id) FROM {$wpdb->prefix}woocommerce_shipping_zone_methods WHERE method_id = 'canada_post' AND zone_id = %d", $zone_id ) ) > 0;
	}
}

add_action( 'plugins_loaded' , array( 'WC_Shipping_Canada_Post_Init' , 'get_instance' ), 0 );
