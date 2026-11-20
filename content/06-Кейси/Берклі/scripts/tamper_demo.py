"""Демо «підміни»: хеш ловить зміну навіть одного байта.

1. Робить резервну копію файлу.
2. Дописує в кінець файлу один пробіл.
3. Запускає hash_artifacts.py --verify — очікуємо «РОЗБІЖНІСТЬ».
4. Відновлює файл з резервної копії і перевіряє ще раз — очікуємо OK.

Запуск з папки архіву:
    python scripts/tamper_demo.py "Приклад-Каховська-ГЕС" "attachments/A-01 NORSAR.pdf"
"""
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def verify(vault: Path) -> None:
    subprocess.run([sys.executable, str(HERE / "hash_artifacts.py"), str(vault), "--verify"], check=False)


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    vault = Path(sys.argv[1])
    target = vault / sys.argv[2]
    if not target.is_file():
        print(f"Файл не знайдено: {target}")
        return 2
    backup = target.with_name(target.name + ".backup")
    shutil.copy2(target, backup)
    try:
        with open(target, "ab") as f:
            f.write(b" ")
        print(f"=== Дописали 1 байт у «{target.name}». Перевіряємо ланцюг:\n", flush=True)
        verify(vault)
    finally:
        shutil.copy2(backup, target)
        backup.unlink()
    print("\n=== Файл відновлено з резервної копії. Перевіряємо ще раз:\n", flush=True)
    verify(vault)
    return 0


if __name__ == "__main__":
    sys.exit(main())
