
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
            isCurrentlyRanked: true,
            topTrackRanks: {
                some: {
                    createdAt: {
                        gte: yesterday
                    }
                }
            }
        },
    })
    return items?.sort((a, b) => a.topTrackRanks[0].rank - b.topTrackRanks[0].rank)
}
  
export const setTopTracksByUserId = async (items: SpotifyTopResultItem[], userId: User["id"]) => {
    return await Promise.all(items.map(async (item, index) => {
        return await prisma.topTrack.upsert({
            where: { spotifyId_userId: { spotifyId: item.id, userId } },
            update: {
                isCurrentlyRanked: true,
                topTrackRanks: {
                    create: [
                        { rank: index+1 }
                    ]
                },
            },
            create: {
                name: item.name,
                userId: userId,
                isCurrentlyRanked: true,
                topTrackRanks: {
                    create: [
                        { rank: index+1 }
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
    }))
}