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
    },
    statistics: {
      viewCount: string,
      subscriberCount: string,
      hiddenSubscriberCount: boolean,
      videoCount: string
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
    hide?: boolean;
    thumbnails: {
      default: VideoThumbnail,
      medium: VideoThumbnail,
      high: VideoThumbnail,
      standard: VideoThumbnail,
    };
    resourceId: {
      videoId: string;
    };
  },
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  }
}

export interface YoutubeVideosResponse {
  items: Array<YoutubeVideoItem>;
  nextPageToken: string;
  prevPageToken: string;
};

interface YoutubeVideosResponseExtraProps {
  newPosition: number;
  hide: false;
}

export interface VideoResponse {
  channelData: YoutubeChannelResponse,
  videoData: YoutubeVideosResponse
}

export interface PageProps {
  videos: YoutubeVideosResponse;
  channel: YoutubeChannelResponse;
  playlistId: string;
  fallback?: {
    [key: string]: YoutubeVideosResponse['items']
  }
}

export interface UpdatedVideoPropsItem {
  id: string;
  position?: number;
  newPosition?: number;
  hide?: boolean;
  pageNumber: number;
  videoId: string;
}