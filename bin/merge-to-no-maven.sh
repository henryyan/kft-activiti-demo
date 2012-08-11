#!/bin/bash
NO_MAVEN_DIR="../kft-activiti-demo-no-maven"
echo "delete all files of branch no-maven"

echo "delete libs"
rm $NO_MAVEN_DIR/WebContent/WEB-INF/lib/*

echo "delete java"
rm -rf $NO_MAVEN_DIR/src/*

echo "delete java resources"
rm -rf $NO_MAVEN_DIR/resources/*

echo "delete web resources"
rm -rf $NO_MAVEN_DIR/WebContent/common
rm -rf $NO_MAVEN_DIR/WebContent/css
rm -rf $NO_MAVEN_DIR/WebContent/images
rm -rf $NO_MAVEN_DIR/WebContent/js

echo "copying libs to no-maven"
mvn dependency:copy-dependencies
cp ./target/dependency/* $NO_MAVEN_DIR/WebContent/WEB-INF/lib/

echo "copying java"
cp -r src/main/java/* $NO_MAVEN_DIR/src

echo "copying java resources"
cp -r src/main/resources/* $NO_MAVEN_DIR/resources

echo "copying web resources"
cp -r src/main/webapp/common $NO_MAVEN_DIR/WebContent/common
cp -r src/main/webapp/css $NO_MAVEN_DIR/WebContent/css
cp -r src/main/webapp/images $NO_MAVEN_DIR/WebContent/images
cp -r src/main/webapp/js $NO_MAVEN_DIR/WebContent/js