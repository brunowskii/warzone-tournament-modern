# OBS Overlays

Use the URLs below as Browser Sources in OBS. Append parameters as needed.

Base route (App Router):
- /en/obs/leaderboard?tournamentId=YOUR_ID

Parameters:
- tournamentId: string (required)
- view: leaderboard | fragger (default: leaderboard)
- theme: dark | light | neon (default: dark)
- compact: true | false (default: false)
- refresh: ms number (default: 5000)

Examples:
- /en/obs/leaderboard?tournamentId=abc123&theme=neon&compact=true
- /en/obs/leaderboard?tournamentId=abc123&view=fragger

Tips:
- Set OBS Browser Source width/height to your canvas (e.g., 1920x1080).
- Enable hardware acceleration in OBS for smooth animation.
- Keep refresh >= 3000ms to reduce API load.
