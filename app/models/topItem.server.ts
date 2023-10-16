import { TopItemType, type TopItem, type TopItemRank, type User } from "@prisma/client";

import { prisma } from "~/db.server";
import { SpotifyTopResultItem } from "./spotifyApiModels";


const getTopItemsByUserId = (topItemType: TopItemType) => async (id: User["id"]) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    const items = await prisma.topItem.findMany(
    {
        include: {
            topItemRanks: {
                where: {
                    createdAt: {
                        gte: yesterday
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                },
                take: 1
            }
        }, 
        where: { 
            userId: id, 
            type: topItemType, 
            isCurrentlyRanked: true,
            topItemRanks: {
                some: {
                    createdAt: {
                        gte: yesterday
                    }
                }
            }
        },
    })
    return items.sort((a, b) => a.topItemRanks[0].rank - b.topItemRanks[0].rank)
}
  
export const getTopSongsByUserId = getTopItemsByUserId(TopItemType.SONG);
export const getTopArtistsByUserId = getTopItemsByUserId(TopItemType.ARTIST);

const setTopItems = (topItemType: TopItemType) => async (items: SpotifyTopResultItem[], userId: User["id"]) => {
    return await Promise.all(items.map(async (item, index) => {
        return await prisma.topItem.upsert({
            where: { spotifyId_userId: { spotifyId: item.id, userId } },
            update: {
                name: item.name,
                type: topItemType,
                isCurrentlyRanked: true,
                topItemRanks: {
                    create: [
                        { rank: index+1 }
                    ]
                },
            },
            create: {
                name: item.name,
                type: topItemType,
                userId: userId,
                isCurrentlyRanked: true,
                topItemRanks: {
                    create: [
                        { rank: index+1 }
                    ]
                },
                spotifyId: item.id
            },
            include: {
                topItemRanks: true
            }
        })
    }))
}


export const setTopSongsByUserId = setTopItems(TopItemType.SONG);
export const setTopArtistsByUserId = setTopItems(TopItemType.ARTIST);