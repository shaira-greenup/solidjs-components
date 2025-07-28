set shell := ["zsh", "-cu"]

init:
    pnpm install
    python ./scripts/make_db.py

run:
    DB_PATH=./notes.sqlite pnpm run dev -- --host
