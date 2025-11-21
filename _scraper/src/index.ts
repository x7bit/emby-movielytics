import "dotenv/config";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { Movie } from "./movie.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const OUTPUT_JSON_DIR = path.join(__dirname, "..", "..", "src", "assets");
const OUTPUT_JSON_FILE = path.join(OUTPUT_JSON_DIR, "movies.json");
const OUTPUT_THUMBS_DIR = path.join(__dirname, "..", "..", "public", "thumbs");
const EMBY_API_URL = process.env.EMBY_API_URL ?? "http://localhost:8096/emby/Items";
const EMBY_API_KEY = process.env.EMBY_API_KEY ?? "";
const EMBY_MOVIES_PARENT_ID = process.env.EMBY_MOVIES_PARENT_ID ?? "";
const EMBY_FIELDS = [
  "OriginalTitle",
  "ProductionYear",
  "Genres",
  "Studios",
  "MediaSources",
  "ImageTags",
  "CriticRating",
  "ProviderIds",
  "DateCreated",
];
const TMDB_API_URL = "https://api.themoviedb.org/3/movie";
const TMDB_API_KEY = process.env.TMDB_API_KEY ?? "";
const OMDB_API_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = process.env.OMDB_API_KEY ?? "";
const LANGUAGE = process.env.LANGUAGE ?? "";

const scrap = async () => {
  if (!checkEnvVariables()) return;
  const embyMovies = await fetchEmbyMovies();
  if (embyMovies.length === 0) return;
  const oldMoviesMap = readExistingMovies();
  const movies: Movie[] = [];
  const toDeleteImages: string[] = [];
  for (const embyMovie of embyMovies) {
    let toInsertMovie: Movie | null = null;
    if (oldMoviesMap.has(embyMovie.id)) {
      toInsertMovie = structuredClone(oldMoviesMap.get(embyMovie.id)!);
      if (embyMovie.criticRating >= 0 && embyMovie.criticRating !== toInsertMovie.criticRating) {
        toInsertMovie.criticRating = embyMovie.criticRating;
      }
      if (embyMovie.image && toInsertMovie.image && embyMovie.image !== toInsertMovie.image) {
        toDeleteImages.push(toInsertMovie.image);
        toInsertMovie.image = embyMovie.image;
      }
    } else {
      toInsertMovie = await fetchTmdbMovie(embyMovie);
    }
    if (toInsertMovie && toInsertMovie.criticRating === -1) {
      toInsertMovie = await fetchOmdbMovie(toInsertMovie);
    }
    if (toInsertMovie) {
      movies.push(toInsertMovie);
    }
  }
  writeMoviesJson(movies);
  writeMoviesThumbs(movies);
  deleteMoviesThumbs(toDeleteImages);
};

const checkEnvVariables = (): boolean => {
  let check = true;
  if (!EMBY_API_KEY) {
    console.error("❌ EMBY_API_KEY is not set in the environment variables.");
    check = false;
  }
  if (!EMBY_MOVIES_PARENT_ID) {
    console.error("❌ EMBY_MOVIES_PARENT_ID is not set in the environment variables.");
    check = false;
  }
  if (!TMDB_API_KEY) {
    console.error("❌ TMDB_API_KEY is not set in the environment variables.");
    check = false;
  }
  if (!OMDB_API_KEY) {
    console.error("❌ OMDB_API_KEY is not set in the environment variables.");
    check = false;
  }
  if (!LANGUAGE) {
    console.error("❌ LANGUAGE is not set in the environment variables.");
    check = false;
  }
  return check;
};

const readExistingMovies = (): Map<string, Movie> => {
  if (fs.existsSync(OUTPUT_JSON_FILE)) {
    try {
      const data = fs.readFileSync(OUTPUT_JSON_FILE, "utf-8");
      const movies = JSON.parse(data) as Movie[];
      return new Map(movies.map(movie => [movie.id, movie]));
    } catch (err) {
      console.warn("⚠️  Could not read movies.json:", err instanceof Error ? err.message : err);
    }
  }
  return new Map();
};

