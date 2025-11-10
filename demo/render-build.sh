#!/usr/bin/env bash
# Render build script for Spring Boot

set -o errexit

echo "Building Spring Boot application..."
mvn clean package -DskipTests

echo "Build completed successfully!"
