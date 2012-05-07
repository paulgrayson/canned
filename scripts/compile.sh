ps -Af | awk '/bin\/coffee/ { print "kill "$2 }' | sh
coffee -w -c -j lib/canned-server.js src/server/*.cs &
coffee -w -c -j public/javascripts/canned-client.js src/client/*.cs &


