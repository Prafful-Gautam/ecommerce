import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from '../cart/cart-item.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderStatus } from './dto/order.dto';

describe('OrderService', () => {
  let service: OrderService;
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
    holdUnit: 5,
    active: 'active' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    cartItems: [],
  };

  const mockCartItem: CartItem = {
    id: 1,
    user: mockUser,
    product: mockProduct,
    quantity: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrder: Order = {
    id: 1,
    user: mockUser,
    items: [],
    totalAmount: 299.97,
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderItem: OrderItem = {
    id: 1,
    order: mockOrder,
    product: mockProduct,
    cartItem: mockCartItem,
    quantity: 3,
    priceAtPurchase: 99.99,
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create an order successfully from cart items', async () => {
      const userId = 1;
      const productWithStock = {
        ...mockProduct,
        inStock: 100,
        holdUnit: 3,
      };
      const cartItems = [{ ...mockCartItem, product: productWithStock }];
      const orderItems = [{ ...mockOrderItem }];

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser) // User lookup
        .mockResolvedValueOnce(productWithStock); // Product lookup for each cart item

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create
        .mockReturnValueOnce(mockOrder) // Order creation
        .mockReturnValueOnce(mockOrderItem); // OrderItem creation

      mockEntityManager.save
        .mockResolvedValueOnce(mockOrder) // Save order
        .mockResolvedValueOnce(productWithStock) // Save product (stock update)
        .mockResolvedValueOnce(orderItems) // Save order items
        .mockResolvedValueOnce(mockOrder); // Save order with total

      const result = await service.createOrder(userId);

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, {
        where: { id: userId },
      });
      expect(mockEntityManager.find).toHaveBeenCalledWith(CartItem, {
        where: { user: { id: userId } },
        relations: ['product'],
      });
      expect(mockEntityManager.create).toHaveBeenCalledWith(Order, {
        user: mockUser,
        totalAmount: 0,
      });
      expect(mockEntityManager.save).toHaveBeenCalled();
      expect(mockEntityManager.remove).toHaveBeenCalledWith(cartItems);
      expect(result).toBeDefined();
      expect(result.totalAmount).toBeCloseTo(299.97, 2); // 3 * 99.99
    });

    it('should throw ForbiddenException when user not found', async () => {
      const userId = 999;

      mockEntityManager.findOne.mockResolvedValueOnce(null);

      await expect(service.createOrder(userId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.createOrder(userId)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw BadRequestException when cart is empty', async () => {
      const userId = 1;

      mockEntityManager.findOne.mockResolvedValueOnce(mockUser);
      mockEntityManager.find.mockResolvedValue([]);

      await expect(service.createOrder(userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when product not found', async () => {
      const userId = 1;
      const cartItems = [mockCartItem];

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser) // User found
        .mockResolvedValueOnce(null); // Product not found

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create.mockReturnValueOnce(mockOrder);

      await expect(service.createOrder(userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update product stock correctly', async () => {
      const userId = 1;
      const cartItems = [mockCartItem];
      const productWithStock = {
        ...mockProduct,
        inStock: 100,
        holdUnit: 5,
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(productWithStock);

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create
        .mockReturnValueOnce(mockOrder)
        .mockReturnValueOnce(mockOrderItem);

      mockEntityManager.save
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(productWithStock)
        .mockResolvedValueOnce([mockOrderItem])
        .mockResolvedValueOnce(mockOrder);

      await service.createOrder(userId);

      // Verify product stock was updated
      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          inStock: 97, // 100 - 3
          holdUnit: 2, // 5 - 3
        }),
      );
    });

    it('should throw InternalServerErrorException when stock becomes negative', async () => {
      const userId = 1;
      const cartItems = [mockCartItem];
      const productWithLowStock = {
        ...mockProduct,
        inStock: 2, // Less than cart quantity
        holdUnit: 0,
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(productWithLowStock);

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create.mockReturnValueOnce(mockOrder);

      mockEntityManager.save.mockResolvedValueOnce(mockOrder);

      // After stock update: inStock = 2 - 3 = -1, which should throw error
      await expect(service.createOrder(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when holdUnit becomes negative', async () => {
      const userId = 1;
      const cartItems = [mockCartItem];
      const productWithMismatch = {
        ...mockProduct,
        inStock: 100,
        holdUnit: 1, // Less than cart quantity
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(productWithMismatch);

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create.mockReturnValueOnce(mockOrder);

      mockEntityManager.save.mockResolvedValueOnce(mockOrder);

      // After holdUnit update: holdUnit = 1 - 3 = -2, which should throw error
      await expect(service.createOrder(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should calculate total amount correctly for multiple items', async () => {
      const userId = 1;
      const product1 = { ...mockProduct, id: 1, price: '50.00', inStock: 100, holdUnit: 2 };
      const product2 = { ...mockProduct, id: 2, price: '30.00', inStock: 100, holdUnit: 3 };
      const cartItem1 = {
        ...mockCartItem,
        id: 1,
        quantity: 2,
        product: product1,
      };
      const cartItem2 = {
        ...mockCartItem,
        id: 2,
        quantity: 3,
        product: product2,
      };
      const cartItems = [cartItem1, cartItem2];

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(product1)
        .mockResolvedValueOnce(product2);

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create
        .mockReturnValueOnce(mockOrder)
        .mockReturnValueOnce({ ...mockOrderItem, id: 1 })
        .mockReturnValueOnce({ ...mockOrderItem, id: 2 });

      mockEntityManager.save
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(product1)
        .mockResolvedValueOnce(product2)
        .mockResolvedValueOnce([mockOrderItem, mockOrderItem])
        .mockResolvedValueOnce(mockOrder);

      const result = await service.createOrder(userId);

      // Total: (2 * 50) + (3 * 30) = 100 + 90 = 190
      expect(result.totalAmount).toBeCloseTo(190, 2);
    });

    it('should remove cart items after order creation', async () => {
      const userId = 1;
      const cartItems = [mockCartItem];
      const productWithStock = {
        ...mockProduct,
        inStock: 100,
        holdUnit: 3,
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(productWithStock);

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create
        .mockReturnValueOnce(mockOrder)
        .mockReturnValueOnce(mockOrderItem);

      mockEntityManager.save
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(productWithStock)
        .mockResolvedValueOnce([mockOrderItem])
        .mockResolvedValueOnce(mockOrder);

      await service.createOrder(userId);

      expect(mockEntityManager.remove).toHaveBeenCalledWith(cartItems);
    });

    it('should create order items with correct price at purchase', async () => {
      const userId = 1;
      const cartItems = [mockCartItem];
      const productWithPrice = {
        ...mockProduct,
        price: '149.99',
        inStock: 100,
        holdUnit: 3,
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(productWithPrice);

      mockEntityManager.find.mockResolvedValue(cartItems);
      mockEntityManager.create
        .mockReturnValueOnce(mockOrder)
        .mockReturnValueOnce(mockOrderItem);

      mockEntityManager.save
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(productWithPrice)
        .mockResolvedValueOnce([mockOrderItem])
        .mockResolvedValueOnce(mockOrder);

      await service.createOrder(userId);

      expect(mockEntityManager.create).toHaveBeenCalledWith(
        OrderItem,
        expect.objectContaining({
          order: mockOrder,
          product: productWithPrice,
          ci: mockCartItem,
          quantity: mockCartItem.quantity,
          priceAtPurchase: 149.99,
        }),
      );
    });
  });
});
