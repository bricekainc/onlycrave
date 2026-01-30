import { getCreators } from '../lib/fetchCreators';

export async function getServerSideProps() {
  const creators = await getCreators();
  return { props: { creators } };
}

export default function Home({ creators }: { creators: any[] }) {
  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <h1 style={{ color: '#0102FD', textAlign: 'center', fontSize: '2.5rem' }}>OnlyCrave Discovery</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '40px' }}>
        {creators.map(c => (
          <div key={c.username} style={{ background: '#111', borderRadius: '15px', padding: '20px', border: '1px solid #222', textAlign: 'center' }}>
            <img src={c.avatar} style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid #0102FD', marginBottom: '15px' }} />
            <h3>{c.name}</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: '15px 0' }}>{c.description.substring(0, 100)}...</p>
            <a href={c.link} style={{ display: 'inline-block', padding: '10px 25px', backgroundColor: '#0102FD', color: '#fff', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold' }}>View Profile</a>
          </div>
        ))}
      </div>
    </div>
  );
}
