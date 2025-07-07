import Sidebar from '../components/Sidebar';

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '2rem', width: '100%' }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
