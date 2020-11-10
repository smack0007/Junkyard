const modules = {};
async function require(path, currentPath) {
    let currentDirectory = "./";
    if (currentPath !== undefined) {
        currentDirectory = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);
    }

    let pathToLoad = path;
    if (pathToLoad.startsWith("./")) {
        pathToLoad = currentDirectory + pathToLoad.substring("./".length);
    }

    if (!pathToLoad.endsWith(".js")) {
        pathToLoad += ".js";
    }

    // console.info("require", path, currentPath, currentDirectory, pathToLoad);

    if (modules[pathToLoad] === undefined) {
        const module = { exports: {} };
        modules[pathToLoad] = module;

        const src = await fetch(pathToLoad).then(response => response.text());
        // console.info(src);

        const loader = Function("require, exports, module", src);
        loader(function (path) { return require(path, pathToLoad); }, module.exports, module);
    }

    return modules[pathToLoad].exports;
}
