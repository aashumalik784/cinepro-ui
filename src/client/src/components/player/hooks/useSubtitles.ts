import { useMediaWatchContext } from "../providers/MediaWatchProvider"

export function useSubtitles() {
    const { state, selectSubtitle } = useMediaWatchContext()

    return {
        subtitles: state.media?.playback.subtitles || [],
        selectedSubtitle: state.media?.playback.selectedSubtitle,
        selectSubtitle,
    }
}
