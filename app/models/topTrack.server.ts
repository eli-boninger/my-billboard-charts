
import { prisma } from "~/db.server";
import { SpotifyTopResultItem } from "./spotifyApiModels";
import type { User, TopTrack, TopTrackRank } from "@prisma/client";

export const getTopTracksByUserId = async (id: User["id"]) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    const items = await prisma.topTrack?.findMany(
    {
        include: {
            topTrackRanks: {
                orderBy: {
                    createdAt: 'asc'
                },
                take: 1
            }
        }, 
        where: { 
            userId: id, 
            isCurrentlyRanked: true,
        },
    })
    return items?.sort((a, b) => a.topTrackRanks[0].rank - b.topTrackRanks[0].rank)
}

export const setAllTracksUnranked = async (userId: User["id"]) => {
    return await prisma.topTrack.updateMany({
        where: {
            isCurrentlyRanked: true,
            userId
        },
        data: {
            isCurrentlyRanked: false
        }
    })
}
  
const getTopTrackBySpotifyIdAndUserId = async (spotifyId: TopTrack["spotifyId"], userId: User["id"]) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    return await prisma.topTrack.findUnique(
    {
        include: {
            topTrackRanks: {
                orderBy: {
                    createdAt: 'asc'
                },
                take: 1
            }
        }, 
        where: { 
            spotifyId_userId: { spotifyId: spotifyId, userId},
            isCurrentlyRanked: true,
        },
    })
}
  

export const upsertTopTrack = async (item: SpotifyTopResultItem, newRank: number, userId: User["id"], existingRecordRank?: number) => {
    if (existingRecordRank) {
        return await prisma.topTrack.update({
            where: { spotifyId_userId: { spotifyId: item.id, userId } },
            data: {
                isCurrentlyRanked: true,
                topTrackRanks: {
                    create: [
                        { rank: newRank, previousRank: existingRecordRank ?? null }
                    ]
                },
            },
        })
    }
    return await prisma.topTrack.create({
        data: {
            name: item.name,
            userId: userId,
            isCurrentlyRanked: true,
            topTrackRanks: {
                create: [
                    { rank: newRank }
                ]
            },
            spotifyId: item.id,
            album: item.album?.name,
            artists: item.artists?.map(a => a.name)
        },
        include: {
            topTrackRanks: true
        }
    })
}