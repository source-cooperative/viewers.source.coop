# Contrubiting

## Step 1 - Add Viewer

In `src/components/viewers` create a folder which has the name of the unique identifier you will be using for this viewer.
Unique identifiers should be short and descriptive but otherwise have no requirements as long as the project builds.

Within this folder, create an `index.tsx` file which will be the entrypoint for your viewer.
Within the `index.tsx` file, create a `viewerMetadata` constant with the `ViewerMetadata` type.
This `viewerMetadata` constant has a few properties:

- `title` - The name of your viewer
- `description` - A short description of what your viewer does
- `compatibilityCheck` - A function which takes in the `FileProps` object for a file and returns a boolean of whether your viewer is compatible with that file.
- `viewer` - The function which returns your viewer's React component

Create your function which returns your React component.
This function has one parameter - the FileProps object of the file to be viewed.

The FileProps object contains four properties, only the `url` and `filename` property are guaranteed to be included.
The `contentType` and `size` properties are not currently included but will be in a future updated.

## Step 2 - Add Dependencies

Add the dependencies for your viewer to the `package.json` file.
It's recommended that when loading in these dependencies in your viewer that you use [dynamic imports](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading) in order to decrease the amount of JavaScript needed to load the viewers.

## Step 3 - Register Viewer

You will register your viewer in `src/components/viewer.tsx`.
First, import your viewer's `ViewerMetadata` at the top of the file.
Next, add your viewer to the `viewers` constant below the imports.
The key in this object is a unique identifier for your viewer and the value is the `ViewerMetadata` which was imported at the top of this file.
After these steps are done, your viewer will visible in the viewer list, assuming your viewer is compatible with the file being viewed.

## Step 4 - Test Viewer

You can run the demo site of the viewers locally by first installing the dependencies using `npm i` and then running the development environment by running `npm run dev`.

## Step 5 - Submit a PR

The final step to getting your viewer included is to create a PR on this repository.
Within the PR include a description of what types of files your viewer is compatible with and if possible some links to files which the viewer can be tested with.

## Tips

- Our frontend uses the [theme-ui](https://theme-ui.com/) framework. Make use of these components as much as you can!
- We've developed some [extra components](https://github.com/source-cooperative/components) for Source Cooperative which are included in this project.
- Make use of HTTP range requests when possile to ensure that you are loading the minimum required data to ensure good performance.
