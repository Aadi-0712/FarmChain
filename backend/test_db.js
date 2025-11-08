import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://farmchain_user:farmchain_2024@localhost:5432/farmchain',
});

client.connect()
  .then(() => console.log('✅ Connected to PostgreSQL successfully'))
  .catch(err => console.error('❌ Database connection failed:', err))
  .finally(() => client.end());
