<?php
if (!defined('ABSPATH')) {
    exit;
}

class SB_Post_Types
{
    const GYM = 'gym';
    const CITY = 'city';
    const SPORT = 'sport';

    const LANDING_STATUSES = array(
        'none' => 'درخواست نشده',
        'requested' => 'درخواست شده',
        'in_progress' => 'در حال طراحی',
        'done' => 'تحویل شده',
    );

    /** All gym custom fields (post meta). Title = gym_name, thumbnail = featured_image, taxonomies = city / sports. */
    public static function gym_fields()
    {
        return array(
            'address' => array('type' => 'string', 'label' => 'آدرس کامل'),
            'neighborhood' => array('type' => 'string', 'label' => 'محله'),
            'street' => array('type' => 'string', 'label' => 'خیابان'),
            'phone' => array('type' => 'string', 'label' => 'شماره تماس'),
            'manager_name' => array('type' => 'string', 'label' => 'نام مدیر / مسئول'),
            'rating' => array('type' => 'number', 'label' => 'امتیاز (۰ تا ۵)'),
            'is_featured' => array('type' => 'boolean', 'label' => 'نمایش در باشگاه‌های برتر'),
            'badge' => array('type' => 'string', 'label' => 'برچسب (مثلاً پیشنهاد ویژه)'),
            'image_url' => array('type' => 'string', 'label' => 'آدرس تصویر جایگزین (در نبود تصویر شاخص)'),
            'landing_page_requested' => array('type' => 'boolean', 'label' => 'درخواست لندینگ پیج اختصاصی'),
            'landing_page_status' => array('type' => 'string', 'label' => 'وضعیت لندینگ پیج'),
            'landing_page_url' => array('type' => 'string', 'label' => 'آدرس لندینگ پیج'),
            'source' => array('type' => 'string', 'label' => 'منبع ثبت'),
            'external_id' => array('type' => 'string', 'label' => 'شناسه ثبت در بدن هوشمند'),
        );
    }

    public static function sanitizer($key, $type)
    {
        if ($type === 'number') {
            return function ($value) {
                return is_numeric($value) ? max(0, min(5, (float) $value)) : 0;
            };
        }
        if ($type === 'boolean') {
            return 'rest_sanitize_boolean';
        }
        if (in_array($key, array('image_url', 'landing_page_url'), true)) {
            return 'esc_url_raw';
        }
        if ($key === 'landing_page_status') {
            return function ($value) {
                return array_key_exists($value, SB_Post_Types::LANDING_STATUSES) ? $value : 'none';
            };
        }
        return 'sanitize_text_field';
    }

    public static function register()
    {
        register_post_type(self::GYM, array(
            'labels' => array(
                'name' => 'باشگاه‌ها',
                'singular_name' => 'باشگاه',
                'add_new' => 'افزودن باشگاه',
                'add_new_item' => 'افزودن باشگاه جدید',
                'edit_item' => 'ویرایش باشگاه',
                'all_items' => 'همه باشگاه‌ها',
                'search_items' => 'جستجوی باشگاه',
                'not_found' => 'باشگاهی یافت نشد',
                'menu_name' => 'بدن هوشمند',
            ),
            'public' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-universal-access',
            'menu_position' => 21,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail'),
            'has_archive' => true,
            'rewrite' => array('slug' => 'gym'),
        ));

        register_taxonomy(self::CITY, self::GYM, array(
            'labels' => array('name' => 'شهرها', 'singular_name' => 'شهر', 'add_new_item' => 'افزودن شهر', 'search_items' => 'جستجوی شهر'),
            'hierarchical' => true,
            'show_in_rest' => true,
            'show_admin_column' => true,
            'rewrite' => array('slug' => 'city'),
        ));

        register_taxonomy(self::SPORT, self::GYM, array(
            'labels' => array('name' => 'رشته‌های ورزشی', 'singular_name' => 'رشته ورزشی', 'add_new_item' => 'افزودن رشته', 'search_items' => 'جستجوی رشته'),
            'hierarchical' => true,
            'show_in_rest' => true,
            'show_admin_column' => true,
            'rewrite' => array('slug' => 'sport'),
        ));

        foreach (self::gym_fields() as $key => $field) {
            register_post_meta(self::GYM, $key, array(
                'type' => $field['type'],
                'single' => true,
                'show_in_rest' => true,
                'sanitize_callback' => self::sanitizer($key, $field['type']),
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ));
        }

        register_term_meta(self::CITY, 'province', array('type' => 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field'));
        register_term_meta(self::SPORT, 'image_url', array('type' => 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'esc_url_raw'));
        register_term_meta(self::SPORT, 'featured', array('type' => 'boolean', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'rest_sanitize_boolean'));
        register_term_meta(self::SPORT, 'order', array('type' => 'integer', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'absint'));
    }
}
