import pinataSDK from "@pinata/sdk";
import path from "path";
import fs from "fs"



const pinata = pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_API_SECRET!);

async function storeImages(imagesPath: string) {
    console.log(("Uploading to IPFS...."));

    const fullImagesPath = path.resolve(imagesPath);
    const files = fs.readdirSync(fullImagesPath);
    console.log(files);
    let responses = [];
    for (let fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`);
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile);
            responses.push(response);

        }
        catch (error: any) {
            console.log(error.message);
        }
    }
    console.log(responses);

    return { responses: responses.map(r => r.IpfsHash), files };
}



async function storeTokenURIMetadata(metadata: object) {
    console.log(("Uploading to IPFS...."));



    try {
        const response = await pinata.pinJSONToIPFS(metadata);
        return response;

    }
    catch (error: any) {
        console.log(error.message);
        throw new Error(`Error while uploading metadata for ${metadata}`)
    }
}



export { storeImages, storeTokenURIMetadata };