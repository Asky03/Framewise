# Security checklist

- Never place private API keys in client components.
- Keep secrets in local `.env` files and never commit them.
- Validate and sanitize any future user-generated content.
- Keep dependencies updated and run `npm audit`.
- Add authentication and rate limiting only when future server features require them.
- Use properly licensed images, fonts, icons, and camera references.
- Ask for permission before publishing user-submitted photographs.
