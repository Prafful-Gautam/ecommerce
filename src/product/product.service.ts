import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductI } from './interface/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async addProduct(createProduct: ProductI) {
    const isProductExist = await this.findProductByName(createProduct.name);
    if (isProductExist)
      throw new BadRequestException('This product name already exist');
    const prod = this.productRepository.create(createProduct);
    return this.productRepository.save(prod);
  }
  findProductByName(name: string) {
    return this.productRepository.findOne({ where: { name } });
  }
  updateProduct(id: number, updateProduct: Partial<Omit<ProductI, 'name'>>) {
    return this.productRepository.update({ id }, { ...updateProduct });
  }
  getAllActiveProducts({
    limit = 10,
    cursor,
  }: {
    limit?: number;
    cursor?: number;
  }) {
    return this.productRepository.find({});
    // const qb = this.productRepository.createQueryBuilder('product').orderBy("product.createdAt","DESC")
    // .take(limit+1);
    // qb.andWhere('product.id')
  }
}
