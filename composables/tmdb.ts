import type { Media, MediaType, PageResult, Person } from '../types'

const apiBaseUrl = '/api'
export async function fetchTMDB(
  url: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<any> {
  const defaultParams = {
    include_adult: false,
    without_genres: '27',
  }
  if (params.language == null) {
    const locale = useNuxtApp().$i18n.locale
    params.language = unref(locale)
  }

  return $fetch(url, {
    baseURL: `${apiBaseUrl}/tmdb`,
    params: { ...defaultParams, ...params },
  })
}

export function getMediaList(
  type: MediaType,
  query: string,
  page: number,
): Promise<PageResult<Media>> {
  return fetchTMDB(`${type}/${query}`, { page })
}

/**
 * Get trending
 */
export function getTrending(
  type: MediaType,
  page = 1,
): Promise<PageResult<Media>> {
  return fetchTMDB(`trending/${type}/week`, { page })
}

export function getMedia(type: MediaType, id: string | number): Promise<Media> {
  return fetchTMDB(`${type}/${id}`, {
    append_to_response:
      'videos,credits,images,external_ids,release_dates,combined_credits',
    include_image_language: 'en',
  })
}

/**
 * Get recommended
 */
export function getRecommendations(
  type: MediaType,
  id: string | number,
  page = 1,
): Promise<PageResult<Media>> {
  return fetchTMDB(`${type}/${id}/recommendations`, { page })
}

/**
 * Get genre list
 */
export function getGenreList(
  media: string,
): Promise<{ name: string; id: number }[]> {
  return fetchTMDB(`genre/${media}/list`).then((res) => res.genres)
}

/**
 * Discover media by genre
 */
export function getMediaByGenre(
  media: string,
  genre: string,
  page = 1,
): Promise<PageResult<Media>> {
  return fetchTMDB(`discover/${media}`, {
    with_genres: genre,
    page,
  })
}

/**
 * Search (searches movies, tv and people)
 */
export function searchShows(query: string, page = 1) {
  return fetchTMDB('search/multi', { query, page, include_adult: false })
}

/**
 * Get person (single)
 */
export function getPerson(id: string): Promise<Person> {
  return fetchTMDB(`person/${id}`, {
    append_to_response: 'images,combined_credits,external_ids',
    include_image_language: 'en',
  })
}
