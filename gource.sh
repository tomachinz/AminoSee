gource --path ~/src_aminosee --seconds-per-day 0.15 --title "AminoSee" -1280x720 --file-idle-time 0 --auto-skip-seconds 0.75 --multi-sampling --stop-at-end --highlight-users --hide filenames,mouse,progress --max-files 0 --background-colour 000000 --disable-bloom --font-size 24 --output-ppm-stream - --output-framerate 30 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -i audio/Final_master_AminoSee_audio_logo-Q3.ogg -shortest -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 audio/git_evolution.mp4
