# Error with "This copy of libswiftCore.dylib requires an OS version prior to 12.2.0."
https://stackoverflow.com/questions/55361057/this-copy-of-libswiftcore-dylib-requires-an-os-version-prior-to-12-2-0

# RN NativeBase issues
https://stackoverflow.com/questions/38713240/unrecognized-font-family-ionicons

# Lottie compilation issues
It works after I set "Don't Dead Strip Inits and Terms" to "Yes"
https://github.com/react-native-community/upgrade-support/issues/25

# Auth0 React Native Boilerplate using reduxjs toolkit slices for state control, and Apollo to call graphql backend 

The complete guide to getting started with [react-native-auth0](https://github.com/auth0/react-native-auth0) is our [React Native QuickStart](https://auth0.com/docs/quickstart/native/react-native/00-login).

## 1. Install

Clone the repository and install the dependencies with [Yarn](https://yarnpkg.com):

```bash
git clone git@github.com:swangy/RN-boilerplate.git
cd react-native auth0 redux template
yarn install
```

### iOS Applications only

Change the directory into the `ios` folder and run the following command to install the SDK pod with [CocoaPods](https://cocoapods.org/):

```bash
cd ios
pod install
```

You should see the `A0Auth0` pod being installed and linked to the boilerplate app.

### Android applications only

Open the `android/app/src/main/AndroidManifest.xml` file and locate the Intent Filter declaration. You must update the `android:host` property to use your Auth0 Domain from the step above.

```xml
<data
  android:host="{YOUR_DOMAIN}"
  android:pathPrefix="/android/${applicationId}/callback"
  android:scheme="${applicationId}" />
```

The `applicationId` will get auto-completed dynamically.

## 2. Configure Auth0

1. Copy the `utils/config.sample.js` in this sample to `utils/config.js`.
2. Open your [Applications in the Auth0 dashboard](https://manage.auth0.com/#/applications).
3. Select your existing Application from the list or click **Create Application** at the top to create a new Application of type **Native**.
4. On the **Settings** tab for the Application, copy the "Client ID" and "Domain" values and paste them into the AUTH_CONFIG section of the `utils/config.js` file created above. (presumably start with DEV)
5. In the **Allowed Callback URLs** field, paste in the text below and replace `YOUR_DOMAIN` with the **Domain** from above. These URLs are required for the authentication result to be redirected from the browser to the app:

```
com.auth0samples://YOUR_DOMAIN/ios/com.auth0samples/callback,
com.auth0samples://YOUR_DOMAIN/android/com.auth0samples/callback
```

6. Add the same values to the **Allowed Logout URLs** field as well. These are required for the browser to redirect back to the app after the user logs out.
7. Scroll down and click **Save Changes**.


## 3. Configure Graphql
Redux slices are designed to call a graphql backend - this boilerplate calls a Hasura graphql endpoint to make CRUD calls easy

- Edit GRAPHQL_ENDPOINT section of `utils/config.js` (presumably start with DEV)
## 4. Run The App

Run your app on an emulator, simulator, or your own connected device.

- To run the app on iOS run `yarn run ios`.
- To run the app on Android run `yarn run android`.

The first run may take a while to fully launch. Keep an eye out for confirmation windows and watch the terminal for output and results.

**Note:** If you get an error about "No bundle URL present" try clicking reload in the app or running `yarn run ios` again. 
