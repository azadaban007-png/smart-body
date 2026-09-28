<?php
if (!defined('ABSPATH')) {
    exit;
}

/** wp-admin management: gym fields meta box, list columns, landing-page filter, approve action, term meta, menus. */
class SB_Admin
{
    public static function init()
    {
        add_action('add_meta_boxes_' . SB_Post_Types::GYM, array(__CLASS__, 'add_meta_box'));
        add_action('save_post_' . SB_Post_Types::GYM, array(__CLASS__, 'save_meta'), 10, 2);
        add_filter('manage_' . SB_Post_Types::GYM . '_posts_columns', array(__CLASS__, 'columns'));
        add_action('manage_' . SB_Post_Types::GYM . '_posts_custom_column', array(__CLASS__, 'column_content'), 10, 2);
        add_action('restrict_manage_posts', array(__CLASS__, 'landing_filter'));
        add_action('pre_get_posts', array(__CLASS__, 'apply_landing_filter'));
        add_filter('post_row_actions', array(__CLASS__, 'row_actions'), 10, 2);
        add_action('admin_post_sb_approve_gym', array(__CLASS__, 'approve_gym'));
        add_action('admin_menu', array(__CLASS__, 'menus'));

        add_action(SB_Post_Types::CITY . '_add_form_fields', array(__CLASS__, 'city_fields_add'));
        add_action(SB_Post_Types::CITY . '_edit_form_fields', array(__CLASS__, 'city_fields_edit'));
        add_action(SB_Post_Types::SPORT . '_add_form_fields', array(__CLASS__, 'sport_fields_add'));
        add_action(SB_Post_Types::SPORT . '_edit_form_fields', array(__CLASS__, 'sport_fields_edit'));
        foreach (array('created_', 'edited_') as $hook) {
            add_action($hook . SB_Post_Types::CITY, array(__CLASS__, 'save_term_meta'));
            add_action($hook . SB_Post_Types::SPORT, array(__CLASS__, 'save_term_meta'));
        }
    }

    public static function menus()
    {
        $parent = 'edit.php?post_type=' . SB_Post_Types::GYM;
        $pending = (int) wp_count_posts(SB_Post_Types::GYM)->pending;
        $bubble = $pending ? ' <span class="awaiting-mod">' . $pending . '</span>' : '';
        add_submenu_page($parent, 'در انتظار تأیید', 'در انتظار تأیید' . $bubble, 'edit_others_posts', $parent . '&post_status=pending');
        add_submenu_page($parent, 'درخواست‌های لندینگ پیج', 'درخواست‌های لندینگ پیج', 'edit_others_posts', $parent . '&sb_landing=requested');
    }

    // ---------- Gym fields meta box ----------
    public static function add_meta_box()
    {
        add_meta_box('sb_gym_fields', 'اطلاعات باشگاه', array(__CLASS__, 'render_meta_box'), SB_Post_Types::GYM, 'normal', 'high');
    }

    public static function render_meta_box(WP_Post $post)
    {
        wp_nonce_field('sb_save_gym', 'sb_gym_nonce');
        echo '<table class="form-table" role="presentation"><tbody>';
        foreach (SB_Post_Types::gym_fields() as $key => $field) {
            $value = get_post_meta($post->ID, $key, true);
            $name = 'sb_meta[' . esc_attr($key) . ']';
            echo '<tr><th scope="row"><label for="sb_' . esc_attr($key) . '">' . esc_html($field['label']) . '</label></th><td>';
            if (in_array($key, array('source', 'external_id'), true)) {
                echo '<code>' . esc_html($value ?: '—') . '</code>';
            } elseif ($key === 'landing_page_status') {
                echo '<select id="sb_' . esc_attr($key) . '" name="' . $name . '">';
                foreach (SB_Post_Types::LANDING_STATUSES as $status => $label) {
                    echo '<option value="' . esc_attr($status) . '"' . selected($value ?: 'none', $status, false) . '>' . esc_html($label) . '</option>';
                }
                echo '</select>';
            } elseif ($field['type'] === 'boolean') {
                echo '<input type="checkbox" id="sb_' . esc_attr($key) . '" name="' . $name . '" value="1"' . checked((bool) $value, true, false) . '>';
            } elseif ($key === 'address') {
                echo '<textarea id="sb_address" name="' . $name . '" rows="2" class="large-text">' . esc_textarea($value) . '</textarea>';
            } else {
                $type = $field['type'] === 'number' ? 'number" step="0.1" min="0" max="5' : 'text';
                echo '<input type="' . $type . '" id="sb_' . esc_attr($key) . '" name="' . $name . '" value="' . esc_attr($value) . '" class="regular-text">';
            }
            echo '</td></tr>';
        }
        echo '</tbody></table>';
    }

