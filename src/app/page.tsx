import { Layout } from "antd";
import HeaderAdmin from "./layout/header";
import SiderAdmin from "./layout/sider";
import FooterAdmin from "./layout/Footer";
import Image from "next/image";


export default function Home() {
  
  return (
    <div>
         <Layout> 
    <HeaderAdmin />
 
    <SiderAdmin>
      <Image src="/images/nen.jpg" alt="logo" width={1450} height={1000} />
           
       
         </SiderAdmin>
         </Layout>
         <FooterAdmin />
    </div>
  )
}
