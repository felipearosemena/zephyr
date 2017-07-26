<?php

namespace Z;

class Video
{

  /**
   * get the video thumbnail from youtube / vimeo based on the video URL
   *
   * @author <felipearosemena@gmail.com>
   */

  public static function getVideoThumbnailSrc( $video_url, $custom_size = '' )
  {

    $service = static::getVideoService( $video_url );
    $protocol = is_ssl() ? 'https' : 'http';

    switch ( $service ) {

      // Is this a youtube link?
      case 'youtube':
        $video_id = getVideoIDFromYoutubeURL( $video_url );
        $size = ( $custom_size != '' ) ? $custom_size : '0';
        $img_src = $protocol . '://img.youtube.com/vi/' . $video_id . '/' . $size . '.jpg';
        break;

      // Is this a vimeo link?
      case 'vimeo':
        $video_id = getVideoIDFromVimeoURL( $video_url );
        $request_url = $protocol . '://vimeo.com/api/v2/video/' . $video_id . '.php';
        $contents = @file_get_contents( "$request_url" );
        $array = @unserialize( trim( "$contents" ) );
        $img_src = ( is_array( $array ) ) ? $array[0]['thumbnail_large'] : $array['thumbnail_large'];
        break;

      default:
        return;
        break;
    }

    return $img_src;

  } /* getVideoThumbnailSrc() */


  /**
   * Helper method to convert a URL into a video ID for youtube.com, youtube and vimeo.com
   *
   * @package Media.php
   * @since 1.0
   * @param (string) $url the video url
   * @return (string) $id the ID of the video
   */

  public static function getVideoIDFromURL( $url )
  {

    $service = static::getVideoService( $url );

    switch ( $service ) {

      // Is this a youtube link?
      case 'youtube':
        return static::getVideoIDFromYoutubeURL( $url );
        break;

      // Is this a vimeo link?
      case 'vimeo':
        return static::getVideoIDFromVimeoURL( $url );
        break;
    }

  } /* getVideoIDFromURL() */


  /**
   * Helper method to get a youTube ID from a url
   *
   * @package Media.php
   * @since 1.0
   * @param (string) $url
   * @return (string) $id - the youTube ID
   */

  public static function getVideoIDFromYoutubeURL( $url )
  {

    $pattern = '/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/';

    preg_match( $pattern, $url, $matches );

    if ( count( $matches ) && strlen( $matches[7] ) == 11 ) {
      return $matches[7];
    }

  } /* getVideoIDFromYoutubeURL() */


  /**
   * Helper method to get the video ID for a Vimeo url
   *
   * @package Media.php
   * @since 1.0
   * @param (string) $url
   * @return (string) $id - the vimeo ID
   * @return null
   */

  public static function getVideoIDFromVimeoURL( $url )
  {

    $pattern = '/\/\/(www\.)?vimeo.com\/(\d+)($|\/)/';

    preg_match( $pattern, $url, $matches );

    if ( count( $matches ) ) {
      return $matches[2];
    }

  } /* getVideoIDFromVimeoURL() */


  /**
   * Detemine if a video url is from youtube or vimeo
   *
   * @author Felipe Arosemena 
   * @package Media.php
   * @since 1.0
   * @param $url
   * @return video service
   */

  public static function getVideoService( $url )
  {

    // Is this a youtube link?
    $isYouTube = ( preg_match( '/youtu\.be/i', $url ) || preg_match( '/youtube\.com\/watch/i', $url ) ) ? true : false;

    // Is this a vimeo link?
    $isVimeo = ( preg_match( '/vimeo\.com/i', $url ) ) ? true : false;

    if ( $isYouTube ) {
      return 'youtube';
    }

    if ( $isVimeo ) {
      return 'vimeo';
    }

    return false;

  } /* getVideoService() */

}
