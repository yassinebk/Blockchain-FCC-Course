import Link from "next/link";
import { ConnectButton } from "web3uikit";
import CustomLink from "./Link";

const Header = () => {
  return (
    <nav className="flex py-5 px-16 border-b-blue-200 border-b-[1px] border-solid items-center">
      <div>
        <h1 className="text-2xl font-bold text-blue-500 mr-[300px]">
          NFT Marketplace
        </h1>
      </div>
      <div className="flex items-center justify-between min-w-[20vw] text-blue-600">
        <CustomLink href="/">Home</CustomLink>
        <CustomLink href="/sell">Sell</CustomLink>
        <CustomLink href="/support">Support</CustomLink>
        <CustomLink href="/services">Services</CustomLink>
      </div>
      <div className="ml-auto ">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
};

export default Header;
