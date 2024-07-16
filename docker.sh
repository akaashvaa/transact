 docker build ./ -t mongodb:4.7-replset && docker run --name mongodb-replset -p 27017:27017 -d mongodb:4.7-replset
