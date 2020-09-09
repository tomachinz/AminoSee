TITLE="github.com/tomachinz/AminoSee       Audio track by TOMACHI: Mechanoid Rein"
OUTPUTFILEMP4="video/gource.mp4"
FASTOUTPUTFILEMP4="video/fast_gource.mp4"
OUTPUTFILEWEBM="video/gource.webm"
OUTPUTFILEAUDIO="video/gource_music.mp4"
FASTOUTPUTFILEAUDIO="video/fast_gource_music.mp4"
AUDIOTRACK="/Volumes/13xOLDSKOOL/Users/tom/Projects OLDSKOOL/Album2 The Atkinson Diet 13inch/Mechanoid Rain/Bounces/Mechanoid_Rain-18Jan2019_Version.wav"
# THIS LAST ABOUT A MINUTE
FASTCOMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1600x1040 --seconds-per-day 0.01 --auto-skip-seconds 1 --max-file-lag 20 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 15 --key --bloom-multiplier 0.021321 --bloom-intensity 1 --background 012345  -e 0.15 --title '$TITLE'"
ENCODE="$FASTCOMMAND -o - | ffmpeg -probesize 63M  -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264  -b:v 1000k -preset slow -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 $FASTOUTPUTFILEAUDIO"
mkdir video

echo Render an animation of the AminoSee Github open source code repository evolution of time
echo title: $TITLE
echo audio: $OUTPUTFILEAUDIO
echo track: $AUDIOTRACK
echo THIS IS PREVIEW quit to render
eval $FASTCOMMAND
echo THIS IS ACTUAL ENCODE
eval $ENCODE
echo Now Ima go add a track up in this...
echo
ffmpeg -i $FASTOUTPUTFILEMP4 -i $AUDIOTRACK -c:v copy -c:a aac -strict experimental -filter:a "volume=1.0" fast_$OUTPUTFILEAUDIO
sleep 1


COMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1600x1040 --seconds-per-day 0.1 --auto-skip-seconds 4 --max-file-lag 20 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 15 --key --bloom-multiplier 0.021321 --bloom-intensity 1 --background 012345  -e 0.15 --title '$TITLE'"
ENCODE="$COMMAND -o - | ffmpeg -probesize 63M  -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264  -b:v 1000k -preset slow -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 $OUTPUTFILEMP4"
echo About to run...:
echo $COMMAND
echo THIS IS PREVIEW QUIT TO RENDER TO DISK PROPER
eval $COMMAND
echo About to encode the MP4 video soon, using this...:
echo $ENCODE
eval $ENCODE
echo ADDING A TUNE IM WORKING ON TO THE AUDIO TO THE VIDEO
ffmpeg -i $OUTPUTFILEMP4 -i $AUDIOTRACK -c:v copy -c:a aac -strict experimental -filter:a "volume=1.0" $OUTPUTFILEAUDIO

echo About to encode the WEBM video soon, using this...:
ENCODE="$COMMAND -o - | ffmpeg -probesize 100M  -y -r 60 -f image2pipe ppm -i - -vcodec libvpx -acodec libvorbis -b:v 1024k -preset slow -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 $OUTPUTFILEWEBM"
echo $ENCODE
sleep 1
eval $ENCODE





# COMMAND="gource --date-format '%d / %m / %Y %a' --camera-mode overview -1100x880 --seconds-per-day 0.2 --auto-skip-seconds 0.1 --max-file-lag 0.01 --background-image src/public/WhitePaper_800px.png --logo src/public/funk-logo-140px.png  --font-size 14 --key --bloom-multiplier 0.125 --bloom-intensity 0.125 --background 012345  -e 0.75 --title 'github.com/tomachinz/AminoSee'"
#
# -i /Volumes/13xOLDSKOOL/Users/tom/Projects\ OLDSKOOL/Album2\ The\ Atkinson\ Diet\ 13inch/Mechanoid\ Rain/Bounces/Mechanoid_Rain-18Jan2019_Version.wav -filter_complex 'anullsrc=channel_layout=mono:sample_rate=8000[a]'
#   -map 0 -map '[a]' -c:v copy -c:a pcm_alaw -shortest output.mov

# ffmpeg -i input -filter_complex "anullsrc=channel_layout=mono:sample_rate=8000[a]"
#   -map 0 -map "[a]" -c:v copy -c:a pcm_alaw -shortest output.mov
# -vcodec libvpx -acodec libvorbis output.webm
# ENCODE="$COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4"
# ENCODE="$COMMAND -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4"
