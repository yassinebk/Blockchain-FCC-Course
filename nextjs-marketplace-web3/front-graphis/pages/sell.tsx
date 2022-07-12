import Head from "next/head";
import React from "react";
import { Accordion } from "web3uikit";
import ProcceedsWithdrawal from "../components/ProcceedsWithdrawal";
import SellForm from "../components/SellForm";
import styles from "../styles/Home.module.css";

interface sellProps {}

export const Sell: React.FC<sellProps> = ({}) => {
  return (
    <div className="container mx-auto">
      <Head>
        <title>NFT Marketplace - List Item</title>
        <meta
          name="description"
          content="The perfect marketplace for buying cool NFTs. Good prices, trusted services, Open-Source where we want our customers to have the perfect experience."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-8 w-full h-full min-h-[80vh]">
        <div className="  space-y-40 ">
          <SellForm />
          <ProcceedsWithdrawal />
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

export default Sell;
