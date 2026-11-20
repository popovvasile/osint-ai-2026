"""SHA-256 для артефактів волта (Протокол Берклі).

Для кожної нотатки в 02-Артефакти, де заповнено поле `файл`:
- рахує SHA-256 локальної копії файлу;
- якщо поле sha256 порожнє: записує хеш і час обчислення,
  а етап «знайдено» змінює на «збережено»;
- якщо хеш уже записаний і не збігається: нічого не перезаписує,
  лише повідомляє про розбіжність (файл змінено після збереження).

--verify: лише перевіряє збереження, нотатки не змінює.

Запуск з папки архіву (Windows, macOS, Linux; Python 3.10+):
    python scripts/hash_artifacts.py "Приклад-Каховська-ГЕС" --verify
    python scripts/hash_artifacts.py "Волт-для-ДЗ"

Без шляху скрипт працює з поточною папкою.
Без Python той самий хеш дає: Get-FileHash (Windows), shasum -a 256 (macOS), sha256sum (Linux).
"""
import argparse
import hashlib
import re
import sys
from datetime import datetime
from pathlib import Path

NOTES_DIR = "02-Артефакти"
ATTACH_DIR = "attachments"


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def field_re(name: str) -> re.Pattern:
    return re.compile(rf"^{re.escape(name)}:[ \t]*(.*)$", re.M)


def get_field(fm: str, name: str) -> str | None:
    m = field_re(name).search(fm)
    if not m:
        return None
    v = m.group(1).strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        v = v[1:-1]
    return v


def set_field(fm: str, name: str, value: str) -> str:
    line = f'{name}: "{value}"'
    pat = field_re(name)
    if pat.search(fm):
        return pat.sub(lambda _m: line, fm, count=1)
    return fm + "\n" + line


def resolve(vault: Path, raw: str) -> Path | None:
    """`attachments/a.mp4`, `a.mp4`, `[[a.mp4]]` або `![[a.mp4|підпис]]` → шлях у волті."""
    name = raw.strip().lstrip("!").strip()
    if name.startswith("[[") and name.endswith("]]"):
        name = name[2:-2].split("|")[0]
    if not name:
        return None
    root = vault.resolve()
    for cand in (vault / name, vault / ATTACH_DIR / name):
        p = cand.resolve()
        if p.is_file() and root in p.parents:
            return p
    return None


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("vault", type=Path, nargs="?", default=Path("."), help="папка волта (за замовчуванням — поточна)")
    ap.add_argument("--verify", action="store_true", help="лише перевірити, нічого не змінювати")
    args = ap.parse_args()

    if not (args.vault / NOTES_DIR).is_dir():
        print(f"У «{args.vault}» немає папки {NOTES_DIR}. Вкажіть папку волта першим аргументом.")
        return 2
    notes = sorted((args.vault / NOTES_DIR).glob("*.md"))
    if not notes:
        print(f"У {args.vault / NOTES_DIR} немає нотаток.")
        return 0

    problems = 0
    for note in notes:
        with open(note, encoding="utf-8", newline="") as f:
            raw = f.read()
        crlf = "\r\n" in raw
        text = raw.replace("\r\n", "\n")
        if not text.startswith("---\n") or (end := text.find("\n---", 3)) == -1:
            print(f"{note.stem:<44} пропущено: немає властивостей")
            continue
        fm, rest = text[:end], text[end:]

        file_value = get_field(fm, "файл") or ""
        if not file_value:
            print(f"{note.stem:<44} поле «файл» порожнє — немає локальної копії")
            continue
        path = resolve(args.vault, file_value)
        if path is None:
            print(f"{note.stem:<44} ФАЙЛ НЕ ЗНАЙДЕНО: {file_value}")
            problems += 1
            continue

        digest = sha256_of(path)
        stored = (get_field(fm, "sha256") or "").lower()

        if stored:
            if stored == digest:
                print(f"{note.stem:<44} OK        {digest[:16]}…")
            else:
                print(f"{note.stem:<44} РОЗБІЖНІСТЬ: записано {stored[:16]}…, зараз {digest[:16]}…")
                problems += 1
            continue

        if args.verify:
            print(f"{note.stem:<44} хеш не записано (зараз {digest[:16]}…)")
            problems += 1
            continue

        fm = set_field(fm, "sha256", digest)
        fm = set_field(fm, "хеш_обчислено", datetime.now().astimezone().isoformat(sep=" ", timespec="seconds"))
        if get_field(fm, "етап") == "знайдено":
            fm = set_field(fm, "етап", "збережено")
        out = fm + rest
        if crlf:
            out = out.replace("\n", "\r\n")
        with open(note, "w", encoding="utf-8", newline="") as f:
            f.write(out)
        print(f"{note.stem:<44} записано  {digest[:16]}…  ({path.name}, {path.stat().st_size:,} байт)")

    if problems:
        print(f"\nПроблем: {problems}. Ланцюг збереження неповний.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
