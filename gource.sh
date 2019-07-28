COMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1100x880 --seconds-per-day 0.6936 --auto-skip-seconds 0.025 --max-file-lag 0.175 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 14 --key --bloom-multiplier 0.125 --bloom-intensity 0.125 --background 012345  -e 0.75 --title 'github.com/tomachinz/AminoSee'"
echo About to run...:
echo $COMMAND
sleep 1
eval $COMMAND
echo About to encode the video soon, using this...:
ENCODE="$COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4"
echo $ENCODE
sleep 15
eval $ENCODE

# eval $COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4


# --file-idle-time 30

# gource --camera-mode overview -960x540 --seconds-per-day 0.43 --auto-skip-seconds 0.15 --file-idle-time 30 --max-file-lag 0.2 --background-image src/public/WhitePaper_960px.png --logo src/public/funk-logo-140px.png  --font-size 14 --key  --bloom-multiplier 0.125 --bloom-intensity 0.25 --background 012345 --title 'tomachinz github commits' --frameless -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libvpx -b 10000K gource.webm



# gource -1280x720 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4

# gource --seconds-per-day 0.15 --title "AminoSee" -1280x720 --file-idle-time 0 --auto-skip-seconds 0.75 --multi-sampling --stop-at-end --highlight-users --hide filenames,mouse,progress --max-files 0 --background-colour 000000 --disable-bloom --font-size 24 --output-ppm-stream - --output-framerate 30 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -i src/public/aminosee_audio_logo-Q10.ogg -shortest -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 src/public/aminosee_audio_logo-Q10.ogg

# gource --path src_aminosee --seconds-per-day 0.15 --title "AminoSee" -1280x720 --file-idle-time 0 --auto-skip-seconds 0.75 --multi-sampling --stop-at-end --highlight-users --hide filenames,mouse,progress --max-files 0 --background-colour 000000 --disable-bloom --font-size 24 --output-ppm-stream - --output-framerate 30 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -i src/public/aminosee_audio_logo-Q10.ogg -shortest -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 src/public/aminosee_audio_logo-Q10.ogg

# gource --camera-mode overview -960x540 --seconds-per-day 0.63 --auto-skip-seconds 0.15 --file-idle-time 30 --max-file-lag 0.2 --background-image src/public/aminosee-promo-one-shot.png    --logo src/public/AminoSee_DNA_Viewer_ascii_logo_shot.jpg  --font-size 26 --key  --bloom-multiplier 0.25 --bloom-intensity 0.5  --background 012345 --title 'tomachinz commits to github.com/tomachinz/AminoSee' --frameless
