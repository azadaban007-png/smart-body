<?php
if (!defined('ABSPATH')) {
    exit;
}

/** "Tools & connection" admin page: REST endpoints overview + one-click import of the prototype sample data. */
class SB_Sample_Data
{
    public static function init()
    {
        add_action('admin_menu', array(__CLASS__, 'menu'));
        add_action('admin_post_sb_import_sample', array(__CLASS__, 'handle_import'));
    }

    public static function menu()
    {
        add_submenu_page('edit.php?post_type=' . SB_Post_Types::GYM, 'اتصال و ابزارها', 'اتصال و ابزارها', 'manage_options', 'sb-tools', array(__CLASS__, 'render'));
    }

    public static function render()
    {
        $base = rest_url(SB_Rest_API::NS);
        $imported = isset($_GET['sb_imported']) ? absint($_GET['sb_imported']) : null;
        echo '<div class="wrap"><h1>بدن هوشمند — اتصال و ابزارها</h1>';
        if ($imported !== null) {
            echo '<div class="notice notice-success"><p>' . esc_html(sprintf('داده نمونه وارد شد (%d باشگاه).', $imported)) . '</p></div>';
        }
        echo '<h2>REST API</h2><p>آدرس پایه: <code>' . esc_html($base) . '</code></p><ul>';
        foreach (array('GET /status', 'GET /cities', 'GET /sports', 'GET /gyms?city=&q=&sport=&featured=&limit=', 'GET /gyms/{slug}', 'GET|POST /registrations (Application Password)') as $route) {
            echo '<li><code>' . esc_html($route) . '</code></li>';
        }
        echo '</ul><h2>اتصال فرانت‌اند</h2><ol>';
        echo '<li>از «کاربران ← نمایه» یک Application Password برای یک کاربر مدیر یا ویرایشگر بسازید.</li>';
        echo '<li>در بک‌اند بدن هوشمند مقادیر <code>WP_BASE_URL</code>، <code>WP_USERNAME</code> و <code>WP_APP_PASSWORD</code> را تنظیم کنید.</li></ol>';
        echo '<h2>داده نمونه</h2><p>شهرها، رشته‌ها و باشگاه‌های نمونه (همان داده پیش‌فرض فرانت‌اند) را وارد کنید. اجرای دوباره، رکوردهای موجود را به‌روزرسانی می‌کند.</p>';
        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
        wp_nonce_field('sb_import_sample');
        echo '<input type="hidden" name="action" value="sb_import_sample">';
        submit_button('وارد کردن داده نمونه', 'primary', 'submit', false);
        echo '</form></div>';
    }

    public static function handle_import()
    {
        if (!current_user_can('manage_options')) {
            wp_die('دسترسی غیرمجاز');
        }
        check_admin_referer('sb_import_sample');
        $count = self::import();
        wp_safe_redirect(admin_url('edit.php?post_type=' . SB_Post_Types::GYM . '&page=sb-tools&sb_imported=' . $count));
        exit;
    }

    /** Idempotent import from sample-data.json (generated from the backend seed data). */
    public static function import()
    {
        $data = json_decode((string) file_get_contents(SB_CORE_DIR . 'includes/sample-data.json'), true);
        if (!is_array($data)) {
            return 0;
        }
        foreach ($data['cities'] as $city) {
            $term_id = self::upsert_term($city['name'], $city['slug'], SB_Post_Types::CITY);
            if ($term_id) {
                update_term_meta($term_id, 'province', $city['province']);
            }
        }
        foreach ($data['sports'] as $i => $sport) {
            $term_id = self::upsert_term($sport['name'], $sport['slug'], SB_Post_Types::SPORT);
            if ($term_id) {
                update_term_meta($term_id, 'image_url', esc_url_raw($sport['image']));
                update_term_meta($term_id, 'featured', !empty($sport['featured']));
                update_term_meta($term_id, 'order', $i + 1);
            }
        }
        $count = 0;
        foreach ($data['gyms'] as $gym) {
            if (self::upsert_gym($gym)) {
                $count++;
            }
        }
        return $count;
    }

    private static function upsert_term($name, $slug, $taxonomy)
    {
        $term = get_term_by('slug', $slug, $taxonomy);
        if ($term) {
            return $term->term_id;
        }
        $result = wp_insert_term($name, $taxonomy, array('slug' => $slug));
        return is_wp_error($result) ? 0 : $result['term_id'];
    }

    private static function upsert_gym(array $gym)
    {
        $existing = get_page_by_path($gym['slug'], OBJECT, SB_Post_Types::GYM);
        $post_id = wp_insert_post(array(
            'ID' => $existing ? $existing->ID : 0,
            'post_type' => SB_Post_Types::GYM,
            'post_status' => 'publish',
            'post_name' => $gym['slug'],
            'post_title' => $gym['name'],
            'post_content' => $gym['description'],
            'post_excerpt' => $gym['description'],
        ), true);
        if (is_wp_error($post_id)) {
            return false;
        }
        $meta = array(
            'address' => $gym['address'],
            'neighborhood' => $gym['neighborhood'],
            'street' => $gym['street'],
            'phone' => $gym['phone'],
            'rating' => (float) $gym['rating'],
            'is_featured' => !empty($gym['featured']),
            'badge' => $gym['badge'] ?? '',
            'image_url' => esc_url_raw($gym['image']),
            'landing_page_requested' => false,
            'landing_page_status' => 'none',
            'source' => 'sample',
        );
        foreach ($meta as $key => $value) {
            update_post_meta($post_id, $key, $value);
        }
        $city = get_term_by('name', $gym['city'], SB_Post_Types::CITY);
        if ($city) {
            wp_set_object_terms($post_id, array((int) $city->term_id), SB_Post_Types::CITY);
        }
        wp_set_object_terms($post_id, $gym['sports'], SB_Post_Types::SPORT);
        return true;
    }
}
