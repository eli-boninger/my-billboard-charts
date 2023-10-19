
import { prisma } from "~/db.server";
import { SpotifyTopResultItem } from "./spotifyApiModels";
import { type User, type TopItem, TopItemType, TopItemRank } from "@prisma/client";

export type TopItemAndRank =
    {
        topItemRanks: TopItemRank[]
    } & TopItem

export const getTopItemsByUserId = async (id: User["id"], topItemType: TopItemType = TopItemType.TRACK): Promise<TopItemAndRank[]> => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    const items = await prisma.topItem?.findMany(
    {
        include: {
            topItemRanks: {
                orderBy: {
                    createdAt: 'asc'
                },
                take: 1
            }
        }, 
        where: { 
            userId: id, 
            isCurrentlyRanked: true,
            topItemType,
        },
    })
    return items?.sort((a, b) => a.topItemRanks[0].rank - b.topItemRanks[0].rank)
}

export const setAllItemsUnranked = async (userId: User["id"], topItemType: TopItemType = TopItemType.TRACK) => {
    return await prisma.topItem.updateMany({
        where: {
            isCurrentlyRanked: true,
            userId,
            topItemType,
        },
        data: {
            isCurrentlyRanked: false
        }
    })
}
  
const getTopItemsBySpotifyIdAndUserId = async (spotifyId: TopItem["spotifyId"], userId: User["id"], topItemType: TopItemType = TopItemType.TRACK) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    return await prisma.topItem.findUnique(
    {
        include: {
            topItemRanks: {
                orderBy: {
                    createdAt: 'asc'
                },
                take: 1
            }
        }, 
        where: { 
            spotifyId_userId_topItemType: { spotifyId: spotifyId, userId, topItemType},
            isCurrentlyRanked: true,
        },
    })
}
  

export const upsertTopItem = async (item: SpotifyTopResultItem, newRank: number, userId: User["id"], topItemType: TopItemType = TopItemType.TRACK, existingRecordRank?: number) => {
    if (existingRecordRank) {
        return await prisma.topItem.update({
            where: { spotifyId_userId_topItemType: { spotifyId: item.id, userId, topItemType } },
            data: {
                isCurrentlyRanked: true,
                topItemRanks: {
                    create: [
                        { rank: newRank, previousRank: existingRecordRank ?? null }
                    ]
                },
            },
        })
    }
    return await prisma.topItem.create({
        data: {
            name: item.name,
            userId: userId,
            isCurrentlyRanked: true,
            topItemRanks: {
                create: [
                    { rank: newRank }
                ]
            },
            spotifyId: item.id,
            album: item.album?.name,
            artists: item.artists?.map(a => a.name) ?? [],
            topItemType,
        },
        include: {
            topItemRanks: true
        }
    })
}