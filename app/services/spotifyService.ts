import { TopArtist, TopTrack } from "@prisma/client";
import { SpotifyTopItemsRequestResult } from "~/models/spotifyApiModels";
import { getTopArtistsByUserId, setTopArtistsByUserId } from "~/models/topArtist.server";
import { getTopTracksByUserId, setTopTracksByUserId } from "~/models/topTrack.server";
import { addSpotifyTokenToSession, getSpotifySession, requireUser } from "~/session.server";

const refreshAccessToken = async (request: Request) => {
    const user = await requireUser(request);
    if (!user || !user.spotifyRefreshToken) {
        throw new Error("User not authorized")
    }
    const params = new URLSearchParams({
        refresh_token: user.spotifyRefreshToken,
        grant_type: "refresh_token",
      });
    try {
        const res = await fetch(`https://accounts.spotify.com/api/token`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_API_TOKEN}`
                ).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });
        
        if (res.status === 200) {
            const resultJson = await res.json();
            await addSpotifyTokenToSession(request, resultJson?.access_token)
            return resultJson?.access_token;
        }
    } catch (e) {
        console.error(e)
    }
}


export const spotifyApiRequest = async <T>(request: Request, url: string, method: string = "GET", body?: BodyInit): Promise<T | undefined> => {
    const spotifyAuthToken = await getSpotifySession(request);
    try {
        const res = await fetch(url, { method, body, headers: { Authorization: `Bearer ${spotifyAuthToken}`, }})
        if (res.status === 401) {
            const refreshedToken = await refreshAccessToken(request);
            const refreshedResult = await fetch(url, { method, body, headers: { Authorization: `Bearer ${refreshedToken}`, }})
            if (refreshedResult.status === 400) {
                throw new Error("something went wrong")
            }
            return await refreshedResult.json();
        } else {
            return await res.json();
        }
    } catch (e) {
        console.error(e)
    }
}

export const getTopTracks = async (request: Request, userId: string): Promise<TopTrack[]> => {
    const tracks = await getTopTracksByUserId(userId);
    if (!!tracks && tracks.length > 0) {
        return tracks;
    }
    const res = await spotifyApiRequest<SpotifyTopItemsRequestResult>(request, "https://api.spotify.com/v1/me/top/tracks?time_range=short_term");
    if (!!res?.items) {
        await setTopTracksByUserId(res.items, userId)
        return await getTopTracksByUserId(userId)
    } else {
        return [];
    }
    
}

export const getTopArtists = async (request: Request, userId: string): Promise<TopArtist[]> => {
    const artists = await getTopArtistsByUserId(userId);
    if (!!artists && artists.length > 0) {
        return artists;
    }
    const res = await spotifyApiRequest<SpotifyTopItemsRequestResult>(request, "https://api.spotify.com/v1/me/top/artists?time_range=short_term");
    if (!!res?.items) {
        await setTopArtistsByUserId(res.items, userId)
        return await getTopArtistsByUserId(userId)
    } else {
        return []
    }
}