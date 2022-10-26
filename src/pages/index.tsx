import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageProps, UpdatedVideoPropsItem, YoutubeChannelResponse, YoutubeVideosResponse } from '../types';
import { CHANNELS_API_URL } from '../constants/youtube-api';
import useSWRInfinite from 'swr/infinite';
import { SWRConfig } from 'swr';
import Grid from '../components/Grid/Grid';
import { getReorderedYoutubeVideos } from '../api-handler/getReorderedYoutubeVideos';
import Image from 'next/image';
import Toolbar from '../components/Toolbar/Toolbar';
import toast from 'react-hot-toast';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/client';


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

export type EditedCardsDescription = {
    [id: string]: UpdatedVideoPropsItem;
}

const Home: NextPage<PageProps> = ({ videos, channel, playlistId, fallback }) => {
  // console.log('videos', videos.items)
  const [cards, setCards] = useState<YoutubeVideosResponse['items']>(videos.items);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editInProgress, setEditInProgress] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [editedCards, setEditedCards] = useState<EditedCardsDescription>({});

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey(playlistId), fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateFirstPage: false,
    revalidateAll: false
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
    onAuthStateChanged(auth, user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    })
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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [size, handleScroll]);

  function saveOrder() {
    fetch('/api/set-videos', {
      method: 'POST',
      body: JSON.stringify(editedCards),
    }).then(() => {
      setEditInProgress(false);
      toast.success("Saved");
    });
  }

  function toggleEditMode() {
    setIsEditing(prev => !prev);
  }

  return (
    <SWRConfig value={{ fallback }}>

      <div>
        <Head>
          <title>LEFT HAND RIGHT</title>
          <meta name="description" content={channel.items[0].snippet.title} />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className="w-full">
          {isLoggedIn && <Toolbar onSave={saveOrder} editInProgress={editInProgress} toggleEditMode={toggleEditMode}  isEditing={isEditing} />}
            <div className="h-62 mt-20 mb-10 flex flex-col justify-center items-center">
              <h1 className="text-2xl text-center">{channel.items[0].snippet.title}</h1>
              <div className="m-10">
                <Image className="rounded-full self-center m-10 mx-auto" layout="fixed" height={80} width={80} src={channel.items[0].snippet.thumbnails.high.url} alt={channel.items[0].snippet.title} />
              </div>
            </div>

            <Grid cards={cards} setCards={setCards} editedCards={editedCards} setEditedCards={setEditedCards} setEditInProgress={setEditInProgress} isLoading={isValidating} isEditing={isEditing}/>

          </div>
          <div id="portal-root"></div>
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
        [`/api/get-videos?pageNumber=0&playlistId=${playlistId}`]: videoData
      }
    },
    revalidate: 60
  }
}

export default Home
