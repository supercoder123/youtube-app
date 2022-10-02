export interface YoutubeChannelResponse {
    items: Array<{
      contentDetails: {
        relatedPlaylists: {
          uploads: string
        }
      },
      snippet: {
        title: string;
        thumbnails: {
          default: VideoThumbnail,
          high: VideoThumbnail,
          medium: VideoThumbnail,
        }
      }
    }>
  };
  
  interface VideoThumbnail {
    url: string;
    width: number;
    height: number;
  }
  
  export interface YoutubeVideoItem {
    id: string;
    snippet: {
      title: string;
      description: string;
      position: number;
      newPosition: number;
      hide: false;
      thumbnails: {
        default: VideoThumbnail,
        medium: VideoThumbnail,
        high: VideoThumbnail,
        standard: VideoThumbnail,
      };
      resourceId: {
        videoId: string;
      }
    }
  }
  
  export interface YoutubeVideosResponse {
    items: Array<YoutubeVideoItem>
  };
  
  interface YoutubeVideosResponseExtraProps {
    newPosition: number;
    hide: false;
  }
  
  export interface VideoResponse {
    channelData: YoutubeChannelResponse,
    videoData: YoutubeVideosResponse
  }

  export interface VideoCache {
    newPosition: number;
    hide?: boolean;
    id: string
  }