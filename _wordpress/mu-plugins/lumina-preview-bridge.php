<?php
/**
 * Plugin Name: Lumina Headless Preview Bridge
 * Description: Redirects the standard WordPress "Preview" button to the Next.js frontend gateway.
 * Version: 1.0
 * Author: Lumina Team
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Filter the preview link to point to the Next.js API route.
 * 
 * SETUP INSTRUCTIONS:
 * Add this to your wp-config.php:
 * define( 'NEXTJS_FRONTEND_URL', 'http://localhost:3000' );
 * define( 'NEXTJS_PREVIEW_SECRET', 'LuminaPreview2026' );
 */
add_filter( 'preview_post_link', function( $preview_link, $post ) {
    
    // 1. Get the Frontend URL from wp-config.php or fallback to local
    $frontend_url = defined('NEXTJS_FRONTEND_URL') ? NEXTJS_FRONTEND_URL : 'http://localhost:3000';
    
    // 2. Get the Secret from wp-config.php or fallback
    $secret = defined('NEXTJS_PREVIEW_SECRET') ? NEXTJS_PREVIEW_SECRET : 'LuminaPreview2026';
    
    // 3. Map WordPress Post Types to Next.js Routes
    // WordPress Slug -> Next.js Folder Name
    $post_type_map = [
        'resource' => 'resources',
        'expert'   => 'experts',
        'page'     => 'pages' // Add more as your app grows
    ];

    $post_type = $post->post_type;
    $route = isset($post_type_map[$post_type]) ? $post_type_map[$post_type] : $post_type;

    /**
     * 4. Construct the API Gateway URL
     * We pass:
     * - secret: For security handshake
     * - slug: For the final pretty URL
     * - id: The Database ID (Our fallback safety net for new drafts)
     * - postType: To tell Next.js which folder to look in
     */
    return sprintf(
        '%s/api/draft?secret=%s&slug=%s&id=%d&postType=%s',
        untrailingslashit($frontend_url),
        $secret,
        $post->post_name,
        $post->ID,
        $route
    );
}, 10, 2 );
