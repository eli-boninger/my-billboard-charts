import { type TopArtist, type TopArtistRank, type User } from "@prisma/client";

import { prisma } from "~/db.server";
import { SpotifyTopResultItem } from "./spotifyApiModels";

export const getTopArtistsByUserId = async (id: User["id"]) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    const items = await prisma.topArtist.findMany(
    {
        include: {
            topArtistRanks: {
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
    return items?.sort((a, b) => a.topArtistRanks[0].rank - b.topArtistRanks[0].rank)
}

export const setAllArtistsUnranked = async (userId: User["id"]) => {
    return await prisma.topArtist.updateMany({
        where: {
            isCurrentlyRanked: true,
            userId
        },
        data: {
            isCurrentlyRanked: false
        }
    })
}

const getTopArtistBySpotifyIdAndUserId = async (spotifyId: TopArtist["spotifyId"], userId: User["id"]) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    return await prisma.topArtist.findUnique(
    {
        include: {
            topArtistRanks: {
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
  
export const upsertTopArtist = async (item: SpotifyTopResultItem, newRank: number, userId: User["id"], existingRecordRank?: number) => {
    if (existingRecordRank) {
        return await prisma.topArtist.update({
            where: { spotifyId_userId: { spotifyId: item.id, userId}},
            data: {
                name: item.name,
                isCurrentlyRanked: true,
                topArtistRanks: {
                    create: [
                        { rank: newRank, previousRank: existingRecordRank ?? null }
                    ]
                },

            }
        })
    }
    return await prisma.topArtist.create({
        data: {
            name: item.name,
            userId: userId,
            isCurrentlyRanked: true,
            topArtistRanks: {
                create: [
                    { rank: newRank }
                ]
            },
            spotifyId: item.id
        },
        include: {
            topArtistRanks: true
        }
    })
}