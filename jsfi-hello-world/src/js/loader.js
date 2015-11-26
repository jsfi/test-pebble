var __loader = (function() {
    var packages = {};
    var packagesLinenoOrder = [{ filename: 'loader.js', lineno: 0 }];
    var extpaths = ['?', '?.js', '?.json', '?/index.js'];
    var paths = ['/', 'lib', 'vendor'];

    return {
        require: require,
        define: define,
        getPackageByLineno: getPackageByLineno
    };

    /* public */
    function require(path, requirer) {
        var module = getPackage(path, requirer);

        if (!module) {
            throw new Error('Cannot find module "' + path + '"');
        }

        if (module.exports) {
            return module.exports;
        }

        var loadRequire = function(path) {
            return require(path, module);
        };

        module.exports = {};
        module.loader(module.exports, module, loadRequire);
        module.loaded = true;

        return module.exports;
    }

    function define(path, lineno, loadfun) {
        var module = {
            filename: path,
            lineno: lineno,
            loader: loadfun
        };

        packages[path] = module;
        packagesLinenoOrder.push(module);
        packagesLinenoOrder.sort(compareLineno);
    }

    function getPackageByLineno(lineno) {
        var packages = packagesLinenoOrder;
        var module;

        for (var i = 0, ii = packages.length; i < ii; ++i) {
            var next = packages[i];

            if (next.lineno > lineno) {
                break;
            }

            module = next;
        }

        return module;
    }

    /* helper */
    function basepath(path) {
        return path.replace(/[^\/]*$/, '');
    }

    function normalize(path) {
        path = replace(path, /(?:(^|\/)\.?\/)+/g, '$1');
        path = replace(path, /[^\/]*\/\.\.\//, '');

        return path;
    }

    function getPackage(path, requirer) {
        var module;
        if (requirer) {
            module = getPackageAtPath(basepath(requirer.filename) + '/' + path);
        }

        if (!module) {
            module = getPackageAtPath(path);
        }

        for (var i = 0, ii = paths.length; !module && i < ii; ++i) {
            var dirpath = paths[i];
            module = getPackageAtPath(dirpath + '/' + path);
        }

        return module;
    }

    function getPackageAtPath(path) {
        var module;

        path = normalize(path);

        for (var i = 0, ii = extpaths.length; !module && i < ii; ++i) {
            var filepath = extpaths[i].replace('?', path);
            module = packages[filepath];
        }

        return module;
    }

    function replace(a, regexp, b) {
        var z;

        do {
            z = a;
        } while (z !== (a = a.replace(regexp, b)));

        return z;
    }

    function compareLineno(a, b) {
        return a.lineno - b.lineno;
    }
})();
