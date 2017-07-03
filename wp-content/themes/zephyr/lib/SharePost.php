<?php 

/**
 *
 * Social Sharing Class
 *  
 *  Generates the appropriate url to share a certain post.
 *
 *  For best results, make sure your posts have all the necessary Open Graph tags.
 *  That will help the service pick up the featured image, page content, etc.
 *  Yoast SEO plugin will add these for you when you enable the plugin.
 *
 *  Usage: 
 *  
 *  $sharer = new SharePost();
 *  echo $sharer->get_url('tweet', $postID); 
 *
 *  Where 'tweet' corresponds to a key in the apis array inside the constructor function
 *  and $postID is the ID of the post to be shared.
 *
 */

namespace BW;

class SharePost 
{
  
  function __construct() 
  {
    $this->twitter_account = get_field('global_twitter_account', 'options');
  }


  /**
   *
   * Get an item the set of sharing link options available
   *
   */
  
  private function apis($key, $post_id, $page_url)
  {

    $apis = array(
      'fb_share'   => array(
        'url'      => 'https://www.facebook.com/sharer/sharer.php?',
        'params'   => 'u='
      ),

      'fb_like'    => array(
        'url'      => 'http://www.facebook.com/plugins/like.php?',
        'params'   => 'width&layout=standard&action=like&show_faces=true&href='
      ),
 
      'tweet'      => array(
        'url'      => 'https://twitter.com/intent/tweet?',
        'params'   => 'text='. rawurlencode(get_the_title($post_id)) . ($this->twitter_account ? rawurlencode(' via @' . $this->twitter_account) : '') . '&url='
      ),

      'gplus_share'  => array(
        'url'        => 'https://plus.google.com/share?',
        'params'     => 'url='
      ),

      'linkedin_share' => array(
        'url'          => 'http://www.linkedin.com/shareArticle?',
        'params'       => 'title=' . rawurlencode(get_the_title($post_id)) . '&source=' . rawurlencode(get_site_url()) . '&url='
      )
    );

    return isset($apis[$key]) ? $apis[$key] : null;

  }
  /**
   *
   * Get the sharing url for a certain type of sharing option.
   * See list of API's above for a reference on how to access each one.
   *
   * @param string $key - The name of the type of URL you want. Must match an the key in 
   *                      the $apis array from the `api` method.
   * @param integet $post_id - ID of the post to be shared.
   *
   */
  
  public function get_url($key='', $post_id = null)
  {

    $share_url = '';
    $current_page_url = get_permalink($post_id);
    $endpoint = $this->apis($key, $post_id, $current_page_url);

    if($endpoint) {
      $pars = isset($endpoint['params']) ? html_entity_decode($endpoint['params'], ENT_QUOTES, 'UTF-8') : '';

      $share_url = $endpoint['url'] . $pars . rawurlencode($current_page_url);
    }

    return $share_url;

  }

}