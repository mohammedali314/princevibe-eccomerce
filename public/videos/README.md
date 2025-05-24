# Videos Directory

This directory contains the video assets for the Hero section of the PrinceVibe luxury watch store.

## Current Videos:
- `banner.MP4` - Primary luxury timepieces video
- `bannervid.mp4` - Smart collection showcase video  
- `banner3.webm` - Signature series exclusive video

## Usage:
Videos are referenced in the Hero component as `/videos/filename.ext` and are served directly from the public directory.

## Adding New Videos:
1. Place video files in this `public/videos/` directory
2. Update the Hero component to reference the new video path
3. Ensure video files are optimized for web (< 10MB recommended)

## Supported Formats:
- MP4 (recommended for compatibility)
- WebM (good compression, modern browsers)
- MOV (if needed, though MP4 preferred)

## Notes:
- Videos in this directory are NOT bundled with the app
- They're served as static assets from the public folder
- This prevents GitHub push issues with large files
- Videos should be optimized for web delivery 