    public static function save_meta($post_id, WP_Post $post)
    {
        if (!isset($_POST['sb_gym_nonce']) || !wp_verify_nonce(sanitize_key($_POST['sb_gym_nonce']), 'sb_save_gym')) {
            return;
        }
        if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || !current_user_can('edit_post', $post_id)) {
            return;
        }
        $input = isset($_POST['sb_meta']) ? wp_unslash((array) $_POST['sb_meta']) : array();
        foreach (SB_Post_Types::gym_fields() as $key => $field) {
            if (in_array($key, array('source', 'external_id'), true)) {
                continue;
            }
            $raw = $field['type'] === 'boolean' ? !empty($input[$key]) : ($input[$key] ?? '');
            $sanitize = SB_Post_Types::sanitizer($key, $field['type']);
            update_post_meta($post_id, $key, call_user_func($sanitize, $raw));
        }
    }

    // ---------- List table ----------
    public static function columns($columns)
    {
        $new = array();
        foreach ($columns as $key => $label) {
            $new[$key] = $label;
            if ($key === 'title') {
                $new['sb_phone'] = 'تماس';
                $new['sb_rating'] = 'امتیاز';
                $new['sb_landing'] = 'لندینگ پیج';
            }
        }
        return $new;
    }

    public static function column_content($column, $post_id)
    {
        if ($column === 'sb_phone') {
            echo esc_html(get_post_meta($post_id, 'phone', true) ?: '—');
        } elseif ($column === 'sb_rating') {
            echo esc_html(get_post_meta($post_id, 'rating', true) ?: '—');
        } elseif ($column === 'sb_landing') {
            $status = get_post_meta($post_id, 'landing_page_status', true) ?: 'none';
            echo esc_html(SB_Post_Types::LANDING_STATUSES[$status] ?? $status);
        }
    }

    public static function landing_filter($post_type)
    {
        if ($post_type !== SB_Post_Types::GYM) {
            return;
        }
        $current = isset($_GET['sb_landing']) ? sanitize_key($_GET['sb_landing']) : '';
        echo '<select name="sb_landing"><option value="">همه وضعیت‌های لندینگ</option>';
        foreach (SB_Post_Types::LANDING_STATUSES as $status => $label) {
            echo '<option value="' . esc_attr($status) . '"' . selected($current, $status, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select>';
    }

    public static function apply_landing_filter(WP_Query $query)
    {
        if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== SB_Post_Types::GYM || empty($_GET['sb_landing'])) {
            return;
        }
        $query->set('meta_query', array(array('key' => 'landing_page_status', 'value' => sanitize_key($_GET['sb_landing']))));
    }

    // ---------- Approve (publish) action ----------
    public static function row_actions($actions, WP_Post $post)
    {
        if ($post->post_type === SB_Post_Types::GYM && in_array($post->post_status, array('pending', 'draft'), true) && current_user_can('publish_post', $post->ID)) {
            $url = wp_nonce_url(admin_url('admin-post.php?action=sb_approve_gym&post=' . $post->ID), 'sb_approve_gym_' . $post->ID);
            $actions['sb_approve'] = '<a href="' . esc_url($url) . '">تأیید و انتشار</a>';
        }
        return $actions;
    }

    public static function approve_gym()
    {
        $post_id = isset($_GET['post']) ? absint($_GET['post']) : 0;
        check_admin_referer('sb_approve_gym_' . $post_id);
        if (!current_user_can('publish_post', $post_id)) {
            wp_die('دسترسی غیرمجاز');
        }
        wp_update_post(array('ID' => $post_id, 'post_status' => 'publish'));
        wp_safe_redirect(wp_get_referer() ?: admin_url('edit.php?post_type=' . SB_Post_Types::GYM));
        exit;
    }

    // ---------- Term meta (city province, sport image / featured / order) ----------
    private static function term_input($name, $label, $value, $type, $table)
    {
        $field = $type === 'checkbox'
            ? '<input type="checkbox" name="sb_term[' . $name . ']" value="1"' . checked((bool) $value, true, false) . '>'
            : '<input type="' . $type . '" name="sb_term[' . $name . ']" value="' . esc_attr($value) . '" class="regular-text">';
        echo $table
            ? '<tr class="form-field"><th scope="row"><label>' . esc_html($label) . '</label></th><td>' . $field . '</td></tr>'
            : '<div class="form-field"><label>' . esc_html($label) . '</label>' . $field . '</div>';
    }

    private static function sport_inputs($term, $table)
    {
        $id = $term ? $term->term_id : 0;
        wp_nonce_field('sb_term_meta', 'sb_term_nonce');
        self::term_input('image_url', 'آدرس تصویر رشته', $id ? get_term_meta($id, 'image_url', true) : '', 'url', $table);
        self::term_input('featured', 'نمایش در نوار رشته‌های صفحه اصلی', $id ? get_term_meta($id, 'featured', true) : '', 'checkbox', $table);
        self::term_input('order', 'ترتیب نمایش', $id ? get_term_meta($id, 'order', true) : '', 'number', $table);
    }

    public static function sport_fields_add()
    {
        self::sport_inputs(null, false);
    }

    public static function sport_fields_edit($term)
    {
        self::sport_inputs($term, true);
    }

    public static function city_fields_add()
    {
        wp_nonce_field('sb_term_meta', 'sb_term_nonce');
        self::term_input('province', 'استان', '', 'text', false);
    }

    public static function city_fields_edit($term)
    {
        wp_nonce_field('sb_term_meta', 'sb_term_nonce');
        self::term_input('province', 'استان', get_term_meta($term->term_id, 'province', true), 'text', true);
    }

    public static function save_term_meta($term_id)
    {
        if (!isset($_POST['sb_term_nonce']) || !wp_verify_nonce(sanitize_key($_POST['sb_term_nonce']), 'sb_term_meta') || !current_user_can('manage_categories')) {
            return;
        }
        $input = isset($_POST['sb_term']) ? wp_unslash((array) $_POST['sb_term']) : array();
        $term = get_term($term_id);
        if ($term && $term->taxonomy === SB_Post_Types::CITY) {
            update_term_meta($term_id, 'province', sanitize_text_field($input['province'] ?? ''));
            return;
        }
        update_term_meta($term_id, 'image_url', esc_url_raw($input['image_url'] ?? ''));
        update_term_meta($term_id, 'featured', !empty($input['featured']));
        update_term_meta($term_id, 'order', absint($input['order'] ?? 0));
    }
}
