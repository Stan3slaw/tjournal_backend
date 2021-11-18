import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'rjournal',
  password: '9642',
  database: 'rjournal',
  entities: [__dirname + '/**/entities/*.entity{.ts, .js}'],
  synchronize: true,
};

export default config;
