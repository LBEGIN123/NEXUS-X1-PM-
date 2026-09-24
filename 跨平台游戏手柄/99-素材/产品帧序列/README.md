# Frame sequence

Drop the extracted frames of the generated take in this folder and the page will
use them automatically instead of the eight still images.

## Option A - manifest with an explicit file list

```json
{
  "fps": 60,
  "files": ["f_0001.webp", "f_0002.webp", "f_0003.webp"]
}
```

## Option B - manifest with a pattern

```json
{
  "fps": 60,
  "count": 600,
  "pad": 4,
  "pattern": "f_%04d.webp"
}
```

## Generating the frames

```bash
# 1. interpolate to 60 fps
ffmpeg -i in.mp4 -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" out60.mp4

# 2. export a WebP sequence
ffmpeg -i out60.mp4 -vf "scale=1920:-2" -c:v libwebp -quality 78 frames/f_%04d.webp
```

The page is deliberately loaded through plain `<img>` tags, so it also works
when the folder is opened straight from disk. When no manifest is present it
falls back to the eight reference stills and cross-fades between them using the
same camera storyboard as the video prompt.
