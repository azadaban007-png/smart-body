<?php
/**
 * Plugin Name:       Smart Body Core
 * Description:       Gyms, cities, sports and gym registrations for the Smart Body (بدن هوشمند) platform. Exposes a clean REST API (smartbody/v1). No ACF required.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Smart Body
 * Text Domain:       smart-body
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SB_CORE_VERSION', '1.0.0');
define('SB_CORE_DIR', plugin_dir_path(__FILE__));

require_once SB_CORE_DIR . 'includes/helpers.php';
require_once SB_CORE_DIR . 'includes/class-post-types.php';
require_once SB_CORE_DIR . 'includes/class-rest-api.php';
require_once SB_CORE_DIR . 'includes/class-admin.php';
require_once SB_CORE_DIR . 'includes/class-sample-data.php';

add_action('init', array('SB_Post_Types', 'register'));
add_action('rest_api_init', array('SB_Rest_API', 'register_routes'));

if (is_admin()) {
    SB_Admin::init();
    SB_Sample_Data::init();
}

register_activation_hook(__FILE__, function () {
    SB_Post_Types::register();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
