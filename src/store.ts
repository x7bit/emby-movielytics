import moviesJson from "@/assets/movies.json";
import { Movie } from "@/entity/movie";
import i18n from "@/i18n";
import { reactive } from "vue";

type SortType = "title" | "year" | "critic" | "audience";

type KeyLabelCounts = {
  keys: string[];
  labels: string[];
  counts: number[];
};

type LabelCount = {
  label: string;
  count: number;
};

const movies = moviesJson as Movie[];

const _decadeKeysLabelsCounts = (): KeyLabelCounts => {
  const keyMap = new Map<string, number>();
  movies.forEach(movie => {
    const decade = Movie.decadeKey(movie.year);
    keyMap.set(decade, (keyMap.get(decade) ?? 0) + 1);
  });

  const keys: string[] = [];
  const labels: string[] = [];
  const counts: number[] = [];
  const decades = Array.from(keyMap.keys()).map(label => parseInt(label));
  const minDecade = Math.min(...decades);
  const maxDecade = Math.max(...decades);
  for (let decade = minDecade; decade <= maxDecade; decade += 10) {
    keys.push(`${decade}`);
    labels.push(`${decade}s`);
    counts.push(keyMap.get(`${decade}`) ?? 0);
  }

  return { keys, labels, counts };
};

const _genreKeyLabelCounts = (): KeyLabelCounts => {
  const keyMap = new Map<string, LabelCount>();
  movies.forEach(movie => {
    movie.genres.forEach(genreRaw => {
      const key = Movie.genreKey(genreRaw);
      const count = (keyMap.get(key)?.count ?? 0) + 1;
      const label = i18n.global.t(`genre.${key}`);
      keyMap.set(key, { label, count });
    });
  });

  const entries = Array.from(keyMap.entries())
    .filter(entry => entry[1].count >= 10)
    .sort((a, b) => a[1].label.localeCompare(b[1].label));

  return {
    keys: entries.map(entry => entry[0]),
    labels: entries.map(entry => entry[1].label),
    counts: entries.map(entry => entry[1].count),
  };
};

export const store = reactive({
  movies: [...movies].sort(Movie.sortByTitle),
  latestMovies: [...movies].sort((a, b) => Movie.sortByCreated(b, a)).slice(0, 10),
  totalMovies: movies.length,
  totalDuration: movies.reduce((sum, movie) => sum + movie.duration, 0),
  decades: _decadeKeysLabelsCounts(),
  genres: _genreKeyLabelCounts(),
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
