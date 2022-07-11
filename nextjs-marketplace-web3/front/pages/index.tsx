import type { NextPage } from "next";
import Head from "next/head";
import { useMoralisQuery } from "react-moralis";
import { Loading } from "web3uikit";
import NFTBox from "../components/NFTBox";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { data: listedNFTs, isFetching: fetchingListingNFTs } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId"),
    [],
    {
      live: true,
      onLiveUpdate: (entity, all) =>
        all.map((e) => (e.id === entity.id ? entity : e)),
    }
  );

  return (
    <div className="container mx-auto">
      <Head>
        <title>NFT Marketplace - Home</title>
        <meta
          name="description"
          content="The perfect marketplace for buying cool NFTs. Good prices, trusted services, Open-Source where we want our customers to have the perfect experience."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-8 w-full h-full min-h-[80vh]">
        <h1 className="font-bold text-3xl mb-8">Recently Listed</h1>
        <div className="flex flex-wrap  space-x-4">
          {fetchingListingNFTs ? (
            <Loading spinnerColor="#4b6a9d" spinnerType="wave" size={90} />
          ) : (
            listedNFTs.map((NFT) => (
              <NFTBox
                key={NFT.id}
                NFTAddress={NFT.attributes.nftAddress}
                marketplaceAddress={NFT.attributes.marketplaceAddress}
                price={NFT.attributes.price}
                seller={NFT.attributes.seller}
                tokenId={NFT.attributes.tokenId}
              />
            ))
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Yassine Belkhadem
        </a>
      </footer>
    </div>
  );
};

export default Home;
