OUTPUTFILE="src/public/gource.mp4"
# COMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1100x880 --seconds-per-day 0.2 --auto-skip-seconds 0.1 --max-file-lag 0.01 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 14 --key --bloom-multiplier 0.125 --bloom-intensity 0.125 --background 012345  -e 0.75 --title 'github.com/tomachinz/AminoSee'"
COMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1440x960 --seconds-per-day 0.25 --auto-skip-seconds 0.1 --max-file-lag 0.1 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 14 --key --bloom-multiplier 0.321 --bloom-intensity 4 --background 012345  -e 0.75 --title 'github.com/tomachinz/AminoSee'"
echo About to run...:
echo $COMMAND
sleep 1
eval $COMMAND
echo About to encode the video soon, using this...:
# ENCODE="$COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4"
ENCODE="$COMMAND -o - | ffmpeg -probesize 63M  -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264  -b:v 1600k  -preset slow -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 $OUTPUTFILE"
echo $ENCODE
sleep 5
eval $ENCODE

#
# -i /Volumes/13xOLDSKOOL/Users/tom/Projects\ OLDSKOOL/Album2\ The\ Atkinson\ Diet\ 13inch/Mechanoid\ Rain/Bounces/Mechanoid_Rain-18Jan2019_Version.wav -filter_complex 'anullsrc=channel_layout=mono:sample_rate=8000[a]'
#   -map 0 -map '[a]' -c:v copy -c:a pcm_alaw -shortest output.mov

# ffmpeg -i input -filter_complex "anullsrc=channel_layout=mono:sample_rate=8000[a]"
#   -map 0 -map "[a]" -c:v copy -c:a pcm_alaw -shortest output.mov
OUTPUTFILE="src/public/gource.webm"
-vcodec libvpx -acodec libvorbis output.webm
COMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1440x960 --seconds-per-day 0.25 --auto-skip-seconds 0.1 --max-file-lag 0.1 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 14 --key --bloom-multiplier 1 --bloom-intensity 1 --background 012345  -e 0.75 --title 'github.com/tomachinz/AminoSee'"
echo About to encode the video soon, using this...:
# ENCODE="$COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4"
ENCODE="$COMMAND -o - | ffmpeg -probesize 100M  -y -r 60 -f image2pipe ppm -i - -vcodec libvpx -acodec libvorbis -b:v 1600k -preset slow -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 $OUTPUTFILE"
echo $ENCODE
sleep 5
eval $ENCODE
