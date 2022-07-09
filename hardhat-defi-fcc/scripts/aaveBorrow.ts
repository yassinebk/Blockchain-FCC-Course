import { getWeth } from "./getWeth";

async function main() {
  await getWeth();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error.message);
  });

