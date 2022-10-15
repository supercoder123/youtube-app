import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react';
import { PageProps, UpdatedVideoPropsItem, YoutubeChannelResponse, YoutubeVideosResponse } from '../types';
import { CHANNELS_API_URL } from '../constants/youtube-api';
import useSWRInfinite from 'swr/infinite';
import { SWRConfig, useSWRConfig } from 'swr';
import Grid from '../components/Grid/Grid';
import { getReorderedYoutubeVideos } from '../api-handler/getReorderedYoutubeVideos';
import Image from 'next/image';

const getKey = (playlistId: string) => {
  return (pageIndex: number, previousPageData: { videos: YoutubeVideosResponse }) => {
    // reached the end
    // console.log(previousPageData)
    if (previousPageData && !previousPageData.videos.nextPageToken) return null;

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/get-videos?pageNumber=${pageIndex}&playlistId=${playlistId}`;

    // add the cursor to the API endpoint
    return `/api/get-videos?pageNumber=${pageIndex}&playlistId=${playlistId}&pageToken=${previousPageData.videos.nextPageToken}`;
  };
}

const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};

export type UpdatedVideoList = (UpdatedVideoPropsItem | null)[];

const Home: NextPage<PageProps> = ({ videos, channel, playlistId, fallback }) => {
  const { mutate } = useSWRConfig()
  const [cards, setCards] = useState<YoutubeVideosResponse['items']>(videos.items);
  const [reorderedCards, setReorderedCards] = useState<UpdatedVideoList>([]);
  const { data, size, setSize, isValidating } = useSWRInfinite(getKey(playlistId), fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    persistSize: false,
    revalidateOnReconnect: false,
    revalidateAll: false,
    revalidateFirstPage: false,
  });

  const handleScroll = useCallback(
    () => {
      const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
      if (isValidating) {
        return;
      }
      if ((clientHeight + scrollTop) >= scrollHeight) {
        setSize(size + 1);
      }
    },
    [setSize, size, isValidating],
  )

  useEffect(() => {
    setSize(0);
  }, []);

  useEffect(() => {
    if (data && data.length >= 2) {
      const swrFetchedVideos = data.reduce((arr, videoResponse, i) => {
        arr.push(...videoResponse.videos.items);
        return arr;
      }, []);
      setCards(swrFetchedVideos);
    }
  }, [data])

  const getReorderedCards = (cards: UpdatedVideoList) => {
    setReorderedCards(cards)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [size, handleScroll]);

  function saveOrder() {
    fetch('/api/set-videos', {
      method: 'POST',
      body: JSON.stringify(reorderedCards),
    }).then(() => {
      setReorderedCards([]);
    });
  }

  return (
    <SWRConfig value={{ fallback }}>

      <div>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className="w-full">
            <div className="h-64 flex flex-col justify-center items-center">
              <h1 className="text-2xl text-center">{channel.items[0].snippet.title}</h1>
              <div className="m-10">
                <Image className="rounded-full self-center m-10 mx-auto" layout="fixed" height={80} width={80} src={channel.items[0].snippet.thumbnails.high.url} alt={channel.items[0].snippet.title} />
              </div>
            </div>
            <button
              className='px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'
              onClick={() => {
                saveOrder();
              }}
            >
              Save
            </button>
            <Grid cards={cards} setCards={setCards} getReorderedCards={getReorderedCards} isLoading={isValidating} />

          </div>
        </main>

        <footer>

        </footer>
      </div>
    </SWRConfig>
  )
}

export async function getStaticProps(context: any) {

  const channelData: YoutubeChannelResponse = await (await fetch(CHANNELS_API_URL)).json();
  const playlistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

  const videoData = await getReorderedYoutubeVideos(playlistId, '');
  return {
    props: {
      videos: videoData.videos,
      channel: channelData,
      playlistId,
      // videoIdCommaList: videoIds.join(','),
      fallback: {
        ['/api/get-videos']: videoData
      }
    },
  }
}

export default Home
