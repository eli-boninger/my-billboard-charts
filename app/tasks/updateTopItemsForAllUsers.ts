import { SpotifyTopItemsRequestResult, SpotifyTopResultItem } from "~/models/spotifyApiModels";
import { getTopArtistsByUserId, setAllArtistsUnranked, upsertTopArtist } from "~/models/topArtist.server";
import { getTopTracksByUserId, setAllTracksUnranked, upsertTopTrack } from "~/models/topTrack.server";
import { User, getAllSpotifyAuthorizedUsers } from "~/models/user.server"

export const updateTopItemsForAllUsers = async () => {
    console.info("********************************")
    console.info("Updating top items for all users")

    const users = await getAllSpotifyAuthorizedUsers();
    users.forEach(u => updateAllUserTopItems(u.id, u.spotifyRefreshToken))
}

const refreshAccessToken = async (refreshToken: User["spotifyRefreshToken"]) => {
    const params = new URLSearchParams({
        refresh_token: refreshToken,
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
            return resultJson?.access_token;
        }
    } catch (e) {
        console.error(e)
    }
}


const updateAllUserTopItems = async (id: User["id"], refreshToken: User["spotifyRefreshToken"]) => {
    const topTracks = await getTopTracksByUserId(id);
    const topArtists = await getTopArtistsByUserId(id)
    await setAllTracksUnranked(id);
    await setAllArtistsUnranked(id)

    let newTracksList: SpotifyTopResultItem[] = []
    let newArtistsList: SpotifyTopResultItem[] = []
    try {
        const refreshedToken = await refreshAccessToken(refreshToken);
        const tracksRes = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", { headers: { Authorization: `Bearer ${refreshedToken}`, }})
        const artistsRes = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term", { headers: { Authorization: `Bearer ${refreshedToken}`, }})
        newTracksList = (await tracksRes.json() as SpotifyTopItemsRequestResult)?.items
        newArtistsList = (await artistsRes.json() as SpotifyTopItemsRequestResult)?.items
    } catch (e) {
        console.error(e)
    }

    newTracksList.forEach((t, index) => {
        upsertTopTrack(t, index, id, topTracks.find(tt => tt.spotifyId === t.id)?.topTrackRanks[0]?.rank)
    })
    newArtistsList.forEach((a, index) => {
        upsertTopArtist(a, index, id, topArtists.find(ta => ta.spotifyId === a.id)?.topArtistRanks[0]?.rank)
    })
}