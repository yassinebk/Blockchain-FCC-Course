Moralis.Cloud.afterSave("itemListed", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed Tx");

  logger.info(request);
  if (confirmed) {
    logger.info("Found Item");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const activeItem = new ActiveItem();

    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("nftAddress"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("price", request.object.get("price"));
    activeItem.set("seller", request.object.get("sender"));
    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )} tokenId:${request.object.get("tokenId")} seller:${request.object.get(
        "sender"
      )}`
    );
    logger.info("Saving..");
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave("itemCanceled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed Tx");

  logger.info(request);
  if (confirmed) {
    logger.info("Finding Item...");
    const ActiveItem = Moralis.Object.extend("ActiveItem");

    const query = new Moralis.Query(ActiveItem);
    query.equalTo("nftAddress", request.object.get("NFTAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("seller", request.object.get("seller"));
    logger.info(`Marketplace | Query: ${query}`);
    const alreadyListedItem = await query.first();
      logger.info("Here");

    if (!alreadyListedItem) throw new Error("Item not found");

    logger.info(`Deleting ${alreadyListedItem.id}`);
    await alreadyListedItem.destroy();
    logger.info(
      `Deleted item with tokenId ${request.object.get(
        "tokenId"
      )} at address ${request.object.get(
        "address"
      )} since the listing is being updated. `
    );
  }
});

Moralis.Cloud.afterSave("itemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed Tx");

  logger.info(request);
  if (confirmed) {
    logger.info("Finding Item...");
    const ActiveItem = Moralis.Object.extend("ActiveItem");

    const query = new Moralis.Query(ActiveItem);
    query.equalTo("nftAddress", request.object.get("NFTAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("marketplaceAddress", request.object.get("address"));
    logger.info(`Marketplace | Query: ${query}`);
    const alreadyListedItem = await query.first();

    if (!alreadyListedItem) throw new Error("Item not found");

    logger.info(`Deleting ${alreadyListedItem.id}`);
    await alreadyListedItem.destroy();
    logger.info(
      `Deleted item with tokenId ${request.object.get(
        "tokenId"
      )} at address ${request.object.get(
        "address"
      )} since the listing is being updated. `
    );
  }
});

Moralis.Cloud.afterSave("itemUpdated", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed Tx");

  logger.info(request);
  if (confirmed) {
    logger.info("Finding Item ..");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    // Looking for listed item to delete
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("nftAddress", request.object.get("NFTAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("seller", request.object.get("seller"));
    logger.info(`Marketplace | Query: ${query}`);
    const alreadyListedItem = await query.first();

    if (!alreadyListedItem) {
      throw new Error("Item not found");
    }

    logger.info(`Deleting ${alreadyListedItem.id}`);
    await alreadyListedItem.destroy();
    logger.info(
      `Deleted item with tokenId ${request.object.get(
        "tokenId"
      )} at address ${request.object.get(
        "address"
      )} since the listing is being updated. `
    );

    const activeItem = new ActiveItem();
    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("NFTAddress"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("price", request.object.get("newPrice"));
    activeItem.set("seller", request.object.get("seller"));
    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )} tokenId:${request.object.get("tokenId")} seller:${request.object.get(
        "sender"
      )}`
    );
    logger.info("Saving..");
    await activeItem.save();
  }
});
