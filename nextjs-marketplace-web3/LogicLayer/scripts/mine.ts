import { moveBlocks } from "../utils/move-blocks";


const BLOCK=3;

async function mine() {
    await moveBlocks(BLOCK,3);
}

mine().then(() => console.log("Mined "));