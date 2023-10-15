import { TopItemType, type TopItem, type TopItemRank, type User } from "@prisma/client";

import { prisma } from "~/db.server";
import { SpotifyTopResultItem } from "./spotifyApiModels";


const getTopItemsByUserId = (topItemType: TopItemType) => async (id: User["id"]) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    return prisma.topItem.findMany({ include: {
        topItemRanks: {
            orderBy: {
                createdAt: 'asc'
            },
            take: 1
        }
    }, where: { userId: id, type: topItemType, isCurrentlyRanked: true }})
}
  
export const getTopSongsByUserId = getTopItemsByUserId(TopItemType.SONG);
export const getTopArtistsByUserId = getTopItemsByUserId(TopItemType.ARTIST);

const setTopItems = (topItemType: TopItemType) => async (items: SpotifyTopResultItem[], userId: User["id"]) => {
    return await Promise.all(items.map(async (item, index) => {
        return await prisma.topItem.create({
            data: {
                name: item.name,
                type: topItemType,
                userId: userId,
                isCurrentlyRanked: true,
                topItemRanks: {
                    create: [
                        { rank: index+1 }
                    ]
                }
            },
            include: {
                topItemRanks: true
            }
        })
    }))
}


export const setTopSongsByUserId = setTopItems(TopItemType.SONG);
export const setTopArtistsByUserId = setTopItems(TopItemType.ARTIST);