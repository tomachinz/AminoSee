
echo Starting 8 parallel processes...

nice -n 1 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 2 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 3 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 4 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 5 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 6 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 7 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 8 ./batch-peptides.sh $1 $2 $3 $4 $5 $6 &
nice -n 9 ./batch-peptides.sh $1 $2 $3 $4 $5 $6


echo
echo


echo "  MADE IN NEW ZEALAND"
echo "  ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐"
echo "  ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘"
echo "  ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─"
echo "  by Tom Atkinson            aminosee.funk.nz"
echo "   ah-mee no-see       'I See It Now - I AminoSee it!' "
