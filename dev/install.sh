#!/bin/bash

ln_folder="/Users/severinbuhler/.polar/networks/3/volumes/c-lightning/bob/lightningd"
target_folder="$ln_folder/cln-jit-proto"

plugins_path="$ln_folder/plugins"

echo Install plugin to $target_folder

echo Copy dist folder
rm -rf $target_folder
mkdir $target_folder
mkdir "$target_folder/src"
cp -R ./src "$target_folder/src"
cp -R ./package.json $target_folder
cp -R ./package-lock.json $target_folder
cp -R ./tsconfig.json $target_folder

echo Install dependecies and build app
cd $target_folder
npm i
npm run build
cd -

echo Copy plugin entry file
mkdir $plugins_path
cp ./dev/cln-jit-proto.sh $plugins_path
echo Done
