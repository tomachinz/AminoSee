COMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1100x880 --seconds-per-day 0.128 --auto-skip-seconds 0.1 --max-file-lag 0.01 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 14 --key --bloom-multiplier 0.125 --bloom-intensity 0.125 --background 012345  -e 0.75 --title 'github.com/tomachinz/AminoSee'"
echo About to run...:
echo $COMMAND
sleep 1
eval $COMMAND
echo About to encode the video soon, using this...:
# ENCODE="$COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4"
ENCODE="$COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264  -b:v 2600k  -preset slow -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4"
echo $ENCODE
sleep 5
eval $ENCODE &
