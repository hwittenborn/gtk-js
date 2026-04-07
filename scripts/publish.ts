const packages = [
  "packages/gtk-css",
  "packages/icon-helpers",
  "packages/gtk4-icons",
  "packages/adwaita-icons",
  "packages/gtk4",
  "packages/adwaita",
];

for (const dir of packages) {
  const pkg = await Bun.file(`${dir}/package.json`).json();
  const { name, version } = pkg;

  const res = await fetch(`https://registry.npmjs.org/${name}/${version}`);
  if (res.ok) {
    console.log(`${name}@${version} already published, skipping`);
    continue;
  }

  console.log(`Publishing ${name}@${version}...`);
  const result = Bun.spawnSync({
    cmd: ["bun", "publish", "--cwd", dir],
    stdout: "inherit",
    stderr: "inherit",
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode);
  }

  console.log(`New tag: ${name}@${version}`);
}
