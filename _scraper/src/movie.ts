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

  static buildFromEmbyItem(item: any): Movie | null {
    if (!this.checkEmbyItem(item)) {
      return null;
    }
    const movie = new Movie();
    movie.id = item.Id;
    movie.imdbId = item.ProviderIds.IMDB;
    movie.title = item.Name;
    movie.originalTitle = item.OriginalTitle;
    movie.studio = this.normalizeStudio(item.Studios[0].Name);
    movie.criticRating = item.CriticRating ? parseFloat(item.CriticRating) / 10 : -1;
    movie.genres = item.Genres;
    movie.image = item.ImageTags.Primary;
    movie.videoFormat = item.MediaSources[0].MediaStreams.find((stream: any) => stream.Type === "Video").DisplayTitle;
    movie.created = new Date(item.DateCreated.replace(/(\.\d{3})\d*Z$/, "$1Z")).getTime();
    return movie;
  }

  static checkEmbyItem(item: any): boolean {
    if (
      !item ||
      typeof item !== "object" ||
      !item.Name ||
      typeof item.Name !== "string" ||
      !item.ProductionYear ||
      typeof item.ProductionYear !== "number"
    ) {
      console.log("❌ Invalid item");
      return false;
    }

    let isValid = true;
    const itemLabel = `${item.Name} (${item.ProductionYear})`;
    if (!item.Id) {
      console.log(`❌ Item '${itemLabel}' does not have a valid ID`);
      isValid = false;
    }
    if (!item.ProviderIds?.IMDB) {
      console.log(`❌ Item '${itemLabel}' does not have a valid IMDB ID`);
      isValid = false;
    }
    if (!item.OriginalTitle) {
      console.log(`❌ Item '${itemLabel}' does not have an Original Title`);
      isValid = false;
    }
    if (!Array.isArray(item.Genres) || !item.Genres.every((genre: any) => typeof genre === "string")) {
      console.log(`❌ Item '${itemLabel}' does not have valid Genres`);
      isValid = false;
    }
    if (!Array.isArray(item.Studios) || !item.Studios[0]?.Name || typeof item.Studios[0].Name !== "string") {
      console.log(`❌ Item '${itemLabel}' does not have a valid Studio`);
      isValid = false;
    }
    if (!item.ImageTags?.Primary || typeof item.ImageTags.Primary !== "string") {
      console.log(`❌ Item '${itemLabel}' does not have a valid Image Tag`);
      isValid = false;
    }
    if (
      !Array.isArray(item.MediaSources) ||
      !item.MediaSources[0]?.MediaStreams ||
      !Array.isArray(item.MediaSources[0].MediaStreams)
    ) {
      console.log(`❌ Item '${itemLabel}' does not have valid Media Streams`);
      isValid = false;
    }
    const videoStream = item.MediaSources[0].MediaStreams.find((stream: any) => stream.Type === "Video");
    if (!videoStream || !videoStream.DisplayTitle || typeof videoStream.DisplayTitle !== "string") {
      console.log(`❌ Item '${itemLabel}' does not have a valid Video Stream`);
      isValid = false;
    }
    if (!item.DateCreated || typeof item.DateCreated !== "string") {
      console.log(`❌ Item '${itemLabel}' does not have a valid Created Date`);
      isValid = false;
    }
    return isValid;
  }

  static normalizeStudio(studio: string): string {
    if (studio.includes("Metro-Goldwyn-Mayer") || studio.includes("MGM")) return "Metro-Goldwyn-Mayer";
    if (studio.includes("Warner Bros")) return "Warner Bros. Pictures";
    if (studio.includes("20th Century Fox") || studio.includes("Twentieth Century Fox")) return "20th Century Studios";
    return studio;
  }

  static fillWithTmdbItem(movie: Movie, item: any): Movie | null {
    if (!this.checkTmdbItem(item)) {
      return null;
    }
    movie.year = parseInt(item.release_date.split("-")[0], 10);
    movie.duration = item.runtime;
    movie.overview = item.overview;
    movie.audienceRating = item.vote_average;
    movie.countries = item.production_countries.map((country: any) => country.iso_3166_1);
    movie.actors = item.credits.cast.slice(0, 5).map((actor: any) => actor.name);
    movie.directors = item.credits.crew
      .filter((crew: any) => crew.job === "Director")
      .map((director: any) => director.name)
      .slice(0, 5);
    return movie;
  }

  static checkTmdbItem(item: any): boolean {
    if (
      !item ||
      typeof item !== "object" ||
      !item.title ||
      typeof item.title !== "string" ||
      !item.release_date ||
      typeof item.release_date !== "string"
    ) {
      console.log("❌ Invalid TMDB item");
      return false;
    }
    const year = parseInt(item.release_date.split("-")[0], 10);
    if (isNaN(year)) {
      console.log("❌ Invalid TMDB item");
      return false;
    }

    let isValid = true;
    const itemLabel = `${item.title} (${year})`;
    if (!item.runtime || typeof item.runtime !== "number") {
      console.log(`❌ TMDB item '${itemLabel}' does not have a valid Runtime`);
      isValid = false;
    }
    if (!item.overview || typeof item.overview !== "string") {
      console.log(`❌ TMDB item '${itemLabel}' does not have a valid Overview`);
      isValid = false;
    }
    if (!item.vote_average || typeof item.vote_average !== "number") {
      console.log(`❌ TMDB item '${itemLabel}' does not have a valid Vote Average`);
      isValid = false;
    }
    if (
      !Array.isArray(item.production_countries) ||
      item.production_countries.some(
        (country: any) => typeof country.iso_3166_1 !== "string" || country.iso_3166_1.length !== 2
      )
    ) {
      console.log(`❌ TMDB item '${itemLabel}' does not have valid Production Countries`);
      isValid = false;
    }
    if (
      !Array.isArray(item.credits?.cast) ||
      item.credits.cast.some((actor: any) => !actor.name || typeof actor.name !== "string")
    ) {
      console.log(`❌ TMDB item '${itemLabel}' does not have valid Cast`);
      isValid = false;
    }
    if (
      !Array.isArray(item.credits?.crew) ||
      item.credits.crew.some((crew: any) => !crew.name || typeof crew.name !== "string") ||
      !item.credits.crew.some((crew: any) => crew.job === "Director")
    ) {
      console.log(`❌ TMDB item '${itemLabel}' does not have valid Crew`);
      isValid = false;
    }
    return isValid;
  }

  static fillWithOmdbItem(movie: Movie, item: any): Movie {
    if (!this.checkOmdbItem(item)) {
      movie.criticRating = -2;
      return movie;
    }
    const rottenRating = item.Ratings.find((rating: any) => rating.Source === "Rotten Tomatoes");
    movie.criticRating = parseInt(rottenRating.Value, 10) / 10;
    return movie;
  }

  static checkOmdbItem(item: any): boolean {
    if (
      !item ||
      typeof item !== "object" ||
      !item.Title ||
      typeof item.Title !== "string" ||
      !item.Year ||
      typeof item.Year !== "string"
    ) {
      console.log("❌ Invalid OMDB item");
      return false;
    }

    let isValid = true;
    const itemLabel = `${item.Title} (${item.Year})`;
    let criticRating = -1;
    if (Array.isArray(item.Ratings)) {
      const rottenRating = item.Ratings.find((rating: any) => rating.Source === "Rotten Tomatoes");
      if (rottenRating && rottenRating.Value) {
        criticRating = parseInt(rottenRating.Value, 10);
      }
    }
    if (criticRating < 0 || criticRating > 100 || isNaN(criticRating)) {
      console.log(`❌ OMDB item '${itemLabel}' does not have a valid Critic Rating`);
      isValid = false;
    }
    return isValid;
  }
}
