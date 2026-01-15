import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dummyProductData } from './dummyproducts';
import { ProductI } from '../product/interface/product.dto';
import { Product } from '../product/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async run() {
    // Clear existing data
    // await this.userRepository.clear();
    const data: ProductI[] = [...dummyProductData];

    return await this.productRepository.save(data);
  }
}
