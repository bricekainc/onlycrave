import { getCreators } from '../lib/getCreators';

export async function getServerSideProps() {
  const creators = await getCreators();
  return { props: { creators } };
}

export default function Home({ creators }: { creators: any[] }) {
  return (
    <div style={{ backgroundColor: '#0b0e11', minHeight: '100vh', color: 'white', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#0102FD', fontSize: '2.5rem', fontWeight: 'bold' }}>OnlyCrave Hub</h1>
        <p>Discover elite verified creators</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {creators.map((c) => (
          <div key={c.username} style={{ background: '#1a1d21', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid #333' }}>
            <img src={c.avatar} alt={c.name} style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 15px', border: '3px solid #0102FD' }} />
            <h3 style={{ margin: '10px 0' }}>{c.name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#ccc', height: '60px', overflow: 'hidden' }}>{c.description}</p>
            <a href={c.link} target="_blank" style={{ display: 'block', backgroundColor: '#0102FD', color: 'white', padding: '10px', borderRadius: '8px', marginTop: '15px', textDecoration: 'none', fontWeight: 'bold' }}>
              View Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
