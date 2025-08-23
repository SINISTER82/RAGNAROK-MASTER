import { useRouter } from 'next/router';
import Image from 'next/image';
import sinisterLogo from '../public/sinister-drakkar.png';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/login');
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    }} onClick={handleClick}>
      <Image src={sinisterLogo} alt="SINISTER" width={300} height={300} />
    </div>
  );
}
