import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from './records.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Gender } from '../../users/userInfo';
import { Record } from '../entities/records.entity';

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
        name: 'Test User',
        email: 'test@example.com',
        password: 'testPassword',
        birthday: new Date(),
        gender: Gender.MALE,
        point: 1000,
        isInChallenge: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        imgUrl: null,
        description: null,
        latestChallengeDate: null,
        deletedAt: null,
        refreshToken: null,
      };

      mockRecordsRepository.getLatestUserRecord.mockResolvedValue(null);

      await expect(service.getResultFromRecord(user as User)).rejects.toThrow(
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

      const result = await service.getResultFromRecord(user as User);
      expect(result).toHaveProperty('recentRecords');
      expect(result).toHaveProperty('avgDatas');
    });
  });
});
