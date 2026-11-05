import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const gamesDir = path.join(root, "public", "games");
const outFile = path.join(root, "src", "data", "games.generated.json");
const strict = process.argv.includes("--strict");

const REQUIRED = [
  "slug",
  "title",
  "description",
  "discipline",
  "instructions",
  "entry",
];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GRADE = /^\d{1,2}º$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const warnings = [];
const errors = [];
const warn = (message) => warnings.push(message);
const fail = (message) => errors.push(message);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSafeRelative(value) {
  return (
    isNonEmptyString(value) &&
    !value.startsWith("/") &&
    !value.includes("..") &&
    !value.includes("\\")
  );
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let entries = [];
  try {
    entries = await readdir(gamesDir, { withFileTypes: true });
  } catch {
    warn("public/games ainda não existe. Catálogo vazio.");
  }

  const folders = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const games = [];

  for (const folder of folders) {
    const folderDir = path.join(gamesDir, folder);
    const manifestPath = path.join(folderDir, "manifest.json");

    let manifest;
    try {
      manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    } catch (error) {
      if (error && error.code === "ENOENT") {
        warn(
          `${folder}: sem manifest.json na raiz; pasta ignorada. ` +
            "Variantes e rascunhos devem ficar em lab/."
        );
      } else {
        fail(`${folder}: manifest.json inválido (${error.message}).`);
      }
      continue;
    }

    if (!isPlainObject(manifest)) {
      fail(`${folder}: o manifest precisa ser um objeto JSON.`);
      continue;
    }

    if (manifest.status === "draft") {
      console.log(`[sync-games] ${folder}: rascunho, fora do catálogo.`);
      continue;
    }

    const errorCount = errors.length;

    for (const field of REQUIRED) {
      if (!isNonEmptyString(manifest[field])) {
        fail(`${folder}: campo obrigatório "${field}" ausente ou vazio.`);
      }
    }

    if (!SLUG.test(folder)) {
      fail(`${folder}: o nome da pasta deve usar minúsculas, números e hífen.`);
    }

    if (manifest.slug !== folder) {
      fail(
        `${folder}: o slug do manifest ("${manifest.slug}") precisa ser igual ao nome da pasta.`
      );
    }

    if (!Array.isArray(manifest.grades) || manifest.grades.length === 0) {
      fail(`${folder}: "grades" precisa ser uma lista com pelo menos uma série.`);
    } else if (!manifest.grades.every((grade) => GRADE.test(grade))) {
      fail(`${folder}: "grades" deve usar o formato "6º", "7º" etc.`);
    }

    if (!Number.isFinite(Number(manifest.duration))) {
      fail(`${folder}: "duration" precisa ser um número em minutos.`);
    } else {
      const duration = Number(manifest.duration);
      if (duration < 1 || duration > 30) {
        fail(`${folder}: "duration" deve ficar entre 1 e 30 minutos.`);
      }
    }

    if (isNonEmptyString(manifest.title) && manifest.title.length > 60) {
      fail(`${folder}: "title" deve ter no máximo 60 caracteres.`);
    }

    if (isNonEmptyString(manifest.description) && manifest.description.length > 160) {
      fail(`${folder}: "description" deve ter no máximo 160 caracteres.`);
    }

    if (isNonEmptyString(manifest.instructions) && manifest.instructions.length > 240) {
      fail(`${folder}: "instructions" deve ter no máximo 240 caracteres.`);
    }

    if (manifest.tags !== undefined && !Array.isArray(manifest.tags)) {
      warn(`${folder}: "tags" deveria ser uma lista; o valor foi ignorado.`);
    }

    if (manifest.featured !== undefined && typeof manifest.featured !== "boolean") {
      warn(`${folder}: "featured" deveria ser true ou false.`);
    }

    if (manifest.order !== undefined && !Number.isFinite(Number(manifest.order))) {
      warn(`${folder}: "order" deveria ser um número.`);
    }

    if (manifest.createdAt && !DATE.test(manifest.createdAt)) {
      warn(`${folder}: "createdAt" deveria estar no formato AAAA-MM-DD.`);
    }

    if (manifest.status && manifest.status !== "published" && manifest.status !== "draft") {
      warn(`${folder}: "status" desconhecido ("${manifest.status}").`);
    }

    if (manifest.author === "Seu nome" || manifest.authorClass === "Sua turma") {
      warn(`${folder}: créditos de exemplo no manifest. Preencha autor e turma.`);
    }

    const entry = manifest.entry;
    if (isSafeRelative(entry)) {
      if (!(await exists(path.join(folderDir, entry)))) {
        fail(`${folder}: o arquivo de entrada "${entry}" não existe.`);
      }
    } else if (isNonEmptyString(entry)) {
      fail(`${folder}: "entry" não pode ser absoluto nem conter "..".`);
    }

    const cover = isNonEmptyString(manifest.cover) ? manifest.cover : "cover.svg";
    if (isSafeRelative(cover)) {
      if (!(await exists(path.join(folderDir, cover)))) {
        fail(`${folder}: a capa "${cover}" não existe.`);
      }
    } else {
      fail(`${folder}: "cover" não pode ser absoluto nem conter "..".`);
    }

    if (errors.length > errorCount) {
      continue;
    }

    games.push({
      slug: manifest.slug,
      title: manifest.title,
      author: isNonEmptyString(manifest.author)
        ? manifest.author
        : "Estudante do Vicente Rijo",
      authorClass: isNonEmptyString(manifest.authorClass) ? manifest.authorClass : "",
      discipline: manifest.discipline,
      grades: manifest.grades,
      tags: Array.isArray(manifest.tags) ? manifest.tags : [],
      description: manifest.description,
      instructions: manifest.instructions,
      duration: Number(manifest.duration) || 5,
      version: isNonEmptyString(manifest.version) ? manifest.version : "1.0.0",
      entry: manifest.entry,
      entryUrl: `/games/${manifest.slug}/${manifest.entry}`,
      coverUrl: `/games/${manifest.slug}/${cover}`,
      featured: Boolean(manifest.featured),
      order: Number(manifest.order) || 0,
      createdAt: isNonEmptyString(manifest.createdAt) ? manifest.createdAt : "",
    });
  }

  if (warnings.length > 0) {
    console.warn("\n[sync-games] Avisos:\n");
    for (const message of warnings) console.warn(` - ${message}`);
  }

  if (errors.length > 0) {
    console.error("\n[sync-games] Corrija os manifests abaixo:\n");
    for (const message of errors) console.error(` - ${message}`);
    if (strict) process.exit(1);
    console.warn(
      "\n[sync-games] Modo desenvolvimento: as pastas com erro foram ignoradas. " +
        "Use --strict para bloquear o build."
    );
  }

  games.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title, "pt-BR");
  });

  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, `${JSON.stringify(games, null, 2)}\n`, "utf8");

  console.log(`[sync-games] ${games.length} jogo(s) no catálogo.`);
}

main().catch((error) => {
  console.error("[sync-games] Falha inesperada:", error);
  process.exit(1);
});
