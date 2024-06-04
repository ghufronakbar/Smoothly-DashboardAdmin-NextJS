import { Inter } from "next/font/google";
import Pesanan from "./admin/pesanan";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Pesanan/>
    </>
  );
}
