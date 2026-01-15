import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CartService } from './cart.service';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Status } from '../product/interface/product.dto';

describe('CartService', () => {
  let service: CartService;
  let cartItemRepo: Repository<CartItem>;
  let dataSource: DataSource;
  let mockEntityManager: any;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: 'customer' as any,
    createdAt: new Date(),
    cartItems: [],
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    type: 'Electronics',
    price: '99.99',
    inStock: 100,
    holdUnit: 0,
    active: Status.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    cartItems: [],
  };

  const mockCartItem: CartItem = {
    id: 1,
    user: mockUser,
    product: mockProduct,
    quantity: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Mock EntityManager
    mockEntityManager = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    // Mock DataSource
    const mockDataSource = {
      transaction: jest.fn((callback) => callback(mockEntityManager)),
    };

    // Mock Repository
    const mockRepository = {
      find: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartItemRepo = module.get<Repository<CartItem>>(
      getRepositoryToken(CartItem),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should add a new product to cart successfully', async () => {
      const userId = 1;
      const productId = 1;
      const quantity = 3;

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser) // User lookup
        .mockResolvedValueOnce(mockProduct) // Product lookup with lock
        .mockResolvedValueOnce(null); // No existing cart item

      mockEntityManager.create.mockReturnValue(mockCartItem);
      mockEntityManager.save.mockResolvedValue(mockCartItem);

      const result = await service.addToCart(userId, productId, quantity);

      expect(mockEntityManager.findOne).toHaveBeenCalledTimes(3);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, {
        where: { id: userId },
      });
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' },
      });
      expect(mockEntityManager.create).toHaveBeenCalledWith(CartItem, {
        user: mockUser,
        product: mockProduct,
        quantity,
      });
      expect(mockEntityManager.save).toHaveBeenCalledTimes(3); // CartItem (create), CartItem (update), and Product
      expect(result).toEqual({ productId, quantity });
    });

    it('should update existing cart item quantity', async () => {
      const userId = 1;
      const productId = 1;
      const quantity = 8;

      const existingCartItem = { ...mockCartItem, quantity: 5 };
      const updatedProduct = { ...mockProduct, inStock: 100, holdUnit: 5 };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedProduct)
        .mockResolvedValueOnce(existingCartItem);

      mockEntityManager.save.mockResolvedValue(existingCartItem);

      const result = await service.addToCart(userId, productId, quantity);

      expect(mockEntityManager.findOne).toHaveBeenCalledTimes(3);
      expect(mockEntityManager.save).toHaveBeenCalledWith(existingCartItem);
      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          holdUnit: 8, // 5 (existing) + 3 (diff)
        }),
      );
      expect(result).toEqual({ productId, quantity });
    });

    it('should throw BadRequestException when user not found', async () => {
      const userId = 999;
      const productId = 1;
      const quantity = 3;

      mockEntityManager.findOne.mockResolvedValueOnce(null); // User not found

      await expect(
        service.addToCart(userId, productId, quantity),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.addToCart(userId, productId, quantity),
      ).rejects.toThrow('User or Product not found');
    });

    it('should throw BadRequestException when product not found', async () => {
      const userId = 1;
      const productId = 999;
      const quantity = 3;

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null); // Product not found

      await expect(
        service.addToCart(userId, productId, quantity),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.addToCart(userId, productId, quantity),
      ).rejects.toThrow('User or Product not found');
    });

    it('should throw ForbiddenException when not enough stock available', async () => {
      const userId = 1;
      const productId = 1;
      const quantity = 50;

      const lowStockProduct = { ...mockProduct, inStock: 10, holdUnit: 5 };
      const existingCartItem = { ...mockCartItem, quantity: 2 };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser) // User lookup
        .mockResolvedValueOnce(lowStockProduct) // Product lookup with lock
        .mockResolvedValueOnce(existingCartItem); // Existing cart item lookup

      // Available stock: 10 - 5 = 5
      // Requested diff: 50 - 2 = 48
      // Should throw error

      await expect(
        service.addToCart(userId, productId, quantity),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should remove cart item when quantity is set to 0', async () => {
      const userId = 1;
      const productId = 1;
      const quantity = 0;

      const existingCartItem = { ...mockCartItem, quantity: 5 };
      const updatedProduct = { ...mockProduct, holdUnit: 5 };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedProduct)
        .mockResolvedValueOnce(existingCartItem);

      mockEntityManager.remove.mockResolvedValue(existingCartItem);
      mockEntityManager.save.mockResolvedValue(updatedProduct);

      const result = await service.addToCart(userId, productId, quantity);

      expect(mockEntityManager.remove).toHaveBeenCalledWith(existingCartItem);
      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          holdUnit: 0, // 5 - 5 = 0
        }),
      );
      expect(result).toEqual({ productId, quantity: 0 });
    });

    it('should handle decreasing quantity correctly', async () => {
      const userId = 1;
      const productId = 1;
      const quantity = 2; // Decreasing from 5 to 2

      const existingCartItem = { ...mockCartItem, quantity: 5 };
      const updatedProduct = { ...mockProduct, inStock: 100, holdUnit: 5 };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedProduct)
        .mockResolvedValueOnce(existingCartItem);

      mockEntityManager.save.mockResolvedValue(existingCartItem);

      const result = await service.addToCart(userId, productId, quantity);

      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          holdUnit: 2, // 5 - 3 = 2 (decreased by 3)
        }),
      );
      expect(result).toEqual({ productId, quantity });
    });
  });

  describe('getCart', () => {
    it('should return all cart items for a user', async () => {
      const userId = 1;
      const mockCartItems = [mockCartItem];

      jest.spyOn(cartItemRepo, 'find').mockResolvedValue(mockCartItems);

      const result = await service.getCart(userId);

      expect(cartItemRepo.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['product'],
      });
      expect(result).toEqual(mockCartItems);
    });

    it('should return empty array when user has no cart items', async () => {
      const userId = 1;

      jest.spyOn(cartItemRepo, 'find').mockResolvedValue([]);

      const result = await service.getCart(userId);

      expect(cartItemRepo.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['product'],
      });
      expect(result).toEqual([]);
    });
  });

  describe('removeFromCart', () => {
    it('should remove items from cart successfully', async () => {
      const userId = 1;
      const productId = 1;
      const removeQty = 2;

      const existingCartItem = {
        ...mockCartItem,
        quantity: 5,
        product: { ...mockProduct, holdUnit: 5 },
      };

      mockEntityManager.findOne.mockResolvedValue(existingCartItem);
      mockEntityManager.save.mockResolvedValue(existingCartItem);

      const result = await service.removeFromCart(userId, {
        productId,
        removeQty,
      });

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(CartItem, {
        where: {
          user: { id: userId },
          product: { id: productId },
        },
        relations: ['product'],
      });
      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 3, // 5 - 2 = 3
        }),
      );
      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          holdUnit: 3, // 5 - 2 = 3
        }),
      );
      expect(result).toEqual({
        productId,
        removed: removeQty,
        remainingQuantity: 3,
      });
    });

    it('should remove cart item when quantity becomes 0', async () => {
      const userId = 1;
      const productId = 1;
      const removeQty = 5;

      const existingCartItem = {
        ...mockCartItem,
        quantity: 5,
        product: { ...mockProduct, holdUnit: 5 },
      };

      mockEntityManager.findOne.mockResolvedValue(existingCartItem);
      mockEntityManager.remove.mockResolvedValue(existingCartItem);
      mockEntityManager.save.mockResolvedValue(mockProduct);

      const result = await service.removeFromCart(userId, {
        productId,
        removeQty,
      });

      expect(mockEntityManager.remove).toHaveBeenCalledWith(existingCartItem);
      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          holdUnit: 0, // 5 - 5 = 0
        }),
      );
      expect(result).toEqual({
        productId,
        removed: removeQty,
        remainingQuantity: 0,
      });
    });

    it('should throw BadRequestException when cart item not found', async () => {
      const userId = 1;
      const productId = 999;
      const removeQty = 2;

      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(
        service.removeFromCart(userId, { productId, removeQty }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.removeFromCart(userId, { productId, removeQty }),
      ).rejects.toThrow('CART_ITEM_NOT_FOUND');
    });

    it('should throw BadRequestException when removeQty is invalid (<= 0)', async () => {
      const userId = 1;
      const productId = 1;
      const removeQty = 0;

      const existingCartItem = {
        ...mockCartItem,
        quantity: 5,
        product: mockProduct,
      };

      mockEntityManager.findOne.mockResolvedValue(existingCartItem);

      await expect(
        service.removeFromCart(userId, { productId, removeQty }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.removeFromCart(userId, { productId, removeQty }),
      ).rejects.toThrow('INVALID_REMOVE_QUANTITY');
    });

    it('should throw BadRequestException when removeQty exceeds cart quantity', async () => {
      const userId = 1;
      const productId = 1;
      const removeQty = 10;

      const existingCartItem = {
        ...mockCartItem,
        quantity: 5,
        product: mockProduct,
      };

      mockEntityManager.findOne.mockResolvedValue(existingCartItem);

      await expect(
        service.removeFromCart(userId, { productId, removeQty }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.removeFromCart(userId, { productId, removeQty }),
      ).rejects.toThrow('REMOVE_QTY_EXCEEDS_CART_QTY');
    });
  });

  describe('clearCart', () => {
    it('should clear all cart items for a user', async () => {
      const userId = 1;
      const deleteResult = { affected: 3, raw: [] };

      jest.spyOn(cartItemRepo, 'delete').mockResolvedValue(deleteResult);

      const result = await service.clearCart(userId);

      expect(cartItemRepo.delete).toHaveBeenCalledWith({
        user: { id: userId },
      });
      expect(result).toEqual(deleteResult);
    });

    it('should return delete result with 0 affected when cart is empty', async () => {
      const userId = 1;
      const deleteResult = { affected: 0, raw: [] };

      jest.spyOn(cartItemRepo, 'delete').mockResolvedValue(deleteResult);

      const result = await service.clearCart(userId);

      expect(cartItemRepo.delete).toHaveBeenCalledWith({
        user: { id: userId },
      });
      expect(result).toEqual(deleteResult);
    });
  });
});
