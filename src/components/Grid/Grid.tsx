import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
    UniqueIdentifier
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from "@dnd-kit/sortable";

import { YoutubeVideoItem, YoutubeVideosResponse } from '../../types';
import VideoCard from '../VideoCard/VideoCard';
import { EditedCardsDescription } from '../../pages';

const Grid = ({ cards, setCards, editedCards, setEditedCards, setEditInProgress, isLoading, isEditing }: {
    cards: YoutubeVideosResponse['items'],
    setCards: Dispatch<SetStateAction<YoutubeVideoItem[]>>,
    editedCards: EditedCardsDescription,
    setEditedCards: Dispatch<SetStateAction<EditedCardsDescription>>,
    setEditInProgress:  Dispatch<SetStateAction<boolean>>,
    isLoading: boolean,
    isEditing: boolean
}) => {
    const ref = useRef(cards);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>('');
    // const [items, setItems] = useState(cards);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCards((prevItems) => {
                const oldIndex = prevItems.findIndex(item => item.id === active.id);
                const newIndex = prevItems.findIndex(item => item.id === over.id);
                const newItems = arrayMove(prevItems, oldIndex, newIndex);
                const updatedItemsMap = newItems
                    .reduce((acc: EditedCardsDescription, item, index) => {
                        if (item.snippet.position !== prevItems[index].snippet.position) {
                            acc[item.id] = {
                                ...acc[item.id],
                                id: item.id,
                                position: item.snippet.position,
                                newPosition: index,
                                pageNumber: parseInt((index / 25).toString()), // TODO: update spage size 
                                videoId: item.snippet.resourceId.videoId
                            };
                        }
                        return acc;
                    }, editedCards);

                setEditedCards(updatedItemsMap);
                setEditInProgress(true);

                return newItems;
            });

        }
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
            >
                <div className="grid select-none lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center">
                    <SortableContext items={cards} strategy={rectSortingStrategy}>
                        {
                            cards.map((video, index) => {
                                let hide;
                                if (editedCards[video.id]) {
                                    hide = 'hide' in editedCards[video.id] ? editedCards[video.id].hide : video.snippet.hide;
                                } else {
                                    hide = video.snippet.hide;
                                }
                                return (
                                    <VideoCard
                                        key={video.id}
                                        index={index}
                                        video={video}
                                        isEditing={isEditing}
                                        hide={hide}
                                        setEditedCards={setEditedCards}
                                        setEditInProgress={setEditInProgress}
                                    />
                                );
                            })
                        }
                        {/* <DragOverlay>
                        {activeId ? (
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: "red"
                                }}
                            ></div>
                        ) : null}
                    </DragOverlay> */}
                    </SortableContext>

                </div>
            </DndContext >

            {(isLoading) && (<div className=" w-full flex justify-center mt-3">
                <div className="animate-ping inline-flex h-10 w-10 rounded-full bg-sky-400 opacity-75"></div>
            </div>)}

        </>

    )
}

export default Grid;