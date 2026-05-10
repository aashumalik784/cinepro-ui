import type { MovieDetails, TVSeriesDetails, TVEpisode } from "@lorenzopant/tmdb"
import type { UnifiedMedia } from "../types/media.types"
import type { PlaybackBundle } from "../types/player.types"
import { getTMDBImageUrl } from "../utils/url"

export function mapMovieToUnified(movie: MovieDetails, playback: PlaybackBundle): UnifiedMedia {
    return {
        id: movie.id.toString(),
        type: "movie",
        title: movie.title,
        overview: movie.overview?? "No overview available.",
        posterUrl: getTMDBImageUrl(movie.poster_path, "medium"),
        backdropUrl: getTMDBImageUrl(movie.backdrop_path, "large"),
        releaseDate: movie.release_date,
        runtime: movie.runtime,
        playback,
    }
}

export function mapTvEpisodeToUnified(show: TVSeriesDetails, episode: TVEpisode, playback: PlaybackBundle): UnifiedMedia {
    return {
        id: show.id.toString(),
        type: "tv",
        title: show.name,
        overview: episode.overview || show.overview || "No overview available.",
        posterUrl: getTMDBImageUrl(show.poster_path, "medium"),
        backdropUrl: getTMDBImageUrl(episode.still_path || show.backdrop_path, "large"),
        releaseDate: episode.air_date,
        seasonNumber: episode.season_number,
        episodeNumber: episode.episode_number,
        episodeTitle: episode.name,
        playback,
    }
}
