<?php
if (!defined('ABSPATH')) {
    exit;
}

/** Persian-aware normalization; mirrors backend/text_utils.py. */
function sb_normalize($text)
{
    static $map = null;
    if ($map === null) {
        $map = array('ي' => 'ی', 'ك' => 'ک', 'ۀ' => 'ه', 'ة' => 'ه', 'أ' => 'ا', 'إ' => 'ا', "\u{200C}" => ' ');
        $fa = array('۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹');
        $ar = array('٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩');
        foreach ($fa as $i => $digit) {
            $map[$digit] = (string) $i;
            $map[$ar[$i]] = (string) $i;
        }
    }
    $text = strtr((string) $text, $map);
    $text = preg_replace('/[،,.\-_\/]/u', ' ', $text);
    return trim(preg_replace('/\s+/u', ' ', $text));
}

/** True when the query (street / neighborhood / area) matches the given address parts. */
function sb_location_matches(array $parts, $query)
{
    $needle = sb_normalize($query);
    if ($needle === '') {
        return true;
    }
    $hay = sb_normalize(implode(' ', $parts));
    if (strpos($hay, $needle) !== false || strpos(str_replace(' ', '', $hay), str_replace(' ', '', $needle)) !== false) {
        return true;
    }
    $generic = array('خیابان', 'خ', 'میدان', 'م', 'محله', 'شهرک', 'بلوار', 'کوچه', 'چهارراه', 'منطقه', 'محدوده', 'فلکه');
    $tokens = array_values(array_filter(explode(' ', $needle), function ($t) use ($generic) {
        return !in_array($t, $generic, true);
    }));
    if (!$tokens) {
        return false;
    }
    foreach ($tokens as $token) {
        if (strpos($hay, $token) === false) {
            return false;
        }
    }
    return true;
}

function sb_terms($post_id, $taxonomy)
{
    $terms = get_the_terms($post_id, $taxonomy);
    return is_array($terms) ? $terms : array();
}

function sb_meta($post_id, $key)
{
    return get_post_meta($post_id, $key, true);
}

function sb_format_city(WP_Term $term)
{
    return array(
        'slug' => $term->slug,
        'name' => $term->name,
        'province' => (string) get_term_meta($term->term_id, 'province', true),
    );
}

function sb_format_sport(WP_Term $term)
{
    return array(
        'slug' => $term->slug,
        'name' => $term->name,
        'image' => get_term_meta($term->term_id, 'image_url', true) ?: null,
        'featured' => (bool) get_term_meta($term->term_id, 'featured', true),
    );
}

/** Gym payload — the single contract shared with the Emergent frontend. */
function sb_format_gym(WP_Post $post)
{
    $id = $post->ID;
    $cities = sb_terms($id, SB_Post_Types::CITY);
    $image = get_the_post_thumbnail_url($id, 'large') ?: sb_meta($id, 'image_url');
    $description = $post->post_excerpt ?: wp_strip_all_tags($post->post_content);

    return array(
        'id' => (string) $id,
        'slug' => urldecode($post->post_name),
        'name' => $post->post_title,
        'city' => $cities ? $cities[0]->name : '',
        'address' => (string) sb_meta($id, 'address'),
        'neighborhood' => (string) sb_meta($id, 'neighborhood'),
        'street' => (string) sb_meta($id, 'street'),
        'phone' => (string) sb_meta($id, 'phone'),
        'image' => $image ?: '',
        'sports' => array_map('sb_format_sport', sb_terms($id, SB_Post_Types::SPORT)),
        'rating' => (float) sb_meta($id, 'rating'),
        'description' => $description,
        'status' => $post->post_status,
        'featured' => (bool) sb_meta($id, 'is_featured'),
        'badge' => sb_meta($id, 'badge') ?: null,
        'managerName' => (string) sb_meta($id, 'manager_name'),
        'landingPageRequested' => (bool) sb_meta($id, 'landing_page_requested'),
        'landingPageStatus' => sb_meta($id, 'landing_page_status') ?: 'none',
        'landingPageUrl' => sb_meta($id, 'landing_page_url') ?: null,
    );
}
