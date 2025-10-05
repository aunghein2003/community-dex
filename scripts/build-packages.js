const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const packagesDir = path.join(root, "packages");

function getPackages() {
  return fs
    .readdirSync(packagesDir)
    .map((pkg) => {
      const pkgPath = path.join(packagesDir, pkg);
      const pkgJsonPath = path.join(pkgPath, "package.json");
      if (!fs.existsSync(pkgJsonPath)) return null;
      const pkgJson = require(pkgJsonPath);
      return {
        name: pkgJson.name,
        dir: pkgPath,
        deps: Object.keys({
          ...pkgJson.dependencies,
          ...pkgJson.peerDependencies,
        }).filter((d) => d.startsWith("@orderly.network/")),
      };
    })
    .filter(Boolean);
}

function topoSort(pkgs) {
  const result = [];
  const visited = new Set();

  function visit(pkg) {
    if (visited.has(pkg.name)) return;
    visited.add(pkg.name);
    for (const dep of pkg.deps) {
      const depPkg = pkgs.find((p) => p.name === dep);
      if (depPkg) visit(depPkg);
    }
    result.push(pkg);
  }

  pkgs.forEach(visit);
  return result;
}

const pkgs = topoSort(getPackages());

for (const pkg of pkgs) {
  console.log(`\n📦 Building ${pkg.name}...`);
  try {
    execSync(`yarn workspace ${pkg.name} run build`, {
      cwd: root,
      stdio: "inherit",
    });
  } catch (e) {
    console.error(`❌ Failed to build ${pkg.name}`);
    process.exit(1);
  }
}
