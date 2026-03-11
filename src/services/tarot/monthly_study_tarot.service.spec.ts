import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyStudyTarotService } from './monthly_study_tarot.service';
import { OpenAIService } from '../openai.service';
import { PrismaService } from '../prisma.service';
import { TarotType } from '@prisma/client';

describe('MonthlyStudyTarotService', () => {
  let service: MonthlyStudyTarotService;
  let openAIService: OpenAIService;
  let prismaService: PrismaService;

  const mockOpenAIService = {
    getMonthlyStudyTarotMessage: jest.fn(),
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
        MonthlyStudyTarotService,
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

    service = module.get<MonthlyStudyTarotService>(MonthlyStudyTarotService);
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
    it('should return monthly study tarot message from OpenAI', async () => {
      const mockRequest = {
        userUuid: 'test-uuid',
        currentStateCard: { name: 'The Magician', direction: 'upright' },
        obstacleCard: { name: 'The Tower', direction: 'reversed' },
        adviceCard: { name: 'The Star', direction: 'upright' },
      };

      const mockResponse = {
        currentState: 'You are in a good place',
        obstacle: 'Watch out for challenges',
        advice: 'Keep moving forward',
        summary: 'Overall positive outlook',
      };

      mockOpenAIService.getMonthlyStudyTarotMessage.mockResolvedValue(
        mockResponse,
      );

      const result = await service.readTarot(mockRequest);

      expect(openAIService.getMonthlyStudyTarotMessage).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('saveData', () => {
    it('should save monthly study tarot data to database', async () => {
      const mockData = {
        result: {
          currentState: 'Test current state',
          obstacle: 'Test obstacle',
          advice: 'Test advice',
          summary: 'Test summary',
        },
        userUuid: 'test-uuid',
      };

      const mockSavedData = {
        id: 1,
        userUuid: 'test-uuid',
        type: TarotType.MONTHLY_STUDY,
        version: 1.0,
        data: mockData.result,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.latestTarot.upsert.mockResolvedValue(mockSavedData);

      const result = await service.saveData(mockData);

      expect(prismaService.latestTarot.upsert).toHaveBeenCalledWith({
        where: {
          userUuid_type: {
            userUuid: mockData.userUuid,
            type: TarotType.MONTHLY_STUDY,
          },
        },
        create: {
          userUuid: mockData.userUuid,
          type: TarotType.MONTHLY_STUDY,
          version: MonthlyStudyTarotService.version,
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
