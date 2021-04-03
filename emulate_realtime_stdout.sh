if [ -z "$1" ]
  then
    echo "Usage: $0 FILENAME [SECONDS]"
    exit
fi

seconds=$2
if [ -z "$2" ]
  then
      seconds=1
fi

cat $1
sleep $seconds
