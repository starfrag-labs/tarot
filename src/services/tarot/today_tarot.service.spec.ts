import { Test, TestingModule } from '@nestjs/testing';
import { TodayTarotService } from './today_tarot.service';
import { OpenAIService } from '../openai.service';
import { PrismaService } from '../prisma.service';
import { TarotType } from '@prisma/client';

describe('TodayTarotService', () => {
  let service: TodayTarotService;
  let openAIService: OpenAIService;
  let prismaService: PrismaService;

  const mockOpenAIService = {
    getTodayTarotMessage: jest.fn(),
  };

  const mockPrismaService = {
    latestTarot: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodayTarotService,
        {
          provide: OpenAIService,
          useValue: mockOpenAIService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodayTarotService>(TodayTarotService);
    openAIService = module.get<OpenAIService>(OpenAIService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('readTarot', () => {
    it('should return tarot message from OpenAI', async () => {
      const mockRequest = {
        userUuid: 'test-uuid',
        cards: [{ name: 'The Fool', direction: 'upright' }],
      };

      const mockResponse = {
        description: 'Today is a great day for new beginnings!',
      };

      mockOpenAIService.getTodayTarotMessage.mockResolvedValue(mockResponse);

      const result = await service.readTarot(mockRequest);

      expect(openAIService.getTodayTarotMessage).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('saveTarot', () => {
    it('should save tarot data to database', async () => {
      const mockData = {
        result: { description: 'Test description' },
        userUuid: 'test-uuid',
      };

      const mockSavedData = {
        id: 1,
        userUuid: 'test-uuid',
        type: TarotType.TODAY,
        version: 1.0,
        data: mockData.result,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.latestTarot.upsert.mockResolvedValue(mockSavedData);

      const result = await service.saveTarot(mockData);

      expect(prismaService.latestTarot.upsert).toHaveBeenCalledWith({
        where: {
          userUuid_type: {
            userUuid: mockData.userUuid,
            type: TarotType.TODAY,
          },
        },
        create: {
          userUuid: mockData.userUuid,
          type: TarotType.TODAY,
          version: TodayTarotService.version,
          data: mockData.result,
        },
        update: {
          data: mockData.result,
        },
      });
      expect(result).toEqual(mockSavedData);
    });
  });
});
