export class Movie {
  id: string = "";
  imdbId: string = "";
  title: string = "";
  originalTitle: string = "";
  duration: number = 0;
  year: number = 0;
  studio: string = "";
  overview: string = "";
  criticRating: number = -1;
  audienceRating: number = -1;
  genres: string[] = [];
  actors: string[] = [];
  directors: string[] = [];
  countries: string[] = [];
  image: string | null = null;
  videoFormat: string = "";
  created: number = 0;

  static ratingLabel(rating: number): string {
    return rating >= 0 ? rating.toFixed(1) : "–";
  }

  static sortByTitle(a: Movie, b: Movie): number {
    const _a = a.title.replace(/^[^a-zA-Z0-9]+/, "").toLowerCase();
    const _b = b.title.replace(/^[^a-zA-Z0-9]+/, "").toLowerCase();
    if (_a < _b) return -1;
    if (_a > _b) return 1;
    return 0;
  }

  static sortByYear(a: Movie, b: Movie): number {
    return a.year - b.year;
  }

  static sortByCriticRating(a: Movie, b: Movie): number {
    return a.criticRating - b.criticRating;
  }

  static sortByAudienceRating(a: Movie, b: Movie): number {
    return a.audienceRating - b.audienceRating;
  }
}
