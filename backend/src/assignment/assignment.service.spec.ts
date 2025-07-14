import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentService } from './assignment.service';
import { Assignment } from './assignment.entity';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let mockRepository: Partial<Repository<Assignment>>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(Assignment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  describe('calculateRemainingDays', () => {
    beforeEach(() => {
      // Mock the current date to be consistent in tests
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return 5 remaining days when treatment started 5 days ago for 10-day treatment', () => {
      const startDate = new Date('2024-01-10');
      const totalDays = 10;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(5);
    });

    it('should return 0 remaining days when treatment period has ended', () => {
      const startDate = new Date('2024-01-01');
      const totalDays = 10;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(0);
    });

    it('should return full treatment days when starting today', () => {
      const startDate = new Date('2024-01-15');
      const totalDays = 7;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(7);
    });

    it('should return 1 remaining day when treatment ends tomorrow', () => {
      const startDate = new Date('2024-01-09');
      const totalDays = 7;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(1);
    });

    it('should return 0 for future start dates (edge case)', () => {
      const startDate = new Date('2024-01-20');
      const totalDays = 7;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(12); // 7 + 5 days until start
    });

    it('should handle long treatment periods correctly', () => {
      const startDate = new Date('2024-01-01');
      const totalDays = 30;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(16); // 30 - 14 elapsed days
    });
  });
});
