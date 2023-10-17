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
            topArtistRanks: {
                some: {
                    createdAt: {
                        gte: yesterday
                    }
                }
            }
        },
    })
    return items.sort((a, b) => a.topArtistRanks[0].rank - b.topArtistRanks[0].rank)
}
  
export const setTopArtistsByUserId = async (items: SpotifyTopResultItem[], userId: User["id"]) => {
    return await Promise.all(items.map(async (item, index) => {
        return await prisma.topArtist.upsert({
            where: { spotifyId_userId: { spotifyId: item.id, userId } },
            update: {
                name: item.name,
                isCurrentlyRanked: true,
                topArtistRanks: {
                    create: [
                        { rank: index+1 }
                    ]
                },
            },
            create: {
                name: item.name,
                userId: userId,
                isCurrentlyRanked: true,
                topArtistRanks: {
                    create: [
                        { rank: index+1 }
                    ]
                },
                spotifyId: item.id
            },
            include: {
                topArtistRanks: true
            }
        })
    }))
}