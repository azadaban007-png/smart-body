<?php
if (!defined('ABSPATH')) {
    exit;
}

/** REST API: /wp-json/smartbody/v1/* — the contract consumed by the Emergent backend. */
class SB_Rest_API
{
    const NS = 'smartbody/v1';

    public static function register_routes()
    {
        $public = '__return_true';
        $manage = array(__CLASS__, 'can_manage');

        register_rest_route(self::NS, '/status', array('methods' => 'GET', 'callback' => array(__CLASS__, 'status'), 'permission_callback' => $public));
        register_rest_route(self::NS, '/cities', array('methods' => 'GET', 'callback' => array(__CLASS__, 'cities'), 'permission_callback' => $public));
        register_rest_route(self::NS, '/sports', array('methods' => 'GET', 'callback' => array(__CLASS__, 'sports'), 'permission_callback' => $public));
        register_rest_route(self::NS, '/gyms', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'gyms'),
            'permission_callback' => $public,
            'args' => array(
                'city' => array('type' => 'string'),
                'q' => array('type' => 'string'),
                'sport' => array('type' => 'string'),
                'featured' => array('type' => 'boolean'),
                'limit' => array('type' => 'integer', 'default' => 50, 'minimum' => 1, 'maximum' => 100),
            ),
        ));
        register_rest_route(self::NS, '/gyms/(?P<slug>[^/]+)', array('methods' => 'GET', 'callback' => array(__CLASS__, 'gym'), 'permission_callback' => $public));
        register_rest_route(self::NS, '/registrations', array(
            array('methods' => 'GET', 'callback' => array(__CLASS__, 'list_registrations'), 'permission_callback' => $manage),
            array('methods' => 'POST', 'callback' => array(__CLASS__, 'create_registration'), 'permission_callback' => $manage),
        ));
    }

    /** Application Password user must be an Editor or Administrator. */
    public static function can_manage()
    {
        return current_user_can('edit_others_posts') && current_user_can('upload_files');
    }

    public static function status()
    {
        $counts = wp_count_posts(SB_Post_Types::GYM);
        return rest_ensure_response(array(
            'plugin' => 'smart-body-core',
            'version' => SB_CORE_VERSION,
            'gyms' => array('published' => (int) $counts->publish, 'pending' => (int) $counts->pending, 'draft' => (int) $counts->draft),
        ));
    }

    public static function cities()
    {
        $terms = get_terms(array('taxonomy' => SB_Post_Types::CITY, 'hide_empty' => false, 'orderby' => 'name'));
        return rest_ensure_response(is_array($terms) ? array_map('sb_format_city', $terms) : array());
    }

    public static function sports()
    {
        $terms = get_terms(array('taxonomy' => SB_Post_Types::SPORT, 'hide_empty' => false));
        $terms = is_array($terms) ? $terms : array();
        usort($terms, function ($a, $b) {
            return (int) get_term_meta($a->term_id, 'order', true) <=> (int) get_term_meta($b->term_id, 'order', true);
        });
        return rest_ensure_response(array_map('sb_format_sport', $terms));
    }

    public static function gyms(WP_REST_Request $request)
    {
        $args = array('post_type' => SB_Post_Types::GYM, 'post_status' => 'publish', 'posts_per_page' => 500, 'no_found_rows' => true);
        $tax_query = array();

        $city = trim((string) $request->get_param('city'));
        if ($city !== '') {
            $term = get_term_by('name', $city, SB_Post_Types::CITY) ?: get_term_by('slug', sanitize_title($city), SB_Post_Types::CITY);
            if (!$term) {
                return rest_ensure_response(array());
            }
            $tax_query[] = array('taxonomy' => SB_Post_Types::CITY, 'field' => 'term_id', 'terms' => $term->term_id);
        }
        $sport = trim((string) $request->get_param('sport'));
        if ($sport !== '') {
            $tax_query[] = array('taxonomy' => SB_Post_Types::SPORT, 'field' => 'slug', 'terms' => sanitize_title($sport));
        }
        if ($tax_query) {
            $args['tax_query'] = $tax_query;
        }

        $gyms = array_map('sb_format_gym', get_posts($args));

        $q = (string) $request->get_param('q');
        if ($q !== '') {
            $gyms = array_filter($gyms, function ($g) use ($q) {
                return sb_location_matches(array($g['name'], $g['address'], $g['neighborhood'], $g['street']), $q);
            });
        }
        $featured = $request->get_param('featured');
        if ($featured !== null) {
            $gyms = array_filter($gyms, function ($g) use ($featured) {
                return $g['featured'] === (bool) $featured;
            });
        }
        usort($gyms, function ($a, $b) {
            return $b['rating'] <=> $a['rating'];
        });

        return rest_ensure_response(array_slice(array_values($gyms), 0, (int) $request->get_param('limit')));
    }

    public static function gym(WP_REST_Request $request)
    {
        $slug = sanitize_title(urldecode($request['slug']));
        $posts = get_posts(array('name' => $slug, 'post_type' => SB_Post_Types::GYM, 'post_status' => 'publish', 'numberposts' => 1));
        if (!$posts) {
            return new WP_Error('sb_not_found', 'Gym not found', array('status' => 404));
        }
        return rest_ensure_response(sb_format_gym($posts[0]));
    }

    public static function list_registrations()
    {
        $posts = get_posts(array('post_type' => SB_Post_Types::GYM, 'post_status' => array('pending', 'draft'), 'numberposts' => 200, 'orderby' => 'date', 'order' => 'DESC'));
        return rest_ensure_response(array_map(function ($post) {
            return array_merge(sb_format_gym($post), array('editLink' => admin_url('post.php?post=' . $post->ID . '&action=edit')));
        }, $posts));
    }

    /** Creates a *pending* gym post for admin review. Idempotent on externalId. */
    public static function create_registration(WP_REST_Request $request)
    {
        $p = $request->get_json_params();
        foreach (array('gymName', 'managerName', 'phone', 'city', 'address') as $field) {
            if (empty($p[$field])) {
                return new WP_Error('sb_invalid', sprintf('Missing field: %s', $field), array('status' => 400));
            }
        }

        $external_id = sanitize_text_field($p['externalId'] ?? '');
        if ($external_id !== '') {
            $existing = get_posts(array('post_type' => SB_Post_Types::GYM, 'post_status' => 'any', 'meta_key' => 'external_id', 'meta_value' => $external_id, 'numberposts' => 1, 'fields' => 'ids'));
            if ($existing) {
                return rest_ensure_response(self::registration_response($existing[0], true));
            }
        }

        $post_id = wp_insert_post(array(
            'post_type' => SB_Post_Types::GYM,
            'post_status' => 'pending',
            'post_title' => sanitize_text_field($p['gymName']),
            'post_content' => '',
        ), true);
        if (is_wp_error($post_id)) {
            return $post_id;
        }

        $landing = rest_sanitize_boolean($p['landingPageRequested'] ?? false);
        $meta = array(
            'manager_name' => $p['managerName'],
            'phone' => $p['phone'],
            'address' => $p['address'],
            'neighborhood' => $p['neighborhood'] ?? '',
            'street' => $p['street'] ?? '',
            'landing_page_requested' => $landing,
            'landing_page_status' => $landing ? 'requested' : 'none',
            'source' => 'registration',
            'external_id' => $external_id,
        );
        foreach ($meta as $key => $value) {
            update_post_meta($post_id, $key, is_bool($value) ? $value : sanitize_text_field($value));
        }

        $city_name = sanitize_text_field($p['city']);
        $city = get_term_by('name', $city_name, SB_Post_Types::CITY);
        $city_id = $city ? $city->term_id : (is_wp_error($r = wp_insert_term($city_name, SB_Post_Types::CITY)) ? 0 : $r['term_id']);
        if ($city_id) {
            wp_set_object_terms($post_id, array((int) $city_id), SB_Post_Types::CITY);
        }

        $sport_ids = array();
        foreach ((array) ($p['sports'] ?? array()) as $slug) {
            $term = get_term_by('slug', sanitize_title($slug), SB_Post_Types::SPORT);
            if ($term) {
                $sport_ids[] = (int) $term->term_id;
            }
        }
        wp_set_object_terms($post_id, $sport_ids, SB_Post_Types::SPORT);

        if (!empty($p['mediaId'])) {
            set_post_thumbnail($post_id, (int) $p['mediaId']);
            wp_update_post(array('ID' => (int) $p['mediaId'], 'post_parent' => $post_id));
        } elseif (!empty($p['imageUrl'])) {
            update_post_meta($post_id, 'image_url', esc_url_raw($p['imageUrl']));
        }

        $response = rest_ensure_response(self::registration_response($post_id, false));
        $response->set_status(201);
        return $response;
    }

    private static function registration_response($post_id, $duplicate)
    {
        return array(
            'id' => (int) $post_id,
            'status' => get_post_status($post_id),
            'editLink' => admin_url('post.php?post=' . (int) $post_id . '&action=edit'),
            'duplicate' => $duplicate,
        );
    }
}
