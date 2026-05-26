#!/usr/bin/env node
/**
 * Build Docker image and push to Amazon ECR.
 *
 * Usage:
 *   npm run aws:deploy -- --region us-east-1 --account 123456789012
 *   npm run aws:deploy -- --region us-east-1 --account 123456789012 --cluster any-exam-easy --service web
 */
import { spawnSync } from "node:child_process";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const region = arg("--region", process.env.AWS_REGION ?? "us-east-1");
const account = arg("--account", process.env.AWS_ACCOUNT_ID);
const repo = arg("--repo", "any-exam-easy");
const cluster = arg("--cluster", "");
const service = arg("--service", "");

if (!account) {
  console.error("Missing --account ACCOUNT_ID (or set AWS_ACCOUNT_ID)");
  process.exit(1);
}

const registry = `${account}.dkr.ecr.${region}.amazonaws.com`;
const image = `${registry}/${repo}:latest`;

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true, ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log(`Building and pushing ${image} …`);

const describe = spawnSync(
  "aws",
  ["ecr", "describe-repositories", "--repository-names", repo, "--region", region],
  { stdio: "pipe", shell: true }
);
if (describe.status !== 0) {
  console.log("Creating ECR repository…");
  run("aws", ["ecr", "create-repository", "--repository-name", repo, "--region", region]);
}

run("aws", ["ecr", "get-login-password", "--region", region], {
  stdio: ["inherit", "pipe", "inherit"],
});

const login = spawnSync(
  "sh",
  ["-c", `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${registry}`],
  { stdio: "inherit" }
);
if (login.status !== 0) process.exit(1);

run("docker", ["build", "-t", repo, "."]);
run("docker", ["tag", `${repo}:latest`, image]);
run("docker", ["push", image]);

console.log(`\n✓ Pushed ${image}`);

if (cluster && service) {
  console.log(`Forcing ECS deployment ${cluster}/${service} …`);
  run("aws", [
    "ecs",
    "update-service",
    "--cluster",
    cluster,
    "--service",
    service,
    "--force-new-deployment",
    "--region",
    region,
  ]);
  console.log("✓ ECS service update requested");
} else {
  console.log("\nNext: register aws/ecs-task-definition.json and create/update ECS service.");
}
