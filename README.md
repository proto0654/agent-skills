# agent-skills

Глобальные скиллы, правила и конфиги агентов с рабочей машины (Windows 11).
Собрано 2025-11-20. Секреты и креденшелы исключены.

## Что внутри

    skills/           14 личных скиллов (Claude / .agents — содержимое идентично)
    cursor-builtin/   27 встроенных скиллов Cursor
    codex/            config.toml и rules/ от Codex CLI
    providers/
      gemini/         настройки Gemini CLI
      opencode/       конфиг OpenCode
      grokbot/        настройки Grok Bot
      kiro/           настройки Kiro
      antigravity/    настройки Antigravity

## Личные скиллы

actualize, archify, code-audit, commit-message, debug-root-cause, docs-bootstrap,
existing-project, frontend-content-integration, gsap-flow, project-context,
qa-edge-cases, release-audit, safe-refactor

Каждый — папка с SKILL.md и, если нужно, references/.

## Как восстановить на машине

    # Claude Code
    cp -r skills/* ~/.claude/skills/

    # Codex
    cp -r skills/* ~/.codex/skills/

    # общий каталог агентов
    cp -r skills/* ~/.agents/skills/

## Что не попало в репозиторий

- сессии, кэш, логи, history (объём в гигабайтах, к скиллам не относится)
- auth.json, credentials, .env и прочие файлы с доступами
- расширения Cursor (2.4 ГБ)

## Источники на рабочей машине

    ~/.codex/{skills,rules,config.toml}
    ~/.claude/skills  (идентично ~/.agents/skills)
    ~/.cursor/skills-cursor
    ~/.gemini, ~/.config/opencode, ~/.grokbot, ~/.kiro, ~/.antigravity
