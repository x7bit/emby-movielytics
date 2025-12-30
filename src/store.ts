import moviesJson from "@/assets/movies.json";
import { Movie } from "@/entity/movie";
import { reactive } from "vue";

type SortType = "title" | "year" | "critic" | "audience";

type LabelsAndCounts = {
  labels: string[];
  counts: number[];
};

const movies = moviesJson as Movie[];

const _decadeLabelsAndCounts = (): LabelsAndCounts => {
  const map = new Map<string, number>();
  movies.forEach(movie => {
    const decade = Movie.decadeLabel(movie.year);
    map.set(decade, (map.get(decade) ?? 0) + 1);
  });

  const labels: string[] = [];
  const decades = Array.from(map.keys()).map(label => parseInt(label));
  const minDecade = Math.min(...decades);
  const maxDecade = Math.max(...decades);
  for (let decade = minDecade; decade <= maxDecade; decade += 10) {
    labels.push(`${decade}s`);
  }

  const counts: number[] = labels.map(decade => map.get(decade) ?? 0);

  return { labels, counts };
};

const _genreLabelsAndCounts = (): LabelsAndCounts => {
  const map = new Map<string, number>();
  movies.forEach(movie => {
    movie.genres.forEach(genreRaw => {
      const genre = Movie.genreLabel(genreRaw);
      map.set(genre, (map.get(genre) ?? 0) + 1);
    });
  });

  const labels: string[] = Array.from(map.keys())
    .filter(genre => (map.get(genre) ?? 0) >= 10)
    .sort();

  const counts: number[] = labels.map(genre => map.get(genre) ?? 0);

  return { labels, counts };
};

export const store = reactive({
  movies: [...movies].sort(Movie.sortByTitle),
  latestMovies: [...movies].sort((a, b) => Movie.sortByCreated(b, a)).slice(0, 10),
  totalMovies: movies.length,
  totalDuration: movies.reduce((sum, movie) => sum + movie.duration, 0),
  decades: _decadeLabelsAndCounts(),
  genres: _genreLabelsAndCounts(),
  search: "",
  sortType: "title" as SortType,
  sortAsc: true,
  decadeFilter: undefined as string | undefined,
  genreFilter: undefined as string | undefined,
});

export const sortMovies = (type: SortType): void => {
  let asc = true;
  switch (type) {
    case "title":
      asc = type === store.sortType ? !store.sortAsc : true;
      store.movies.sort((a, b) => (asc ? Movie.sortByTitle(a, b) : Movie.sortByTitle(b, a)));
      break;
    case "year":
      asc = type === store.sortType ? !store.sortAsc : false;
      store.movies.sort((a, b) => (asc ? Movie.sortByYear(a, b) : Movie.sortByYear(b, a)));
      break;
    case "critic":
      asc = type === store.sortType ? !store.sortAsc : false;
      store.movies.sort((a, b) => (asc ? Movie.sortByCriticRating(a, b) : Movie.sortByCriticRating(b, a)));
      break;
    case "audience":
      asc = type === store.sortType ? !store.sortAsc : false;
      store.movies.sort((a, b) => (asc ? Movie.sortByAudienceRating(a, b) : Movie.sortByAudienceRating(b, a)));
      break;
  }
  store.sortType = type;
  store.sortAsc = asc;
};

export const getSortIcon = (type: SortType): string => {
  if (store.sortType !== type) return "unfold_more";
  return store.sortAsc ? "keyboard_arrow_up" : "keyboard_arrow_down";
};
