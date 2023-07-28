import BorrowContent from '@/components/Home/BorrowContent';
import SavingContent from '@/components/Home/SavingContent';
import WalletData from '@/components/Home/WalletData';
import DelegateeHistory from '@/components/Home/delegatee/DelegateeHistory';
import Delegations from '@/components/Home/delegations/Delegations';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Zk Tropykus App</title>
        <meta
          content="Tropykus ZKEVM"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <main>
        <Link href={`/actions/tes?name=repay`}>
          Hola
        </Link>
        <WalletData />
        <SavingContent />
        <BorrowContent />
        {/* <DelegateeHistory /> */}
        <Delegations />
      </main>
    </div>
  );
};

// export default Home;
export default Home;