const fetchEmbyMovies = async (): Promise<Movie[]> => {
  const params = new URLSearchParams({
    api_key: EMBY_API_KEY,
    ParentId: EMBY_MOVIES_PARENT_ID,
    IncludeItemTypes: "Movie",
    Recursive: "true",
    Fields: EMBY_FIELDS.join(","),
  });
  const url = `${EMBY_API_URL}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const data = await res.json();
    const movies: Movie[] = [];
    data.Items?.forEach((item: any) => {
      const movie = Movie.buildFromEmbyItem(item);
      if (movie) movies.push(movie);
    });
    return movies;
  } catch (err) {
    console.error("❌ Error getting movies from Emby:", err instanceof Error ? err.message : err);
    return [];
  }
};

const fetchTmdbMovie = async (movie: Movie): Promise<Movie | null> => {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: LANGUAGE,
    append_to_response: "credits",
  });
  const url = `${TMDB_API_URL}/${movie.imdbId}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const item = await res.json();
    const completedMovie = Movie.fillWithTmdbItem(structuredClone(movie), item);
    if (completedMovie) {
      console.log(`✅ ${completedMovie.title} (${completedMovie.year}) completed with TMDB`);
    }
    return completedMovie;
  } catch (err) {
    console.error(
      `❌ Error getting data from TMDB for ${movie.title} (${movie.year}):`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
};

const fetchOmdbMovie = async (movie: Movie): Promise<Movie | null> => {
  const params = new URLSearchParams({ apikey: OMDB_API_KEY, i: movie.imdbId });
  const url = `${OMDB_API_URL}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const item = await res.json();
    const completedMovie = Movie.fillWithOmdbItem(structuredClone(movie), item);
    if (completedMovie.criticRating >= 0) {
      console.log(`✅ ${completedMovie.title} (${completedMovie.year}) completed with OMDB`);
    }
    return completedMovie;
  } catch (err) {
    console.error(
      `❌ Error getting data from OMDB for ${movie.title} (${movie.year}):`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
};

const writeMoviesJson = (movies: Movie[]): void => {
  if (!fs.existsSync(OUTPUT_JSON_DIR)) fs.mkdirSync(OUTPUT_JSON_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(movies, null, 2));
  console.log(`✅ Movies saved in: ${OUTPUT_JSON_FILE}`);
};

const writeMoviesThumbs = async (movies: Movie[]): Promise<void> => {
  if (!fs.existsSync(OUTPUT_THUMBS_DIR)) fs.mkdirSync(OUTPUT_THUMBS_DIR, { recursive: true });

  let skipCount = 0;
  for (const movie of movies) {
    if (movie.image) {
      const thumbFileName = `${movie.image}.jpg`;
      const thumbFilePath = path.join(OUTPUT_THUMBS_DIR, `${movie.image}.jpg`);
      const thumbUrl = `${EMBY_API_URL}/${movie.id}/Images/Primary?tag=${movie.image}&api_key=${EMBY_API_KEY}`;

      if (fs.existsSync(thumbFilePath)) {
        skipCount++;
        continue;
      }

      try {
        const res = await fetch(thumbUrl);
        if (!res.ok) {
          console.warn(`⚠️  Could not download image from ${movie.title} (${movie.year}): ${res.statusText}`);
          continue;
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await sharp(buffer)
          .resize(320, 480, { fit: "cover", position: "entropy" })
          .jpeg({ quality: 80 })
          .toFile(thumbFilePath);

        console.log(`🖼️  Image of ${movie.title} (${movie.year}) resized and saved: ${thumbFileName}`);
      } catch (err) {
        console.error(
          `❌ Error processing image of ${movie.title} (${movie.year}):`,
          err instanceof Error ? err.message : err
        );
      }
    } else {
      console.warn(`⚠️  Movie without image: ${movie.title} (${movie.year})`);
      skipCount++;
    }
  }
  if (skipCount > 0) {
    console.log(`⚠️  Images from ${skipCount} movies were omitted.`);
  }
};

const deleteMoviesThumbs = async (images: string[]): Promise<void> => {
  let deletedCount = 0;
  for (const image of images) {
    const thumbFilePath = path.join(OUTPUT_THUMBS_DIR, `${image}.jpg`);
    if (fs.existsSync(thumbFilePath)) {
      fs.unlinkSync(thumbFilePath);
      deletedCount++;
    }
  }
  if (deletedCount > 0) {
    console.log(`🗑️  Images from ${deletedCount} movies were deleted.`);
  }
};

scrap();
