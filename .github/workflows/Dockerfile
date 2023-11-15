# Use an official Nginx runtime as a base image
FROM nginx:alpine

# Set the working directory to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copy the contents of the coding2 directory to the working directory
COPY ./coding2 /usr/share/nginx/html/coding2

# Copy the contents of the lib2 directory to the working directory
COPY ./lib2 /usr/share/nginx/html/lib2

COPY ./index.html /usr/share/nginx/html/

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run on container start
CMD ["nginx", "-g", "daemon off;"]
