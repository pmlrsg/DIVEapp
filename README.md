# DIVEapp
This is the repository for the Mobile/Web app for the DIVE visibility service

## Running as a web app
Navigate to the *www* directory and load/host index.html as a starting page

## Building as a mobile app

### Requirements
Android Studio - latest
Cordova 11+ (including node.js)
Java 11

### To build (linux/mac)
- Set paths in *setup-env.sh* to match your local install locations
- Run `source setup-env.sh`
- make sure you're in the repositories root direcory
- run build script of your choice
-- `./build-debug.sh` for an apk file
-- `./build-release.sh` for an aab app bundle
- [optional] sign release bundles with the following command
```
jarsigner -verbose -sigalg SHA256withRSA -keystore <path-to-your-keystore> ./platforms/android/app/build/outputs/bundle/release/app-release.aab <key-name>
```
