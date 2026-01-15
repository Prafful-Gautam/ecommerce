import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { seedProducts } from './src/database/seeds/product.seed';
import { Product } from './src/product/product.entity';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'ecommerce',
    entities: [Product], // add all your entities here
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('📦 Database connected');

    // Execute your seed function(s)
    await seedProducts(dataSource);

    console.log('🌱 Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1); // Exit with failure code
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🛑 Database connection closed');
    }
  }
}

// Execute wrapper
runSeed();
