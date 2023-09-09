import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from './records.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Record } from '../entities/records.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('RecordsService', () => {
  let service: RecordsService;
  let mockRecordsRepository;
  let mockUserRepository;

  beforeEach(async () => {
    mockRecordsRepository = {
      getLatestUserRecord: jest.fn(),
      getRecordForAverage: jest.fn(),
    };
    mockUserRepository = {
      getUsersForAverage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordsService,
        {
          provide: getRepositoryToken(Record),
          useValue: mockRecordsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getResultFromRecord', () => {
    it('should throw NotFoundException if no records found', async () => {
      const user = {
        id: 1,
        birthday: new Date(),
        gender: '남자',
        password: 'kkk11K2kkk',
        provider: 'normal',
        name: '차은우',
      };
      mockRecordsRepository.getLatestUserRecord.mockResolvedValue(null);

      await expect(service.getResultFromRecord(user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the expected result', async () => {
      const user = { id: 1, birthday: new Date(), gender: '남자' };
      const recentRecords = {
        weight: 70,
        muscle: 30,
        height: 180,
        fat: 20,
      };
      mockRecordsRepository.getLatestUserRecord.mockResolvedValue(
        recentRecords,
      );
      mockUserRepository.getUsersForAverage.mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      const recordsForAverage = [
        { userId: 1, weight: 60, fat: 18, muscle: 28 },
        { userId: 2, weight: 75, fat: 22, muscle: 35 },
      ];
      mockRecordsRepository.getRecordForAverage.mockResolvedValue(
        recordsForAverage,
      );

      const result = await service.getResultFromRecord(user);
      expect(result).toHaveProperty('recentRecords');
      expect(result).toHaveProperty('avgDatas');
    });
  });
});
