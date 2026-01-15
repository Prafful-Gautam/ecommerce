import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductI, Status } from './interface/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/user/dto/create-user.dto';

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
  async getAllActiveProducts(
    role: UserRole,
    {
      limit = 10,
      cursor,
    }: {
      limit?: number;
      cursor?: number;
    },
  ) {
    const querybuilder = this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.id', 'DESC')
      .take(+limit + 1);
    if (cursor) {
      querybuilder.where('product.id < :cursor', { cursor });
    }
    if (role == UserRole.CUSTOMER) {
      querybuilder.andWhere('product.active = :active', {
        active: Status.ACTIVE,
      });
    }

    const prod = await querybuilder.getMany();
    let nextCursor: number | null = null;
    if (prod.length > limit) {
      const nextProd = prod.pop();
      nextCursor = nextProd!.id;
    }

    return {
      products: prod,
      nextCursor,
    };
  }
}
