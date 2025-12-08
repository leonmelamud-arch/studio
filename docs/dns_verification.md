# DNS Verification for GitHub Pages

To verify your custom domain `ai-know.org` for GitHub Pages, you need to add the following DNS record at your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare).

**Record Type:** `TXT`
**Host/Name:** `_github-pages-challenge-leonmelamud-arch`
**Value/Content:** `31c809ba88a115ab4d2c76771da834`
**TTL:** Default (e.g., 3600 or Auto)

## Instructions:
1. Log in to your domain provider's dashboard.
2. Navigate to the DNS Management / DNS Settings page for `ai-know.org`.
3. Add a new record with the details above.
4. Wait for propagation (usually a few minutes, but can take up to 24h).
5. Go back to GitHub Repository Settings > Pages and verify the domain.
