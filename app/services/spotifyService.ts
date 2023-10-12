import { SpotifyTopItemsRequestResult } from "~/models/spotifyApiModels";
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
            await refreshAccessToken(request);
            const refreshedResult = await fetch(url, { method, body, headers: { Authorization: `Bearer ${spotifyAuthToken}`, }})
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

export const getTopSongs = async (request: Request) => {
    return await spotifyApiRequest<SpotifyTopItemsRequestResult>(request, "https://api.spotify.com/v1/me/top/tracks?time_range=short_term");
}

export const getTopArtists = async (request: Request) => {
    return await spotifyApiRequest<SpotifyTopItemsRequestResult>(request, "https://api.spotify.com/v1/me/top/artists?time_range=short_term");

}