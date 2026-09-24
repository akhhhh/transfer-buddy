import logo from "@/public/Transfer buddy 2.png";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="p-4 px-6 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-2 items-center">
        <Image className="w-10" src={logo} alt="" />
        <h1 className="text-4xl font-semibold">Transfer Buddy</h1>
      </div>
    </nav>
  );
};

export default Navbar;
