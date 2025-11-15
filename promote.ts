import { patchver } from "jsr:@deno/patchver@0.3.0";

const CHANNEL = Deno.args[0];
if (CHANNEL !== "rc" && CHANNEL !== "lts") {
  throw new Error(`Invalid channel: ${CHANNEL}`);
}

const BINARIES = ["deno.exe"];

const CANARY_URL = "https://dl.deno.land";

function getCanaryBinaryUrl(
  version: string,
  binary: string,
  target: string,
): string {
  return `${CANARY_URL}/canary/${version}/${binary}-${target}.zip`;
}

async function patchBinary(inputPath: string, channel: string) {
  console.log(`Patching ${inputPath}...`);

  const input = await Deno.readFile(inputPath);
  const output = patchver(input, channel);

  // Extract filename without extension and create output name
  const baseName = inputPath.replace(/\.exe$/, "");
  const outputPath = `${baseName}-x86_64-pc-windows-msvc-${channel}.exe`;

  await Deno.writeFile(outputPath, output);
  console.log(`Created ${outputPath}`);
}

async function main() {
  for (const binary of BINARIES) {
    await patchBinary(binary, CHANNEL);
  }
  console.log("All Windows binaries patched successfully!");
}

console.log("URL:", getCanaryBinaryUrl("b0cfbf53d3984a8e4aa26ca4f24d48f0df54e7c8", "deno", "x86_64-pc-windows-msvc"));
await main();
