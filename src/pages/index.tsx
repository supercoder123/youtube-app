import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import VideoCard from '../components/VideoCard/VideoCard';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { PageProps, UpdatedVideoPropsItem, YoutubeChannelResponse, YoutubeVideoItem, YoutubeVideosResponse } from '../types';
import { CHANNELS_API_URL, PLAYLISTS_ITEMS_API_URL } from '../constants/youtube-api';
import db from '../firebase/admin';
import useSWRInfinite from 'swr/infinite';
import { SWRConfig, unstable_serialize } from 'swr';

const getKey = (pageIndex: number, previousPageData: YoutubeVideosResponse) => {
  // reached the end
  if (previousPageData && !previousPageData.nextPageToken) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return PLAYLISTS_ITEMS_API_URL;

  // add the cursor to the API endpoint
  return `${PLAYLISTS_ITEMS_API_URL}&pageToken=${previousPageData.nextPageToken}`;
}

// const fetcher = (...args: any[]) => fetch(...args: any[]).then(res => res.json())

const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};

type UpdatedVideoList = (UpdatedVideoPropsItem | null)[];

const Home: NextPage<PageProps> = ({ videos, channel, videoIdCommaList, fallback }) => {
  const [cards, setCards] = useState<YoutubeVideosResponse['items']>(videos.items);
  const [reorderedCards, setReorderedCards] = useState<UpdatedVideoList>();
  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateAll: false,
    revalidateFirstPage: false,
  })
  const handleScroll = () => {
    const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
    if ((clientHeight + scrollTop) >= scrollHeight) {
      setSize(size + 1);
    }
  }

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {

    setCards((prevCards: any) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as any],
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (data && data.length >= 2) {
      setCards(prevCards => [...prevCards, ...data[data.length - 1].items])
    }
  }, [data])

  useEffect(() => {
    const updatedCards = cards.map((card: YoutubeVideoItem, i) => {
      if (card.snippet.position !== i) {
        card.snippet.newPosition = i;
        return {
          id: card.id,
          position: card.snippet.position,
          newPosition: i
        };
      }
      return null;
    }).filter((val) => val);

    setReorderedCards(updatedCards);

  }, [cards]);



  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [size]);

  function saveOrder() {
    fetch('/api/set-videos', {
      method: 'POST',
      body: JSON.stringify(reorderedCards),
    });
  }

  // if (!data) return 'loading';

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
            <h1 className="text-2xl text-center">{channel.items[0].snippet.title}</h1>
            <button
              className='px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'
              onClick={() => {
                saveOrder();
              }}
            >
              Save
            </button>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center">
              <DndProvider backend={HTML5Backend}>
                {/* {
                data.map((item, index) => {
                  return item.items.map((video, index) => {
                    return <VideoCard key={video.id} id={video.id} index={index} video={video} moveCard={moveCard} />
                  })
                })
              } */}

                {
                  cards.map((video, index) => {
                    return <VideoCard key={video.id} id={video.id} index={index} video={video} moveCard={moveCard} />
                  })
                }
              </DndProvider>

              {/* {(isValidating) && <div className='animate-pulse '>Loding more</div>} */}
            </div>

            {(isValidating) && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>}

          </div>
        </main>

        <footer>

        </footer>
      </div>
    </SWRConfig>
  )
}

// export async function getStaticProps(context: any) {

//   const channelData: YoutubeChannelResponse = await (await fetch(CHANNELS_API_URL)).json();
//   const playListId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
//   const videoData: YoutubeVideosResponse = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&playlistId=${playListId}`)).json();
//   const docRef = db.collection('youtube');
//   const videoIds = [];

//   for (let i=0; i<videoData.items.length; i++) {
//     const reorderedVideo = await docRef.doc(videoData.items[i].id).get();
//     const data = reorderedVideo.data();
//     videoIds.push(videoData.items[i].snippet.resourceId.videoId)
//     if (reorderedVideo.exists && data) {
//       videoData.items[i].snippet.position = data.newPosition;
//     }
//   }

//   videoData.items.sort((a, b) => a.snippet.position - b.snippet.position);

//   return {
//     props: {
//       videos: videoData,
//       channel: channelData,
//       videoIdCommaList: videoIds.join(','),
//       fallback: {
//         [unstable_serialize([PLAYLISTS_ITEMS_API_URL])]: videoData
//       }
//     },
//   }
// }

export async function getServerSideProps(context: any) {
  const channelData: YoutubeChannelResponse = await (await fetch(CHANNELS_API_URL)).json();
  const playListId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
  const videoData: YoutubeVideosResponse = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&playlistId=${playListId}`)).json();
  const snapshot = await db.collection('youtube').get();
  const collection:any = {};
    snapshot.forEach(doc => {
        collection[doc.id] = doc.data();
    });
  const videoIds = [];

  for (let i = 0; i < videoData.items.length; i++) {
    try {
      const data = collection[videoData.items[i].id];
      videoIds.push(videoData.items[i].snippet.resourceId.videoId)
        videoData.items[i].snippet.position = data.newPosition;
    } catch (e) {
      console.log(e)
    }

  }

  videoData.items.sort((a, b) => a.snippet.position - b.snippet.position);

  return {
    props: {
      videos: videoData,
      channel: channelData,
      // videoIdCommaList: videoIds.join(','),
      fallback: {
        [unstable_serialize([PLAYLISTS_ITEMS_API_URL])]: videoData
      }
    },
  }
}

export default Home
