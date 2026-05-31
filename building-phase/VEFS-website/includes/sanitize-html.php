<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/htmlpurifier/HTMLPurifier.auto.php';

/**
 * Sanitize blog body HTML with a strict allowlist.
 * Tags:  p, h2, h3, h4, strong, em, u, a, ul, ol, li, blockquote, br, img, hr
 * Attrs: a[href|title|rel], img[src|alt|width|height]
 * URL schemes: http, https, mailto
 */
function sanitize_blog_html(string $html): string {
    static $purifier = null;
    if ($purifier === null) {
        $config = HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', 'p,h2,h3,h4,strong,em,u,a[href|title|rel],ul,ol,li,blockquote,br,img[src|alt|width|height],hr');
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true]);
        $config->set('Attr.AllowedRel', ['nofollow', 'noopener', 'noreferrer']);
        $config->set('Cache.SerializerPath', sys_get_temp_dir());
        $config->set('HTML.Doctype', 'HTML 4.01 Transitional');
        $purifier = new HTMLPurifier($config);
    }
    return $purifier->purify($html);
}
