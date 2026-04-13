Pre-deployment checklist for this project:
1. Run `npm run lint` in both portfolio/ and mail-server/ (zero warnings)
2. Run `npm test` in mail-server/
3. Confirm VERSION and CHANGELOG are updated
4. Check that no .env.secret or .env.config files are staged in git
5. Verify docker-compose.yml secret/config references are correct
Report any failures before proceeding.