#!/bin/bash
NO_MAVEN_DIR="../kft-activiti-demo-no-maven"
echo "delete all files of branch no-maven"

#echo "delete libs"
rm $NO_MAVEN_DIR/WebContent/WEB-INF/lib/*

echo "delete java"
rm -rf $NO_MAVEN_DIR/src/*
rm -rf $NO_MAVEN_DIR/test/*

echo "delete java resources"
rm -rf $NO_MAVEN_DIR/resources/*

echo "delete web resources"
rm -rf $NO_MAVEN_DIR/WebContent/common
rm -rf $NO_MAVEN_DIR/WebContent/css
rm -rf $NO_MAVEN_DIR/WebContent/images
rm -rf $NO_MAVEN_DIR/WebContent/js
rm -rf $NO_MAVEN_DIR/WebContent/api
rm -rf $NO_MAVEN_DIR/WebContent/editor
rm -rf $NO_MAVEN_DIR/WebContent/explorer
rm -rf $NO_MAVEN_DIR/WebContent/libs
rm -rf $NO_MAVEN_DIR/WebContent/WEB-INF/views

echo "copying libs to no-maven"
mvn package -Dmaven.test.skip=true
cp ./target/kft-activiti-demo/WEB-INF/lib/* $NO_MAVEN_DIR/WebContent/WEB-INF/lib/
cd $NO_MAVEN_DIR
git checkout -- WebContent/WEB-INF/lib/junit-4.10.jar
git checkout -- WebContent/WEB-INF/lib/servlet-api-2.5.jar
cd -

echo "copying java"
cp -r src/main/java/* $NO_MAVEN_DIR/src
cp -r src/test/java/* $NO_MAVEN_DIR/test

echo "copying java resources"
cp -r src/main/resources/* $NO_MAVEN_DIR/resources
cp target/classes/application.properties $NO_MAVEN_DIR/resources
cd $NO_MAVEN_DIR
git checkout -- resources/activiti.cfg.xml
git checkout -- resources/application.test.properties
git checkout -- resources/applicationContext-test.xml
git checkout -- resources/data/sample-data.xml
cd -

echo "copying web resources"
cp -r src/main/webapp/common $NO_MAVEN_DIR/WebContent/common
cp -r src/main/webapp/css $NO_MAVEN_DIR/WebContent/css
cp -r src/main/webapp/images $NO_MAVEN_DIR/WebContent/images
cp -r src/main/webapp/js $NO_MAVEN_DIR/WebContent/js
cp -r src/main/webapp/api $NO_MAVEN_DIR/WebContent/api
cp -r src/main/webapp/editor $NO_MAVEN_DIR/WebContent/editor
cp -r src/main/webapp/explorer $NO_MAVEN_DIR/WebContent/explorer
cp -r src/main/webapp/libs $NO_MAVEN_DIR/WebContent/libs
cp -r src/main/webapp/WEB-INF/views $NO_MAVEN_DIR/WebContent/WEB-INF/views
cp src/main/webapp/WEB-INF/*.xml $NO_MAVEN_DIR/WebContent/WEB-INF
